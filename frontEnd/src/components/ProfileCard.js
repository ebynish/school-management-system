import React from "react";
import {
  Box,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  Button,
  Image,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom"; // Import Link from React Router

const ProfileCard = ({ userData }) => {
  return (
    <Box
      bg="white"
      p={2}
      shadow="sm"
      borderRadius="md"
      borderColor="gray.300"
      maxW="750px"
    >
      <Flex align="center" justify="space-between">
        {/* Profile Image Section */}
        <Box flex="0 0 30%" textAlign="center">
          <Image
            src={userData?.profileImage || "https://placehold.co/120?text=No+Image"}
            alt="Profile Picture"
            borderRadius="full"
            boxSize="120px"
            objectFit="cover"
            mx="auto"
          />
          <Text fontSize="lg" fontWeight="bold" mt={4}>
            {userData?.firstName} {userData?.lastName}
          </Text>
        </Box>

        {/* Details Table */}
        <Box flex="1" ml={8}>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td><strong>Matric. No.:</strong></Td>
                <Td>{userData?.matricNumber}</Td>
              </Tr>
              <Tr>
                <Td><strong>Level:</strong></Td>
                <Td>{userData?.level}</Td>
              </Tr>
              <Tr>
                <Td><strong>Entry Mode:</strong></Td>
                <Td>{userData?.entryMode}</Td>
              </Tr>
              <Tr>
                <Td><strong>CGPA:</strong></Td>
                <Td>{userData?.cgpa}</Td>
              </Tr>
              <Tr>
                <Td><strong>Session:</strong></Td>
                <Td>{userData?.session}</Td>
              </Tr>
              <Tr>
                <Td><strong>Programme:</strong></Td>
                <Td>{userData?.programmeName}</Td>
              </Tr>
              <Tr>
                <Td><strong>Department:</strong></Td>
                <Td>{userData?.departmentName}</Td>
              </Tr>
              <Tr>
                <Td><strong>Examination Centre:</strong></Td>
                <Td>{userData?.examinationCentre}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Flex>

      {/* Footer Section */}
      <Flex justify="flex-end" mt={6} gap={4}>
        <Button as={Link} to={`/user-profile`} variant="link" color={userData?.color}>
          Check your profile →
        </Button>
      </Flex>
    </Box>
  );
};

export default ProfileCard;
