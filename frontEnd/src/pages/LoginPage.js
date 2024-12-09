// LoginPage.js
import React from 'react';
import EmailPasswordLogin from '../components/EmailLogin';
import Auth from '../components/Auth'; // The Google OAuth login component
import { Text, Box, Heading, Divider, Image } from '@chakra-ui/react';

const LoginPage = ({config}) => {
  return (
    <Box >
    <Box p={6} maxWidth="400px" mx="auto" mt={10}>
      <Heading mb={4} justifyContent={'center'} display={'flex'}  mt={10}>
        <Image src={`${config.logoUrl}`}  width={350} /></Heading>

      <Divider my={4} />      
      
      <EmailPasswordLogin config={config}/>
      
      <Divider my={4} />


        
        {/* <Text align="center" fontSize={13} mt={4}>
          Don't have an account?{' '}
          <Link fontSize={13} to="/signup" color="blue.500" fontWeight="bold">
            Sign Up
          </Link>
        </Text> */}
    </Box>
    </Box>
  );
};

export default LoginPage;
