import React, { useState } from 'react';
import { 
  Box, Text, Button, FormControl, FormLabel, Input, Switch, Select, VStack,
  Flex, Tabs, TabList, Tab, TabPanels, TabPanel 
} from '@chakra-ui/react';
import { useTheme as useCustomTheme } from '../themeProvider';
import Layout from '../components/Layout';

const SettingsPage = () => {
  const { setThemeColors } = useCustomTheme();
  
  const [selectedTab, setSelectedTab] = useState(0);

  const changeThemeColor = () => {
    setThemeColors({
      primary: "#ff4500",
      secondary: "#282c34",
      light: "#61dafb",
      grey: "#f5f5f5",
    });
  };

  return (
    <Layout trending="none">
      <Flex maxW="100%" p={4}>
        {/* Side Tabs */}
        <Box width="30%" borderRightWidth={1} pr={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={6}>Settings</Text>
          <Tabs orientation="vertical" index={selectedTab} onChange={(index) => setSelectedTab(index)}>
            <TabList>
              <Tab>Account</Tab>
              <Tab>Privacy</Tab>
              <Tab>Notifications</Tab>
            </TabList>
          </Tabs>
        </Box>

        {/* Content Area */}
        <Box width="70%" p={4}>
          <Tabs index={selectedTab} onChange={(index) => setSelectedTab(index)}>
            <TabPanels>
              {/* Account Information */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box p={4} borderWidth={1} borderRadius="md">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>Account Information</Text>
                    <FormControl id="username">
                      <FormLabel>Username</FormLabel>
                      <Input placeholder="Enter your username" />
                    </FormControl>
                    <FormControl id="email" mt={4}>
                      <FormLabel>Email</FormLabel>
                      <Input type="email" placeholder="Enter your email" />
                    </FormControl>
                    <FormControl id="password" mt={4}>
                      <FormLabel>Password</FormLabel>
                      <Input type="password" placeholder="Enter your password" />
                    </FormControl>
                    <Button colorScheme="blue" mt={4}>Save Changes</Button>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Privacy Settings */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box p={4} borderWidth={1} borderRadius="md">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>Privacy Settings</Text>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="private-account" mb="0">Private Account</FormLabel>
                      <Switch id="private-account" />
                    </FormControl>
                    <FormControl display="flex" alignItems="center" mt={4}>
                      <FormLabel htmlFor="show-location" mb="0">Show Location</FormLabel>
                      <Switch id="show-location" />
                    </FormControl>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Notification Settings */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box p={4} borderWidth={1} borderRadius="md">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>Notification Settings</Text>
                    <FormControl id="email-notifications">
                      <FormLabel>Email Notifications</FormLabel>
                      <Select placeholder="Select notification preference">
                        <option value="all">All Notifications</option>
                        <option value="mentions">Mentions Only</option>
                        <option value="none">No Notifications</option>
                      </Select>
                    </FormControl>
                    <Button colorScheme="blue" mt={4}>Update Notifications</Button>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Layout>
  );
};


export default SettingsPage;
