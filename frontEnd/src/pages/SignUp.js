import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { Box, Button, Stack, Divider, Text } from '@chakra-ui/react';
import EmailSignup from '../components/EmailSignup';


const SignupPage = () => {
  const [signupMethod, setSignupMethod] = useState(''); // Track which form to show

  return (
    <Box width="400px" margin="0 auto" padding="40px" boxShadow="lg" borderRadius="md">
      <Stack direction="row" justifyContent="center" spacing={4} mb={6}>
        <Button
          // colorScheme="blue"
          variant={signupMethod === 'email' ? 'solid' : 'outline'}
          onClick={() => setSignupMethod('email')}
        >
          Sign Up with Email
        </Button>
        <Button
          // colorScheme="blue"
          variant={signupMethod === 'phone' ? 'solid' : 'outline'}
          onClick={() => setSignupMethod('phone')}
        >
          Sign Up with Phone
        </Button>
      </Stack>

      {/* Conditionally render the form based on user selection */}
      {signupMethod === 'email' && <EmailSignup />}

      <Divider />
         {/* Add a link to the login page */}
         <Text mt={4} textAlign="center">
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          Log In
        </Link>
      </Text>
    </Box>
  );
};

export default SignupPage;
