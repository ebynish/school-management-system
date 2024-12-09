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
import { useParams, Link } from "react-router-dom"; // Assuming react-router for routing
import useApi from "../hooks/useApi";
import { submitForm } from "../api";

const ResetPasswordPage = ({ config }) => {
  const toast = useToast();
  const { execute: update } = useApi(submitForm);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { token } = useParams(); // Extract the `token` from the URL
  console.log(token)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await update("auth/reset-password", { token, newPassword: password });
      if (response?.statusCode === 200) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been updated. You can now log in.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to reset the password.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
          Enter your new password to reset your account password.
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing="4">
            <FormControl id="password" isRequired>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl id="confirm-password" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <Button bg={config.buttonColor} color="white" type="submit" w="full">
              Reset Password
            </Button>
          </VStack>
        </form>
        <Text mt="4" fontSize="sm" color="gray.600">
          Remembered your password?{" "}
          <Link to="/login">
            Go back to login
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
