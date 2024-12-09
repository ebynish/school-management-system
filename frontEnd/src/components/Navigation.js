import React from "react";
import {
  Box,
  Container,
  HStack,
  Text,
  Link,
  Image,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

const Navigation = ({ config }) => {
  const location = useLocation();

  return (
    <Box as="nav" role="navigation" className="chakra-ui-print-hide">
      {/* Top Section */}
      <Box bg={config.primaryColor} py={2} px={5}>
        <SimpleGrid columns={{ base: 1, md: 2 }} maxW="container.xl" spacing={4} pl={10}>
          {/* Emails */}
          <HStack spacing={4} justify="start" align="center" color="white">
            {config?.email?.map((email, index) => (
              <React.Fragment key={index}>
                <Text>
                  <Link href={`mailto:${email}`}>{email}</Link>
                </Text>
                {index < config.email.length - 1 && <Divider orientation="vertical" />}
              </React.Fragment>
            ))}
          </HStack>

          {/* Phones */}
          <HStack spacing={4} justify="end" align="center" color="white">
            {config.phoneNumber?.map((phone, index) => (
              <React.Fragment key={index}>
                <Text>
                  Call: <Link href={`tel:${phone}`}>{phone}</Link>
                </Text>
                {index < config.phoneNumber.length - 1 && <Divider orientation="vertical" />}
              </React.Fragment>
            ))}
          </HStack>
        </SimpleGrid>
      </Box>

      {/* Menu Section */}
      <Box bg="white" boxShadow="md">
        <Container maxW="container.xl">
          <HStack justify="space-between" align="center" py={4}>
            {/* Logo Section */}
            <Box>
              <Link href="/">
                <Image src={config?.logoUrl} height="50px" width="190px" alt="DLC Logo" />
              </Link>
            </Box>

            {/* Menu Links Section */}
            <HStack as="nav" spacing={8} display={{ base: "none", md: "flex" }}>
              {config?.menu?.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  color="gray.700"
                  fontWeight={location.pathname === `${item.href}` ? "bold" : "normal"}
                  _hover={{ color: config.primaryColor }}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={config.apply}
                target="_blank"
                color="white"
                bg={config.buttonColor}
                px={4}
                py={2}
                borderRadius="md"
                _hover={{ bg: config.primaryColor }}
              >
                Apply Now
              </Link>
            </HStack>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Navigation;
