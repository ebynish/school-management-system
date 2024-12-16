import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  Flex,
  Checkbox,
  Spinner,
  useToast,
  Avatar
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import PrintableCourseForm from "../components/PrintableCourseForm";
import useApi from "../hooks/useApi";
import { fetchData, submitForm } from "../api";
import { useSelector } from "react-redux";

const CourseRegistration = ({ config }) => {
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
    level: user?.levelName,
    registeredCourses: registeredCourses,
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

          <Box  p={5} shadow="md" borderRadius="md" bg="white">
            {/* Semester Toggle */}
            <HStack mb={5}>
              <Button
                onClick={() => setSemester(user?.semesterId)}
                bg={semester == user?.semesterId ? config.buttonColor : "#edf2f7"}
                color={semester == user?.semesterId ? "white" : "black"}
              >
                Current Semester
              </Button>
              <Button
                onClick={() => setSemester("All Semesters")}
                bg={semester === "All Semesters" ? config.buttonColor : "#edf2f7"}
                color={semester === "All Semesters" ? "white" : "black"}
              >
                All Semesters
              </Button>
            </HStack>

            {/* Units Information */}
            <Grid templateColumns="repeat(4, 1fr)" gap={5} mb={5} >
              <GridItem 
              borderRadius="md"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            bg="white"
            p={4}
            >
                <Text fontSize="lg" fontWeight="bold"
            >
                  Minimum Units
                </Text>
                <Text  fontSize="2xl" mt={2}>
                  6
                </Text>
              </GridItem>
              <GridItem 
             borderRadius="md"
             shadow="md"
             border="1px solid"
             borderColor="gray.200"
             bg="white"
             p={4}
            >
                <Text fontWeight="bold" fontSize="lg">
                  Maximum Units
                </Text>
                <Text fontSize="2xl" mt={2}>
                  24
                </Text>
              </GridItem>
              <GridItem 
              borderRadius="md"
              shadow="md"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              p={4}
            >
                <Text fontWeight="bold" fontSize="lg">
                  Total Selected Units
                </Text>
                <Text fontSize="2xl" mt={2}>
                  {totalUnits}
                </Text>
              </GridItem>
              <GridItem borderRadius="md"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            bg="white"
            p={4}>
                <Text fontWeight="bold" fontSize="lg">
                  Selected Courses
                </Text>
                <Text fontSize="2xl" mt={2}>
                  {selectedCourses.length}
                </Text>
              </GridItem>
            </Grid>

            {/* Search and Course List */}
            <HStack spacing={4} mb={5}>
              <Button variant="outline" colorScheme="red" onClick={handleUnselectAll}>
                Unselect All
              </Button>
            </HStack>

            {/* Display Courses */}
            <VStack align="stretch" spacing={3}>
              {currentCourses.length === 0 ? (
                <Text>No courses available for selected semester.</Text>
              ) : (
                currentCourses?.map((course) => (
                  <HStack
                    key={course._id}
                    bg="gray.50"
                    p={4}
                    borderRadius="md"
                    justify="space-between"
                    shadow="sm"
                  >
                    <HStack>
                      <Checkbox
                        isChecked={selectedCourses?.some((c) => c._id === course._id)}
                        onChange={() => handleCourseSelection(course)}
                        isDisabled={registeredCourses[0]?.selectedCourses?.some((regCourse) => regCourse._id === course._id)} // Disable if the course is registered
                      />
                      <Text fontWeight="bold">{course.code}</Text>
                      <Text> - </Text>
                      <Text>{course.name}</Text>
                    </HStack>
                    <Text>{course.unit} Units</Text>
                  </HStack>
                ))
              )}
            </VStack>

            {/* Loading Placeholder */}
            {loading && (
              <Flex justify="center" mt={10}>
                <Spinner size="xl" color="green.500" />
              </Flex>
            )}

            {/* Submit and Print Buttons */}
            <Flex justify="space-between" mt={10}>
              <Button bg={config.buttonColor} color="white" onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="outline" colorScheme="green" onClick={handlePrintClick}>
                Print
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Layout>
  );
};

export default CourseRegistration;
