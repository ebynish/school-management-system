import React from 'react';
import { Box, Text, Stack } from '@chakra-ui/react';
import Layout from '../components/Layout';
const NotificationPage = () => {
  const notifications = [
    { id: 1, message: 'You have a new follower!', date: '2023-09-21' },
    { id: 2, message: 'Your post received a like!', date: '2023-09-20' },
    { id: 3, message: 'You were mentioned in a comment.', date: '2023-09-19' },
  ];

  return (
    <Layout>
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Notifications</Text>
      <Stack spacing={3}>
        {notifications.map(notification => (
          <Box key={notification.id} borderWidth={1} borderRadius="md" p={3}>
            <Text>{notification.message}</Text>
            <Text color="gray.500" fontSize="sm">{notification.date}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
    </Layout>
  );
};

export default NotificationPage;
