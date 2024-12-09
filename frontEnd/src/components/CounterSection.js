import { Box, Flex, Text, Icon, useBreakpointValue } from '@chakra-ui/react';
import { GiWorld, GiBrain, GiBookCover, GiPerson } from 'react-icons/gi';

const CounterSection = () => {
  return (
    <Box
      id="fh5co-counter"
      backgroundImage="url('images/img_bg_4.jpg')"
      backgroundPosition="50% 41.7917px"
      backgroundAttachment="fixed"
      position="relative"
      py="100px"
      color="white"
    >
      <Box position="absolute" top="0" left="0" right="0" bottom="0" bg="rgba(0, 0, 0, 0.4)" />
      <Box className="container">
        <Flex direction="column" align="center">
          <Flex wrap="wrap" justify="space-evenly" textAlign="center" w="100%" spacing={4}>
            <Flex
              direction="column"
              align="center"
              p="4"
              maxW="250px"
              mx="4"
              _hover={{ transform: 'scale(1.05)', transition: 'transform 0.3s' }}
            >
              <Icon as={GiWorld} boxSize={12} />
              <Text fontSize="4xl" fontWeight="bold" mt={4}>
                801168
              </Text>
              <Text fontSize="lg" mt={2}>
                Alumni
              </Text>
            </Flex>

            <Flex
              direction="column"
              align="center"
              p="4"
              maxW="250px"
              mx="4"
              _hover={{ transform: 'scale(1.05)', transition: 'transform 0.3s' }}
            >
              <Icon as={GiBookCover} boxSize={12} />
              <Text fontSize="4xl" fontWeight="bold" mt={4}>
                8876
              </Text>
              <Text fontSize="lg" mt={2}>
                Total Learners
              </Text>
            </Flex>

            <Flex
              direction="column"
              align="center"
              p="4"
              maxW="250px"
              mx="4"
              _hover={{ transform: 'scale(1.05)', transition: 'transform 0.3s' }}
            >
              <Icon as={GiPerson} boxSize={12} />
              <Text fontSize="4xl" fontWeight="bold" mt={4}>
                291
              </Text>
              <Text fontSize="lg" mt={2}>
                Certified Facilitators
              </Text>
            </Flex>

            <Flex
              direction="column"
              align="center"
              p="4"
              maxW="250px"
              mx="4"
              _hover={{ transform: 'scale(1.05)', transition: 'transform 0.3s' }}
            >
              <Icon as={GiBrain} boxSize={12} />
              <Text fontSize="4xl" fontWeight="bold" mt={4}>
                52
              </Text>
              <Text fontSize="lg" mt={2}>
                e-tutors
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default CounterSection;
