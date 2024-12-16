import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Button } from "react-native";
import { Box, HStack, VStack, Text, Image, Divider } from "native-base";
import { connect } from "react-redux";
import * as actions from "../../../Redux/Actions/cartActions";

import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";

const { width, height } = Dimensions.get("window");

const Confirm = (props) => {
  const finalOrder = props.route.params;

  const [productUpdate, setProductUpdate] = useState([]);

  useEffect(() => {
    if (finalOrder) {
      getProducts(finalOrder);
    }
    return () => {
      setProductUpdate([]);
    };
  }, [props]);

  const getProducts = (x) => {
    const order = x.order.order;
    let products = [];
    if (order) {
      order.orderItems.forEach((cart) => {
        axios
          .get(`${baseURL}products/${cart.product}`)
          .then((data) => {
            products.push(data.data);
            setProductUpdate([...products]);
          })
          .catch((e) => console.log(e));
      });
    }
  };

  const confirmOrder = () => {
    const order = finalOrder.order.order;
    axios
      .post(`${baseURL}orders`, order)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Completed",
            text2: "",
          });
          setTimeout(() => {
            props.clearCart();
            props.navigation.navigate("Cart");
          }, 500);
        }
      })
      .catch(() => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Box style={styles.titleContainer}>
        <Text fontSize="lg" bold>
          Confirm Order
        </Text>
        {props.route.params && (
          <Box borderWidth={1} borderColor="orange.300" p={4} borderRadius={8}>
            <Text fontSize="md" bold my={2}>
              Shipping to:
            </Text>
            <VStack space={2}>
              <Text>Address: {finalOrder.order.order.shippingAddress1}</Text>
              <Text>Address2: {finalOrder.order.order.shippingAddress2}</Text>
              <Text>City: {finalOrder.order.order.city}</Text>
              <Text>Zip Code: {finalOrder.order.order.zip}</Text>
              <Text>Country: {finalOrder.order.order.country}</Text>
            </VStack>
            <Divider my={4} />
            <Text fontSize="md" bold my={2}>
              Items:
            </Text>
            {productUpdate &&
              productUpdate.map((x) => (
                <Box
                  key={x.name}
                  borderWidth={1}
                  borderColor="gray.200"
                  borderRadius={8}
                  p={3}
                  my={2}
                >
                  <HStack alignItems="center" space={3}>
                    <Image
                      source={{ uri: x.image }}
                      alt={x.name}
                      size="sm"
                      borderRadius={5}
                    />
                    <VStack flex={1}>
                      <Text bold>{x.name}</Text>
                      <Text color="green.500" fontSize="sm">
                        $ {x.price}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
          </Box>
        )}
        <View style={{ alignItems: "center", margin: 20 }}>
          <Button title="Place order" onPress={confirmOrder} />
        </View>
      </Box>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
});

export default connect(null, mapDispatchToProps)(Confirm);
