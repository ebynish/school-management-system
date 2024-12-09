import React from 'react';
import { Box, Heading, Text, Icon, VStack } from '@chakra-ui/react';
import { FiClipboard, FiSettings, FiUser, 
  FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp, FiHome} from 'react-icons/fi';
import {FaBuilding } from 'react-icons/fa';
const getIcon = (itemType) => {
  switch (itemType) {
    case 'page': return FiClipboard;
    case 'settings': return FiSettings;
    case 'user': return FiUser;
    case 'office': return FaBuilding;
    // Add more mappings as needed
    default: return FiClipboard; // Fallback icon
  }
}
const CardComponent = ({ title, description, icon }) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg="white"
      _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      transition="all 0.2s ease"
    >
      <VStack spacing={4} align="start">
        {icon && <Icon as={getIcon(icon)} boxSize={4} />}
        <Text fontSize={14} fontWeight={500}>{title}</Text>
        <Text color="gray.600">{description}</Text>
      </VStack>
    </Box>
  );
};

export default CardComponent;
