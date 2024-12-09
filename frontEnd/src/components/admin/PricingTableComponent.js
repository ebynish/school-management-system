import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const PricingTableComponent = ({ component }) => {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">Pricing Table</Text>
      {component.nestedComponents.map((nestedComponent, index) => (
        <Box key={index} borderWidth="1px" borderRadius="lg" p={4} mt={2}>
          <Text fontSize="xl">{nestedComponent.title}</Text>
          <Text>{nestedComponent.price}</Text>
          <Text>{nestedComponent.description}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default PricingTableComponent;
