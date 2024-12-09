import React from 'react';
import { Flex } from '@chakra-ui/react';
import CardComponent from './CardComponent';
import { Link } from 'react-router-dom';
const TypesCard = ({ data }) => {
   
  return (
    <Flex gap={4} wrap="wrap">
      {data?.map((item, index) => (
        <Link to={item.linkUrl}>
        <CardComponent
          key={index}
          title={item.title}
          description={item.description}
          icon={item.icon}
        />
        </Link>
      ))}
    </Flex>
  );
};

export default TypesCard;
