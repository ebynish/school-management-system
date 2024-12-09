import React from 'react';
import { Box, Text, Avatar } from '@chakra-ui/react';

const TestimonialComponent = ({ component }) => {
  return (
    <Box p={5} borderWidth="1px" borderRadius="lg">
      <Avatar src={component.avatar} />
      <Text fontWeight="bold">{component.name}</Text>
      <Text>{component.testimonial}</Text>
    </Box>
  );
};

export default TestimonialComponent;
