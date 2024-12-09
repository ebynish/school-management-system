import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const HeroComponent = ({ component }) => {
  return (
    <Box backgroundColor={component.backgroundColor || 'gray.100'} p={10} textAlign="center">
      <Text fontSize="4xl" fontWeight="bold">{component.title}</Text>
      <Text fontSize="xl">{component.description}</Text>
    </Box>
  );
};

export default HeroComponent;
