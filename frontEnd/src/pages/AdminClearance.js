import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Progress,
} from "@chakra-ui/react";

const AdminClearancePage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchStudentsClearance = async () => {
      try {
        const response = await fetch(`/api/clearances`);
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          throw new Error('Failed to fetch clearances');
        }
      } catch (error) {
        console.error('Error fetching clearances:', error);
      }
    };

    fetchStudentsClearance();
  }, []);

  const handleToggleClearanceStatus = async (studentId, stepId) => {
    const updatedStudents = students.map(student =>
      student.id === studentId
        ? {
            ...student,
            steps: student.steps.map(step =>
              step.id === stepId ? { ...step, status: !step.status } : step
            ),
          }
        : student
    );
    setStudents(updatedStudents);

    try {
      const response = await fetch(`/api/clearances/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stepId }),
      });
      if (!response.ok) {
        throw new Error('Failed to update clearance status');
      }
    } catch (error) {
      console.error('Error updating clearance status:', error);
    }
  };

  const handleSubmitClearance = async (studentId) => {
    try {
      const response = await fetch(`/api/clearances/${studentId}/submit`, {
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
    }
  };

  const calculateProgress = (steps) => (steps.filter(step => step.status).length / steps.length) * 100;

  return (
    <Box p={8}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Student ID</Th>
            <Th>Student Name</Th>
            <Th>Progress</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {students.map((student) => (
            <Tr key={student.id}>
              <Td>{student.id}</Td>
              <Td>{student.name}</Td>
              <Td>
                <Progress value={calculateProgress(student.steps)} size="sm" colorScheme="green" width="100%" />
              </Td>
              <Td>
                <Button
                  colorScheme="blue"
                  onClick={() => handleSubmitClearance(student.id)}
                  isDisabled={calculateProgress(student.steps) < 100}
                >
                  Submit
                </Button>
                <Button
                  colorScheme="teal"
                  ml={2}
                  onClick={() => setSelectedStudent(student)}
                >
                  View Details
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedStudent && (
        <ClearanceDetailsModal
          student={selectedStudent}
          isOpen={isOpen}
          onClose={onClose}
          onToggleStatus={handleToggleClearanceStatus}
        />
      )}
    </Box>
  );
};

const ClearanceDetailsModal = ({ student, isOpen, onClose, onToggleStatus }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Clearance Details for {student.name}</ModalHeader>
      <ModalBody>
        {student.steps.map((step) => (
          <Box key={step.id} mb={2}>
            <Checkbox
              isChecked={step.status}
              onChange={() => onToggleStatus(student.id, step.id)}
            >
              {step.task}
            </Checkbox>
          </Box>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default AdminClearancePage;
