import React, { useState, useEffect } from "react";
import {
  Box,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Checkbox,
  Progress,
  VStack,
  Text,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";

const ClearancePage = ({ config }) => {
  const [studentSteps, setStudentSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.auth.user);
  const studentId = user?._id;

  useEffect(() => {
    const fetchStudentClearance = async () => {
      try {
        const response = await fetch(`/api/students/${studentId}/clearance`);
        if (response.ok) {
          const data = await response.json();
          setStudentSteps(data?.steps);
        } else {
          throw new Error('Failed to fetch clearance status');
        }
      } catch (error) {
        console.error('Error fetching clearance status:', error);
      }
    };

    fetchStudentClearance();
  }, [studentId]);

  const handleToggleStudentStep = async (stepId) => {
    const updatedSteps = studentSteps?.map((step) =>
      step?._id === stepId ? { ...step, status: !step?.status } : step
    );
    setStudentSteps(updatedSteps);

    try {
      const response = await fetch(`/api/students/${studentId}/clearance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stepId, status: !updatedSteps?.step?.status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update clearance status');
      }
    } catch (error) {
      console.error('Error updating clearance status:', error);
    }
  };

  const calculateProgress = (steps) => (steps?.filter(step => step?.status)?.length / steps?.length) * 100;

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/students/${studentId}/clearance/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to submit clearance');
      }
      onOpen();
    } catch (error) {
      console.error('Error submitting clearance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout config={config}>
      <Box p={8}>
        <Heading size="lg" mb={4}>Your Clearance Progress</Heading>
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Admitted Students</Tab>
            <Tab>Graduating Students</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ClearanceChecklist
                steps={studentSteps.filter(step => step.type === 'admitted')}
                onToggle={handleToggleStudentStep}
                progress={calculateProgress(studentSteps.filter(step => step.type === 'admitted'))}
              />
            </TabPanel>
            <TabPanel>
              <ClearanceChecklist
                steps={studentSteps?.filter(step => step?.type === 'graduating')}
                onToggle={handleToggleStudentStep}
                progress={calculateProgress(studentSteps?.filter(step => step?.type === 'graduating'))}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Box mt={4}>
          <Button
            colorScheme="blue"
            onClick={handleSubmitAll}
            isLoading={isSubmitting}
          >
            Submit All
          </Button>
        </Box>
      </Box>

      <SubmitModal isOpen={isOpen} onClose={onClose} />
    </Layout>
  );
};

const ClearanceChecklist = ({ steps, onToggle, progress }) => (
  <VStack align="start" spacing={4}>
    <Text>Progress:</Text>
    <Progress value={progress} size="sm" colorScheme="green" width="100%" />
    {steps?.map((step) => (
      <Checkbox
        key={step?.id}
        isChecked={step?.status}
        onChange={() => onToggle(step?.id)}
      >
        {step?.task}
      </Checkbox>
    ))}
    <Text fontSize="sm" color="gray.500">
      {progress === 100 ? "All tasks completed!" : `${progress?.toFixed(0)}% completed`}
    </Text>
  </VStack>
);

const SubmitModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Submit Clearance</ModalHeader>
      <ModalBody>
        <Text>Your clearance tasks have been successfully submitted!</Text>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ClearancePage;
