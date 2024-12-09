import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import useApi from '../../hooks/useApi';
import {fetchData, submitForm} from '../../api';
import DynamicTable from '../../components/DynamicTable';

const ApprovalRules = () => {
  const toast = useToast();
  const { loading: submitLoading, error: submitError, execute: submitData } = useApi(submitForm);
  const { data, loading, error, execute} = useApi(fetchData);
  const [rules, setRules] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    processId: '',
    processType: '',
    level: '',
    condition: '',
    approverRole: '',
    priority: '',
    requiredApprovals: '',
    multiApproval: false,
    action: '',
  });

  useEffect(() => {
    fetchApprovalRules();
  }, []);

  const fetchApprovalRules = async () => {
    try {
      const datas = await execute('/approval-rules');
      setRules(datas);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitData('approval-rules');
      toast({
        title: 'Success',
        description: 'Approval rule saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchApprovalRules(); // Refresh the table
      handleCloseModal(); // Close the modal
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({
      processId: '',
      processType: '',
      level: '',
      condition: '',
      approverRole: '',
      priority: '',
      requiredApprovals: '',
      multiApproval: false,
      action: '',
    });
  };

  const headers = [
    { label: 'Process ID', key: 'processId.name' },
    { label: 'Process Type', key: 'processType' },
    { label: 'Level', key: 'level' },
    { label: 'Condition', key: 'condition' },
    { label: 'Approver Role', key: 'approverRole' },
    { label: 'Priority', key: 'priority' },
    { label: 'Required Approvals', key: 'requiredApprovals' },
    { label: 'Multi Approval', key: 'multiApproval' },
    { label: 'Action', key: 'action' },
  ];

  return (
    <Box p={4}>
      <Button onClick={handleOpenModal} colorScheme="teal" mb={4}>
        Add Approval Rule
      </Button>

      <DynamicTable apiUrl={"/approval-rules"} headers={headers}   />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Approval Rule</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack as="form" onSubmit={handleSubmit} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Process ID</FormLabel>
                <Input name="processId" value={formData.processId} onChange={handleInputChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Process Type</FormLabel>
                <Input name="processType" value={formData.processType} onChange={handleInputChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Level</FormLabel>
                <Input type="number" name="level" value={formData.level} onChange={handleInputChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Condition</FormLabel>
                <Input name="condition" value={formData.condition} onChange={handleInputChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Approver Role</FormLabel>
                <Input name="approverRole" value={formData.approverRole} onChange={handleInputChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Priority</FormLabel>
                <Input type="number" name="priority" value={formData.priority} onChange={handleInputChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Required Approvals</FormLabel>
                <Input type="number" name="requiredApprovals" value={formData.requiredApprovals} onChange={handleInputChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Multi Approval</FormLabel>
                <Select name="multiApproval" value={formData.multiApproval} onChange={handleInputChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Action</FormLabel>
                <Input name="action" value={formData.action} onChange={handleInputChange} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Save Rule
            </Button>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ApprovalRules;
