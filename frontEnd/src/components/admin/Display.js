import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, VStack, Spinner } from '@chakra-ui/react';

const Display = ({ data, value }) => {
  
  
  return (
    <VStack spacing={1} align="start" width={"400px"}> 
      {value && data?.additionalProps && Object.entries(data?.additionalProps).map(([key, propKey]) => (
        <Flex key={key} width="100%" justify="space-between" bg={data?.backgroundColor} p={2}>
          <Text fontWeight="bold">{splitCamelCase(propKey)}</Text> {/* Use propKey for display */}
          <Text align="start" alignSelf={'left'}>{value[propKey] || 'N/A'}</Text> {/* Fetch the value from the response using the propKey */}
        </Flex>
      ))}
    </VStack>
  );
};

// Function to split camelCase into words
const splitCamelCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, char => char.toUpperCase());
};

export default Display;
