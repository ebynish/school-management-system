import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import MainLayout from "../components/MainLayout";
const ContactUs = ({config}) => {
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Your message has been successfully sent. We will get back to you soon.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <MainLayout config={config}>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"    
      p="10"
    >
      <Box
        maxW="550px"
        w="full"
        bg="white"
        p="8"
        borderRadius="lg"
        boxShadow="lg"
        textAlign="center"
      >
        <Heading as="h1" size="lg" mb="6" color="gray.700">
          Contact Us
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing="4" align="stretch">
            {/* Name Input */}
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Enter your name" />
            </FormControl>

            {/* Email Input */}
            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input type="email" placeholder="Enter your email" />
            </FormControl>

            {/* Subject Input */}
            <FormControl id="subject" isRequired>
              <FormLabel>Subject</FormLabel>
              <Input placeholder="Enter the subject" />
            </FormControl>

            {/* Message Textarea */}
            <FormControl id="message" isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea placeholder="Write your message here" rows={5} />
            </FormControl>

            {/* Submit Button */}
            <Button bg={config.buttonColor} color="white" type="submit" w="full">
              Send Message
            </Button>
          </VStack>
        </form>
      </Box>
    </Box></MainLayout>
  );
};

export default ContactUs;
