import React from "react";
import { Box, Flex, Text, IconButton, Avatar } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // For navigation
import { logout } from "../../slices/authSlice"; // Replace with your actual auth slice action

const TopBar = () => {
  const user = useSelector((state) => state.auth.user); // Access the user from the Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth state
    dispatch(logout()); // Clear the user auth state in Redux
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <Box bg="white" px={6} py={4} shadow="md" className='chakra-ui-print-hide'>
      <Flex justify="space-between" align="center">
        {/* Logo or Title */}
        <Text fontSize="xl" fontWeight="bold" color="gray.700">
          Dashboard
        </Text>

        {/* Logout Icon */}
        <Flex align="center" gap={3}>
          <Text fontSize="sm" color="gray.600">
            Welcome, {user?.firstName || "Guest"}
          </Text>
          <Avatar size="sm" src={user?.avatarUrl || "https://placehold.co/120?text=No+Image"} />
          <IconButton
            icon={<FiLogOut />}
            colorScheme="red"
            variant="ghost"
            aria-label="Logout"
            onClick={handleLogout}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default TopBar;
