import React, { useState, useCallback } from "react";
import { FlatList, ActivityIndicator, Dimensions } from "react-native";
import {
  NativeBaseProvider,
  Box,
  HStack,
  VStack,
  Input,
  Icon,
  Text,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

import ProductList from "./ProductList";
import SearchedProduct from "./SearchedProducts";
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
import baseURL from "../../assets/common/baseUrl";

const { height } = Dimensions.get("window");

const ProductContainer = (props) => {
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [active, setActive] = useState(-1);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);

      axios
        .get(`${baseURL}products`)
        .then((res) => {
          setProducts(res.data);
          setProductsFiltered(res.data);
          setProductsCtg(res.data);
          setInitialState(res.data);
          setLoading(false);
        })
        .catch(() => console.log("Error fetching products"));

      axios
        .get(`${baseURL}categories`)
        .then((res) => setCategories(res.data))
        .catch((e) => console.log("Error fetching categories:", e));

      return () => {
        setProducts([]);
        setProductsFiltered([]);
        setCategories([]);
        setProductsCtg([]);
        setInitialState([]);
        setFocus(false);
        setActive(-1);
      };
    }, [])
  );

  const searchProduct = (text) => {
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => setFocus(true);
  const onBlur = () => setFocus(false);

  const changeCtg = (ctg) => {
    if (ctg === "all") {
      setProductsCtg(initialState);
      setActive(-1);
    } else {
      setProductsCtg(products.filter((i) => i.category._id === ctg));
      setActive(categories.findIndex((cat) => cat._id === ctg));
    }
  };

  return (
    <NativeBaseProvider>
      {loading ? (
        <Box style={{ justifyContent: "center", alignItems: "center", height }}>
          <ActivityIndicator size="large" color="red" />
        </Box>
      ) : (
        <VStack flex={1}>
          {/* Search Bar */}
          <HStack
            space={2}
            alignItems="center"
            px={4}
            py={3}
            bg="white"
            borderBottomWidth={1}
            borderBottomColor="gray.200"
          >
            <Icon as={Ionicons} name="search" size="5" color="gray.500" />
            <Input
              placeholder="Search"
              variant="unstyled"
              flex={1}
              onFocus={openList}
              onChangeText={(text) => searchProduct(text)}
            />
            {focus && (
              <Icon
                as={Ionicons}
                name="ios-close"
                size="6"
                color="gray.500"
                onPress={onBlur}
              />
            )}
          </HStack>

          {focus ? (
            <SearchedProduct
              navigation={props.navigation}
              productsFiltered={productsFiltered}
            />
          ) : (
            <>
              <Banner />
              <Box
                style={{
                  marginBottom: 10,
                  height: 60, // Altura explícita para la sección de categorías
                }}
              >
                <CategoryFilter
                  categories={categories}
                  categoryFilter={changeCtg}
                  active={active}
                  setActive={setActive}
                />
              </Box>

              <FlatList
                data={productsCtg}
                keyExtractor={(item) => item._id}
                numColumns={2}
                renderItem={({ item }) => (
                  <Box style={styles.gridItem}>
                    <ProductList navigation={props.navigation} item={item} />
                  </Box>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </VStack>
      )}
    </NativeBaseProvider>
  );
};

const styles = {
  gridItem: {
    flexBasis: "48%", // Ancho automático para 2 columnas
    margin: "1%",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
};

export default ProductContainer;
