import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Text,
  Image,
  Heading,
  Flex
} from "@chakra-ui/react";

const PrintableCourseForm = ({ userData }) => {
  
  const {
    firstName,
    lastName,
    schoolLogo,
    programme,
    session,
    semester,
    level,
    matricNumber,
    department,
    registeredCourses,
    totalUnits
  } = userData;

  return (
    <Box p={6} margin="0 auto" className="invoice-container2">
      <Image src={schoolLogo} alt="School Logo" mb={4} />
      
      {/* User Details Table */}
      <Box borderWidth="1px" borderRadius="md" p={6} borderColor="gray.300" mb={6} width={"100%"}>
        <Flex justifyContent={'center'} alignItems={'center'}>
        <Heading justifyContent={'center'} alignItems={'center'} >Course Registration</Heading>
        </Flex>
        <Stack spacing={4}>
          <Table variant="simple" width={"100%"}>
            <Tbody width={"100%"}>
              <Tr>
                <Td><strong>Name:</strong></Td>
                <Td>{`${firstName} ${lastName}`}</Td>
              </Tr>
              <Tr>
                <Td><strong>Matric Number:</strong></Td>
                <Td>{matricNumber}</Td>
              </Tr>
              <Tr>
                <Td><strong>Programme:</strong></Td>
                <Td>{programme}</Td>
              </Tr>
              <Tr>
                <Td><strong>Department:</strong></Td>
                <Td>{department}</Td>
              </Tr>
              <Tr>
                <Td><strong>Session:</strong></Td>
                <Td>{session}</Td>
              </Tr>
              <Tr>
                <Td><strong>Semester:</strong></Td>
                <Td>{semester}</Td>
              </Tr>
              <Tr>
                <Td><strong>Level:</strong></Td>
                <Td>{level}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
      </Box>

      {/* Registered Courses Table */}
      <Box borderWidth="1px" borderRadius="md" p={6} borderColor="gray.300" mb={6}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Registered Courses</Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Course Code</Th>
              <Th>Course Name</Th>
              <Th isNumeric>Units</Th>
            </Tr>
          </Thead>
          <Tbody>
            {registeredCourses[0]?.selectedCourses?.map((course) => (
              <Tr key={course._id}>
                <Td>{course.code}</Td>
                <Td>{course.name}</Td>
                <Td isNumeric>{course.unit}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Units Information */}
      <Box borderWidth="1px" borderRadius="md" p={6} borderColor="gray.300">
        <Stack spacing={4}>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td><strong>Total Units:</strong></Td>
                <Td>{totalUnits}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
      </Box>
    </Box>
  );
};

export default PrintableCourseForm;
