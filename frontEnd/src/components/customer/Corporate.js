import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Step,
    StepDescription,
    StepIndicator,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
    Select,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  const steps = [
    { title: "Corporate Details", description: "Information about the company" },
    { title: "Address Info", description: "Company head office address" },
    { title: "Contact Info", description: "Company contact information" },
    { title: "Directors & Confirmation", description: "Director(s) info and submission" },
  ];
  
  function CorporateCustomer() {
    const { activeStep, setStep } = useSteps({ initialStep: 0 });
  
    // Store form data
    const [formData, setFormData] = useState({
      companyName: "",
      registrationNumber: "",
      tin: "",
      incorporationDate: "",
      industry: "",
      headOfficeAddress: "",
      city: "",
      lga: "",
      state: "",
      phoneNumber: "",
      email: "",
      directors: [
        {
          directorName: "",
          directorPosition: "",
          directorPhoneNumber: "",
          directorEmail: "",
          identificationType: "",
          identificationNumber: "",
        },
      ],
      signature: "",
      date: "",
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    // Handle change for director information
    const handleDirectorChange = (index, e) => {
      const { name, value } = e.target;
      const newDirectors = [...formData.directors];
      newDirectors[index][name] = value;
      setFormData({ ...formData, directors: newDirectors });
    };
  
    // Add new director entry
    const addDirector = () => {
      setFormData({
        ...formData,
        directors: [
          ...formData.directors,
          {
            directorName: "",
            directorPosition: "",
            directorPhoneNumber: "",
            directorEmail: "",
            identificationType: "",
            identificationNumber: "",
          },
        ],
      });
    };
  
    // Remove a director entry
    const removeDirector = (index) => {
      const newDirectors = formData.directors.filter((_, i) => i !== index);
      setFormData({ ...formData, directors: newDirectors });
    };
  
    return (
      <Box>
        <Stepper activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus />
              </StepIndicator>
              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
  
        {/* Step 1: Corporate Details */}
        {activeStep === 0 && (
          <Box>
            <FormControl>
              <FormLabel>Company Name</FormLabel>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Registration Number</FormLabel>
              <Input
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>TIN (Tax Identification Number)</FormLabel>
              <Input name="tin" value={formData.tin} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Date of Incorporation</FormLabel>
              <Input
                name="incorporationDate"
                type="date"
                value={formData.incorporationDate}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Industry</FormLabel>
              <Input name="industry" value={formData.industry} onChange={handleInputChange} />
            </FormControl>
          </Box>
        )}
  
        {/* Step 2: Address Information */}
        {activeStep === 1 && (
          <Box>
            <FormControl>
              <FormLabel>Head Office Address</FormLabel>
              <Input
                name="headOfficeAddress"
                value={formData.headOfficeAddress}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>City / Town</FormLabel>
              <Input name="city" value={formData.city} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>LGA</FormLabel>
              <Input name="lga" value={formData.lga} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>State</FormLabel>
              <Input name="state" value={formData.state} onChange={handleInputChange} />
            </FormControl>
          </Box>
        )}
  
        {/* Step 3: Contact Information */}
        {activeStep === 2 && (
          <Box>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>
          </Box>
        )}
  
        {/* Step 4: Directors & Confirmation */}
        {activeStep === 3 && (
          <Box>
            {formData.directors.map((director, index) => (
              <Box key={index} borderWidth="1px" p={4} mt={4}>
                <FormControl>
                  <FormLabel>Director's Name</FormLabel>
                  <Input
                    name="directorName"
                    value={director.directorName}
                    onChange={(e) => handleDirectorChange(index, e)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Director's Position</FormLabel>
                  <Input
                    name="directorPosition"
                    value={director.directorPosition}
                    onChange={(e) => handleDirectorChange(index, e)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Director's Phone Number</FormLabel>
                  <Input
                    name="directorPhoneNumber"
                    value={director.directorPhoneNumber}
                    onChange={(e) => handleDirectorChange(index, e)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Director's Email Address</FormLabel>
                  <Input
                    name="directorEmail"
                    type="email"
                    value={director.directorEmail}
                    onChange={(e) => handleDirectorChange(index, e)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Identification Type</FormLabel>
                  <Select
                    name="identificationType"
                    value={director.identificationType}
                    onChange={(e) => handleDirectorChange(index, e)}
                  >
                    <option value="National ID">National ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="Voter's Card">Voter's Card</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Identification Number</FormLabel>
                  <Input
                    name="identificationNumber"
                    value={director.identificationNumber}
                    onChange={(e) => handleDirectorChange(index, e)}
                  />
                </FormControl>
                {formData.directors.length > 1 && (
                  <Button mt={4} colorScheme="red" onClick={() => removeDirector(index)}>
                    Remove Director
                  </Button>
                )}
              </Box>
            ))}
            <Button mt={4} onClick={addDirector}>
              Add Another Director
            </Button>
            <FormControl mt={6}>
              <FormLabel>Signature</FormLabel>
              <Input name="signature" value={formData.signature} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input name="date" type="date" value={formData.date} onChange={handleInputChange} />
            </FormControl>
          </Box>
        )}
  
        <Button
          onClick={() => setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))}
          mt={4}
        >
          Next
        </Button>
        <Button
          onClick={() => setStep((prevStep) => Math.max(prevStep - 1, 0))}
          mt={4}
          ml={4}
        >
          Back
        </Button>
      </Box>
    );
  }
  
  export default CorporateCustomer;
  