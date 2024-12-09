import React from 'react';
import { Text, Box, Button, SimpleGrid, FormControl, FormLabel, Input, Select, Checkbox, HStack } from '@chakra-ui/react';
import Options from './Options';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';

const Field = ({ field, fieldIndex, sectionIndex, sections, setSections }) => {
  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex][name] = type === 'checkbox' ? checked : value;
    if (field.type == "section"){
    if (!updatedSections[sectionIndex].fields[fieldIndex].fields)
        updatedSections[sectionIndex].fields[fieldIndex].fields = [];
    updatedSections[sectionIndex].fields[fieldIndex].fields.push({
        label: '',
        name: '',
        type: '',
        inputType: '',
        isRequired: false,
        options: [{ name: '', value: '' }],
      });
    }
    setSections(updatedSections);
  };

  const handleRemoveField = () => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields.splice(fieldIndex, 1);
    setSections(updatedSections);
  };

  const handleAddNestedField = () => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex].fields = updatedSections[sectionIndex].fields[fieldIndex].fields || [];
    updatedSections[sectionIndex].fields[fieldIndex].fields.push({
      label: '',
      name: '',
      type: '',
      inputType: '',
      isRequired: false,
      options: [{ name: '', value: '' }],
    });
    setSections(updatedSections);
  };

  const handleNestedFieldChange = (nestedFieldIndex, event) => {
    const { name, value, type, checked } = event.target;
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex].fields[nestedFieldIndex][name] = type === 'checkbox' ? checked : value;
    setSections(updatedSections);
  };

  const handleRemoveNestedField = (nestedFieldIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex].fields.splice(nestedFieldIndex, 1);
    setSections(updatedSections);
  };

  return (
    <Box mb={4} borderWidth={1} p={4} borderRadius="md">
      <SimpleGrid columns={[1, 2]} spacing={4}>
        <FormControl mb={2}>
          <FormLabel fontSize={13}>Label</FormLabel>
          <Input fontSize={13} type="text" name="label" value={field.label} onChange={handleFieldChange} required />
        </FormControl>
        <FormControl mb={2}>
          <FormLabel fontSize={13}>Name</FormLabel>
          <Input fontSize={13} type="text" name="name" value={field.name} onChange={handleFieldChange} required />
        </FormControl>
        <FormControl mb={2}>
          <FormLabel fontSize={13}>Type</FormLabel>
          <Select fontSize={13} name="type" value={field.type} onChange={handleFieldChange} required>
            <option value="">Select Type</option>
            <option value="field">Field</option>
            <option value="section">Section</option>
          </Select>
        </FormControl>
        <FormControl mb={2}>
          <FormLabel fontSize={13}>Input Type</FormLabel>
          <Select fontSize={13} name="inputType" value={field.inputType} onChange={handleFieldChange}>
            <option value="">Select Input Type</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="select">Select</option>
            <option value="textarea">Textarea</option>
            <option value="file">File</option>
            <option value="date">Date</option>
          </Select>
        </FormControl>
        <FormControl mb={2}>
          <HStack>
            <FormLabel fontSize={13}>Is Required</FormLabel>
            <Checkbox fontSize={13} name="isRequired" isChecked={field.isRequired} onChange={handleFieldChange} />
          </HStack>
        </FormControl>
      </SimpleGrid>

      {(field.inputType === 'select' || field.inputType === 'radio') && (
        <Options field={field} fieldIndex={fieldIndex} sectionIndex={sectionIndex} sections={sections} setSections={setSections} />
      )}

      {field.type === 'section' && (
        <Box mt={4} borderWidth={1} p={4} borderRadius="md">
          <FormLabel fontSize={14}>Nested Fields</FormLabel>
          {field.fields?.map((nestedField, nestedFieldIndex) => (
            <Box key={nestedFieldIndex} mb={4} borderWidth={1} p={4} borderRadius="md">
              <SimpleGrid columns={[1, 2]} spacing={4}>
                <FormControl mb={2}>
                  <FormLabel fontSize={13}>Label</FormLabel>
                  <Input
                    fontSize={13}
                    type="text"
                    name="label"
                    value={nestedField.label}
                    onChange={(e) => handleNestedFieldChange(nestedFieldIndex, e)}
                    required
                  />
                </FormControl>
                <FormControl mb={2}>
                  <FormLabel fontSize={13}>Name</FormLabel>
                  <Input
                    fontSize={13}
                    type="text"
                    name="name"
                    value={nestedField.name}
                    onChange={(e) => handleNestedFieldChange(nestedFieldIndex, e)}
                    required
                  />
                </FormControl>
                <FormControl mb={2}>
          <FormLabel fontSize={13}>Type</FormLabel>
          <Select fontSize={13} name="type"    value={nestedField.name}
                    onChange={(e) => handleNestedFieldChange(nestedFieldIndex, e)} required>
            <option value="">Select Type</option>
            <option value="field">Field</option>
            <option value="section">Section</option>
          </Select>
        </FormControl>
        <FormControl mb={2}>
          <FormLabel fontSize={13}>Input Type</FormLabel>
          <Select fontSize={13} name="inputType"    value={nestedField.name}
                    onChange={(e) => handleNestedFieldChange(nestedFieldIndex, e)}>
            <option value="">Select Input Type</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="select">Select</option>
            <option value="textarea">Textarea</option>
            <option value="file">File</option>
            <option value="date">Date</option>
          </Select>
        </FormControl>
        <FormControl mb={2}>
          <HStack>
            <FormLabel fontSize={13}>Is Required</FormLabel>
            <Checkbox fontSize={13} name="isRequired" isChecked={field.isRequired}    
            value={nestedField.name}
            onChange={(e) => handleNestedFieldChange(nestedFieldIndex, e)} />
          </HStack>
        </FormControl>
              </SimpleGrid>
              <Button mt={2} variant="outline" colorScheme="red" onClick={() => handleRemoveNestedField(nestedFieldIndex)}>
                <DeleteIcon />
              </Button>
            </Box>
          ))}
          <Text>Use this to add nested fields</Text>
          <Button mt={4} onClick={handleAddNestedField}>
            <AddIcon />
          </Button>
        </Box>
      )}

      {fieldIndex !== 0 && (
        <Button mt={2} variant="outline" colorScheme="red" onClick={handleRemoveField}>
          <DeleteIcon />
        </Button>
      )}
    </Box>
  );
};

export default Field;
