import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Stack, Image, Flex, Button, Table, Tbody, Tr, Td } from "@chakra-ui/react";
import MainLayout from "../components/MainLayout";
import RemitaPayment from 'react-remita';
import { fetchData, submitForm } from "../api";
import useApi from "../hooks/useApi";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
const CreateInvoicePage = ({ config }) => {
  const location = useLocation();
  const { userData } = location.state || {}; // Retrieve the user data passed via state
  const { data: transaction, error, loading, execute} = useApi(fetchData);
  const { execute: update } = useApi(submitForm);
  const user = useSelector((state) => state.auth.user);
  const handlePrint = () => {
    window.print(); // Trigger the browser print functionality
  };

  useEffect(()=>{
    const fetchTransaction =async()=>{
      await execute("check/summary/transactions/"+userData?.transactionId); // Execute the API call
    }
    fetchTransaction()
  },[execute, userData])

  
  let paymentData = {
    key: config?.remita?.publicKey, // Retrieve Remita API key from config
    orderId: transaction?._id, // Use user's phone as the order ID
    customerId: transaction?._id, // Use user's phone as customer ID
    serviceTypeId: config?.remita?.serviceTypeId, // Get service type ID from config
    firstName: transaction?.firstName, // Get user's first name
    lastName: transaction?.lastName, // Get user's last name
    email: transaction?.email, // Get user's email
    phone: transaction?.phone, // Get user's phone
    amount: transaction?.amount, // Get the amount to be paid
    narration: transaction?.description, // Description of the payment
    processRrr: true,
    extendedData: {
      customFields: [
        {
          name: "rrr",
          value: Number(transaction?.RRR), // RRR value from userData
        },
      ],
    },
  };

  const data = {
    ...paymentData,
    onSuccess: async function (response) {
      // Callback when payment is successful (you can handle further actions here)
      console.log("Payment Success Response", response);
      let result = await update(`update/transactions/${transaction?._id}`, { 
        transactionId: response.transactionId,
        status: response.message || "Successful",
        type: transaction?.description
      });
      if (result?.statusCode == 200)
          window.location.reload();


    },
    onError: function (response) {
      // Callback when payment fails
      console.log("Payment Error Response", response);
    },
    onClose: function () {
      // Callback when payment modal is closed
      console.log("Payment Modal Closed");
    },
  };

  return (
    <>
    { user ? 
    <Layout>
    <Box p={2} className="invoice-container2"  >
    {/* Header Section with School Logo and Name */}
    <Flex align="center" mb={6} justify="space-between" justifyContent={'center'} alignContent={'center'}>
      <Box align="center">
        {/* School Logo */}
        <Image
          src={config?.schoolLogo || "/logo.png"} // Default logo
          alt="School Logo"
          width={"100%"}
          objectFit="cover"
          mr={4}
        />
      </Box>
    </Flex>

    {/* Invoice Details - Styled as a table */}
    <Box borderWidth="1px" borderRadius="md" p={6} borderColor="gray.300">
      <Stack spacing={4}>
        {/* Invoice Table */}
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td><strong>Name:</strong></Td>
              <Td>{`${transaction?.firstName} ${transaction?.lastName}`}</Td>
            </Tr>
            <Tr>
              <Td><strong>Email:</strong></Td>
              <Td>{transaction?.email}</Td>
            </Tr>
            { transaction?.description.includes("Application") || transaction?.description.includes("Acceptance") ?
            <Tr>
              <Td><strong>Application ID:</strong></Td>
              <Td>{transaction?.applicantId}</Td>
            </Tr> : <Tr>
              <Td><strong>Matric No:</strong></Td>
              <Td>{transaction?.matricNumber}</Td>
            </Tr>}
            <Tr>
              <Td><strong>Phone:</strong></Td>
              <Td>{transaction?.phone}</Td>
            </Tr>
            <Tr>
              <Td><strong>Course:</strong></Td>
              <Td>{transaction?.courseName || "N/A"}</Td> {/* Default to "N/A" if not available */}
            </Tr>
            <Tr>
              <Td><strong>Program:</strong></Td>
              <Td>{transaction?.programmeName || "N/A"}</Td> {/* Default to "N/A" if not available */}
            </Tr>
            <Tr>
              <Td><strong>Amount:</strong></Td>
              <Td>{userData?.displayAmount ? `${userData?.displayAmount}` : "Not Available"}</Td> {/* Display 'Not Available' if amount is missing */}
            </Tr>
            <Tr>
              <Td><strong>RRR Number:</strong></Td>
              <Td>{transaction?.RRR} (You can use this number to pay at the bank)</Td> {/* Display 'Not Available' if amount is missing */}
            </Tr>
            <Tr>
              <Td><strong>Status:</strong></Td>
              <Td>{transaction?.status || "Pending"}</Td> {/* Default to "Pending" if not provided */}
            </Tr>
            <Tr>
              <Td><strong>Session:</strong></Td>
              <Td>{transaction?.session}</Td> {/* Default to current session if not available */}
            </Tr>
            <Tr>
              <Td><strong>Description:</strong></Td>
              <Td>{transaction?.description || "No description provided"}</Td> {/* Default if no description */}
            </Tr>
          </Tbody>
        </Table>
      </Stack>

      {/* Pay Now Button */}
      <Flex justify="space-between" mt={6}>
        <Button colorScheme="blue" onClick={handlePrint}>
          Print Invoice
        </Button>
        { transaction?.status !== "Successful" ?
        <RemitaPayment
          style={{ background: config.primaryColor, color: "white", padding: "10px", borderRadius: "10px" }}
          remitaData={data}
          text="Pay Now"
          live={false}  // Change this to `true` for live payment
        /> : <Link to={ transaction.type.includes("Application") ? "/continue-application" :"/dashboard"}  style={{ background: config.primaryColor, color: "white", padding: "10px", borderRadius: "10px" }}>Continue </Link>}
      </Flex>
    </Box>
  </Box>
    </Layout>:
    <MainLayout config={config}>
      <Box p={8} maxW="800px" mx="auto" className="invoice-container">
        {/* Header Section with School Logo and Name */}
        <Flex align="center" mb={6} justify="space-between" justifyContent={'center'} alignContent={'center'}>
          <Box align="center">
            {/* School Logo */}
            <Image
              src={userData?.schoolLogo || "/logo.png"} // Default logo
              alt="School Logo"
              width={"100%"}
              objectFit="cover"
              mr={4}
            />
          </Box>
        </Flex>

        {/* Invoice Details - Styled as a table */}
        <Box borderWidth="1px" borderRadius="md" p={6} borderColor="gray.300">
          <Stack spacing={4}>
            {/* Invoice Table */}
            <Table variant="simple">
              <Tbody>
                <Tr>
                  <Td><strong>Name:</strong></Td>
                  <Td>{`${transaction?.firstName} ${transaction?.lastName}`}</Td>
                </Tr>
                <Tr>
                  <Td><strong>Email:</strong></Td>
                  <Td>{transaction?.email}</Td>
                </Tr>
                { transaction?.description.includes("Application") || transaction?.description.includes("Acceptance") ?
                <Tr>
                  <Td><strong>Application ID:</strong></Td>
                  <Td>{transaction?.applicantId}</Td>
                </Tr> : <Tr>
                  <Td><strong>Matric No:</strong></Td>
                  <Td>{transaction?.matricNumber}</Td>
                </Tr>}
                <Tr>
                  <Td><strong>Phone:</strong></Td>
                  <Td>{transaction?.phone}</Td>
                </Tr>
                <Tr>
                  <Td><strong>Course:</strong></Td>
                  <Td>{transaction?.courseName || "N/A"}</Td> {/* Default to "N/A" if not available */}
                </Tr>
                <Tr>
                  <Td><strong>Program:</strong></Td>
                  <Td>{transaction?.programmeName || "N/A"}</Td> {/* Default to "N/A" if not available */}
                </Tr>
                <Tr>
                  <Td><strong>Amount:</strong></Td>
                  <Td>{userData?.displayAmount ? `${userData?.displayAmount}` : "Not Available"}</Td> {/* Display 'Not Available' if amount is missing */}
                </Tr>
                <Tr>
                  <Td><strong>RRR Number:</strong></Td>
                  <Td>{transaction?.RRR} (You can use this number to pay at the bank)</Td> {/* Display 'Not Available' if amount is missing */}
                </Tr>
                <Tr>
                  <Td><strong>Status:</strong></Td>
                  <Td>{transaction?.status || "Pending"}</Td> {/* Default to "Pending" if not provided */}
                </Tr>
                <Tr>
                  <Td><strong>Session:</strong></Td>
                  <Td>{transaction?.session}</Td> {/* Default to current session if not available */}
                </Tr>
                <Tr>
                  <Td><strong>Description:</strong></Td>
                  <Td>{transaction?.description || "No description provided"}</Td> {/* Default if no description */}
                </Tr>
              </Tbody>
            </Table>
          </Stack>

          {/* Pay Now Button */}
          <Flex justify="space-between" mt={6}>
            <Button colorScheme="blue" onClick={handlePrint}>
              Print Invoice
            </Button>
            { transaction?.status !== "Successful" ?
            <RemitaPayment
              style={{ background: config.primaryColor, color: "white", padding: "10px", borderRadius: "10px" }}
              remitaData={data}
              text="Pay Now"
              live={false}  // Change this to `true` for live payment
            /> : <Link to={ transaction.type.includes("Application") ? "/continue-application" :"/dashboard"}  style={{ background: config.primaryColor, color: "white", padding: "10px", borderRadius: "10px" }}>Continue </Link>}
          </Flex>
        </Box>
      </Box>
    </MainLayout>}
    </>
  );
};

export default CreateInvoicePage;
