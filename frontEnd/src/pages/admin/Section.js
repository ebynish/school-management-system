import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, HStack } from '@chakra-ui/react';
import Field from './Field';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const Section = ({ section, sectionIndex, sections, setSections, handleDeleteSection }) => {
  const handleSectionTitleChange = (event) => {
    const { value } = event.target;
    const updatedSections = [...sections];
    updatedSections[sectionIndex].title = value;
    setSections(updatedSections);
  };

  const handleAddField = () => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields.push({ label: '', name: '', type: '', inputType: '', isRequired: false, options: [{ name: '', value: '' }] });
    setSections(updatedSections);
  };

  return (
    <Box mb={4} borderWidth={1} p={4} borderRadius="md">
      <HStack justifyContent="space-between">
        <FormControl mb={2}>
          <FormLabel fontSize={13}>Section Title</FormLabel>
          <Input fontSize={13} type="text" value={section.title} onChange={handleSectionTitleChange} required />
        </FormControl>
      
      </HStack>
      {section.fields.map((field, fieldIndex) => (
        <Field
          key={fieldIndex}
          field={field}
          fieldIndex={fieldIndex}
          sectionIndex={sectionIndex}
          sections={sections}
          setSections={setSections}
        />
      ))}
      {sectionIndex != 0 && (  <Button onClick={() => handleDeleteSection(sectionIndex)} colorScheme="red" variant="outline">
          <DeleteIcon />
        </Button>)}
      <Button ml={2} mt={4} onClick={handleAddField} variant="outline">
        <AddIcon />
      </Button>
    </Box>
  );
};

export default Section;
