import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useToast, Stack } from '@chakra-ui/react';
import useApi from '../hooks/useApi'; // Your custom useApi hook
import { signUp } from '../api'; // Your signup API call

const EmailSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { data, loading, error, execute } = useApi(signUp);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await execute(formData);
    if (result) {
      toast({
        title: "Account Created",
        description: "Your account has been successfully created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else if (error) {
      toast({
        title: "Signup Failed",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={loading}
          loadingText="Submitting"
        >
          Sign Up with Email
        </Button>
      </Stack>
    </form>
  );
};

export default EmailSignup;
