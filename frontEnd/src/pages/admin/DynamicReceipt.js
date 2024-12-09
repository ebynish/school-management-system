import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Flex,
  Image,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import useApi from 'path-to-your-hooks/useApi'; // Adjust as necessary

const DynamicReceipt = () => {
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: fetchedReceipt, error } = useApi('/api/receipt');

  useEffect(() => {
    if (fetchedReceipt) {
      setReceiptData(fetchedReceipt);
      setLoading(false);
    }
  }, [fetchedReceipt]);

  if (loading) return <Spinner size="xl" />;

  if (error) return (
    <Alert status="error" mb={4}>
      <AlertIcon />
      Failed to load receipt data. Please try again later.
    </Alert>
  );

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  const subtotal = calculateSubtotal(receiptData.products);
  const taxAmount = receiptData.taxRate ? subtotal * receiptData.taxRate : 0;
  const grandTotal = subtotal + taxAmount;

  return (
    <Container maxW="container.md" p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
      {/* Company Logo */}
      {receiptData.companyLogo && (
        <Flex justifyContent="center" mb={4}>
          <Image src={receiptData.companyLogo} alt="Company Logo" maxW="150px" />
        </Flex>
      )}
      
      <Heading as="h2" size="lg" mb={4} textAlign="center">
        {receiptData.companyName || "Company Name"}
      </Heading>
      
      <Text textAlign="center" fontSize="md" mb={4}>
        Receipt No: {receiptData.receiptNumber} | Date: {receiptData.date}
      </Text>
      <Divider mb={4} />

      {/* Customer Information */}
      <Box mb={6}>
        <Text fontWeight="bold">Customer Information:</Text>
        <Text>Name: {receiptData.customerName || "N/A"}</Text>
        <Text>Email: {receiptData.customerEmail || "N/A"}</Text>
        <Text>Phone: {receiptData.customerPhone || "N/A"}</Text>
      </Box>
      
      {/* Itemized Products Table */}
      <Table variant="simple" mb={4}>
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th isNumeric>Quantity</Th>
            <Th isNumeric>Unit Price</Th>
            <Th isNumeric>Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {receiptData.products.map((product, index) => (
            <Tr key={index}>
              <Td>{product.name}</Td>
              <Td isNumeric>{product.quantity}</Td>
              <Td isNumeric>${product.unitPrice.toFixed(2)}</Td>
              <Td isNumeric>${(product.quantity * product.unitPrice).toFixed(2)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Divider mb={4} />

      {/* Totals */}
      <Flex justifyContent="flex-end" mb={2}>
        <Box textAlign="right" w="300px">
          <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text>Tax ({(receiptData.taxRate * 100).toFixed(1)}%): ${taxAmount.toFixed(2)}</Text>
          <Text fontWeight="bold">Grand Total: ${grandTotal.toFixed(2)}</Text>
        </Box>
      </Flex>

      <Divider my={6} />

      <Text fontSize="sm" color="gray.600" textAlign="center">
        Thank you for your purchase!
      </Text>
    </Container>
  );
};

export default DynamicReceipt;
