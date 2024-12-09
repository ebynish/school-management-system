// UpdatedDashboard.tsx
import {
  Button,
  Flex,
  SimpleGrid,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import { CheckIcon, HourglassEmptyIcon, CloseIcon, InfoIcon } from '@chakra-ui/icons';
import DynamicTable from '../../components/DynamicTable';


const ManageRole = () => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const cardData = [
    { title: "Active Users", count: 150, icon: CheckIcon, color: "green.400" },
    { title: "Disabled Users", count: 50, icon: CheckIcon, color: "red.400" },
    { title: "Total Users", count: 30, icon: CloseIcon, color: "yellow.400" },
    ];
  
    
    const headers = [
      { key: "name", label: "Name" },
      { key: "description", label: "Description" }
    ];
    

    // Function to render buttons dynamically for each row
    const renderButtons = (row) => (
      <>
        <Button colorScheme="blue" fontSize="12" onClick={() => handleEdit(row)}>
          Edit
        </Button>
        <Button colorScheme="red" fontSize="12" onClick={() => handleDelete(row)} ml={2}>
          Disable
        </Button>
      </>
    );
  
    const handleEdit = (row) => {
      console.log("Edit clicked for", row);
    };
  
    const handleDelete = (row) => {
      console.log("Delete clicked for", row);
    };
  
  

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
          </Flex>  
          <DynamicTable apiUrl={"roles/findAll"} headers={headers} renderButtons={renderButtons} />
    </Layout>
    ); 
  };

export default ManageRole;
