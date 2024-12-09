import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useHistory, useParams } from "react-router-dom";

const initialCustomers = [
  { id: 1, name: "John Doe", type: "Individual", email: "john@example.com", phoneNumber: "123-456-7890" },
  { id: 2, name: "Tech Solutions", type: "Corporate", email: "info@techsolutions.com", phoneNumber: "987-654-3210" },
];

const EditCustomerPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("Individual");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const toast = useToast();
  const history = useHistory();

  useEffect(() => {
    const customerData = initialCustomers.find(c => c.id === parseInt(id));
    if (customerData) {
      setCustomer(customerData);
      setName(customerData.name);
      setType(customerData.type);
      setEmail(customerData.email);
      setPhoneNumber(customerData.phoneNumber);
    }
  }, [id]);

  const handleEditCustomer = () => {
    // Here, you'd send the updated data to your backend or update state
    toast({ title: "Customer updated.", status: "success", duration: 3000 });
    history.push("/customers"); // Redirect to customer list after editing
  };

  if (!customer) return <Heading>Loading...</Heading>;

  return (
    <Box p={8}>
      <Heading as="h2" size="lg" mb={6}>Edit Customer</Heading>
      <FormControl mb={4}>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Customer Type</FormLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Individual">Individual</option>
          <option value="Corporate">Corporate</option>
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Phone Number</FormLabel>
        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </FormControl>

      <Button colorScheme="blue" onClick={handleEditCustomer}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditCustomerPage;
