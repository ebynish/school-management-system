// src/components/Notification.js
import { Button, useToast } from "@chakra-ui/react";

const Notification = ({ message }) => {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: "Notification",
          description: message,
          status: "info",
          duration: 5000,
          isClosable: true,
        })
      }
    >
      Show Notification
    </Button>
  );
};

export default Notification;
