import React from 'react';
import { Box, Image } from '@chakra-ui/react';

const Loader = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Image src={`${window.location.origin}/logoDark2.png`} />
    </Box>
  );
};

export default Loader;
