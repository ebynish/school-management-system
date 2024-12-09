import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Flex,
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { submitForm } from "../../api";
import useApi from '../../hooks/useApi';
const ApprovalWorkflowTable = ({ workflows, isLoading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStage, setSelectedStage] = useState(null);
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState('');
  const { loading, error, execute } = useApi(submitForm);

  const handleReturnStage = (stage) => {
    // Logic to revert to the previous stage
    console.log('Returning to previous stage', stage);

  };
  
  const handleReturnToInitiator = (stage) => {
    // Logic to send the workflow back to the initiator
    console.log('Returning to initiator', stage);
  };
  
  // Handle row click to open modal
  const handleRowClick = (stage) => {
    setSelectedStage(stage);
    setStatus(stage.status || 'Pending');
    setAmount(stage.amount || '');
    onOpen();
  };

  // Handle form submission for approval
  const handleSubmit = () => {
    // TODO: Add logic for approval submission (API call, etc.)
    // execute("")
    console.log('Submitting approval:', { status, amount });
    onClose();
  };

  return (
    <Box p={3}>
      <Text fontSize="md" mb={4} fontWeight="bold" ml={2}>
        Approval Workflows
      </Text>
      <TableContainer maxHeight="500px" overflowY="auto" overflowX="auto">
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Application Type</Th>
              <Th>Current Stage</Th>
              <Th>Overall Status</Th>
              <Th>Stage Name</Th>
              <Th>Stage Status</Th>
              {/* <Th>Approved By</Th>
              <Th>Approved At</Th>
              <Th>Notes</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={8}>
                  <Flex justifyContent="center" alignItems="center">
                    <Spinner size="lg" />
                  </Flex>
                </Td>
              </Tr>
            ) : workflows?.length > 0 ? (
              workflows?.map((workflow, index) =>
                workflow?.stages?.map((stage, stageIndex) => (
                  <Tr
                    key={`${index}-${stageIndex}`}
                    cursor="pointer"
                    onClick={() => handleRowClick(stage)}
                  >
                    <Td>{workflow.applicationType}</Td>
                    <Td>{workflow.currentStageIndex + 1}</Td>
                    <Td>{workflow.overallStatus}</Td>
                    <Td>{stage.stageName}</Td>
                    <Td>{stage.status}</Td>
                    {/* <Td>{stage.approvedBy || 'N/A'}</Td> */}
                    {/* <Td>{stage.approvedAt || 'N/A'}</Td> */}
                    {/* <Td>{stage.notes || 'N/A'}</Td> */}
                  </Tr>
                ))
              )
            ) : (
              <Tr>
                <Td colSpan={8}>
                  <Flex justifyContent="center" alignItems="center">
                    <Text>No approval workflows found.</Text>
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Approval Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={"600px"}>
          <ModalHeader>Approval</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxW={"600px"}>
            {selectedStage?.amount && (
              <>
                <Text mb={2}>Amount:</Text>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  type="number"
                />
              </>
            ) }
            
                <Text mb={2}>Status:</Text>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Select>
          
          </ModalBody>
          <ModalFooter>
            <Button  colorScheme="teal" mr={3} onClick={handleSubmit}>
              View
            </Button>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="outline" mr={3} onClick={() => handleReturnStage(selectedStage)}>
              Return to Previous Stage
            </Button>
            <Button variant="outline" onClick={() => handleReturnToInitiator(selectedStage)}>
              Return to Initiator
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ApprovalWorkflowTable;
