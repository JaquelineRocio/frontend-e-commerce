import React, { useState, useEffect } from "react";
import { Image, StyleSheet, ScrollView } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  useToast,
} from "native-base";
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";

const SingleProduct = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailabilityText] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (item.countInStock === 0) {
      setAvailability(<TrafficLight unavailable />);
      setAvailabilityText("Unavailable");
    } else if (item.countInStock <= 5) {
      setAvailability(<TrafficLight limited />);
      setAvailabilityText("Limited Stock");
    } else {
      setAvailability(<TrafficLight available />);
      setAvailabilityText("Available");
    }
  }, [item]);

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView>
        <Box style={styles.imageContainer} shadow={2} borderRadius={10} m={4}>
          <Image
            source={{
              uri: item.image
                ? item.image
                : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
            }}
            style={styles.image}
          />
        </Box>
        <VStack space={3} px={5}>
          <Text fontSize="2xl" bold textAlign="center">
            {item.name}
          </Text>
          <Text fontSize="md" color="gray.500" textAlign="center">
            {item.brand}
          </Text>

          <HStack justifyContent="center" alignItems="center" space={2}>
            <Badge
              colorScheme={
                availabilityText === "Unavailable"
                  ? "danger"
                  : availabilityText === "Limited Stock"
                  ? "warning"
                  : "success"
              }
              rounded="full"
              px={4}
              py={1}
            >
              <Text color="gray.600">{availabilityText}</Text>
            </Badge>
            {availability}
          </HStack>

          <Box>
            <Text fontSize="sm" textAlign="justify" color="gray.600">
              {item.description}
            </Text>
          </Box>
        </VStack>
      </ScrollView>

      <HStack
        style={styles.footer}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text style={styles.price}>$ {item.price.toFixed(2)}</Text>
        <Button
          size="lg"
          colorScheme="primary"
          onPress={() => {
            props.addItemToCart(item.id);
            toast.show({
              title: "Added to Cart",
              description: `${item.name} was added successfully!`,
              status: "success",
              duration: 3000,
              placement: "top",
            });
          }}
        >
          Add to Cart
        </Button>
      </HStack>
    </Box>
  );
};

const mapToDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (product) =>
      dispatch(actions.addToCart({ quantity: 1, product })),
  };
};

const styles = StyleSheet.create({
  imageContainer: {
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E53E3E",
  },
});

export default connect(null, mapToDispatchToProps)(SingleProduct);
