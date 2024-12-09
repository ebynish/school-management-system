import React from 'react';
import { Progress } from '@chakra-ui/react';

const ProgressBarComponent = ({ component }) => {
  return (
    <Progress value={component.value} colorScheme={component.colorScheme || 'green'} />
  );
};

export default ProgressBarComponent;
