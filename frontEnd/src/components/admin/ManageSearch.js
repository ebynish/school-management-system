import React, { useState, useEffect } from 'react';
import {
  Spinner, Box, Input, Button, VStack, FormControl, FormLabel, Flex, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import { fetchData } from "../../api";
import FormData from '../FormData';

const sentenceCase = (str) => {
  const sentence = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

const ManageSearch = ({ data, onSearch }) => {
  const [searchFields, setSearchFields] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { datas, loading, error, execute } = useApi(fetchData);
  const [fieldConfig, setFieldConfig] = useState(null);

  // Initialize search fields on data change
  useEffect(() => {
    if (data?.additionalProps) {
      const initialFields = {};
      for (const [key] of Object.entries(data.additionalProps)) {
        initialFields[key] = '';
      }
      setSearchFields(initialFields);
    }
  }, [data]);

  const handleChange = (key, value) => {
    setSearchFields((prevFields) => ({
      ...prevFields,
      [key]: value,
    }));
  };

  const handleSearch = async () => {
    if (loading) return; // Prevent search if already loading

    try {
      const queryString = Object.entries(searchFields)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          // For fields with multiple values, we return multiple key-value pairs for the same key
          return value
            .map(val =>{ if(val) return `${encodeURIComponent('filter')}=${encodeURIComponent(val)}`})
            .join('&');
        }
        // For simple key-value pairs, just return single key-value
        return `${encodeURIComponent(value)}`;
      })
      .filter(Boolean) 
      .join('&');
      const searchResults = await execute(data.linkUrl, queryString, 1, 10);
      
      if (onSearch) {
        
        onSearch(searchResults);
      }
    } catch (err) {
      console.error("Error during search:", err);
    }
  };

  const openModal = async () => {
    setIsModalOpen(true);
    const modalSlug = data?.createDetails?.modalSlug;
    if (!modalSlug) return; // Early return if modalSlug is missing

    try {
      const configResponse = await execute(modalSlug);
      setFieldConfig(configResponse);
    } catch (err) {
      console.error("Error fetching field config:", err);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <Box p={5}>
      {data?.search && (
        <VStack spacing={3} borderWidth={1} borderRadius="md" p={5}>
          <Flex flexDirection="row">
            {data?.additionalProps &&
              Object.entries(data.additionalProps).map(([key, label], index) => (
                <FormControl p={1} key={index}>
                  <FormLabel fontSize="12">{sentenceCase(label)}</FormLabel>
                  <Input
                    value={searchFields[key] || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    size="sm"
                  />
                </FormControl>
              ))}
            <Button fontSize={11} onClick={handleSearch} mt={5} width={200} isLoading={loading}>
              Search
            </Button>
            {error && <Text color="red.500" fontSize="sm">Error: {error.message}</Text>}
          </Flex>
        </VStack>
      )}

      <Flex justifyContent="flex-end" mt={5}>
        {data?.create && (
          data?.createDetails?.createModal ? (
            <>
              <Button fontSize={10} onClick={openModal}>{data?.createDetails?.title}</Button>
              <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{data?.createDetails?.title}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {fieldConfig ? (
                      <FormData fieldsConfig={fieldConfig?.sections} formId={fieldConfig?._id} />
                    ) : (
                      <Spinner />
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" onClick={closeModal}>Close</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          ) : (
            <Link to={data?.createDetails?.linkUrl}>
              <Button fontSize={10}>{data?.createDetails?.title}</Button>
            </Link>
          )
        )}
      </Flex>
    </Box>
  );
};

export default ManageSearch;
