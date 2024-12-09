import { Box, Container, Grid, GridItem, Text, Link, VStack } from "@chakra-ui/react";

const Footer = ({ config }) => {
  return (
    <Box
      as="footer"
      role="contentinfo"
      bgImage={`url(${config?.footerBg})`}
      bgSize="cover"
      bgPosition="center"
      color="white"
      py={8}
      className="chakra-ui-print-hide"
    >
      <Box position="absolute" top="0" left="0" right="0" bg="rgba(0, 0, 0, 0.5)" />
      <Container maxW="container.xl">
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={5}
        >
          {config.footer?.grid?.map((section, index) => (
            <GridItem key={index}>
              <VStack align="start" spacing={4}>
                <Text fontWeight="bold" fontSize="lg">
                  {section.title}
                </Text>
                {section.aboutText && (<Text fontSize="mg">
                  {section.aboutText}
                </Text>) }
                {section.links ? (
                  <VStack align="start" spacing={2}>
                    {section.links.map((link, linkIndex) => (
                      <Link key={linkIndex} href={link.url}>
                        {link?.text}
                      </Link>
                    ))}
                  </VStack>
                ) : (
                  <Text>{section?.text}</Text>
                )}
              </VStack>
            </GridItem>
          ))}
        </Grid>
        <Box textAlign="center" mt={8}>
          <Text fontSize="sm" display="block">
            <small>{config?.footer?.text}</small>
          </Text>
          <Text fontSize="sm" display="block">
            <small>
              Designed by <Link href="#" isExternal>Sapphire Solutions</Link>
            </small>
          </Text>
          <Text fontSize="sm" display="block">
            <small>
              Follow us on:{" "}
              <Link href={config?.footer?.socialLinks?.facebook} isExternal>Facebook</Link>,{" "}
              <Link href={config?.footer?.socialLinks?.twitter} isExternal>Twitter</Link>,{" "}
              <Link href={config?.footer?.socialLinks?.instagram} isExternal>Instagram</Link>,{" "}
              <Link href={config?.footer?.socialLinks?.linkedin} isExternal>LinkedIn</Link>
            </small>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
