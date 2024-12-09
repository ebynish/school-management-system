import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, SimpleGrid, Text, Image, VStack, Heading, Button, Spinner, Flex } from '@chakra-ui/react';
import useApi from '../hooks/useApi'; // Custom hook for API calls
import MainLayout from '../components/MainLayout';
import { fetchData } from '../api';

const NewsGrid = ({config}) => {
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12; // Number of news items per page
  const { data, loading, error, execute } = useApi(fetchData);

  const fetchNews = (page) => {
    execute(`news`, null,page, 10).then((response) => {
      console.log(response)
      setNewsData(response?.rows || []);
      setTotalPages(response?.totalPages || 1);
    });
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <Spinner size="xl" color="blue.500" />;
  // if (error) return <Text color="red.500">Error loading news</Text>;

  return (
    <MainLayout config={config}>
    <Box p={5} mt={10} maxWidth="900px" mx="auto" bg="white" borderRadius="md" boxShadow="sm">
      <Heading mb={6} size="lg" color="gray.800">
        Latest News
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {newsData?.map((news) => (
          <Box
            key={news._id}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            overflow="hidden"
            _hover={{ boxShadow: 'lg' }}
          >
            <Image
              src={news.imageUrl || 'https://via.placeholder.com/400x200'}
              alt={news.title}
              width="100%"
              height="200px"
              objectFit="cover"
            />
            <VStack align="start" p={4} spacing={3}>
              <Text
                color="gray.600"
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
              >
                {news.category?.name}
              </Text>
              <Heading size="sm" color="gray.800">
                {news.title}
              </Heading>
              <Text
                color="gray.600"
                fontSize="sm"
                noOfLines={3}
                lineHeight="1.5"
              >
                {news.summary || 'No summary available.'}
              </Text>
              <Link to={`/news/${news._id}`}>
                <Button colorScheme="blue" size="sm" variant="outline">
                  Read More
                </Button>
              </Link>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Pagination Controls */}
      <Flex mt={8} justify="center" align="center" gap={2}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          colorScheme="blue"
          variant="outline"
        >
          Previous
        </Button>
        <Text color="gray.600" fontSize="sm">
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          colorScheme="blue"
          variant="outline"
        >
          Next
        </Button>
      </Flex>
    </Box>
    </MainLayout>
  );
};

export default NewsGrid;
