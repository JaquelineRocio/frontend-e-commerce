import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import TrafficLight from "./StyledComponents/TrafficLight";
import EasyButton from "./StyledComponents/EasyButton";
import Toast from "react-native-toast-message";

import * as SecureStore from "expo-secure-store";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";

const codes = [
  { name: "pending", code: "3" },
  { name: "shipped", code: "2" },
  { name: "delivered", code: "1" },
];

const OrderCard = (props) => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [statusText, setStatusText] = useState("");
  const [statusChange, setStatusChange] = useState("");
  const [cardColor, setCardColor] = useState("#FFFFFF");

  useEffect(() => {
    setOrderDetails();

    return () => {
      setOrderStatus(null);
      setStatusText("");
      setCardColor("#FFFFFF");
    };
  }, [props.status]);

  const setOrderDetails = () => {
    switch (props.status) {
      case "3":
        setOrderStatus(<TrafficLight unavailable />);
        setStatusText("pending");
        setCardColor("#E74C3C");
        break;
      case "2":
        setOrderStatus(<TrafficLight limited />);
        setStatusText("shipped");
        setCardColor("#F1C40F");
        break;
      case "1":
        setOrderStatus(<TrafficLight available />);
        setStatusText("delivered");
        setCardColor("#2ECC71");
        break;
      default:
        setOrderStatus(null);
        setStatusText("unknown");
        setCardColor("#FFFFFF");
    }
  };

  const updateOrder = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const order = {
        city: props.city,
        country: props.country,
        dateOrdered: props.dateOrdered,
        id: props.id,
        orderItems: props.orderItems,
        phone: props.phone,
        shippingAddress1: props.shippingAddress1,
        shippingAddress2: props.shippingAddress2,
        status: statusChange,
        totalPrice: props.totalPrice,
        user: props.user,
        zip: props.zip,
      };

      const res = await axios.put(
        `${baseURL}orders/${props.id}`,
        order,
        config
      );

      if (res.status === 200 || res.status === 201) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Order Edited",
        });
        setTimeout(() => {
          props.navigation.navigate("Products");
        }, 500);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  return (
    <View style={[{ backgroundColor: cardColor }, styles.container]}>
      <View>
        <Text>Order Number: #{props.id}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text>
          Status: {statusText} {orderStatus}
        </Text>
        <Text>
          Address: {props.shippingAddress1} {props.shippingAddress2}
        </Text>
        <Text>City: {props.city}</Text>
        <Text>Country: {props.country}</Text>
        <Text>Date Ordered: {props.dateOrdered.split("T")[0]}</Text>
        <View style={styles.priceContainer}>
          <Text>Price: </Text>
          <Text style={styles.price}>$ {props.totalPrice}</Text>
        </View>
        {props.editMode && (
          <View>
            <Picker
              mode="dropdown"
              iosIcon={<Icon color={"#007aff"} name="arrow-down" />}
              style={{ width: undefined }}
              selectedValue={statusChange}
              placeholder="Change Status"
              onValueChange={(e) => setStatusChange(e)}
            >
              {codes.map((c) => (
                <Picker.Item key={c.code} label={c.name} value={c.code} />
              ))}
            </Picker>
            <EasyButton secondary large onPress={updateOrder}>
              <Text style={{ color: "white" }}>Update</Text>
            </EasyButton>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  price: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OrderCard;
