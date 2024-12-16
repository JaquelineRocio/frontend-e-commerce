import React, { useContext, useState, useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Box,
  Text,
  VStack,
  Button,
  Heading,
  Divider,
  HStack,
  Icon,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import OrderCard from "../../Shared/OrderCard";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/actions/Auth.actions";

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (!context.stateUser.isAuthenticated) {
        props.navigation.navigate("Login");
        return;
      }

      const fetchUserData = async () => {
        try {
          const token = await SecureStore.getItemAsync("jwt");
          const userResponse = await axios.get(
            `${baseURL}users/${context.stateUser.user.userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setUserProfile(userResponse.data);

          const ordersResponse = await axios.get(`${baseURL}orders`);
          const userOrders = ordersResponse.data.filter(
            (order) => order.user._id === context.stateUser.user.sub
          );
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();

      return () => {
        setUserProfile(null);
        setOrders([]);
      };
    }, [context.stateUser.isAuthenticated])
  );

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("jwt");
      logoutUser(context.dispatch);
      props.navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Box flex={1} bg="gray.100">
      <ScrollView contentContainerStyle={styles.container}>
        {/* Información del Usuario */}
        <Box bg="white" rounded="lg" p={5} shadow={2} width="90%" mb={6}>
          <VStack space={3} alignItems="center">
            <Heading size="lg" color="primary.500">
              {userProfile ? userProfile.name : "User"}
            </Heading>
            <Divider />
            <HStack space={2} alignItems="center">
              <Icon as={Ionicons} name="mail" color="gray.500" size="5" />
              <Text fontSize="md" color="gray.700">
                {userProfile ? userProfile.email : "No Email"}
              </Text>
            </HStack>
            <HStack space={2} alignItems="center">
              <Icon as={Ionicons} name="call" color="gray.500" size="5" />
              <Text fontSize="md" color="gray.700">
                {userProfile ? userProfile.phone : "No Phone"}
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Botón de Cerrar Sesión */}
        <Button
          colorScheme="danger"
          width="90%"
          onPress={handleLogout}
          leftIcon={
            <Icon as={Ionicons} name="log-out" size="5" color="white" />
          }
        >
          Sign Out
        </Button>

        {/* Sección de Órdenes */}
        <Box width="90%" mt={6}>
          <Heading size="md" color="primary.500" mb={4} textAlign="center">
            My Orders
          </Heading>
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard key={order.id} {...order} style={styles.orderCard} />
            ))
          ) : (
            <Box
              bg="white"
              rounded="lg"
              p={4}
              shadow={2}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="md" color="gray.600">
                You have no orders.
              </Text>
            </Box>
          )}
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  orderCard: {
    marginBottom: 12,
    width: "100%",
  },
});

export default UserProfile;
