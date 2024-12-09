import React from 'react';
import { List, ListItem, Box } from '@chakra-ui/react';

const ListComponent = ({ component }) => {
  return (
    <Box>
      <List spacing={3}>
        {component.nestedComponents.map((item, index) => (
          <ListItem key={index}>{item.content}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ListComponent;
