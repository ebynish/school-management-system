import React, { useState, useEffect } from "react";
import {
  Box,
  HStack,
  Text,
  Heading,
  Flex,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import PrintableCourseForm from "../components/PrintableCourseForm";
import useApi from "../hooks/useApi";
import { fetchData, submitForm } from "../api";
import { useSelector } from "react-redux";

const Results = ({ config }) => {
  const user = useSelector((state) => state.auth.user);
  const [semester, setSemester] = useState(user?.semesterId);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [filteredSemesterCourses, setFilteredSemesterCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { execute: fetchCourses } = useApi(fetchData);
  const { loading: courseLoading, execute } = useApi(submitForm);
  const toast = useToast(); // Initialize Chakra UI Toast

  useEffect(() => {
    const fetchCoursesData = async () => {
      setLoading(true);

      // Check if user is already registered for any courses
      const response = await fetchCourses(`check/find/registeredcourses/${user?._id}/userId`);
      setRegisteredCourses(response);  // User's registered courses

      // Fetch all available courses
      const allCoursesResponse = await fetchCourses("check/find/courses");

      // Filter courses based on user's programmeId, departmentId, and semesterId
      const filteredCourses = allCoursesResponse?.filter(course => 
        String(course?.programmeId) === String(user?.programmeId) && 
        String(course?.departmentId) === String(user?.departmentId) && 
        String(course?.semesterId) === String(user?.semesterId)
      );

      setCourses(filteredCourses);  // Set available courses for the user

      // Filter registered courses based on user's semester
      const filteredCoursesBySemester = registeredCourses?.filter(course => 
        String(course?.programmeId) === String(user?.programmeId) && 
        String(course?.departmentId) === String(user?.departmentId) && 
        String(course?.semesterId) === String(user?.semesterId)
      );

      setFilteredSemesterCourses(filteredCoursesBySemester);
      setLoading(false);
    };

    if (user) {
      fetchCoursesData();
    }
  }, [user]);

  const handleCourseSelection = (course) => {
    if (selectedCourses.find((c) => c._id === course._id)) {
      setSelectedCourses(selectedCourses?.filter((c) => c._id !== course._id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const handleUnselectAll = () => {
    setSelectedCourses([]);
  };

  const handleSubmit = async () => {
    try {
      const response = await execute("forms/submit", {
        userId: user?._id,
        schema: 'registeredcourses',
        dependency: 'registeredcourses',
        selectedCourses,
        totalUnits: selectedCourses?.reduce((acc, course) => acc + course.unit, 0),
      });
      
      if (response.statusCode === 200) {
        toast({
          title: "Registration Successful",
          description: "Your course registration has been submitted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalUnits = selectedCourses.reduce((acc, course) => acc + course.unit, 0);

  // Determine current courses to display based on the semester selection
  const currentCourses =
    semester === "All Semesters"
      ? registeredCourses[0]?.selectedCourses // Display all registered courses for all semesters
      : courses.filter(course => 
          String(course?.semester?._id) === String(user?.semesterId)
        );

  const [showPrintableForm, setShowPrintableForm] = useState(false);

  const handlePrintClick = () => {
    setShowPrintableForm(true);
    setTimeout(() => {
      window.print();
      setShowPrintableForm(false);
    }, 1000);
  };

  const userData = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    matricNumber: user?.matricNumber,
    email: user?.email,
    phone: user?.phone,
    schoolLogo: config?.logoUrl,
    programme: user?.programmeName,
    department: user?.departmentName,
    session: user?.session,
    semester: user?.semesterName,
    selectedCourses: registeredCourses[0]?.selectedCourses,
    totalUnits: totalUnits,
  };

  return (
    <Layout config={config}>
      {showPrintableForm ? (
        <PrintableCourseForm userData={userData} />
      ) : (
        <Box flex="1" px={5}>
          <Flex justify="space-between" align="center" mb={5}>
            <Text fontSize="2xl" fontWeight="bold">
              {user.session} Session
            </Text>
            <HStack spacing={4}>
            <Flex align="center" mb={6}>
          
          <Avatar name={`${user.firstName} ${user.lastName}`} />
          <Text ml={3}>{`${user.firstName} ${user.lastName}`}</Text>
        </Flex>
            </HStack>
          </Flex>

          <Box bg="white" >
          
      
        {/* Content */}
        <Flex gap={4} mb={6}>
          <Box
            flex="1"
            bg="white"
            p={6}
            borderRadius="md"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="sm" fontWeight="bold">Cumulative Units Registered</Text>
            <Heading size="lg">0</Heading>
          </Box>
          <Box
            flex="1"
            bg="white"
            p={6}
            borderRadius="md"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="sm" fontWeight="bold">Cumulative Units Passed</Text>
            <Heading size="lg">0</Heading>
          </Box>
          <Box
            flex="1"
            bg="white"
            p={6}
            borderRadius="md"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="sm" fontWeight="bold">CGPA</Text>
            <Heading size="lg">N/A</Heading>
          </Box>
        </Flex>

                    </Box>
        </Box>
      )}
    </Layout>
  );
};

export default Results;
