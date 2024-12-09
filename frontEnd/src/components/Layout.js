import React, { useState } from "react";
import {
  Box,
  Flex,
  useBreakpointValue,
  Text,
  Grid,
  VStack,
  Divider,
} from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import TopBar from "../components/admin/TopBar";
import Calendar from "./Calendar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import AnnouncementBoard from "./AnnouncementBoard";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  const isStudent = user?.role?.name === "Student";
  const isSuperAdmin = user.role.name === 'Super Administrator';
  const isAdmin = user.role.name === 'Administrator';
  const isDashboardPage = location.pathname.includes("dashboard");

  const sidebarWidth = useBreakpointValue({
    base: isSidebarOpen ? "50%" : "15%", // Larger sidebar width for smaller screens
    md: isSidebarOpen ? "25%" : "10%",  // Adjusted for medium screens
    lg: isSidebarOpen ? "18%" : "8%",  // Narrow sidebar for large screens
  });

  const announcements = [
    {
      author: "John Doe",
      date: "Nov 25, 2024",
      title: "Upcoming Holiday on Dec 25th",
    },
    {
      author: "Admin",
      date: "Nov 24, 2024",
      title: "Midterm Results Published",
    },
    {
      author: "Jane Smith",
      date: "Nov 23, 2024",
      title: "Submit Project Reports by Nov 30th",
    },
  ];
  const handleViewAll = () => {
    console.log("View all announcements clicked!");
  };

  const mainContentMargin = useBreakpointValue({
    base: 0, // No margin for small screens
    md: isSidebarOpen ? "18%" : "8%", // Adjusted for medium screens
    lg: isSidebarOpen ? "15%" : "5%",  // Adjusted for large screens
  });

  const onToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Flex direction="column" minH="100vh">
      {/* Sidebar */}
      <Flex>
        <Sidebar isOpen={isSidebarOpen} onToggle={onToggleSidebar} />

        {/* Main Content */}
        <Box
          as="main"
          flex="1"
          ml={sidebarWidth}
          transition="margin 0.3s ease"
          
          bg="#F9F9F9"
        >
          <TopBar user={user} />

          {/* Content Grid */}
          <Grid
            templateColumns={{
              base: "1fr", // Single column on small screens
              md: isStudent || isDashboardPage ? "2fr 1fr" : "1fr", // Two columns for specific pages
            }}
            gap={6}
            mt={6}
          p={{ base: 4, md: 6 }}
          >
            {/* Left Section */}
            <VStack spacing={4} align="stretch">
              {children}
            </VStack>

            {/* Right Section */}
            {(isStudent || isDashboardPage) && (
              <Box
                bg="white"
                p={6}
                borderRadius="md"
                shadow="md"
                className='chakra-ui-print-hide'
                // maxH="900px"
                overflowY="auto"
              >
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Calendar & Events
                </Text>
                <Calendar isAdmin={isAdmin || isSuperAdmin} />
                <Divider mt={10} />
                <AnnouncementBoard announcements={announcements} onViewAll={handleViewAll} />
              </Box>
            )}
          </Grid>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
