import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Divider,
  Avatar,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FaBullhorn } from "react-icons/fa";

const AnnouncementBoard = ({ announcements, onViewAll }) => {
  return (
    <Box
      bg="white"
      p={1}
      maxH="800px"
      overflowY="auto"
    >
      {/* Header */}
      <HStack justify="space-between" m={4}>
        <HStack>
          <Icon as={FaBullhorn} boxSize={6} color="orange.400" />
          <Heading fontSize="lg">Announcements</Heading>
        </HStack>
        {/* {onViewAll && (
          <Button size="sm" colorScheme="blue" onClick={onViewAll}>
            View All
          </Button>
        )} */}
      </HStack>

      <Divider />

      {/* Announcements */}
      <VStack align="stretch" spacing={4} mt={4}>
        {announcements.map((announcement, index) => (
          <Box
            key={index}
            p={4}
            bg="gray.50"
            borderRadius="md"
            shadow="sm"
            _hover={{ bg: "gray.100" }}
          >
            <HStack mb={2}>
              <Avatar size="sm" name={announcement.author} />
              <Text fontWeight="bold" fontSize="sm">
                {announcement.author}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {announcement.date}
              </Text>
            </HStack>
            <Text fontSize="md" fontWeight="semibold">
              {announcement.title}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default AnnouncementBoard;
