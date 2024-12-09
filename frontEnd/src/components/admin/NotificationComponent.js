import React from 'react';
import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react';

const NotificationComponent = ({ component }) => {
  return (
    <Alert status={component.status || 'info'}>
      <AlertIcon />
      <Text>{component.content}</Text>
    </Alert>
  );
};

export default NotificationComponent;
