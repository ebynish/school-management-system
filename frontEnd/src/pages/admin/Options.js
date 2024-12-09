import React from 'react';
import { Box, Button, SimpleGrid, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
const Options = ({ field, fieldIndex, sectionIndex, sections, setSections }) => {
  const handleOptionChange = (optionIndex, event) => {
    const { name, value } = event.target;
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex].options[optionIndex][name] = value;
    setSections(updatedSections);
  };

  const handleAddOption = () => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex].options.push({ name: '', value: '' });
    setSections(updatedSections);
  };

  const handleRemoveOption = (optionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex].options.splice(optionIndex, 1);
    setSections(updatedSections);
  };

  return (
    <Box>
      {field.options.map((option, optionIndex) => (
        <SimpleGrid key={optionIndex} columns={[1, 2]} spacing={4}>
          <FormControl mb={2}>
            <FormLabel fontSize={13}>Option Name</FormLabel>
            <Input fontSize={13} type="text" name="name" value={option.name} onChange={(e) => handleOptionChange(optionIndex, e)} required />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel fontSize={13}>Option Value</FormLabel>
            <Input fontSize={13} type="text" name="value" value={option.value} onChange={(e) => handleOptionChange(optionIndex, e)} required />
          </FormControl>
          { optionIndex !== 0 && (
          <Button mt={1} colorScheme="red" variant="outline" onClick={() => handleRemoveOption(optionIndex)} width={10}>
            <DeleteIcon />
          </Button>)}
        </SimpleGrid>
      ))}
      <Button mt={4} onClick={handleAddOption}>
        <AddIcon />
      </Button>
    </Box>
  );
};

export default Options;
