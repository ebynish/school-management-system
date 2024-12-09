import React from 'react';
import { Box, Image } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';

const CarouselComponent = ({ component }) => {
  return (
    <Carousel>
      {component.nestedComponents.map((nestedComponent, index) => (
        <Box key={index}>
          <Image src={nestedComponent.content} alt={nestedComponent.title} />
        </Box>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
