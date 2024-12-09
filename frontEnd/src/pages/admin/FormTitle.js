import React from 'react';
import { SimpleGrid, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';

const FormTitle = ({ formTitle, formSteps, formSlug, setFormTitle, setFormStep, setFormSlug }) => {
  return (
    <SimpleGrid columns={[1, 3]} spacing={4}>
      <FormControl mb={4}>
        <FormLabel fontSize={13}>Form Title</FormLabel>
        <Input fontSize={13} type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel fontSize={13}>Form Slug</FormLabel>
        <Input fontSize={13} type="text" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} required />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel fontSize={13}>Step</FormLabel>
        <Select fontSize={13} type="text" value={formSteps} onChange={(e) => setFormStep(e.target.value)} required>
          <option></option>
          <option value={"true"}>Yes</option>
          <option value={"false"}>No</option>
        </Select>
      </FormControl>
    </SimpleGrid>
  );
};

export default FormTitle;
