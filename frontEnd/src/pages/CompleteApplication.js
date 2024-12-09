import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Heading,
  Stack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import useApi from "../hooks/useApi"; // Ensure the correct import path for `useApi`
import { submitForm } from "../api";

const CompleteApplication = ({ config }) => {
  const [applicantId, setApplicationNumber] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const { execute, loading } = useApi(submitForm);

  const handleCheckStatus = async () => {
    // Check if both fields are filled out
    if (!applicantId.trim() || !password.trim()) {
      toast({
        description: "Please enter both application number and password.",
        status: "error",
      });
      return;
    }

    try {
      const data = await execute("applicants/login", { applicantId, password });

      // Ensure the data structure is valid before proceeding
      if (data?.statusCode === 200 && data?.data) {
        toast({ description: "Application found.", status: "success" });
        navigate(`/application-form/${data?.data?._id}`, {
          state: { userData: { username: data?.data?._id } },
        });
      } else if (data?.statusCode === 501) {
        toast({ description: "Pay application fee", status: "error" });
        navigate("/pay-invoice", {
          state: { userData: { transactionId: data?.data?._id } },
        });
      } else {
        toast({
          description: "Invalid application number or password.",
          status: "error",
        });
      }
    } catch (error) {
      // More specific error handling
      toast({
        description:
          error?.response?.data?.message ||
          error.message ||
          "Error checking status.",
        status: "error",
      });
    }
  };

  return (
    <MainLayout config={config}>
      <Flex align="center" justify="center" bg="gray.50" px={4} py={10}>
        <Box
          maxW="600px"
          p={6}
          borderWidth="1px"
          borderRadius="md"
          bg="white"
          shadow="md"
        >
          <Heading size="md" mb={6} textAlign="center">
            Continue Application
          </Heading>
          <Stack spacing={4} mb={6}>
            <Input
              placeholder="Enter Application ID"
              value={applicantId}
              onChange={(e) => setApplicationNumber(e.target.value)}
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
                Continue Application
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Flex>
    </MainLayout>
  );
};

export default CompleteApplication;
