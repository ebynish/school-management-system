import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

const BreadcrumbsComponent = ({ component }) => {
  return (
    <Breadcrumb>
      {component.items.map((item, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbsComponent;
