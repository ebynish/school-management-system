import React, {useState, useEffect} from 'react';
import { Box, Text, Button, Image, VStack, SimpleGrid, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { fetchData } from '../api';
const LatestNews = ({ _id, imageUrl, category, createdAt, title, summary }) => {
  return (
    <Box key={_id} bg="white" p={{ base: 0, md: 4 }} borderRadius="md" boxShadow="sm">
      <Image
        src={imageUrl || 'https://via.placeholder.com/400'}
        alt="News Image"
        mb={4}
        borderRadius={10}
      />
      <VStack align="start" spacing={2}>
        <Text color="gray.600" fontSize="14px" fontWeight="400">
          {category} | {new Date(createdAt)?.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <Text color="gray.800" fontSize="16px" fontWeight="bold" textTransform="uppercase">
          {title}
        </Text>
        <Text color="gray.500" fontSize="14px" fontWeight="400">
          {summary ? `${summary.substring(0, 100)}...` : 'No summary available'}
        </Text>
        <Link to={`/news/${_id}`}>
          <Button colorScheme="blue" variant="link" mt={2}>
            Read More
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

const NewsSection = ({config}) => {
  const [newsData, setNewsData] = useState([]);
  const { data, loading, error, execute } = useApi(fetchData);

  useEffect(() => {
    execute('check/find/news').then((response) => {
      setNewsData(response || []);
    });
  }, [execute]);

  if (loading) return <Spinner size="xl" color="blue.500" />;

  return (
    <Box p={20}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {newsData?.map((news) => (
          <LatestNews key={news?._id} {...news} summary={news?.summary || 'No summary provided'} />
        ))}
      </SimpleGrid>

      <Box display="flex" justifyContent="center" mt={4}>
        <Link to="/latest-news">
          <Button
            padding="15px 20px"
            borderRadius="8px"
            background={config.buttonColor}
            color="white"
            boxShadow="0px 4px 16px rgba(76, 147, 255, 0.2)"
          >
            See More News
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default NewsSection;
