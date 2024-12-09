import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  CheckboxGroup,
  Checkbox,
  Stack,
  Divider,
  Text,
} from '@chakra-ui/react';

const MenuForm = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    label: '',
    route: '',
    itemType: 'page',
    permissions: [],
    subItems: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handlePermissionsChange = (value) => {
    setCurrentItem({ ...currentItem, permissions: value });
  };

  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, currentItem]);
    setCurrentItem({
      label: '',
      route: '',
      itemType: 'page',
      permissions: [],
      subItems: [],
    });
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg">
      <Text fontSize="xl" mb={4}>Menu Item Form</Text>
      <VStack spacing={4} align="start">
        <FormControl isRequired>
          <FormLabel>Label</FormLabel>
          <Input
            name="label"
            value={currentItem.label}
            onChange={handleInputChange}
            placeholder="Enter menu item label"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Route</FormLabel>
          <Input
            name="route"
            value={currentItem.route}
            onChange={handleInputChange}
            placeholder="Enter menu item route"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Item Type</FormLabel>
          <Select
            name="itemType"
            value={currentItem.itemType}
            onChange={handleInputChange}
          >
            <option value="page">Page</option>
            <option value="table">Table</option>
            <option value="form">Form</option>
            <option value="report">Report</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Permissions</FormLabel>
          <CheckboxGroup
            colorScheme="green"
            onChange={handlePermissionsChange}
          >
            <Stack spacing={2}>
              <Checkbox value="super_admin">Super Admin</Checkbox>
              <Checkbox value="view_dashboard">View Dashboard</Checkbox>
              <Checkbox value="view_accounts">View Accounts</Checkbox>
              <Checkbox value="edit_accounts">Edit Accounts</Checkbox>
              <Checkbox value="view_customers">View Customers</Checkbox>
              <Checkbox value="manage_accounts">Manage Accounts</Checkbox>
              {/* Add more permissions as needed */}
            </Stack>
          </CheckboxGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleAddMenuItem}
        >
          Add Menu Item
        </Button>
      </VStack>

      <Divider my={5} />
      <Text fontSize="lg">Added Menu Items:</Text>
      <Box mt={4}>
        {menuItems.map((item, index) => (
          <Box key={index} p={2} borderWidth="1px" borderRadius="md" mb={2}>
            <Text><strong>Label:</strong> {item.label}</Text>
            <Text><strong>Route:</strong> {item.route}</Text>
            <Text><strong>Item Type:</strong> {item.itemType}</Text>
            <Text><strong>Permissions:</strong> {item.permissions.join(', ')}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MenuForm;
