import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Image,
  Flex,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spinner,
} from "@chakra-ui/react";
import FormData from "../components/FormData";
import useApi from "../hooks/useApi";
import { fetchData,submitForm } from "../api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";

const ApplicationPage = ({ config }) => {
  const path = window.location.pathname;
  const id = path.substring(path.lastIndexOf("/") + 1);
  const isPreview = path.includes("preview"); // Check if "preview" is in the URL
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isApplicant = user?.role?.name === "Applicant";
  const isAdmin = user?.role?.name === "Administrator";
  const isSuperAdmin = user?.role?.name === "Super Administrator";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Modal state for approval
  const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const { execute } = useApi(submitForm);
  const { execute: fetchDataApi } = useApi(fetchData);
  useEffect(() => {
  setError(null);
  const getData = async () => {
    setLoading(true);
    try {
      const result = await fetchDataApi('forms/prospective-student');
      setData(result); // Update the state with the fetched data
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      toast({ description: err.message || "Error fetching data.", status: "error" });
    }
  };

  
    getData();
  
  
  return () => setData(null);
}, [fetchDataApi, toast]);
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const result = await fetchDataApi(`check/summary/applicants/${id}`);
        setInitialData(result);
      } catch (err) {
        setError(err);
        toast({ description: err.message || "Error fetching data.", status: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInitialData();
  }, [id, fetchDataApi, toast]);

  // Handle approval modal data fetching
  const openApprovalModal = async () => {
    setModalLoading(true);
    try {
      const result = await fetchDataApi("forms/approve-admission");
      setModalData(result);
      setApprovalModalOpen(true);
    } catch (err) {
      toast({ description: err.message || "Error fetching approval data.", status: "error" });
    } finally {
      setModalLoading(false);
    }
  };

  const handlePrint = () => navigate(`/preview-form/${id}`);
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/continue-application");
  };

  const Content = (
    <Box>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text color="red.500">{error.message}</Text>
      ) : initialData ? (
        <Box className="invoice-container2" borderWidth="1px" borderRadius="md" p={6} borderColor="gray.300">
          <Flex justifyContent="space-between" align="center" mb={4}>
            <Box>
              <Image src={config.logoUrl} alt="Logo" height="60px" mb={2} width="250px" />
              <Text fontSize="xl" fontWeight="bold">
                {isPreview ? "Application Preview" : "Application Form"}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {isPreview
                  ? "Review the details below before proceeding with approval or printing."
                  : "Fill in the necessary information below."}
              </Text>
            </Box>
            {isApplicant && (
            <Button colorScheme="red" onClick={handleLogout} size="sm" variant="outline">
              Logout
            </Button>
            )}
          </Flex>

          {isPreview ? (
            <>
              {/* Display application details */}
              <Table variant="simple">
                <Tbody>
                  <Tr>
                    <Td><strong>Name:</strong></Td>
                    <Td>{`${initialData.firstName} ${initialData.lastName}`}</Td>
                  </Tr>
                  <Tr>
                    <Td><strong>Email:</strong></Td>
                    <Td>{initialData.email}</Td>
                  </Tr>
                  <Tr>
                    <Td><strong>Phone:</strong></Td>
                    <Td>{initialData.phone}</Td>
                  </Tr>
                  <Tr>
                    <Td><strong>Course:</strong></Td>
                    <Td>{initialData.courseName || "N/A"}</Td>
                  </Tr>
                  <Tr>
                    <Td><strong>Program:</strong></Td>
                    <Td>{initialData.programmeName || "N/A"}</Td>
                  </Tr>
                  <Tr>
                    <Td><strong>Application ID:</strong></Td>
                    <Td>{initialData.applicantId}</Td>
                  </Tr>
                  <Tr>
                    <Td><strong>Status:</strong></Td>
                    <Td>{initialData.status || "Pending"}</Td>
                  </Tr>
                </Tbody>
              </Table>

              {/* Approval and Print Buttons */}
              <Flex gap={4} mt={4}>
                <Button colorScheme="blue" onClick={handlePrint}>
                  Print Preview
                </Button>
                {initialData.status != "Admitted" && (isAdmin || isSuperAdmin) && (
                  <Button bg={config.primaryColor} color="white" onClick={openApprovalModal}>
                    Approve Admission
                  </Button>
                )}
              </Flex>
            </>
          ) : (
            <FormData
              fieldsConfig={data?.sections || []}
              isLoading={isSubmitting || modalLoading}
              formId={data?._id}
              mainConfig={config}
              initialValues={initialData}
            />
          )}

          {/* Approval Modal */}
          {isPreview && (
            <Modal isOpen={isApprovalModalOpen} onClose={() => setApprovalModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Approve Admission</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {modalLoading ? (
                    <Flex justifyContent="center" alignItems="center">
                      <Spinner size="lg" />
                    </Flex>
                  ) : modalData ? (
                    <FormData
                      submitUrl={`update/applicants/${id}`}
                      fieldsConfig={modalData.sections}
                      isLoading={isSubmitting || modalLoading}
                      formId={modalData._id}
                      mainConfig={config}
                      initialValues={initialData}
                    />
                  ) : (
                    <Text>No data available</Text>
                  )}
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
        </Box>
      ) : (
        <Text>No application data found.</Text>
      )}
    </Box>
  );

  return isAdmin || isSuperAdmin ? <Layout>{Content}</Layout> : Content;
};


export default ApplicationPage;
