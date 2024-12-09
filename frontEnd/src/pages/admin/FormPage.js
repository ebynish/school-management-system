import React, { useState, useEffect } from "react";
import { Button, Box, useToast, Flex } from "@chakra-ui/react";
import FormData from "../../components/FormData";
import useApi from "../../hooks/useApi";
import { fetchData } from "../../api"; 
import { useParams } from "react-router-dom"; 
import Layout from "../../components/Layout";
const FormPage = () => {
    const { id } = useParams();
    
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const { loading, error, execute } = useApi(); 
  const toast = useToast(); 

  const { data, loading: fetchLoading, execute: executeFetch, error: fetchError } = useApi(fetchData);
  console.log(id, "93289")
  useEffect(() => {
    const getData = async () => {
     let result = await executeFetch(`forms/${id}`, null, null, null);
      
    };
    getData();
  }, [executeFetch]);

  
  return (
    <Layout>
      
    <Flex direction="column" flex={1} p={5}>

      <FormData
        fieldsConfig={data?.sections} // Pass the form configuration
        isLoading={isSubmitting || loading} // Show loading state during submission
        step={data?.step}
        formId={data?._id}
      />

      
      {/* Display error if any */}
      {error && (
        <Box color="red.500" mt={2}>
          {error.message}
        </Box>
      )}
    </Flex>
    </Layout>
  );
};

export default FormPage;
