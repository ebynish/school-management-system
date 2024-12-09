import React from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box } from '@chakra-ui/react';

const AccordionComponent = ({ component }) => {
  return (
    <Accordion allowToggle>
      {component.nestedComponents.map((nestedComponent, index) => (
        <AccordionItem key={index}>
          <AccordionButton>
            <Box flex="1" textAlign="left">{nestedComponent.title}</Box>
          </AccordionButton>
          <AccordionPanel pb={4}>
            {nestedComponent.content}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;
