import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginSuccess } from '../slices/authSlice';
import useApi from '../hooks/useApi';
import { submitForm } from '../api';
import { Box, Input, Button, Text, useToast } from '@chakra-ui/react';

const EmailPasswordLogin = ({ config }) => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast(); // Initialize the toast hook
  const { loading, error, execute: loginRequest } = useApi(submitForm);

  const handleLogin = async () => {
    const result = await loginRequest('auth/login', { username, password });
    console.log(result);

    if (result?.statusCode === 200) {
      const { access_token, user } = result?.data;
      localStorage.setItem('token', access_token);
      dispatch(loginSuccess({ user, access_token }));
      toast({
        title: 'Login Successful.',
        description: 'You have been successfully logged in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login Failed.',
        description: result.message || 'An error occurred during login.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Box fontSize={13} p={3}>
      <Text my={1}>Login with your matric number</Text>
      {error && <Text color="red">{error}</Text>}
      <Input
        fontSize={13}
        placeholder="E012345"
        value={username}
        onChange={(e) => setEmail(e.target.value)}
        my={3}
      />
      <Input
        mt={1}
        fontSize={13}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        my={3}
      />
      <Box display={'flex'} justifyContent={'center'} mb={5}>
        <Button
          mt={2}
          bg={config.buttonColor}
          color="white"
          width="350px"
          fontSize={14}
          onClick={handleLogin}
          isLoading={loading}
        >
          Login
        </Button>
      </Box>
      <Link to="/forgot-password">Forgot Password</Link>
    </Box>
  );
};

export default EmailPasswordLogin;
