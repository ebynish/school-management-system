import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  IconButton,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FaFileAlt } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import Layout from "../components/Layout";
import useApi from "../hooks/useApi";
import { fetchData } from "../api";
import { useSelector } from "react-redux";
const DocumentPage = () => {
  const { data: documents, loading, error, execute } = useApi(fetchData);
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const user = useSelector((state) => state.auth.user);

  // Trigger data fetching when the component mounts
  useEffect(() => {
    execute("documents"); // Call execute to fetch the data
  }, [execute]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading documents</Text>;

  // Ensure documents is an array
  const documentList = Array.isArray(documents) ? documents : [];

  // Handle Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = documentList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(documentList.length / itemsPerPage) || 1;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <Layout>
      <Box px={6}>
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
        {/* Tabs for Switching Between Grid and Table View */}
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList mb={4}>
            <Tab onClick={() => setView("grid")}>Grid View</Tab>
            <Tab onClick={() => setView("table")}>Tabular View</Tab>
          </TabList>

          <TabPanels bg="white" boxShadow={"sm"} borderRadius={"10"}>
            {/* Grid View */}
            <TabPanel>
              {documentList.length === 0 ? (
                <Text>No documents available at the moment.</Text>
              ) : (
                <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                  {currentDocuments.map((doc, index) => (
                    <Box
                      key={index}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      shadow="sm"
                      _hover={{ shadow: "md" }}
                      bg="white"
                      textAlign="center"
                    >
                      <FaFileAlt size={50} color="orange" />
                      <Text fontSize="lg" fontWeight="semibold" mt={4}>
                        {doc.title}
                      </Text>
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        {doc.type}
                      </Text>
                      <Text fontSize="xs" color="gray.400" mt={1}>
                        Uploaded: {doc.createdAt}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </TabPanel>

            {/* Table View */}
            <TabPanel>
              {documentList.length === 0 ? (
                <Text>No documents available at the moment.</Text>
              ) : (
                <Table variant="simple" bg="white" p={5}>
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Type</Th>
                      <Th>Date Uploaded</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentDocuments.map((doc, index) => (
                      <Tr key={index}>
                        <Td>{doc.title}</Td>
                        <Td>{doc.type}</Td>
                        <Td>{doc.createdAt}</Td>
                        <Td>
                          <IconButton
                            icon={<AiOutlineDownload />}
                            size="sm"
                            colorScheme="blue"
                            aria-label="Download"
                            onClick={() => alert(`Downloading ${doc.title}`)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Pagination Controls */}
        <HStack justifyContent="center" spacing={4} mt={6}>
          <Button
            onClick={handlePrevious}
            isDisabled={currentPage === 1}
            colorScheme="blue"
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={handleNext}
            isDisabled={currentPage === totalPages}
            colorScheme="blue"
          >
            Next
          </Button>
        </HStack>
      </Box>
    </Layout>
  );
};

export default DocumentPage;
