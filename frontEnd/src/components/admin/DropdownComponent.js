import React from 'react';
import { Select } from '@chakra-ui/react';

const DropdownComponent = ({ component }) => {
  return (
    <Select placeholder={component.placeholder}>
      {component.options.map((option, index) => (
        <option key={index} value={option.value}>{option.label}</option>
      ))}
    </Select>
  );
};

export default DropdownComponent;
