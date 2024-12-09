import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  SimpleGrid,
  Text,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import useApi from "../hooks/useApi";

const ProfilePage = () => {
  const toast = useToast();
  const user = useSelector((state) => state.auth.user); // Assuming 'auth' slice in Redux
  const { execute: changePassword } = useApi(); // Hook for API calls

  // Local state for password fields
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
    let response =  await changePassword("/auth/change_password", {
        method: "POST",
        data: {
          oldPassword,
          newPassword,
        },
      });
      if (response.ok){
      toast({
        title: "Success",
        description: "Password updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setoldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box bg="white" p={8} borderRadius="md" shadow="lg" ml={5}>
        {/* Profile Header */}
        <Flex alignItems="center" mb={8}>
          <Avatar size="xl" name={user?.name || "User"} mr={6} />
          <Box>
            <Heading fontSize="2xl" color="gray.700">
              Edit Profile
            </Heading>
            <Text color="gray.500">Update your account details</Text>
          </Box>
        </Flex>

        {/* Edit Profile Form */}
        <VStack spacing={6} align="stretch">
          {/* Email Address */}
          <FormControl isReadOnly>
            <FormLabel fontWeight="bold" color="gray.600">
              Email Address
            </FormLabel>
            <Input type="email" value={user?.email || ""} bg="gray.100" />
          </FormControl>

          {/* Phone Number */}
          <FormControl>
            <FormLabel fontWeight="bold" color="gray.600">
              Phone Number
            </FormLabel>
            <Input
              type="tel"
              placeholder="Enter your phone number"
              defaultValue={user?.phone || ""}
              readOnly
            />
          </FormControl>

          {/* Academic Details */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isReadOnly>
              <FormLabel fontWeight="bold" color="gray.600">
                Matric. Number
              </FormLabel>
              <Input type="text" value={user?.matricNumber || ""} bg="gray.100" />
            </FormControl>
            <FormControl isReadOnly>
              <FormLabel fontWeight="bold" color="gray.600">
                Level
              </FormLabel>
              <Input type="text" value={user?.level || ""} bg="gray.100" />
            </FormControl>
            <FormControl isReadOnly>
              <FormLabel fontWeight="bold" color="gray.600">
                Entry Mode
              </FormLabel>
              <Input type="text" value={user?.entryMode || ""} bg="gray.100" />
            </FormControl>
            <FormControl isReadOnly>
              <FormLabel fontWeight="bold" color="gray.600">
                Programme
              </FormLabel>
              <Input type="text" value={`${user?.programmeName} ${user?.departmentName}` || ""} bg="gray.100" />
            </FormControl>
          </SimpleGrid>

          {/* Update Password */}
          <Heading fontSize="lg" mt={8} color="gray.700">
            Update Password
          </Heading>
          <FormControl>
            <FormLabel fontWeight="bold" color="gray.600">
              Current Password
            </FormLabel>
            <Input
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setoldPassword(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold" color="gray.600">
              New Password
            </FormLabel>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold" color="gray.600">
              Confirm New Password
            </FormLabel>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>

          {/* Save Button */}
          <Button
            colorScheme="green"
            size="lg"
            w="full"
            mt={4}
            onClick={handlePasswordChange}
            isLoading={loading}
          >
            Save Changes
          </Button>
        </VStack>
      </Box>
    </Layout>
  );
};

export default ProfilePage;
