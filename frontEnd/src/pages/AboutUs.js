import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Flex, 
  Stack
} from '@chakra-ui/react';
import MainLayout from '../components/MainLayout';
const AboutUsPage = ({config}) => {

  return (
    <MainLayout config={config}>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p="10"
    >
      <Box
        maxW="800px"
        w="full"
        bg="white"
        p="8"
        borderRadius="lg"
        boxShadow="lg"
        
      >
     <Flex direction="column"  maxW="1200px" mx="auto">
        <Heading as="h1" size="2xl" mb={6}>
          About Us
        </Heading>

        <Stack spacing={8}>
          <Text fontSize="lg" >
            The Federal College of Education, Zaria (FCE Zaria), is an institution focused on teacher education in Nigeria.
          </Text>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              Establishment and History
            </Heading>
            <Stack spacing={3}>
              <Text>
                <strong>Founded:</strong> November 1962 by the then Northern Region Government of Nigeria.
              </Text>
              <Text>
                <strong>Initial Names:</strong> Originally named Northern Secondary Teachers College, later known as Advanced Teachers’ College Zaria.
              </Text>
              <Text>
                <strong>Affiliation:</strong> It was under the administrative control of Ahmadu Bello University (ABU) Zaria until 1991 when it was disarticulated from ABU and renamed Federal College of Education, Zaria.
              </Text>
            </Stack>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              Location
            </Heading>
            <Text>
              The college is situated in Zaria, Kaduna State, Nigeria, specifically at Gyallesu, opposite the Ahmadu Bello University, Kongo Campus.
            </Text>
         
          </Box>
        </Stack>
      </Flex>
    </Box>
    </Box>
    </MainLayout>
  );
};

export default AboutUsPage;