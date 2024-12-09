import React from 'react';
import { Badge } from '@chakra-ui/react';

const BadgeComponent = ({ component }) => {
  return (
    <Badge colorScheme={component.colorScheme || 'green'}>
      {component.content}
    </Badge>
  );
};

export default BadgeComponent;
