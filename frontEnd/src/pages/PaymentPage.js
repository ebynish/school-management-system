import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Select,
  FormControl,
  Avatar,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import DynamicTable from "../components/DynamicTable";
import useApi from "../hooks/useApi";
import { fetchData, submitForm } from "../api";
import { formatNaira } from "../hooks/common";
import { useNavigate } from "react-router-dom";

const FeeCard = ({ fee }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate("/pay-invoice", { state: { userData: { transactionId: fee._id } } });
  };

  return (
    <Box bg="white" p={4} shadow="md" borderRadius="md" maxW="300px">
      <VStack align="flex-start" spacing={3}>
        <Text fontSize="lg" fontWeight="bold">
          {fee?.description || "No description available"}
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="green.600">
          {fee?.amount ? formatNaira(fee.amount) : "₦0.00"}
        </Text>
        <Text>{fee?.session || "No session provided"}</Text>
        <HStack>
          <Badge colorScheme={fee?.status === "Pending" ? "yellow" : "green"}>
            {fee?.status || "Unknown Status"}
          </Badge>
        </HStack>
        <Text color="gray.500">
          Due {fee?.dueDate || "No due date"}
        </Text>
        <Button colorScheme="green" size="sm" width="full" onClick={handleViewDetails}>
          View Details
        </Button>
      </VStack>
    </Box>
  );
};
const PaymentPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { data: fees, loading, error, execute } = useApi(fetchData);
  const { data: pending, loading: pendLoad, error: pendError, execute: executePending } = useApi(fetchData);
  const { execute: submit } = useApi(submitForm);
  const [selectedFee, setSelectedFee] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      execute("check/find/fees");
      executePending(`check/find/transactions/${user?._id}/userId?s=Pending`);
    }
  }, [user, execute, executePending]);
  
  const handleProceedToPayment = () => {
    if (!selectedFee) {
      toast({
        title: "No Fee Selected",
        description: "Please select a fee before proceeding.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
      amount: Number(selectedFee?.installmentAmount),
      displayAmount: formatNaira(selectedFee?.installmentAmount),
      type: `${selectedFee?.name} - ${user?.programmeName} (${user?.departmentName})`,
      description: `${selectedFee?.name} - ${user?.programmeName} (${user?.departmentName})`,
      expectedAmount: selectedFee.total,
      toBalance: Number(selectedFee.total) - Number(selectedFee?.installmentAmount),
      schema: "transactions",
      integration: "generateInvoice",
    };

    submit("forms/submit", invoiceData)
      .then((response) => {
        if (response?.data?.transactionId && response.statusCode === 200) {
          const updatedInvoiceData = {
            ...invoiceData,
            transactionId: response?.data?.transactionId,
          };
          navigate("/pay-invoice", { state: { userData: updatedInvoiceData } });
        }
      })
      .catch((error) => {
        console.error("Payment failed:", error);
        toast({
          title: "Payment Error",
          description: "Something went wrong. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const transactionHeaders = [
    { key: "RRR", label: "Remita" },
    { key: "createdAt", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "description", label: "Description" },
  ];



  return (
    <Layout>
       <Flex justify="space-between" align="center" mb={5}>
            <Text fontSize="2xl" fontWeight="bold">
              {user.session} Session
            </Text>
            <HStack spacing={4}>
            <Flex align="center" mb={6}>
          
          <Avatar name={`${user.firstName} ${user.lastName}`} />
          <Text ml={3}>{`${user.firstName} ${user.lastName}`}</Text>
        </Flex>
            </HStack>
          </Flex>

      <Tabs variant="enclosed" colorScheme="green">
        <TabList>
          <Tab>Payments</Tab>
          <Tab>Transactions</Tab>
        </TabList>

        <TabPanels>
          {/* Payment Tab */}
          <TabPanel>
            <Flex gap={4} mb={6}>
              <Button colorScheme="green" onClick={onOpen}>
                Make Sundry Payment
              </Button>
              {/* <Button
                leftIcon={<Box as="span" className="material-icons">print</Box>}
                colorScheme="gray"
                variant="outline"
              >
                Print Ledger
              </Button> */}
            </Flex>

            {pending?.length ? (
              pending.map((fee) => <FeeCard key={fee?._id} fee={fee} />)
            ) : (
              <Text>No pending payments found.</Text>
            )}

            {/* Modal for Sundry Payment */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Make Sundry Payment</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl isRequired>
                    <FormLabel>Select Fee</FormLabel>
                    <Select
                      placeholder="Select a fee..."
                      value={selectedFee?._id || ""}
                      onChange={(e) => {
                        const fee = fees.find((f) => f._id === e.target.value);
                        setSelectedFee(fee);
                      }}
                    >
                      {fees?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name} - {formatNaira(option.installmentAmount)}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="green" onClick={handleProceedToPayment}>
                    Proceed
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </TabPanel>

          {/* Transactions Tab */}
          <TabPanel>
            <Box bg="white" p={4} rounded="md" shadow="md">
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                Transaction History
              </Text>
              <Box width={650}>
              <DynamicTable
                apiUrl={`fetch/transactions/${user?._id}?m=userId`}
                headers={transactionHeaders}
                search={false}
                action={false}
              />
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default PaymentPage;
