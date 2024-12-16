import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  useBreakpointValue,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  FaBook,
  FaBookOpen,
  FaBookReader,
  FaCheckSquare,
  FaClock,
  FaCogs,
  FaCreditCard,
  FaFile,
  FaFolderOpen,
  FaGraduationCap,
  FaHome,
  FaKey,
  FaList,
  FaLocationArrow,
  FaSchool,
  FaUser,
  FaUserClock,
  FaUsers,
} from "react-icons/fa";
import Header from "./UserInfo";
import { fetchData } from "../api";
import useApi from "../hooks/useApi";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen, onToggle, config }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null); // Track the currently expanded menu
  const sidebarWidth = useBreakpointValue({
    base: "30%",
    md: isOpen ? "18%" : "8%",
  });
  const navigate = useNavigate();
  const { execute } = useApi(fetchData);
  const user = useSelector((state) => state.auth.user);
  const userPermissions = user?.role?._id;

  useEffect(() => {
    const fetchMenuItems = async () => {
      const datas = await execute("menu/findMenu");
      setMenuItems(datas);
    };
    fetchMenuItems();
  }, [execute]);

  const handleMenuClick = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  return (
    <Box
      position="fixed"
      left="0"
      top="0"
      height="100vh"
      width={sidebarWidth}
      borderRight="1px solid"
      borderColor="gray.200"
      p={4}
      bg="white"
      overflowY="auto"
      className="chakra-ui-print-hide"
    >
      <IconButton
        aria-label="Toggle Sidebar"
        icon={isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        onClick={onToggle}
        bg="white"
        color="black"
        border="1px solid"
        borderColor="gray.300"
        size="sm"
        position="absolute"
        top="10px"
        right="-0px"
      />
      <VStack align="stretch" spacing={4}>
        <Header config={config}/>
        <Divider mt={2} />
        {menuItems?.map((menu) => {
          const isMenuVisible = menu?.permissions?.some((permission) =>
            userPermissions?.includes(permission)
          );
          return (
            isMenuVisible && (
              <React.Fragment key={menu.label}>
                <MenuItem
                  id={menu._id}
                  icon={getIcon(menu.icon)}
                  label={isOpen ? menu.label : ""}
                  to={menu.route}
                  target={menu.target || ""}
                  isActive={navigate.pathname === menu.route}
                  onClick={() => handleMenuClick(menu._id)}
                  hasSubItems={!!menu.subItems?.length}
                  isExpanded={expandedMenu === menu._id}
                />
                {expandedMenu === menu._id &&
                  menu.subItems?.map((subItem) => {
                    const isSubItemVisible = subItem.permissions?.some(
                      (permission) => userPermissions?.includes(permission)
                    );
                    console.log(navigate.pathname,menu.route, "kjdjkdhj")
                    return (
                      isSubItemVisible && (
                        <MenuItem
                          key={subItem.label}
                          icon={getIcon(subItem.icon)}
                          label={isOpen ? subItem.label : ""}
                          to={subItem.route}
                          target={subItem.target || ""}
                          isActive={window.location.pathname == subItem.route}
                          fontSize={"11px"}
                          indent
                        />
                      )
                    );
                    
                  })}
                <Divider />
              </React.Fragment>
            )
          );
        })}
      </VStack>
    </Box>
  );
};

const MenuItem = ({
  icon,
  label,
  to,
  target,
  isActive,
  onClick,
  hasSubItems,
  isExpanded,
  indent,
  fontSize,
}) => {
  const showLabel = useBreakpointValue({ base: false, md: true });
  
  return (
    <Link
      to={to}
      target={target}
      style={{ textDecoration: "none", width: "100%" }}
    >
      <Flex
        align="center"
        p={1}
        pl={indent ? 6 : 3}
        w="100%"
        borderRadius="md"
        _hover={{ bg: "gray.100" }}
        cursor="pointer"
        bg={isActive ? "gray.200" : "transparent"}
        onClick={hasSubItems ? onClick : undefined}
        justifyContent={showLabel ? "start" : "center"}
      >
        <Icon as={icon} boxSize={5} />
        {showLabel && (
          <Text
            fontSize={fontSize || "sm"}
            ml={4}
            fontWeight="medium"
            whiteSpace="nowrap"
          >
            {label}
          </Text>
        )}
        {hasSubItems && (
          <Flex ml="auto" align="center">
            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </Flex>
        )}
      </Flex>
    </Link>
  );
};

const getIcon = (itemType) => {
  switch (itemType) {
    case "profile":
      return FaUser;
    case "course":
      return FaBookOpen;
    case "result":
    case "verifyResult":
      return FaFile;
    case "file":
      return FaFolderOpen;
    case "dashboard":
      return FaHome;
    case "documents":
      return FaBook;
    case "school":
      return FaSchool;
    case "graduate":
      return FaGraduationCap;
    case "lms":
      return FaBookReader;
    case "payments":
      return FaCreditCard;
    case "users":
      return FaUsers;
    case "settings":
      return FaCogs;
    case "permission":
      return FaKey;
    case "roles":
      return FaUsers;
    case "list":
      return FaList;
    case "checkmark":
      return FaCheckSquare;
    case "location":
      return FaLocationArrow;
    case "time":
      return FaUserClock;
    case "folder":
      return FaFolderOpen;
    default:
      return FiChevronRight;
  }
};

export default Sidebar;
