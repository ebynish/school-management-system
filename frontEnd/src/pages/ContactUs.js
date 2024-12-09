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

const ContactUs = () => {
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="gray.50"
      px="4"
    >
      <Box
        maxW="600px"
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
            <Button colorScheme="blue" type="submit" w="full">
              Send Message
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default ContactUs;
