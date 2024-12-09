import React from 'react';
import { StarIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/react';

const RatingComponent = ({ component }) => {
  return (
    <Box>
      <Text fontSize="lg">{component.title}:</Text>
      <Box>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <StarIcon key={index} color={index < component.rating ? 'yellow.400' : 'gray.300'} />
          ))}
      </Box>
    </Box>
  );
};

export default RatingComponent;
