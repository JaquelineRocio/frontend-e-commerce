import React, { useState, useCallback } from "react";
import { View, FlatList, ActivityIndicator, Dimensions } from "react-native";
import { Box, Input, HStack, Text, Button } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import ListItem from "./ListItem";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import baseURL from "../../assets/common/baseUrl";

const { width } = Dimensions.get("window");

// Componente del encabezado de la lista
const ListHeader = () => {
  return (
    <Box
      bg="gray.200"
      py={2}
      px={4}
      flexDirection="row"
      justifyContent="space-between"
    >
      <Text fontWeight="700" width={width / 4}>
        Image
      </Text>
      <Text fontWeight="600" width={width / 6}>
        Brand
      </Text>
      <Text fontWeight="600" width={width / 6}>
        Name
      </Text>
      <Text fontWeight="600" width={width / 6}>
        Category
      </Text>
      <Text fontWeight="600" width={width / 6}>
        Price
      </Text>
    </Box>
  );
};

const Products = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchProducts = async () => {
        try {
          // Obtener token desde SecureStore
          const storedToken = await SecureStore.getItemAsync("jwt");
          setToken(storedToken || "");

          // Obtener productos
          const response = await axios.get(`${baseURL}products`);
          setProductList(response.data);
          setProductFilter(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error cargando productos:", error.message);
          setLoading(false);
        }
      };

      fetchProducts();

      return () => {
        setProductList([]);
        setProductFilter([]);
        setLoading(true);
      };
    }, [])
  );

  // Filtrar productos por búsqueda
  const searchProduct = (text) => {
    if (text === "") {
      setProductFilter(productList);
    } else {
      const filtered = productList.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      );
      setProductFilter(filtered);
    }
  };

  // Eliminar un producto
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${baseURL}products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedProducts = productList.filter((item) => item._id !== id);
      setProductList(updatedProducts);
      setProductFilter(updatedProducts);
    } catch (error) {
      console.error("Error eliminando producto:", error.message);
    }
  };

  return (
    <Box flex={1} bg="white">
      {/* Botones */}
      <HStack space={4} justifyContent="center" my={4}>
        <Button
          leftIcon={<Icon name="shopping-bag" size={18} color="white" />}
          onPress={() => props.navigation.navigate("Orders")}
          bg="blue.500"
        >
          Orders
        </Button>
        <Button
          leftIcon={<Icon name="plus" size={18} color="white" />}
          onPress={() => props.navigation.navigate("ProductForm")}
          bg="green.500"
        >
          Add Product
        </Button>
        <Button
          leftIcon={<Icon name="list" size={18} color="white" />}
          onPress={() => props.navigation.navigate("Categories")}
          bg="orange.500"
        >
          Categories
        </Button>
      </HStack>

      {/* Barra de búsqueda */}
      <HStack px={4} py={2} bg="gray.100" space={2} alignItems="center">
        <Icon name="search" size={18} color="gray" />
        <Input
          placeholder="Search"
          variant="unstyled"
          onChangeText={(text) => searchProduct(text)}
          flex={1}
        />
      </HStack>

      {/* Lista de productos */}
      {loading ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color="red" />
        </Box>
      ) : (
        <FlatList
          data={productFilter}
          ListHeaderComponent={ListHeader}
          renderItem={({ item, index }) => (
            <ListItem
              {...item}
              navigation={props.navigation}
              index={index}
              delete={() => deleteProduct(item._id)}
            />
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      )}
    </Box>
  );
};

export default Products;
