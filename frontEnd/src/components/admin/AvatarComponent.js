import React from 'react';
import { Avatar } from '@chakra-ui/react';

const AvatarComponent = ({ component }) => {
  return (
    <Avatar name={component.name} src={component.src} />
  );
};

export default AvatarComponent;
