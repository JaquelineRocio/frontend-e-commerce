import React from "react";
import { StyleSheet } from "react-native";
import { Box, HStack, VStack, Text, Image } from "native-base";

const CartItem = (props) => {
  const data = props.item.item;

  return (
    <Box
      style={styles.listItem}
      key={Math.random()}
      borderWidth={1}
      borderColor="gray.200"
      p={3}
    >
      <HStack alignItems="center" space={3}>
        <Image
          source={{
            uri: data.image
              ? data.image
              : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
          }}
          alt={data.name}
          size="md"
          borderRadius={5}
        />
        <VStack flex={1}>
          <Text bold fontSize="md">
            {data.name}
          </Text>
          <Text color="green.500" fontSize="sm">
            $ {data.price}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default CartItem;
