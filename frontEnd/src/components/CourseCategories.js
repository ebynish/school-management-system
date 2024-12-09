import { SimpleGrid, Box, Text, Icon, Heading } from '@chakra-ui/react';
import { FaShoppingCart, FaHeart, FaRegMoneyBillAlt, FaFlask, FaCameraRetro, FaHome, FaComments, FaGlobeAmericas } from 'react-icons/fa'; // Import Chakra UI Icons

const CourseCategories = () => {
  return (
    <Box id="fh5co-course-categories" my={10} p={10}>
      <Box textAlign="center" mb={10}>
        <Heading fontSize={"40px"} my={5}>Our Departments/Programmes</Heading>
      </Box>

      <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }}  spacing={3}>
        {/* Course 1 */}
        <Box textAlign="center">
          <Icon as={FaShoppingCart} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.A. English</a>
          </Text>
        </Box>

        {/* Course 2 */}
        <Box textAlign="center">
          <Icon as={FaHeart} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.A. Philosophy and Public Affairs</a>
          </Text>
        </Box>

        {/* Course 3 */}
        <Box textAlign="center">
          <Icon as={FaRegMoneyBillAlt} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.A. History and Diplomatic Studies</a>
          </Text>
        </Box>

        {/* Course 4 */}
        <Box textAlign="center">
          <Icon as={FaFlask} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.A. Communication and Language Art</a>
          </Text>
        </Box>

        {/* Course 5 */}
        <Box textAlign="center">
          <Icon as={FaCameraRetro} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.Sc. Psychology</a>
          </Text>
        </Box>

        {/* Course 6 */}
        <Box textAlign="center">
          <Icon as={FaHome} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.Sc. Economics</a>
          </Text>
        </Box>

        {/* Course 7 */}
        <Box textAlign="center">
          <Icon as={FaComments} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.Sc. Political Science</a>
          </Text>
        </Box>

        {/* Course 8 */}
        <Box textAlign="center">
          <Icon as={FaGlobeAmericas} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.Sc. Sociology</a>
          </Text>
        </Box>

        {/* Course 9 */}
        <Box textAlign="center">
          <Icon as={FaShoppingCart} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">BSW. Social Work</a>
          </Text>
        </Box>

        {/* Course 10 */}
        <Box textAlign="center">
          <Icon as={FaHeart} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">BLIS. Library, Archival and Information Studies</a>
          </Text>
        </Box>

        {/* Course 11 */}
        <Box textAlign="center">
          <Icon as={FaRegMoneyBillAlt} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.Ed. Counseling and Human Development</a>
          </Text>
        </Box>

        {/* Course 12 */}
        <Box textAlign="center">
          <Icon as={FaShoppingCart} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.Ed. Educational Management</a>
          </Text>
        </Box>

        {/* Course 13 */}
        <Box textAlign="center">
          <Icon as={FaHeart} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.Sc. Computer Science</a>
          </Text>
        </Box>

        {/* Course 14 */}
        <Box textAlign="center">
          <Icon as={FaRegMoneyBillAlt} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.Sc. Statistics</a>
          </Text>
        </Box>

        {/* Course 15 */}
        <Box textAlign="center">
          <Icon as={FaFlask} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="nursing-requirements.php">BNSc. Nursing Science</a>
          </Text>
        </Box>

        {/* Course 16 */}
        <Box textAlign="center">
          <Icon as={FaFlask} boxSize={12} mb={4} />
          <Text fontSize="lg">
            <a href="#">B.Ed. Adult Education</a>
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default CourseCategories;
