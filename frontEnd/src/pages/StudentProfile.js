import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  SimpleGrid,
  Text,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import useApi from "../hooks/useApi";
import { fetchData } from "../api"; // Replace with your actual API import
import { useParams } from "react-router-dom";

const StudentProfile = ({ config }) => {
  const toast = useToast();
  const user = useSelector((state) => state.auth.user); // Assuming 'auth' slice in Redux
  const { execute: getUserData, data: userData, loading } = useApi(fetchData); // Hook for API calls
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPwd, setLoadingPwd] = useState(false);
  const [courses, setCourses] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [results, setResults] = useState([]);
  const { id } = useParams(); // Get the student ID from URL params

  useEffect(() => {
    // Fetch user profile data when the component mounts
    const fetchUserProfile = async () => {
      try {
        const userResponse = await getUserData(`/students/${id}`);
        setCourses(userResponse.data.courses || []);
        setPaymentHistory(userResponse.data.paymentHistory || []);
        setResults(userResponse.data.results || []);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load user profile.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchUserProfile();
  }, [getUserData, toast, id]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoadingPwd(true);
      let response = await getUserData("/auth/change_password", {
        method: "POST",
        data: {
          oldPassword,
          newPassword,
        },
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Password updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingPwd(false);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; // Display loading indicator while fetching user data
  }

  return (
    <Layout config={config}>
      <Box bg="white" p={8} borderRadius="md" shadow="lg" ml={5}>
        {/* Profile Header */}
        <Flex alignItems="center" mb={8}>
          <Avatar size="xl" name={user?.name || "User"} mr={6} />
          <Box>
            <Heading fontSize="2xl" color="gray.700">
              Student Profile
            </Heading>
            {/* <Text color="gray.500">Update your account details</Text> */}
          </Box>
        </Flex>

        {/* Tabs for different student details */}
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList mb={4}>
            <Tab>Personal Information</Tab>
            <Tab>Course Registered</Tab>
            <Tab>Payment History</Tab>
            <Tab>Results</Tab>
            <Tab>Password Update</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <FormControl isReadOnly>
                  <FormLabel fontWeight="bold" color="gray.600">
                    Email Address
                  </FormLabel>
                  <Input type="email" value={userData?.email || ""} bg="gray.100" />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.600">
                    Phone Number
                  </FormLabel>
                  <Input type="tel" placeholder="Enter your phone number" defaultValue={userData?.phone || ""} readOnly />
                </FormControl>
                <FormControl isReadOnly>
                  <FormLabel fontWeight="bold" color="gray.600">
                    Matric. Number
                  </FormLabel>
                  <Input type="text" value={userData?.matricNumber || ""} bg="gray.100" />
                </FormControl>
                <FormControl isReadOnly>
                  <FormLabel fontWeight="bold" color="gray.600">
                    Level
                  </FormLabel>
                  <Input type="text" value={userData?.level || ""} bg="gray.100" />
                </FormControl>
                <FormControl isReadOnly>
                  <FormLabel fontWeight="bold" color="gray.600">
                    Entry Mode
                  </FormLabel>
                  <Input type="text" value={userData?.entryMode || ""} bg="gray.100" />
                </FormControl>
                <FormControl isReadOnly>
                  <FormLabel fontWeight="bold" color="gray.600">
                    Programme
                  </FormLabel>
                  <Input type="text" value={`${userData?.programmeName} ${userData?.departmentName}` || ""} bg="gray.100" />
                </FormControl>
              </VStack>
            </TabPanel>

            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {/* Map through the courses array to display them */}
                {courses.map((course, index) => (
                  <Box key={index} p={4} shadow="md" borderWidth="1px">
                    <Text fontSize="lg" fontWeight="bold">
                      {course.name}
                    </Text>
                    <Text mt={2}>Instructor: {course.instructor}</Text>
                    <Text mt={2}>Schedule: {course.schedule}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Map through the payment history array */}
                {paymentHistory.map((payment, index) => (
                  <Box key={index} p={4} shadow="md" borderWidth="1px">
                    <Text fontSize="lg" fontWeight="bold">
                      {payment.date}
                    </Text>
                    <Text mt={2}>Amount: ${payment.amount}</Text>
                    <Text mt={2}>Method: {payment.method}</Text>
                    <Text mt={2}>Status: {payment.status}</Text>
                  </Box>
                ))}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Map through the results array */}
                {results.map((result, index) => (
                  <Box key={index} p={4} shadow="md" borderWidth="1px">
                    <Text fontSize="lg" fontWeight="bold">
                      {result.courseName}
                    </Text>
                    <Text mt={2}>Grade: {result.grade}</Text>
                    <Text mt={2}>Semester: {result.semester}</Text>
                    <Text mt={2}>Year: {result.year}</Text>
                  </Box>
                ))}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.600">
                    Current Password
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.600">
                    New Password
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.600">
                    Confirm New Password
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormControl>

                <Button
                  colorScheme="green"
                  isLoading={loadingPwd}
                  onClick={handlePasswordChange}
                >
                  Change Password
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
};

export default StudentProfile;
