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
  } from "@chakra-ui/react";
  
  import { useState } from "react";
  
  const steps = [
    { title: "Personal Info", description: "Your name and date of birth" },
    { title: "Identification", description: "ID and verification" },
    { title: "Address", description: "Your address details" },
    { title: "Contact", description: "Contact information" },
    { title: "Confirmation", description: "Sign and submit" },
  ];
  
  function IndividualCustomer() {
    const { activeStep, setStep } = useSteps({ initialStep: 0 });
  
    // Store form data
    const [formData, setFormData] = useState({
      surname: "",
      firstName: "",
      otherNames: "",
      mothersMaidenName: "",
      dob: "",
      gender: "",
      title: "",
      nationality: "",
      meansOfIdentification: "",
      idNumber: "",
      idIssueDate: "",
      idExpiryDate: "",
      bankVerificationNumber: "",
      houseNumber: "",
      streetName: "",
      nearestBusStop: "",
      city: "",
      lga: "",
      state: "",
      phoneNumber1: "",
      phoneNumber2: "",
      emailAddress: "",
      signature: "",
      date: "",
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
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
  
        {/* Step 1: Personal Info */}
        {activeStep === 0 && (
          <Box>
            <FormControl>
              <FormLabel>Surname</FormLabel>
              <Input name="surname" value={formData.surname} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input name="firstName" value={formData.firstName} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Other Names</FormLabel>
              <Input name="otherNames" value={formData.otherNames} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Mother's Maiden Name</FormLabel>
              <Input
                name="mothersMaidenName"
                value={formData.mothersMaidenName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Date of Birth</FormLabel>
              <Input name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Gender</FormLabel>
              <Input name="gender" value={formData.gender} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input name="title" value={formData.title} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Nationality</FormLabel>
              <Input name="nationality" value={formData.nationality} onChange={handleInputChange} />
            </FormControl>
          </Box>
        )}
  
        {/* Step 2: Identification */}
        {activeStep === 1 && (
          <Box>
            <FormControl>
              <FormLabel>Means of Identification</FormLabel>
              <Input
                name="meansOfIdentification"
                value={formData.meansOfIdentification}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>ID Number</FormLabel>
              <Input name="idNumber" value={formData.idNumber} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>ID Issue Date</FormLabel>
              <Input
                name="idIssueDate"
                type="date"
                value={formData.idIssueDate}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>ID Expiry Date</FormLabel>
              <Input
                name="idExpiryDate"
                type="date"
                value={formData.idExpiryDate}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Bank Verification Number (BVN)</FormLabel>
              <Input
                name="bankVerificationNumber"
                value={formData.bankVerificationNumber}
                onChange={handleInputChange}
              />
            </FormControl>
          </Box>
        )}
  
        {/* Step 3: Address */}
        {activeStep === 2 && (
          <Box>
            <FormControl>
              <FormLabel>House Number</FormLabel>
              <Input name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Street Name</FormLabel>
              <Input name="streetName" value={formData.streetName} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Nearest Bus Stop / Landmark</FormLabel>
              <Input
                name="nearestBusStop"
                value={formData.nearestBusStop}
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
  
        {/* Step 4: Contact */}
        {activeStep === 3 && (
          <Box>
            <FormControl>
              <FormLabel>Phone Number (1)</FormLabel>
              <Input
                name="phoneNumber1"
                value={formData.phoneNumber1}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Phone Number (2)</FormLabel>
              <Input
                name="phoneNumber2"
                value={formData.phoneNumber2}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input
                name="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={handleInputChange}
              />
            </FormControl>
          </Box>
        )}
  
        {/* Step 5: Confirmation */}
        {activeStep === 4 && (
          <Box>
            <FormControl>
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
  
  export default IndividualCustomer;
  