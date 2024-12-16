import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Box, VStack, HStack, Avatar, Text, Pressable } from "native-base";

const { width } = Dimensions.get("window");

const SearchedProduct = (props) => {
  const { productsFiltered } = props;

  return (
    <Box width={width} bg="white">
      {productsFiltered.length > 0 ? (
        <VStack space={4} px={4} py={2}>
          {productsFiltered.map((item) => (
            <Pressable
              key={item._id.$oid}
              onPress={() =>
                props.navigation.navigate("Product Detail", { item: item })
              }
              bg="gray.100"
              borderRadius="md"
              p={3}
            >
              <HStack space={4} alignItems="center">
                <Avatar
                  size="lg"
                  source={{
                    uri: item.image
                      ? item.image
                      : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                  }}
                />
                <VStack flex={1}>
                  <Text fontSize="md" bold>
                    {item.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {item.description}
                  </Text>
                </VStack>
              </HStack>
            </Pressable>
          ))}
        </VStack>
      ) : (
        <View style={styles.center}>
          <Text>No products match the selected criteria</Text>
        </View>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
});

export default SearchedProduct;
