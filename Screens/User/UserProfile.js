import React, { useContext, useState, useCallback } from "react";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
import { Container } from "native-base";
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
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("Login");
        return;
      }

      // Obtén el token del usuario
      const fetchUserData = async () => {
        try {
          const token = await SecureStore.getItemAsync("jwt");

          // Obtén el perfil del usuario
          const userResponse = await axios.get(
            `${baseURL}users/${context.stateUser.user.sub}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserProfile(userResponse.data);

          // Obtén las órdenes del usuario
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
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        <Text style={{ fontSize: 30 }}>
          {userProfile ? userProfile.name : ""}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text style={{ margin: 10 }}>
            Email: {userProfile ? userProfile.email : ""}
          </Text>
          <Text style={{ margin: 10 }}>
            Phone: {userProfile ? userProfile.phone : ""}
          </Text>
        </View>
        <View style={{ marginTop: 80 }}>
          <Button title={"Sign Out"} onPress={handleLogout} />
        </View>
        <View style={styles.order}>
          <Text style={{ fontSize: 20 }}>My Orders</Text>
          <View>
            {orders.length ? (
              orders.map((order) => <OrderCard key={order.id} {...order} />)
            ) : (
              <View style={styles.order}>
                <Text>You have no orders</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  subContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  order: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 60,
  },
});

export default UserProfile;
