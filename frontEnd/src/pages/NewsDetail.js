import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Image, Spinner, VStack, Heading, Divider } from '@chakra-ui/react';
import useApi from '../hooks/useApi'; // Assuming you have a custom hook for API calls
import { fetchData } from '../api';
import MainLayout from '../components/MainLayout';

const NewsDetail = ({config}) => {
  const { id } = useParams(); // Retrieve the news ID from the route
  const [news, setNews] = useState(null);
  const { data, loading, error, execute } = useApi(fetchData); // Replace `fetchData` with your API service

  useEffect(() => {
    // Fetch news details
    execute(`check/summary/news/${id}/_id`).then((response) => {
      console.log(response)
      setNews(response || {});
    });
  }, [id, execute]);

  if (loading) return <Spinner size="xl" color="blue.500" />;
  if (error) return <Text color="red.500">Error loading news details</Text>;

  return (
    <MainLayout config={config}>
    <Box p={5} mt={10} maxWidth="800px" mx="auto" bg="white" borderRadius="md" boxShadow="sm">
      {news ? (
        <>
         
          <VStack align="start" spacing={4}>
            <Heading size="lg" color="gray.800">
              {news.title}
            </Heading>
            <Text color="gray.600" fontSize="14px">
              {news.category?.name} |{' '}
              {new Date(news.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <Divider />
            <Image
            src={news.imageUrl || 'https://via.placeholder.com/800x400'}
            alt={news.title}
            borderRadius="md"
            mb={5}
          />
          <Divider />
            <Text color="gray.700" fontSize="16px" lineHeight="1.8">
              {news.content}
            </Text>
          </VStack>
        </>
      ) : (
        <Text color="gray.500">No news details found</Text>
      )}
    </Box>
    </MainLayout>
  );
};

export default NewsDetail;
