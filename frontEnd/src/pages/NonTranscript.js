import React, { useEffect, useState } from "react";
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
import { submitForm, fetchData } from "../api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Transcript = ({ config }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    types: "download"
  })
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { execute: submit} = useApi(submitForm);
  const { data: programme, loading, error, execute} = useApi(fetchData);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(()=>{
      execute("check/find/programmes")
  },[execute])

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
    amount: config?.transcript[`${formData["type"]}`],
    schema: "transcripts",
    dependency: "transcripts",
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submit("forms/submit", invoiceData);
      if (response?.StatusCode == 200 && response?.data?.transactionId) {
        const updatedInvoiceData = {
          ...invoiceData,
          transactionId: response?.data?.transactionId,
        };
        navigate("/pay-invoice", { state: { userData: updatedInvoiceData } });
        toast({
          title: "Application Submitted",
          description: "Your transcript application has been successfully submitted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        handleCloseModal();
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

  return (
    <Layout config={config}>
      <Box justifyContent={'flex-end'}>
      <Button  onClick={handleOpenModal} bg={config?.buttonColor} color="white" w={200}>
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
                
                {/* Enrollment Year */}
                <FormControl id="enrollmentYear" isRequired>
                  <FormLabel>Enrollment Year</FormLabel>
                  <Input type="number" placeholder="Enter your year of enrollment" />
                </FormControl>

                {/* Graduation Year */}
                <FormControl id="graduationYear">
                  <FormLabel>Graduation Year (if applicable)</FormLabel>
                  <Input type="number" placeholder="Enter your graduation year" />
                </FormControl>

                {/* Reason for Transcript */}
                <FormControl id="reason" isRequired>
                  <FormLabel>Reason for Transcript</FormLabel>
                  <Textarea placeholder="Explain why you need the transcript" />
                </FormControl>

                {/* Submit Button */}
                <Button justifySelf={'center'} bg={config?.buttonColor} color="white" type="submit" w="200px">
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

      <DynamicTable
        apiUrl={`fetch/transcripts/${user?._id}?m=userId`}
        headers={transactionHeaders}
        search={false}
        action={false}
      />
    </Layout>
  );
};

export default Transcript;
