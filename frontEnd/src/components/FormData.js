import React, { useState } from "react";
import {
  Button,
  useDisclosure,
  Text,
  Grid,
  Box,
  useToast,
} from "@chakra-ui/react";
import DynamicField from "./common/DynamicField";
import DynamicSection from "./common/DynamicSection";
import useApi from '../hooks/useApi';
import { submitForm, fetchData } from '../api';

const FormData = ({ fieldsConfig, submitUrl, onSuccess, step = false, initialValues = {}, formId, mainConfig }) => {
  const { onClose } = useDisclosure();
  const [formData, setFormData] = useState({ ...initialValues, _id: initialValues?._id || null });
  const [sections, setSections] = useState(initialValues?.sections || {});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const { data, loading, error, execute } = useApi(fetchData);
  const { execute: executeForm } = useApi(submitForm);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalData = { formId, ...formData, ...sections};
    console.log(finalData, "djdj")

    try {
      const response = await executeForm(submitUrl ? submitUrl : `forms/submit/`, finalData);
      
      setIsSubmitting(false);
      onClose();
      onSuccess && onSuccess();

      if (response?.statusCode === 200) {
        toast({
          title: "Form Submitted",
          description: response?.message || "Your form has been submitted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        throw new Error(response?.message || "Form submission failed");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Failed to submit form", error);
      toast({
        title: "Submission Error",
        description: error?.response?.data?.message || "There was an error submitting the form. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleSectionChange = (sectionName, newSectionData) => {
    setSections((prevSections) => ({
      ...prevSections,
      [sectionName]: newSectionData,
    }));
  };

  const nextStep = () => {
    if (currentStep < fieldsConfig.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {step === "true" ? (
        <div>
          <Text mb={2} mt={5}>{fieldsConfig[currentStep]?.title}</Text>
          <Grid templateColumns={fieldsConfig[currentStep]?.fields > 2 ? "repeat(3, 1fr)" : "repeat(2, 1fr)"} gap={6}>
            {fieldsConfig[currentStep]?.fields?.map((config, fieldIndex) => {
              if (config.type === "field") {
                return (
                  <DynamicField
                    key={fieldIndex}
                    label={config.label}
                    name={config.name}
                    type={config.inputType}
                    value={formData[config.name] || ""}
                    handleChange={handleChange}
                    isRequired={config.isRequired}
                    options={config.options || []}
                  />
                );
              } else if (config.type === "section") {
                console.log(config.title)
                return (
                  <DynamicSection
                    key={fieldIndex}
                    sections={sections[config.title] || []}
                    setSections={(newSections) => handleSectionChange(config.title, newSections)}
                    fieldsConfig={config.fields}
                    type={config.type}
                    sectionTitle={config.title}
                  />
                );
              }
              return null;
            })}
          </Grid>
          <Box mt={4}>
            <Button onClick={prevStep} mr={3} disabled={currentStep === 0} bg={mainConfig?.buttonColor} color="white">
              Previous
            </Button>
            {currentStep === fieldsConfig.length - 1 ? (
              <Button type="submit" isLoading={isSubmitting} fontSize={12} bg={mainConfig?.buttonColor} color="white">
                Submit
              </Button>
            ) : (
              <Button onClick={nextStep} fontSize={12} bg={mainConfig?.buttonColor} color="white">
                Next
              </Button>
            )}
          </Box>
        </div>
      ) : (
        <div>
          {fieldsConfig?.map((item, sectionIndex) => (
            <div key={sectionIndex}>
              <Text mb={2} mt={5}>{item.title}</Text>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {item?.fields?.map((config, fieldIndex) => {
                  if (config.type === "field") {
                    return (
                      <DynamicField
                        key={fieldIndex}
                        label={config.label}
                        name={config.name}
                        type={config.inputType}
                        value={formData[config.name] || ""}
                        handleChange={handleChange}
                        isRequired={config.isRequired}
                        options={config.options || []}
                        mainConfig={mainConfig}
                      />
                    );
                  } else if (config.type === "section") {
                    return (
                      <DynamicSection
                        key={fieldIndex}
                        sections={sections[config.name] || []}
                        setSections={(newSections) => handleSectionChange(config.title, newSections)}
                        fieldsConfig={config.fields}
                        sectionTitle={config.title}
                        type={config.type}
                        mainConfig={mainConfig}
                        
                        
                      />
                    );
                  }
                  return null;
                })}
              </Grid>
            </div>
          ))}
          <Button type="submit" isLoading={isSubmitting} mt={5} bg={mainConfig?.buttonColor} color="white">
            Submit
          </Button>
        </div>
      )}
    </form>
  );
};

export default FormData;
