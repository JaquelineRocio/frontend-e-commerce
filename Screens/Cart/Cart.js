import React, { useContext, useEffect, useState } from "react";
import { View, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Box, VStack, HStack, Text, Heading, Button } from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/FontAwesome";

import CartItem from "./CartItem";
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import AuthGlobal from "../../Context/store/AuthGlobal";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

const { height, width } = Dimensions.get("window");

const Cart = (props) => {
  const context = useContext(AuthGlobal);
  const [productUpdate, setProductUpdate] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    getProducts();

    return () => {
      setProductUpdate([]);
      setTotalPrice(0);
    };
  }, [props.cartItems]);

  const getProducts = async () => {
    try {
      const products = await Promise.all(
        props.cartItems.map((cart) =>
          axios
            .get(`${baseURL}products/${cart.product}`)
            .then((res) => res.data)
        )
      );
      setProductUpdate(products);

      const total = products.reduce((acc, product) => acc + product.price, 0);
      setTotalPrice(total);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <Box flex={1} bg="white">
      {productUpdate.length ? (
        <VStack space={4}>
          {/* Header */}
          <Heading alignSelf="center" mt={4}>
            Cart
          </Heading>

          {/* SwipeListView */}
          <SwipeListView
            data={productUpdate}
            renderItem={(data) => <CartItem item={data} />}
            renderHiddenItem={(data) => (
              <View style={styles.hiddenContainer}>
                <TouchableOpacity
                  style={styles.hiddenButton}
                  onPress={() => props.removeFromCart(data.item)}
                >
                  <Icon name="trash" color={"white"} size={30} />
                </TouchableOpacity>
              </View>
            )}
            disableRightSwipe
            previewOpenDelay={3000}
            friction={1000}
            tension={40}
            leftOpenValue={75}
            stopLeftSwipe={75}
            rightOpenValue={-75}
          />

          {/* Bottom Container */}
          <HStack
            justifyContent="space-between"
            alignItems="center"
            px={4}
            py={2}
            bg="gray.100"
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            shadow={2}
          >
            <Text fontSize="lg" color="red">
              $ {totalPrice.toFixed(2)}
            </Text>
            <HStack space={2}>
              <Button colorScheme="red" onPress={() => props.clearCart()}>
                Clear
              </Button>
              {context.stateUser.isAuthenticated ? (
                <Button
                  colorScheme="blue"
                  onPress={() => props.navigation.navigate("Checkout")}
                >
                  Checkout
                </Button>
              ) : (
                <Button
                  colorScheme="gray"
                  onPress={() =>
                    props.navigation.navigate("User", { screen: "Login" })
                  }
                >
                  Login
                </Button>
              )}
            </HStack>
          </HStack>
        </VStack>
      ) : (
        <VStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          space={2}
          bg="gray.100"
        >
          <Text fontSize="lg">Looks like your cart is empty</Text>
          <Text fontSize="md">Add products to your cart to get started</Text>
        </VStack>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
    removeFromCart: (item) => dispatch(actions.removeFromCart(item)),
  };
};

const styles = StyleSheet.create({
  hiddenContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  hiddenButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 25,
    height: 70,
    width: width / 1.2,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
