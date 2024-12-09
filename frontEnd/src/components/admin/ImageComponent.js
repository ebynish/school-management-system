import React from 'react';
import { Image, Box } from '@chakra-ui/react';

const ImageComponent = ({ component }) => {
  return (
    <Box>
      <Image src={component.src} alt={component.alt} boxSize="full" />
    </Box>
  );
};

export default ImageComponent;
