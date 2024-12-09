import React, { useState, useEffect } from "react"; 
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { formatNaira } from "../hooks/common";
import { submitForm, fetchData } from "../api";
import useApi from "../hooks/useApi";

const StartPage = ({ config }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = location.state || {};
  const { execute } = useApi(submitForm);
  const { execute: fetchCampus } = useApi(fetchData);
  const toast = useToast();

  // Fetch campuses
  const [campuses, setCampuses] = useState([]);
  const fetchCampuses = async () => {
    
      const response = await fetchCampus("check/find/campuses");
      
      setCampuses(response || []);
  
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    courseId: "",
    courseName: "",
    courseCode: "",
    password: "",
    type: "Application Fee",
    session: config?.admissionSession || new Date().getFullYear().toString().slice(-2),
    campusId: "",
    campusName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "course" && value) {
      const selectedCourse = userData?.courses?.find((course) => course._id === value);
      if (selectedCourse) {
        setFormData((prevData) => ({
          ...prevData,
          courseId: selectedCourse._id,
          courseName: selectedCourse.name,
          courseCode: selectedCourse.code,
          description: `${prevData.type} payment for ${userData.programmeName} (${selectedCourse.name})`,
        }));
      }
    } else if (name === "campusId" && value) {
      const selectedCampus = campuses.find((campus) => campus._id === value);
      if (selectedCampus) {
        setFormData((prevData) => ({
          ...prevData,
          campusId: selectedCampus._id,
          campusName: selectedCampus.name,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const invoiceData = {
      ...formData,
      programmeName: userData?.programmeName,
      programmeId: userData?.programmeId,
      programmeCode: userData?.programmeCode,
      orderId: `${userData?.programmeCode}/${formData?.session?.split("/")[1]?.slice(-2)}`,
      applicantId: `${userData?.programmeCode}/${formData?.session?.split("/")[1]?.slice(-2)}`,
      amount: userData?.amount,
      displayAmount: formatNaira(userData?.amount),
      schema: "applicants",
      integration: "generateInvoice",
      dependency: "applicants",
    };

    try {
      const response = await execute("forms/submit", invoiceData);
      toast({
        title: "Success",
        description: response?.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
        
      if (response?.data?.transactionId && response.statusCode === 200) {
        const updatedInvoiceData = {
          ...invoiceData,
          transactionId: response?.data?.transactionId,
        };
        navigate("/pay-invoice", { state: { userData: updatedInvoiceData } });
      } else {
        console.error("API Error:", response?.message || "Unexpected error occurred");
        toast({
          title: "Error",
          description: response?.message || "Unexpected error occurred.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error occurred during submission:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit the form. Please check your network and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <MainLayout config={config}>
      <Box p={8} maxW="800px" mx="auto">
        <Heading mb={6} textAlign="center">
          Complete Your Details
        </Heading>
        <Text mb={6}>
          <strong>Program:</strong> {userData?.programmeName} <br />
          <strong>Fee:</strong> {formatNaira(userData?.amount)}
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
          </GridItem>
          <GridItem>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
          </GridItem>
          <GridItem>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              type="email"
            />
          </GridItem>
          <GridItem>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              type="tel"
            />
          </GridItem>
          <GridItem>
            <Input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              type="password"
            />
          </GridItem>
          <GridItem>
            <Select
              name="course"
              value={formData.courseId}
              onChange={handleInputChange}
              placeholder="Select Course"
            >
              {userData?.courses?.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </Select>
          </GridItem>
          <GridItem>
            <Select
              name="campusId"
              value={formData.campusId}
              onChange={handleInputChange}
              placeholder="Select Campus"
            >
              {campuses.map((campus) => (
                <option key={campus._id} value={campus._id}>
                  {campus.name}
                </option>
              ))}
            </Select>
          </GridItem>
        </Grid>
        <Button
          mt={6}
          colorScheme="teal"
          size="lg"
          width="250px"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </MainLayout>
  );
};

export default StartPage;
