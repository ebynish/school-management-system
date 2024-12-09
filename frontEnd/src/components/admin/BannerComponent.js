import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const BannerComponent = ({ component }) => {
  return (
    <Box backgroundColor={component.backgroundColor || 'blue.500'} color="white" p={5}>
      <Text fontSize="xl" textAlign="center">{component.content}</Text>
    </Box>
  );
};

export default BannerComponent;
