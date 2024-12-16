import React, { useEffect, useState, useContext } from "react";
import { View, Button, StyleSheet } from "react-native";
import {
  Box,
  VStack,
  Input,
  Select,
  CheckIcon,
  Text,
  useToast,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthGlobal from "../../../Context/store/AuthGlobal";
import { connect } from "react-redux";

const countries = require("../../../assets/countries.json");

const Checkout = (props) => {
  const context = useContext(AuthGlobal);
  const toast = useToast();

  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setOrderItems(props.cartItems);

    if (context.stateUser.isAuthenticated) {
      setUser(context.stateUser.user.sub);
    } else {
      props.navigation.navigate("Cart");
      toast.show({
        title: "Please Login to Checkout",
        status: "error",
        placement: "top",
      });
    }

    return () => {
      setOrderItems([]);
    };
  }, []);

  const checkOut = () => {
    const order = {
      city,
      country,
      dateOrdered: Date.now(),
      orderItems,
      phone,
      shippingAddress1: address,
      shippingAddress2: address2,
      status: "3",
      user,
      zip,
    };

    props.navigation.navigate("Payment", { order });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <Box p={4}>
        <VStack space={4}>
          <Text fontSize="lg" bold>
            Shipping Address
          </Text>
          <Input
            placeholder="Phone"
            keyboardType="numeric"
            value={phone}
            onChangeText={setPhone}
          />
          <Input
            placeholder="Shipping Address 1"
            value={address}
            onChangeText={setAddress}
          />
          <Input
            placeholder="Shipping Address 2"
            value={address2}
            onChangeText={setAddress2}
          />
          <Input placeholder="City" value={city} onChangeText={setCity} />
          <Input
            placeholder="Zip Code"
            keyboardType="numeric"
            value={zip}
            onChangeText={setZip}
          />
          <Select
            selectedValue={country}
            minWidth="200"
            placeholder="Select your country"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            onValueChange={(value) => setCountry(value)}
          >
            {countries.map((c) => (
              <Select.Item key={c.code} label={c.name} value={c.name} />
            ))}
          </Select>
          <Button title="Confirm" onPress={checkOut} />
        </VStack>
      </Box>
    </KeyboardAwareScrollView>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems,
  };
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "80%",
    alignItems: "center",
  },
});

export default connect(mapStateToProps)(Checkout);
