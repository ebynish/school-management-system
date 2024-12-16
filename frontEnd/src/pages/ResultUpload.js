import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Select,
  Text,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import useApi from "../hooks/useApi"; // Custom hook for fetching data
import { fetchData, submitForm } from "../api";
const ResultUploadPage = ({ config }) => {
  const [formData, setFormData] = useState({
    session: "",
    semester: "",
    level: "",
    programme: "",
    campus: "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [options, setOptions] = useState({
    sessions: [],
    semesters: [],
    levels: [],
    programmes: [],
    campuses: [],
  });
  const { execute: fetchOptions, loading } = useApi(fetchData); // API call logic
  const { execute, submitLoading } = useApi(submitForm); // API call logic

  useEffect(() => {
    const fetchDropdownData = async () => {
      const sessions = await fetchOptions("check/find/sessions");
      const semesters = await fetchOptions("check/find/semesters");
      const levels = await fetchOptions("check/find/levels");
      const programmes = await fetchOptions("check/find/programmes");
      const campuses = await fetchOptions("check/find/campuses");
      const departments = await fetchOptions("check/find/departments");
      setOptions({ sessions, semesters, levels, programmes, campuses, departments });
    };
    fetchDropdownData();
  }, [fetchOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("sessionId", formData.session);
    data.append("semesterId", formData.semester);
    data.append("levelId", formData.level);
    data.append("programmeId", formData.programme);
    data.append("departmentId", formData.department);

    try {
      const response = await execute("students/upload-scores",data)
      
      const result = await response.json();
      if (response.ok) {
        setUploadStatus({ success: true, message: "File uploaded successfully!" });
      } else {
        setUploadStatus({ success: false, message: result.message || "Upload failed." });
      }
    } catch (error) {
      setUploadStatus({ success: false, message: "An error occurred while uploading." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout config={config}>
      <Box w="full" maxWidth="700px" p={4} bg="white" borderRadius={10}>
        <Text fontSize="2xl" mb={4}>
          Upload Results
        </Text>
        {loading ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <SimpleGrid columns={[1, 2]} gap={5} >
              <FormControl isRequired>
                <FormLabel>Session</FormLabel>
                <Select name="session" value={formData?.session} onChange={handleChange}>
                  <option value="" disabled>Select Session</option>
                  {options?.sessions?.map((session) => (
                    <option key={session?._id} value={session?._id}>
                      {session?.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Semester</FormLabel>
                <Select name="semester" value={formData?.semester} onChange={handleChange}>
                  <option value="" disabled>Select Semester</option>
                  {options?.semesters?.map((semester) => (
                    <option key={semester?._id} value={semester?._id}>
                      {semester?.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Level</FormLabel>
                <Select name="level" value={formData.level} onChange={handleChange}>
                  <option value="" disabled>Select Level</option>
                  {options?.levels?.map((level) => (
                    <option key={level?._id} value={level?._id}>
                      {level?.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Programme</FormLabel>
                <Select name="programme" value={formData?.programme} onChange={handleChange}>
                  <option value="" disabled>Select Programme</option>
                  {options?.programmes?.map((programme) => (
                    <option key={programme?._id} value={programme?._id}>
                      {programme?.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Campus</FormLabel>
                <Select name="campus" value={formData?.campus} onChange={handleChange}>
                  <option value="" disabled>Select Campus</option>
                  {options?.campuses?.map((campus) => (
                    <option key={campus?._id} value={campus?._id}>
                      {campus?.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Departments</FormLabel>
                <Select name="department" value={formData?.department} onChange={handleChange}>
                  <option value="" disabled>Select Department</option>
                  {options?.departments?.map((department) => (
                    <option key={department?._id} value={department?._id}>
                      {department?.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              </SimpleGrid>
              <FormControl isRequired>
                <FormLabel>File Upload</FormLabel>
                <Input type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
              </FormControl>
              <Button
                mx="auto"
                type="submit"
                bg={config?.buttonColor}
                color="white"
                isLoading={uploading}
                w="350px"
              >
                Upload
              </Button>
            </Stack>
          </form>
        )}
        {uploadStatus && (
          <Text mt={4} color={uploadStatus.success ? "green.500" : "red.500"}>
            {uploadStatus.message}
          </Text>
        )}
      </Box>
    </Layout>
  );
};

export default ResultUploadPage;
