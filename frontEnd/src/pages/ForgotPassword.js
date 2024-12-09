import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  useToast,
  Image
} from "@chakra-ui/react";
import { Link } from "react-router-dom"; // Assuming you're using react-router for navigation
import useApi from "../hooks/useApi";
import { submitForm } from "../api";

const ForgotPasswordPage = ({ config }) => {
  const toast = useToast();
  const { execute: update } = useApi(submitForm);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await update("auth/forgot-password", { email });

      // Handle unexpected `stack` or non-standard responses
      if (response?.stack) {
        console.error("Unexpected error object:", response);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (response?.statusCode === 200) {
        toast({
          title: "Reset Link Sent",
          description: "A password reset link has been sent to your email address.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to send the reset link.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="80vh"
      bg="gray.50"
      px="4"
    >
      <Heading mb={4} justifyContent="center" display="flex" mt={10}>
        <Image src={`${config.logoUrl}`} width={350} />
      </Heading>
      <Box>
        <Text mb="6" color="gray.500">
          Enter your email address to receive a password reset link.
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing="4">
            {/* Email Input */}
            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            {/* Submit Button */}
            <Button bg={config.buttonColor} color="white" type="submit" w="full">
              Send Reset Link
            </Button>
          </VStack>
        </form>
        <Text mt="4" fontSize="sm" color="gray.600">
          Remember your password?{" "}
          <Link to="/login">
            Go back to login
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
