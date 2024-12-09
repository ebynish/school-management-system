import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  GridItem
} from "@chakra-ui/react";
import useApi from "../../hooks/useApi";
import { fetchData } from "../../api";
const DynamicField = ({
  label,
  name,
  type = "text",
  value,
  handleChange,
  options,
  linkUrl,
  isRequired = false,
  multiple = false
}) => {
  const [fetchedOptions, setFetchedOptions] = useState([]);
  const { data, loading: fetchLoading, execute: executeFetch, error: fetchError } = useApi(fetchData);
  

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (typeof options === "string" || linkUrl) {
          const response = await executeFetch(`check/find/${linkUrl || options}`, null, null, null);
          
          setFetchedOptions(response);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [options, linkUrl]);

  return (
    <GridItem
      colSpan={{ base: 3, md: type === "textarea" ? 3 : 1 }}
    >
      <FormControl id={name} isRequired={isRequired}>
        <FormLabel fontSize={12}>{label}</FormLabel>

        {type === "select" && (
          <Select
            name={name}
            value={value}
            onChange={handleChange}
            fontSize={12}
            placeholder={`Select ${label}`}
          >
             {(Array.isArray(fetchedOptions) && fetchedOptions.length > 0 ? fetchedOptions : Array.isArray(options) ? options : [])?.map(
              (option, index) => (
                <option key={index} value={option._id|| option.value}>
                  {option.name}
                </option>
              )
            )}
          </Select>
        )}

        {type === "checkbox" && (
          <Checkbox
            name={name}
            isChecked={value}
            onChange={handleChange}
          >
            {label}
          </Checkbox>
        )}

        {type === "radio" && (
          <RadioGroup name={name} value={value} onChange={handleChange}>
            <Stack direction="row">
              {(fetchedOptions.length > 0 ? fetchedOptions : options)?.map(
                (option, index) => (
                  <Radio key={index} value={option.value}>
                    {option.label}
                  </Radio>
                )
              )}
            </Stack>
          </RadioGroup>
        )}

        {(type === "text" ||
          type === "email" ||
          type === "date" ||
          type === "file" ||
          type === "number") && (
          <Input
            fontSize={12}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={label}
          />
        )}

        {type === "hidden" && (
          <Input
            fontSize={12}
            name={name}
            type={"hidden"}
            value={value}
            onChange={handleChange}
            placeholder={label}
          />
        )}

        {type === "textarea" && (
          <Textarea
            fontSize={12}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={label}
          />
        )}
      </FormControl>
    </GridItem>
  );
};

export default DynamicField;
