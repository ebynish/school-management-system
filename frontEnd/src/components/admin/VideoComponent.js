import React from 'react';
import { Box } from '@chakra-ui/react';

const VideoComponent = ({ component }) => {
  return (
    <Box>
      <video width="100%" controls>
        <source src={component.src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

export default VideoComponent;
