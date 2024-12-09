import { useSelector } from 'react-redux';
import { Box, Avatar, Text, Image } from '@chakra-ui/react';
import { Link  } from 'react-router-dom'; // Import RouterLink for navigation

const Header = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Box display="contents"  alignItems="center" p={1} >
      {/* Logo on the left */}
      <Box display="flex" justifyContent="center" ml={1}>
        <Link  to="/" fontSize="2xl" fontWeight="bold" color="blue.500" display="flex" justifyContent="center">
          <Image src={`${window.location.origin}/logo.png`}  width="300px"/>
        </Link>
      </Box>

    </Box>
  );
};

export default Header;
