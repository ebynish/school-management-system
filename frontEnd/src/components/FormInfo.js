import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Flex,
  Spinner,
  Badge,
  Heading,
  Image,
  Button,
  Link,
  Alert,
  AlertIcon,
  Grid,
  GridItem,
  SimpleGrid
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import useApi from "../hooks/useApi"; // Custom hook for API handling
import { fetchData } from "../api"; // Assuming this is the API function
import Layout from "./Layout";

// Helper function to determine if the URL is an image
const isImageUrl = (url) => /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url);

// Helper function to split camelCase to sentence case
const camelCaseToSentence = (str) => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
    .replace(/^./, (match) => match.toUpperCase()); // Capitalize the first letter
};

// Main component
const FormInfo = () => {
  const location = useLocation();
  const displayType = location.pathname.split("/")[2];
  const lastPart = location.pathname.split("/").pop().split("-").pop();
  
  const [loading, setLoading] = useState(true);
  // Using custom hook to fetch data
  const { data, error, execute } = useApi(fetchData); // Pass identifier or params here if needed

  // Load Data Based on Menu
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log(data)
        if (displayType) {
          await execute(`check/summary/${displayType}/${lastPart}`);
        } else {
          throw new Error('Display type not found');
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lastPart, execute]);

  // Handle API errors
  if (error) {
    return (
      <Box p={5}>
        <Alert status="error">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      </Box>
    );
  }

  // If no data is returned
  if (!data) {
    return (
      <Box p={5}>
        <Alert status="warning">
          <AlertIcon />
          <Text>No Data Found</Text>
        </Alert>
      </Box>
    );
  }

  // Helper function to render each field
  const renderField = (key, value) => {
    // Skip internal MongoDB fields and formId
    if (key === "_id" || key === "formId") return null;

    const formattedKey = camelCaseToSentence(key); // Convert key to sentence case

    // Handle nested objects
    if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <Box key={key} mb={4}>
          <Heading size="sm">{formattedKey}</Heading>
          <VStack align="start">
            {Object.entries(value).map(([nestedKey, nestedValue]) =>
              renderField(nestedKey, nestedValue)
            )}
          </VStack>
        </Box>
      );
    }

    // Handle arrays (no grid for the key, only the content within the array should use grid)
    if (Array.isArray(value)) {
        return (
            <Box key={key} mb={4}>
              <Heading size="md" mb={2}>{formattedKey}</Heading>
              <Flex flexDirection="column" >
                {value.map((item, index) => (
                  <Flex key={index} flexDirection="row" width="100%" alignItems="flex-start" columnGap={"100px"}>
                    {/* Render either the item directly or the nested fields if it's an object */}
                    {typeof item === "object" ? (
                      Object.entries(item).map(([nestedKey, nestedValue]) =>
                        renderField(nestedKey, nestedValue) // Recursively render nested items
                      )
                    ) : (
                      renderField(index, item) // Render the item directly if not an object
                    )}
                  </Flex>
                ))}
              </Flex>
            </Box>
          );
          
    }

    // Handle image URLs
    if (typeof value === "string" && isImageUrl(value)) {
      return (
        <Box key={key} mb={4}>
          <Text fontWeight="bold">{formattedKey}:</Text>
          <Image src={value} alt={formattedKey} maxW="200px" borderRadius="md" />
        </Box>
      );
    }

    // Handle file URLs (non-image)
    if (typeof value === "string" && value.startsWith("http")) {
      return (
        <Box key={key} mb={4}>
          <Text fontWeight="bold">{formattedKey}:</Text>
          <Button
            as={Link}
            href={value}
            isExternal
            colorScheme="blue"
            leftIcon={<DownloadIcon />}
          >
            Download File
          </Button>
        </Box>
      );
    }

    // Render basic key-value pairs
    return (
      <Box key={key} mb={4}>
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold">{formattedKey}:</Text>
          <Text>{value}</Text>
        </VStack>
      </Box>
    );
  };

  return (
    <Layout>
      <Box p={5} border="1px" borderColor="gray.200" borderRadius="md">
        <Flex justifyContent={'center'}>
        <Heading size="md">{displayType.toUpperCase()} DETAILS</Heading>
        </Flex>
        <Badge colorScheme={data.status === "Pending" ? "orange" : "green"} mb={4}>
          {data.status}
        </Badge>
        <SimpleGrid columns={[1, 3]} gap={1}>
  {Object.entries(data).map(([key, value], index) => {
    const field = renderField(key, value);
   

    // Skip rendering if field is null or undefined
    if (!field) return null;
    if(!Array.isArray(value)) {
        return (
          
        
        <Box key={key}>
            {field}
            {index < Object.entries(data).length - 1 && <Divider />}
        </Box>
        
      )
    }else{
        return (
            <Box key={key} gridColumn="span 3">
        
        <Flex key={key}>
            {field}
            {index < Object.entries(data).length - 1 && <Divider />}
        </Flex>
        
        </Box>)
    }
  })}
</SimpleGrid>

      </Box>
    </Layout>
  );
};

export default FormInfo;
