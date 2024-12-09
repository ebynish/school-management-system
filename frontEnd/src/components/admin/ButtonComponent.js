import React from 'react';
import { Button } from '@chakra-ui/react';

const ButtonComponent = ({ component }) => {
  return (
    <Button backgroundColor={component.backgroundColor || 'blue.500'} color={component.textColor || 'white'}>
      {component.content || 'Click Me'}
    </Button>
  );
};

export default ButtonComponent;
