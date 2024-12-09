import React, {useState, useEffect} from "react";
import { Box, Heading, Text, Stack, Button, VStack, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import useApi from "../hooks/useApi";
import { fetchData } from "../api";
const Sidebar = () => (
  <VStack
    spacing={4}
    p={4}
    // bg="gray.100"
    // w="250px"
    borderRight="1px solid gray"
    minH="100vh"
  >
    <Heading size="md" mb={4} mt={5}>
      Admission Quick links
    </Heading>
    <Link href="/admission/status" color="blue.500">
      Check Admission Status
    </Link>
    <Link href="/continue-application" color="blue.500">
      Continue Application
    </Link>
    <Link href="/help" color="blue.500">
      Help Center
    </Link>
  </VStack>
);
const ApplyPage = ({ config }) => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const { data, error, loading, execute } = useApi(fetchData);

  useEffect(() => {
    const fetchProg = async () => {
      try {
        let response = await execute('programmes-with-departments');
        
        setPrograms(response);
      } catch (err) {
        console.error('Error fetching programmes:', err);
      }
    };
    fetchProg();
  }, [execute]);
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading programmes: {error.message}</Text>;
  const handleStartNow = (program) => {
    // Pre-fill invoice data
    const programDetails = {
      programmeId: program?.programme?._id,
      programmeName: program?.programme?.name,
      programmeCode: program?.programme?.code,
      amount: program?.programme?.amount,
      courses: program?.departments,
    };
  
    // Navigate to the StartPage with the selected program details
    navigate("/start", { state: { userData: programDetails, config } });
  };
  return (
    <MainLayout config={config}>
      <Box display="flex">
        <Box p={8} maxW="800px" mx="auto">
          <Heading mb={6} textAlign="center" fontFamily={"heading"}>
            Programme Requirements
          </Heading>
          <Stack spacing={6}>
            {programs?.map((program, index) => (
              <Box key={index} p={4} shadow="sm">
                <Heading fontSize="xl" color={config?.primaryColor} mb={3}>
                  {program.programme?.name}
                </Heading>
                <Text fontWeight="bold" mb={2}>
                  Requirements:
                </Text>
                <Stack as="ul" spacing={2} pl={4}>
                  {program.programme?.requirements?.map((requirement, i) => (
                    <Text as="li" key={i}>
                      {requirement}
                    </Text>
                  ))}
                </Stack>
                <Text fontWeight="bold" mt={4} mb={2}>
                  Available Courses/Departments:
                </Text>
                <Stack as="ul" spacing={2} pl={4}>
                  {program.departments?.map((department, i) => (
                    <Text as="li" key={i}>
                      {department.name}
                    </Text>
                  ))}
                </Stack>
                <Button
                  mt={4}
                  color={config?.buttonColor}
                  size="sm"
                  onClick={() => handleStartNow(program)}
                >
                  Start Now
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
        <Sidebar />
      </Box>
    </MainLayout>
  
  );
};

export default ApplyPage;
