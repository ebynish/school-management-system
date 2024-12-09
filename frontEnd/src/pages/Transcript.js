import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import DynamicTable from "../components/DynamicTable";
import { formatNaira } from "../hooks/common";
import useApi from "../hooks/useApi";
import { submitForm } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Transcript = ({ config }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    types: "download",
    enrollmentYear: "",
    graduationYear: "",
    reason: "",
    destination: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { execute: submit } = useApi(submitForm);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const invoiceData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    programmeName: user?.programmeName,
    matricNumber: user?.matricNumber,
    session: user?.session,
    userId: user?._id,
    programmeId: user?.programmeId,
    programmeCode: user?.programmeCode,
    orderId: `${new Date().toISOString()}`,
    applicantId: `${new Date().toISOString()}`,
    displayAmount: formatNaira(config?.transcript[`${formData["types"]}`]),
    type: `Transcript ${formData["types"]}`,
    description: `Transcript - ${user?.programmeName} (${user?.departmentName})`,
    amount: config?.transcript[`${formData["types"]}`],
    schema: "transcripts",
    dependency: "transcripts",
    ...formData, // Include form data
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submit("forms/submit", invoiceData);
      console.log(response)

      if (response?.statusCode === 200 && response?.data?.transactionId) {
        toast({
          title: "Application Submitted",
          description: "Your transcript application has been successfully submitted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        handleCloseModal();
        const updatedInvoiceData = {
          ...invoiceData,
          transactionId: response?.data?.transactionId,
        };
        navigate("/pay-invoice", { state: { userData: updatedInvoiceData } });
       
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const transactionHeaders = [
    { key: "matricNumber", label: "Matric Number" },
    { key: "programmeName", label: "Programme" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date" },
  ];

  const renderButtons = (row) => {
    console.log(row)
   return(<>
      {(row?.status?.toLowerCase() === "successful" &&
        row?.type?.toLowerCase().includes("download")) && (
          <Link to={`/transcript/download/${row?._id}`}>
            <Button colorScheme="blue" fontSize="12">
              Download
            </Button>
          </Link>
        )}
    </>)
  };

  return (
    <Layout>
      <Box justifyContent={"flex-end"}>
        <Button onClick={handleOpenModal} bg={config?.buttonColor} color="white" w={200}>
          Apply for Transcript
        </Button>
      </Box>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transcript Application</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing="4" align="stretch">
                <FormControl id="enrollmentYear" isRequired>
                  <FormLabel>Enrollment Year</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter your year of enrollment"
                    name="enrollmentYear"
                    value={formData.enrollmentYear}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl id="graduationYear">
                  <FormLabel>Graduation Year (if applicable)</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter your graduation year"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl id="types">
                  <FormLabel>Type</FormLabel>
                  <Select
                    type="text"
                    placeholder="Select type"
                    value={formData.types}
                    name="types"
                    onChange={handleInputChange}
                  >
                    <option value={"download"}>Download</option>
                    <option value={"postal"}>Postage</option>
                    <option value={"email"}>Email</option>
                </Select>
                </FormControl>

                <FormControl id="reason" isRequired>
                  <FormLabel>Reason for Transcript</FormLabel>
                  <Textarea
                    placeholder="Explain why you need the transcript"
                    value={formData.reason}
                    name="reason"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl id="destination" isRequired>
                  <FormLabel>Destination</FormLabel>
                  <Textarea
                    placeholder="Where the transcript should be sent to"
                    value={formData.destination}
                    name="destination"
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button bg={config?.buttonColor} color="white" type="submit" w="200px">
                  Submit
                </Button>
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseModal} variant="outline" mr={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box p={2} bg="white" borderRadius={"10"} boxShadow={"sm"}>
        <DynamicTable
          apiUrl={`fetch/transcripts/${user?._id}?m=userId`}
          headers={transactionHeaders}
          search={false}
          action={true}
          renderButtons={renderButtons}
        />
      </Box>
    </Layout>
  );
};

export default Transcript;
