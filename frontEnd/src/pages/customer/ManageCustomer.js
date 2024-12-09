import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons"; // Import ViewIcon
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";

const initialCustomers = [
  { id: 1, name: "John Doe", type: "Individual", email: "john@example.com", phoneNumber: "123-456-7890" },
  { id: 2, name: "Tech Solutions", type: "Corporate", email: "info@techsolutions.com", phoneNumber: "987-654-3210" },
];

const ManageCustomer = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const toast = useToast();

  // Handle customer deletion
  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(customer => customer.id !== id));
    toast({ title: "Customer deleted.", status: "warning", duration: 3000 });
  };

  return (
    <Layout>
      <Box p={8}>
        <Text as="h2" size="lg" mb={6}>Customer Profiles</Text>
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Link to="/customer/create">
            <Button leftIcon={<AddIcon />} fontSize={13}>
              Create Customer
            </Button>
          </Link>
        </Box>
        
        {/* Customer List Table */}
        <Table variant="simple" fontSize={12}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Email</Th>
              <Th>Phone Number</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers.map(customer => (
              <Tr key={customer.id}>
                <Td>{customer.id}</Td>
                <Td>{customer.name}</Td>
                <Td>{customer.type}</Td>
                <Td>{customer.email}</Td>
                <Td>{customer.phoneNumber}</Td>
                <Td>
                  <Link to={`/view-customer/${customer.type == "Individual" ? "individual" : "corporate"}/${customer.id}`}>
                    <IconButton aria-label="View customer" icon={<ViewIcon />} mr={2} />
                  </Link>
                  <Link to={`/edit-customer/${customer.type == "Individual" ? "individual" : "corporate"}/${customer.id}`}>
                    <IconButton aria-label="Edit customer" icon={<EditIcon />} mr={2} />
                  </Link>
                  <IconButton
                    aria-label="Delete customer"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDeleteCustomer(customer.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Layout>
  );
};

export default ManageCustomer;
