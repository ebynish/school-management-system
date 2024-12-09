import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';

const ModalComponent = ({ component, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{component.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {component.content}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
