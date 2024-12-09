import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Button,
  Box,
  Stack,
  Spinner,
  Text,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { EditIcon, ViewIcon, CloseIcon } from "@chakra-ui/icons";
import useApi from "../hooks/useApi";
import { fetchData } from "../api";
import FormData from "./FormData";
import {useNavigate} from "react-router-dom";

const flattenObject = (obj, prefix = "") => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object" && obj[k] !== null) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      // Format date fields
      if (["date", "createdAt", "updatedAt"].includes(k) && obj[k]) {
        const date = new Date(obj[k]);
        acc[pre + k] = isNaN(date) ? obj[k] : date.toLocaleDateString("en");
      } else {
        acc[pre + k] = obj[k];
      }
    }
    return acc;
  }, {});
};


const DynamicTable = ({ apiUrl, source, headers, search, action, buttons = [] }) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const { data, loading, error, execute } = useApi(fetchData);
  const { data:editData, loading:editLoading, error:editError, execute: editExecute } = useApi(fetchData);
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [fieldConfig, setFieldConfig] = useState(null); // Store fieldConfig for FormData
  const [formId, setFormId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editValues, setEditValues] = useState({});
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const handleInputChange = (e) => setSearchText(e.target.value);
  const handleSearch = () => execute(apiUrl, searchText, page, limit);
  const handlePageChange = (newPage) => newPage >= 1 && newPage <= totalPages && setPage(newPage);

  const pageWindow = 5;
  const startPage = Math.max(1, page - Math.floor(pageWindow / 2));
  const endPage = Math.min(totalPages, startPage + pageWindow - 1);

  const fontSize = useBreakpointValue({ base: "sm", md: "md" });

  useEffect(() => {
    const fetchData = async () => {
      
      if (source) {
        // Use the source data directly if provided
        
        setTotalPages(source?.totalPages || 1);
        setTableData(source.rows);
      } else if (apiUrl && !source) {
        // Fetch data from API if source is not provided
        const result = await execute(apiUrl, searchText, page, limit);
        if (result) {
          
          setTotalPages(result?.totalPages || 1);
          setTableData(result?.rows || result?.data || []);
        }
      }
    };
    fetchData();
  }, [source, apiUrl, page, searchText]);
  

  // Function to handle row selection and open the view modal
  const handleViewModal = (row) => {
    setSelectedRow(row);
    onViewOpen();
  };

  
  const handleEditModal = async (row, modalSlug) => {
    setSelectedRow(row);
    setEditValues(row);
    onEditOpen();
    
    if (modalSlug) {
      try {
        const configResponse = await editExecute(modalSlug); // Fetch fieldConfig
        setFieldConfig(configResponse); // Update fieldConfig state with response
        setFormId(fieldConfig?._id)
      } catch (error) {
        console.error("Error fetching field config:", error);
      }
    }
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      // Assuming there's a function to update the data
      await execute(`${apiUrl}/${selectedRow._id}`, editValues, 'POST'); // Adjust method as needed
      onEditClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const renderActionButtons = (row) => (
    <Stack direction="row" spacing={2}>
      {buttons.map((button, index) => {
        const [label, url] = Object.entries(button)[0];
        const { viewModal, editModal, modalSlug } = button;  // Deconstruct modalSlug directly
  
        if (!url) return null;
  
        let icon;
        let colorScheme = "blue";
        switch (label) {
          case 'view':
            icon = <ViewIcon />;
            break;
          case 'edit':
            icon = <EditIcon />;
            break;
          case 'disable':
            icon = <CloseIcon />;
            colorScheme = "red";
            break;
          default:
            icon = null;
        }
  
        return (
          <Button
            key={index}
            size="xs"
            colorScheme={colorScheme}
            leftIcon={icon}
            onClick={() => {
              if (label === 'view' && viewModal) {
                handleViewModal(row);
              } else if (label === 'edit' && editModal) {
                handleEditModal(row, modalSlug); // Always pass modalSlug here
              } else {
                navigate(`/${url}/${row._id}`);
              }
            }}
          >
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </Button>
        );
      })}
    </Stack>
  );
  

  return (
    <Box width="100%" px={4}>
      {search && (
        <Stack direction={{ base: "column", md: "row" }} mb={4} spacing={2} align="center" justify="flex-end">
          <Input
            fontSize={fontSize}
            value={searchText}
            onChange={handleInputChange}
            placeholder="Search..."
            width={{ base: "100%", md: "300px" }}
          />
          <Button onClick={handleSearch} fontSize={fontSize}>
            Search
          </Button>
        </Stack>
      )}

      <Box overflowX="auto">
        <TableContainer>
          <Table variant="striped" size="sm">
            <Thead fontSize={fontSize}>
              <Tr>
                {headers.map(({ key, label }, index) => (
                  <Th key={index} p={1}>{label}</Th>
                ))}
                {action && <Th p={1}>Actions</Th>}
              </Tr>
            </Thead>
            <Tbody fontSize={fontSize}>
              {loading ? (
                <Tr>
                  <Td colSpan={headers.length + 1} textAlign="center" p={2}>
                    <Spinner />
                  </Td>
                </Tr>
              ) : error ? (
                <Tr>
                  <Td colSpan={headers.length + 1} textAlign="center" p={2}>
                    <Text color="red.500">{error}</Text>
                  </Td>
                </Tr>
              ) : tableData.length > 0 ? (
                tableData.map((row, rowIndex) => {
                  const flattenedRow = flattenObject(row);
                  return (
                    <Tr key={rowIndex}>
                      {headers.map(({ key }) => (
                        <Td key={key} p={1}>
                          {flattenedRow[key] === (true || false) ? String(flattenedRow[key]) : flattenedRow[key]}
                        </Td>
                      ))}
                      {action && (
                        <Td p={1}>
                          {renderActionButtons(row)}
                        </Td>
                      )}
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td colSpan={headers.length + 1} textAlign="center" p={2}>
                    No results found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Stack direction={{ base: "column", md: "row" }} justify="center" mt={4} width="100%" spacing={2}>
        <Button fontSize={fontSize} onClick={() => handlePageChange(page - 1)} isDisabled={page === 1}>
          Previous
        </Button>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((pageNumber) => (
          <Button
            fontSize={fontSize}
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            bg={pageNumber === page ? "gray.400" : "gray.100"}
          >
            {pageNumber}
          </Button>
        ))}
        <Button fontSize={fontSize} onClick={() => handlePageChange(page + 1)} isDisabled={page === totalPages}>
          Next
        </Button>
      </Stack>

      {/* View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRow ? (
              Object.keys(selectedRow).map((key) => (
                <Text key={key}><strong>{key}:</strong> {selectedRow[key]}</Text>
              ))
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            {/* <SimpleGrid columns={[1, 2]} spacing={1}> */}
            {fieldConfig ? (
              <FormData
                fieldsConfig={fieldConfig?.sections} 
                submitUrl={handleEditSubmit}
                initialValues={editValues} 
                formId={formId}
              />
            ) : (
              <Spinner />
            )}
            {/* {Object.keys(editValues).map((key) => (
              <Input
                key={key}
                name={key}
                fontSize={12}
                value={editValues[key] || ""}
                onChange={handleEditInputChange}
                placeholder={key}
                mb={2}
              />
            ))} */}
            {/* </SimpleGrid> */}
            {/* <Button onClick={handleEditSubmit} colorScheme="blue" mt={2}>
              Save Changes
            </Button> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DynamicTable;
