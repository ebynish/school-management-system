import React from 'react';
import { Grid, GridItem, Box, Text } from '@chakra-ui/react';

const GridComponent = ({ component }) => {
  return (
    <Grid templateColumns={`repeat(${component.columns || 3}, 1fr)`} gap={4} mt={4}>
      {component.nestedComponents.map((nestedComponent, nestedIndex) => (
        <GridItem key={nestedIndex}>
          <Box p={3} shadow="md" borderWidth="1px" borderRadius="lg" background={nestedComponent.backgroundColor || 'white'}>
            <Text fontWeight="bold">{nestedComponent.title}</Text>
            <Text>{nestedComponent.description}</Text>
            <Text>{nestedComponent.content}</Text>
          </Box>
        </GridItem>
      ))}
    </Grid>
  );
};

export default GridComponent;
