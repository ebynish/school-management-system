import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Text } from '@chakra-ui/react';

const TabsComponent = ({ component }) => {
  return (
    <Tabs orientation={component.orientation || 'horizontal'} mt={4}>
      <TabList>
        {component.nestedComponents.map((nestedComponent, nestedIndex) => (
          <Tab key={nestedIndex}>{nestedComponent.title}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {component.nestedComponents.map((nestedComponent, nestedIndex) => (
          <TabPanel key={nestedIndex}>
            <Box p={3}>
              <Text fontWeight="bold">{nestedComponent.title}</Text>
              <Text>{nestedComponent.content}</Text>
            </Box>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default TabsComponent;
