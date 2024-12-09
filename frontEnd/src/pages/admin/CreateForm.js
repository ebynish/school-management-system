import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import { useToast } from '@chakra-ui/react';
import useApi from '../../hooks/useApi';
import { submitForm } from '../../api';
import FormTitle from './FormTitle';
import Section from './Section';
import { AddIcon } from '@chakra-ui/icons';

const AddForm = () => {
  const toast = useToast();
  const [formTitle, setFormTitle] = useState('');
  const [formSteps, setFormStep] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [sections, setSections] = useState([
    {
      title: '',
      fields: [{ label: '', name: '', type: '', inputType: '', isRequired: false, options: [{ name: '', value: '' }] }],
    },
  ]);

  const { execute } = useApi(submitForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      title: formTitle,
      step: formSteps,
      slug: formSlug,
      sections: sections.map(section => ({
        title: section.title,
        fields: section.fields.map(field => ({
          label: field.label,
          name: field.name,
          type: field.type,
          inputType: field.inputType,
          isRequired: field.isRequired,
          options: field.options.map(option => ({
            name: option.name,
            value: option.value,
          })),
        })),
      })),
    };

    try {
      await execute('forms', formData);
      toast({
        title: 'Form created.',
        description: 'Your form has been created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error creating form.',
        description: 'There was an error creating your form.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSection = (index) => {
    const updatedSections = sections.filter((_, sectionIndex) => sectionIndex !== index);
    setSections(updatedSections);
  };

  return (
    <Layout>
      <Box p={10}>
        <form onSubmit={handleSubmit}>
          <FormTitle formTitle={formTitle} formSteps={formSteps} formSlug={formSlug} setFormTitle={setFormTitle} setFormStep={setFormStep} setFormSlug={setFormSlug} />
          {sections.map((section, sectionIndex) => (
            <Section
              key={sectionIndex}
              sectionIndex={sectionIndex}
              section={section}
              sections={sections}
              setSections={setSections}
              handleDeleteSection={handleDeleteSection}
            />
          ))}
          <Button mt={4} onClick={() => setSections([...sections, { title: '', fields: [{ label: '', name: '', type: '', inputType: '', isRequired: false, options: [{ name: '', value: '' }] }] }])}>
            <AddIcon />
          </Button>
          <br />
          <Button mt={4} type="submit">Submit</Button>
        </form>
      </Box>
    </Layout>
  );
};

export default AddForm;
