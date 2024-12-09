import { Box } from '@chakra-ui/react';

import UserInfo from './UserInfo';

const Header = () => {
  return (
    <Box display="flex" justifyContent="space-between" p={4} mt={"-50px"}>
      <UserInfo />
      {/* <Auth /> */}
    </Box>
  );
};

export default Header;
