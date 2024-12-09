import { Box, Center, Text, Button, Stack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const AdmissionCountdown = () => {
  const targetDate = new Date('2024-12-31T23:59:59'); // Set your target date here

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval); // Stop the countdown when time reaches zero
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000); // Update the countdown every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [targetDate]);

  return (
    <Box
      id="fh5co-register"
      bgImage="url(images/img_bg_2.jpg)"
      bgSize="cover"
      bgPosition="center"
      position="relative"
      py={{ base: 12, md: 24 }}
      px={{ base: 4, md: 8 }}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.5)"
      />
      <Center height="100%">
        <Stack
          textAlign="center"
          spacing={6}
          zIndex={2}
          color="white"
          maxW="lg"
        >
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
            Admission closes in
          </Text>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            spacing={6}
            fontSize="xl"
            wrap="wrap"
            zIndex={2}
          >
            {/* Days */}
            <Box
              textAlign="center"
              mx={2}
              p={6}
              border="3px solid white"
              borderRadius="50%"
              width="120px"
              height="120px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              fontSize="4xl"
              fontWeight="bold"
            >
              <Text>{timeLeft.days}</Text>
              <Text fontSize="sm">days</Text>
            </Box>
            {/* Hours */}
            <Box
              textAlign="center"
              mx={2}
              p={6}
              border="3px solid white"
              borderRadius="50%"
              width="120px"
              height="120px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              fontSize="4xl"
              fontWeight="bold"
            >
              <Text>{timeLeft.hours}</Text>
              <Text fontSize="sm">hours</Text>
            </Box>
            {/* Minutes */}
            <Box
              textAlign="center"
              mx={2}
              p={6}
              border="3px solid white"
              borderRadius="50%"
              width="120px"
              height="120px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              fontSize="4xl"
              fontWeight="bold"
            >
              <Text>{timeLeft.minutes}</Text>
              <Text fontSize="sm">minutes</Text>
            </Box>
            {/* Seconds */}
            <Box
              textAlign="center"
              mx={2}
              p={6}
              border="3px solid white"
              borderRadius="50%"
              width="120px"
              height="120px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              fontSize="4xl"
              fontWeight="bold"
            >
              <Text>{timeLeft.seconds}</Text>
              <Text fontSize="sm">seconds</Text>
            </Box>
          </Box>
          <Text fontSize="sm" fontWeight="bold">
            <strong>Limited slots, Hurry Up!</strong>
          </Text>

          {/* Center the button */}
          <Center>
            <Button
              as="a"
              href="/apply"
              target="_blank"
              width="200px"
              size="lg"
              variant="outline"
              colorScheme="white"
              borderColor="white"
              _hover={{
                bg: "whiteAlpha.200",
              }}
            >
              Register Now!
            </Button>
          </Center>
        </Stack>
      </Center>
    </Box>
  );
};

export default AdmissionCountdown;
