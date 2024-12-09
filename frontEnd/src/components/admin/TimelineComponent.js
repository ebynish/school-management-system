import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const TimelineComponent = ({ component }) => {
  return (
    <Box>
      {component.events.map((event, index) => (
        <Box key={index} mb={4}>
          <Text fontWeight="bold">{event.title}</Text>
          <Text>{event.date}</Text>
          <Text>{event.description}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default TimelineComponent;
