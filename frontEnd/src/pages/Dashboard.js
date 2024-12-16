import { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  useDisclosure,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import ProfileCard from '../components/ProfileCard';
import useApi from '../hooks/useApi';
import ApprovalWorkflowTable from './admin/ApprovalWorkflowTable';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchData } from '../api';

const Dashboard = ({config}) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const user = useSelector((state) => state.auth.user);
  const { loading: feesLoading, execute: executePending } = useApi(fetchData);
  const { data: workflow, loading: workflowLoading } = useApi();
  const isStudent = user.role.name === 'Student';
  const isStaff = user.role.name === 'Staff';
  const isAdmin = user.role.name === 'Administrator';
  const isSuperAdmin = user.role.name === 'Super Administrator';
  
  const [currentCourses, setCurrentCourses] = useState([]);
  const [latestFee, setLatestFee] = useState(null);
  const [cgpa, setCgpa] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      
        const response = await executePending(`check/find/transactions/${user?._id}/userId?s=Pending`);
        
        if (response && response.length > 0) {
          const sortedFees = response.sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt);
            const dateB = new Date(b.updatedAt || b.createdAt);
            return dateB - dateA; // Descending order
          });
          setLatestFee(sortedFees[0]);
        } else {
          setLatestFee(null);
        }
        
      
    };

    const fetchCgpa = async () => {
      
        try {
          const response = await executePending(`students/${user._id}/cgpa`);
          setCgpa(response?.cgpa || 'N/A'); // Fallback if no CGPA is returned
        } catch (error) {
          console.error('Error fetching CGPA:', error);
          setCgpa('N/A');
        }
      
    };
    const registerCourse =async()=>{
      const response = await executePending(`check/find/registeredcourses/${user?._id}/userId`);
       if (response){
      // Filter registered courses based on user's semester
           const filteredCoursesBySemester = response[0]?.selectedCourses?.filter(course => 
            String(course?.programmeId) === String(user?.programmeId) && 
            String(course?.departmentId) === String(user?.departmentId) && 
            String(course?.semesterId) === String(user?.semesterId)
          );
    
          setCurrentCourses(filteredCoursesBySemester);
           }
    }
    if (isStudent) {
    fetchFees();
    fetchCgpa();
    registerCourse()
    }
  }, [isStudent, executePending]);

  const renderOutstandingPayment = () => {
    if (feesLoading) {
      return <Spinner size="md" />;
    }

    if (!latestFee) {
      return <Text>No outstanding payments found.</Text>;
    }

    return (
      <VStack align="flex-start" spacing={2}>
        <Text fontSize="xl" fontWeight="bold" color="red.500">
          {latestFee.amount || 'N/A'}
        </Text>
        <Text>
          {latestFee.description || 'Fee description not available'} |{' '}
          {latestFee.session || 'Session not specified'}
        </Text>
        <Text color="red.500">Payment is due</Text>
        <Button colorScheme="green" w="40%">
          View Details
        </Button>
      </VStack>
    );
  };

  return (
    <Layout config={config}>
      <Box>
        {/* Profile Section */}
        {isStudent && (
          <>
            <ProfileCard
              userData={{
                matricNumber: user?.matricNumber,
                level: user.level,
                cgpa: cgpa, // Dynamically calculated CGPA
                session: user?.session,
                programmeName: user?.programmeName,
                departmentName: user?.departmentName,
                examinationCentre: user?.campusName || 'Main Campus',
                profileImage: '',
                firstName: user?.firstName,
                lastName: user?.lastName,
                color: config?.buttonColor
              }}
            />

            <Box bg="white" p={5} mt={10}>
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                Registered Courses for the Semester
              </Text>
              {currentCourses?.length > 0 ? (
                <VStack align="stretch" spacing={3}>
                  {currentCourses?.map((course, index) => (
                    <Box key={index} p={3} bg="gray.50" shadow="sm" borderRadius="md">
                      <Text fontWeight="bold">{course?.code}</Text>
                      <Text>{course?.name}</Text>
                      <Text fontSize="sm">Units: {course?.unit}</Text>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <>
                  <Text>You have not registered for any course.</Text>
                  <Link to="/user-courses">
                    <Button colorScheme="green" mt={3} mx="auto" display="block">
                      Register Courses
                    </Button>
                  </Link>
                </>
              )}
            </Box>

            <Box bg="white" p={5} shadow="md" borderRadius="md" mt={10}>
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="lg" fontWeight="bold">
                  Outstanding Payment
                </Text>
                <Link to="/user-payments">
                  <Button variant="link" color={config?.buttonColor}>
                    Check all payments →
                  </Button>
                </Link>
              </Flex>
              {renderOutstandingPayment()}
            </Box>
          </>
        )}

        {!isStudent && (
          <Box>
            {workflowLoading ? (
              <Spinner size="md" />
            ) : (
              <Box w={"705px"}>
              <ApprovalWorkflowTable workflows={workflow} isLoading={workflowLoading} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Dashboard;
