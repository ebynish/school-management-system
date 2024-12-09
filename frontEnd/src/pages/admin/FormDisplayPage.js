import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Text,
  Heading,
  SimpleGrid,
  Divider,
  Image,
  Link,
  Button,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import useApi from 'path-to-your-hooks/useApi'; // Adjust path as necessary

const FormDisplayPage = () => {
  const [formData, setFormData] = useState({});
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: fetchedConfig, error } = useApi('/api/form-config');

  useEffect(() => {
    if (fetchedConfig) {
      setFormConfig(fetchedConfig.config || {});
      setFormData(fetchedConfig.data || {});
      setLoading(false);
    }
  }, [fetchedConfig]);

  if (loading) return <Spinner size="xl" />;

  if (error) return (
    <Alert status="error" mb={4}>
      <AlertIcon />
      Failed to load form configuration. Please try again later.
    </Alert>
  );

  const renderFile = (fileUrl) => {
    const isImage = /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(fileUrl);
    if (isImage) {
      return <Image src={fileUrl} alt="File" maxW="150px" mt={2} fallbackSrc="/path/to/placeholder.png" />;
    } else {
      return (
        <Link href={fileUrl} isExternal download>
          <Button leftIcon={<DownloadIcon />} colorScheme="blue" mt={2}>
            Download File
          </Button>
        </Link>
      );
    }
  };

  return (
    <Container maxW="container.md" p={4}>
      <Heading mb={2}>{formConfig?.title || "Form Title"}</Heading>
      <Text fontSize="lg" mb={6}>{formConfig?.header || "Form Header"}</Text>

      <Box borderWidth="1px" borderRadius="lg" p={6} mb={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {(formConfig?.fields || []).map((field) => (
            <React.Fragment key={field.name}>
              <Text fontWeight="bold">{field.label || field.name}:</Text>
              {typeof formData[field.name] === 'string' && formData[field.name].startsWith('http') ? (
                renderFile(formData[field.name])
              ) : (
                <Text>{formData[field.name] || "Not provided"}</Text>
              )}
            </React.Fragment>
          ))}
        </SimpleGrid>
      </Box>

      {(formConfig?.sections || []).map((section, index) => (
        <Box key={index} borderWidth="1px" borderRadius="lg" p={4} mb={4}>
          <Heading size="md" mb={4}>{section.title || "Section"}</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {(section.fields || []).map((field) => (
              <React.Fragment key={field.name}>
                <Text fontWeight="bold">{field.label || field.name}:</Text>
                {typeof formData[field.name] === 'string' && formData[field.name].startsWith('http') ? (
                  renderFile(formData[field.name])
                ) : (
                  <Text>{formData[field.name] || "Not provided"}</Text>
                )}
              </React.Fragment>
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Container>
  );
};

export default FormDisplayPage;
