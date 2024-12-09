import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Heading,
  Stack,
  useToast,
  Flex,
  Spinner,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import useApi from "../hooks/useApi"; // Ensure the correct import path for `useApi`
import { submitForm } from "../api";
import { formatNaira} from "../hooks/common"
const CheckAdmissionStatusPage = ({ config }) => {
  const [applicantId, setApplicationId] = useState("");
  const [password, setPassword] = useState("");
  const [admissionStatus, setAdmissionStatus] = useState(null); // New state for admission status
  const toast = useToast();
  const navigate = useNavigate();

  const { execute, loading } = useApi(submitForm);
  // const { data: invoice, loading: invload, execute: fetchInvoice } = useApi(fetchData);

  const handleCheckStatus = async () => {
    if (!applicantId || !password) {
      toast({
        description: "Please enter both application number and password.",
        status: "error",
      });
      return;
    }

    try {
      const data = await execute("applicants/status", { applicantId, password });

      if (data?.statusCode === 200) {
        toast({ description: "Application found.", status: "success" });
        setAdmissionStatus(data?.data); // Store admission data
      } else {
        toast({
          description: "No admission data available to print.",
          status: "error",
        });
      }
    } catch (error) {
      toast({ description: error.message || "Error checking status.", status: "error" });
    }
  };

  const handleRedirectToInvoice = async () => {
    if (admissionStatus) {
      try {
        delete admissionStatus.amount;
        delete admissionStatus.type;
        delete admissionStatus.description;
        delete admissionStatus.displayAmount;
        delete admissionStatus._id
        let orderId = admissionStatus.orderId+"ADM";
        delete admissionStatus.orderId;
        const invoiceData = await execute("generateInvoice", {
          applicantId,
          type: "Acceptance Fee",
          description: `Acceptance Fee for ${admissionStatus.session} ${admissionStatus.programmeName} (${admissionStatus.courseName})`,
          ...admissionStatus,
          orderId: orderId,
          admissionStatus: admissionStatus.status,
          amount: config.acceptanceFee
        });
  
        if (invoiceData?.data?.transactionId) {
          console.log("Navigating with Transaction ID:", invoiceData?.data?.transactionId);
          navigate("/pay-invoice", {
            state: { userData: { transactionId: invoiceData?.data?.transactionId, displayAmount: formatNaira(config.acceptanceFee) } },
          });
        } else {
          toast({
            description: "Invoice not found.",
            status: "error",
          });
        }
      } catch (error) {
        toast({
          description: "Error fetching invoice.",
          status: "error",
        });
      }
    } else {
      toast({
        description: "No admission data available.",
        status: "error",
      });
    }
  };
  
  

  return (
    <MainLayout config={config}>
      <Flex align="center" justify="center"  bg="gray.50" px={4} py={10}>
        <Box
          maxW="600px"
          p={6}
          borderWidth="1px"
          borderRadius="md"
          bg="white"
          shadow="md"
        >
          <Heading size="md" mb={6} textAlign="center">
            Check Admission Status
          </Heading>
          <Stack spacing={4} mb={6}>
            <Input
              placeholder="Enter Application ID"
              value={applicantId}
              onChange={(e) => setApplicationId(e.target.value)}
            />
            <Input
              placeholder="Enter Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Flex justify="center">
              <Button
                bg={config.primaryColor}
                color="white"
                _hover={{ bg: config.primaryColor }}
                width="300px"
                borderRadius="md"
                isLoading={loading}
                onClick={handleCheckStatus}
              >
                Check Admission Status
              </Button>
            </Flex>
          </Stack>

          {/* Loading spinner */}
          {loading && (
            <Box textAlign="center" mt={4}>
              <Spinner />
            </Box>
          )}

          {/* Admission status details */}
          {admissionStatus && (
            <Box p={6} borderWidth="1px" borderRadius="md" mt={6}>
              <Flex justify="space-between" mb={4}>
                <Text fontSize="lg" fontWeight="bold">
                  Admission Details
                </Text>
              </Flex>
              <Table variant="striped" colorScheme="gray">
                <Tbody>
                  <Tr>
                    <Td fontWeight="bold">Name:</Td>
                    <Td>{`${admissionStatus.firstName} ${admissionStatus.lastName}`}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Phone Number:</Td>
                    <Td>{admissionStatus.phone}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Program:</Td>
                    <Td>{admissionStatus.programmeName} ({admissionStatus.courseName})</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Status:</Td>
                    <Td color="green.500">{admissionStatus.status}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Session:</Td>
                    <Td>{admissionStatus.session}</Td>
                  </Tr>
                
                </Tbody>
              </Table>
              { admissionStatus.status == "Admitted" && (
              <Flex justify="space-between" mt={6}>
                <Button colorScheme="blue" onClick={handleRedirectToInvoice}>
                  Pay Acceptance Fee
                </Button>
              </Flex>)}
            </Box>
          )}
        </Box>
      </Flex>
    </MainLayout>
  );
};

export default CheckAdmissionStatusPage;
