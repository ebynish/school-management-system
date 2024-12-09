import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  VStack,
  Text,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import useApi from "../hooks/useApi";
import { fetchData, submitForm } from "../api";

const Calendar = ({ isAdmin = false }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch data using custom hook
  const { data: events, loading, error, execute } = useApi(fetchData);

  // Handle event submission (using the custom hook)
  const { loading: loadingEvents, error: errorEvents, execute: submitEvent } = useApi(submitForm);

  useEffect(() => {
    execute("check/find/events");
  }, [execute]);

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const isMobile = useBreakpointValue({ base: true, lg: false });

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      toast({
        title: "Invalid input",
        description: "Please fill in all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      let response = await submitEvent("forms/submit", { ...newEvent, schema:"events", dependency:"events"});
      console.log(response)
      if (response.statusCode == 200){
      toast({
        title: "Event added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewEvent({ title: "", date: "" });
      onClose();
    }else{
      toast({
        title: "Error adding event",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    } catch (error) {
      toast({
        title: "Error adding event",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day+1
    ).toISOString().split("T")[0];
    setSelectedDate(clickedDate);
  };

  const filteredEvents = events?.filter(
    (event) => event.date === selectedDate
  );

  return (
    <Box p="2%" bg="white" w="96%">
      <Text fontSize="md" mb="4%" fontWeight="bold" color="green.600">
        {currentDate.toLocaleString("default", { month: "long" })}{" "}
        {currentDate.getFullYear()}
      </Text>

      {/* Calendar Grid */}
      <Grid templateColumns="repeat(7, 1fr)" gap="2%" mb="4%">
        {daysOfWeek?.map((day, idx) => (
          <Text key={idx} textAlign="center" fontWeight="bold" color="gray.500">
            {day}
          </Text>
        ))}
      </Grid>

      <Grid templateColumns="repeat(7, 1fr)" gap="2%">
        {/* Empty cells before the first day */}
        {Array.from({ length: firstDayOfMonth })?.map((_, i) => (
          <Box key={i} />
        ))}

        {/* Days with Event Markers */}
        {daysArray?.map((day) => {
          const dayEvents = events?.filter(
            (event) =>
              new Date(event.date).getDate() === day &&
              new Date(event.date).getMonth() === currentDate.getMonth()
          );

          return (
            <Box
              key={day}
              p="10%"
              textAlign="center"
              bg={day === currentDay ? "green.100" : "gray.100"}
              borderRadius="md"
              color={day === currentDay ? "green.700" : "gray.700"}
              fontWeight={day === currentDay ? "bold" : "normal"}
              cursor="pointer"
              _hover={{ bg: "green.200" }}
              transition="all 0.2s ease-in-out"
              onClick={() => handleDateClick(day)}
            >
              {day}
              {dayEvents?.length > 0 && (
                <Box
                  w="10%"
                  h="10%"
                  bg="green.600"
                  borderRadius="full"
                  mx="auto"
                  mt="-10%"
                />
              )}
            </Box>
          );
        })}
      </Grid>

      {/* Events List for Selected Date */}
      <VStack align="stretch" spacing="3%" mt="6%">
        <Text fontSize="lg" fontWeight="bold" my={2}>Events</Text>
        <Text >
          {selectedDate
            ? `${new Date(selectedDate).toDateString()}`
            : "Select a date to view events"}
        </Text>
        {selectedDate && filteredEvents?.length > 0 ? (
          filteredEvents?.map((event, index) => (
            <Box key={index} p="4%" bg="gray.50" borderRadius="md" shadow="sm">
              <Text fontWeight="bold">{event.title}</Text>
            </Box>
          ))
        ) : selectedDate ? (
          <Text color="gray.500">No events for this date.</Text>
        ) : null}
      </VStack>

      {/* Add Event Button */}
      {isAdmin && (
        <>
          <Button colorScheme="green" mt="4%" w="100%" onClick={onOpen}>
            Add Event
          </Button>

          {/* Add Event Modal */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Event</ModalHeader>
              <ModalBody>
                <VStack spacing="4%">
                  <Input
                    placeholder="Event Title"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" mr="3%" onClick={handleAddEvent}>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default Calendar;
