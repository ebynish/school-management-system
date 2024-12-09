import React, {useEffect} from 'react';
import {
  Button,
  Flex,
  SimpleGrid,
  Stack,
  useDisclosure,
  Box
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import DynamicTable from '../../components/DynamicTable';
import { fetchData } from '../../api';
import useApi from '../../hooks/useApi';
import useDynamicActions from '../../hooks/useDynamicAction';
const ManageForms = () => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { handleView, handleEdit, handleDelete, handleDisable } = useDynamicActions("forms");

  
  const cardData = [
    { title: "Active Users", count: 150, icon: CheckIcon, color: "green.400" },
    { title: "Disabled Users", count: 50, icon: CheckIcon, color: "red.400" },
    { title: "Total Users", count: 30, icon: CloseIcon, color: "yellow.400" },
    ];
  
    
    const headers = [
      { key: "title", label: "Name of Form" },
      { key: "isActive", label: "Active" }
    ];
    

    // Function to render buttons dynamically for each row
    const renderButtons = (row) => (
      <>
        <Button colorScheme="green" fontSize="12" onClick={() => handleView(row)}>
          View
        </Button>
        <Button colorScheme="blue" fontSize="12" onClick={() => handleEdit(row)} ml={2}>
          Edit
        </Button>
        <Button colorScheme="red" fontSize="12" onClick={() => handleDelete(row)} ml={2}>
          Disable
        </Button>
      </>
    );
  
    

  return (

    <Layout>
      
      <Flex direction="column" flex={1} p={5}>
        {/* <Header /> */}
        <Stack direction="column" p={5} gap={5}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              {cardData.map((card, index) => (
                <DashboardCard
                  key={index}
                  title={card.title}
                  count={card.count}
                  icon={card.icon}
                  color={card.color}
                />
              ))}
              </SimpleGrid>
      
          </Stack> 
          <Box>
                <Link to={'/create-form'}>
                    <Button> New Form </Button>
                </Link>
          </Box>
          <DynamicTable apiUrl={"forms/findAll"} headers={headers} renderButtons={renderButtons} />
          </Flex>  
    </Layout>
    ); 
  };

export default ManageForms;
