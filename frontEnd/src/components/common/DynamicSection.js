import React, { useEffect } from "react";
import { Button, FormLabel, Grid, GridItem } from "@chakra-ui/react";
import DynamicField from "./DynamicField";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const DynamicSection = ({ sections, setSections, fieldsConfig, sectionTitle }) => {

  const handleFieldChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedSections = sections.map((section, secIndex) =>
      secIndex === index ? { ...section, [name]: type === "checkbox" ? checked : value } : section
    );
    setSections(updatedSections);
  };

  const addSection = () => {
    const emptySection = fieldsConfig.reduce((acc, field) => {
      acc[field.name] = field.type === "checkbox" ? false : ""; // Handle default values
      return acc;
    }, {});
    setSections([...sections, emptySection]);
  };

  const removeSection = (index) => {
    const updatedSections = sections.filter((_, secIndex) => secIndex !== index);
    setSections(updatedSections);
  };

  useEffect(() => {
    // Automatically add an initial section if sections is empty
    if (sections.length === 0) {
      addSection();
    }
  }, [sections]);

  return (
    <GridItem colSpan={{ base: 3, md: 3 }}>
      <FormLabel fontSize={12}>{sectionTitle}</FormLabel>
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          <Grid
            style={{ marginBottom: "1rem" }}
            templateColumns="repeat(3, 1fr)"
            gap={5}
          >
            {fieldsConfig.map((field, fieldIndex) => (
              <DynamicField
                key={fieldIndex}
                label={field.label}
                name={field.name}
                type={field.inputType}
                value={section[field.name]}
                handleChange={(e) => handleFieldChange(index, e)}
                options={field.options}
                isRequired={field.isRequired}
              />
            ))}
          </Grid>
          { index != 0 && (
          <Button fontSize={12} colorScheme="red"  variant="outline" onClick={() => removeSection(index)}>
            <DeleteIcon />
          </Button>)}
        </React.Fragment>
      ))}

      <Button mt={3} fontSize={12} colorScheme="blue" onClick={addSection}>
        <AddIcon />
      </Button>
    </GridItem>
  );
};

export default DynamicSection;
