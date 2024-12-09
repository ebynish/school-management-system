// LoanCard.js
import React from 'react';
import {
  Box,
  Text,
  Heading,
  Icon
} from '@chakra-ui/react';

const DashboardCard = ({ title, count, icon: IconComponent, color }) => {
  return (
    <Box
      px={5}
      py={2}
      shadow="md"
      borderWidth="1px"
      width={"100%"}
      borderRadius="lg"
     
      borderColor={color}
      mt={2}
    >
      <Icon as={IconComponent} boxSize={6} color={color} />
      <Text  size="md" mt={2}>
        {title}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" color={color}>
        {count}
      </Text>
    </Box>
  );
};

export default DashboardCard;
