import React from 'react';
import { Input, Box } from '@chakra-ui/react';

const SearchBarComponent = ({ component }) => {
  return (
    <Box>
      <Input placeholder={component.placeholder || 'Search...'} />
    </Box>
  );
};

export default SearchBarComponent;
