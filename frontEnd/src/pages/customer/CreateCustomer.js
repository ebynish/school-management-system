import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack
} from "@chakra-ui/react";
import IndividualCustomer from "../../components/customer/Individual";
import CorporateCustomer from "../../components/customer/Corporate";
import Layout from "../../components/Layout";

const CreateCustomerPage = () => {
  const [customerType, setCustomerType] = useState();

  const handleCustomerTypeChange = (value) => {
    setCustomerType(value);
  };

  return (
    <Layout>
    <Box p={8}>

      <FormControl mb={6}>
        <FormLabel>Customer Type</FormLabel>
        <RadioGroup value={customerType} onChange={handleCustomerTypeChange}>
          <Stack direction="row">
            <Radio value="Individual">Individual</Radio>
            <Radio value="Corporate">Corporate</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      {/* Render the form based on customer type */}
      {customerType === "Individual" && <IndividualCustomer />}
      {customerType === "Corporate" && <CorporateCustomer />}
      {/* {customerType ? 
      <Button mt={6}>
        Submit
      </Button> : "" } */}
    </Box>
    </Layout>
  );
};

export default CreateCustomerPage;
