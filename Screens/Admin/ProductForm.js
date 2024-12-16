import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Platform, ScrollView } from "react-native";
import {
  Box,
  VStack,
  Input,
  Select,
  Button,
  Icon,
  WarningOutlineIcon,
  Text,
  Center,
} from "native-base";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import mime from "mime";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

const ProductForm = (props) => {
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [err, setError] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("jwt");
        setToken(storedToken || "");
        const res = await axios.get(`${baseURL}categories`);
        setCategories(res.data);
      } catch (error) {
        alert("Hubo un problema al cargar las categorías.");
      }
    };

    fetchInitialData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setMainImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const addProduct = async () => {
    if (
      !name ||
      !brand ||
      !price ||
      !description ||
      !category ||
      !countInStock
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const productData = {
      name,
      brand,
      price,
      description,
      category,
      countInStock,
      image: mainImage,
    };

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const endpoint = `${baseURL}products`;
      const res = await axios.post(endpoint, productData, config);

      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Producto añadido con éxito",
      });

      props.navigation.goBack();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Imagen */}
      <Box mt={5} alignItems="center">
        <Image
          style={styles.image}
          source={{ uri: mainImage || "https://via.placeholder.com/200" }}
        />
        <Button mt={3} colorScheme="primary" onPress={pickImage}>
          Seleccionar Imagen
        </Button>
      </Box>

      {/* Formulario */}
      <VStack space={4} px={4} mt={4}>
        <Input
          placeholder="Marca"
          value={brand}
          onChangeText={setBrand}
          style={styles.input}
        />
        <Input
          placeholder="Nombre del Producto"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Input
          placeholder="Precio"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
        />
        <Input
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
        <Input
          placeholder="Cantidad en Stock"
          keyboardType="numeric"
          value={countInStock}
          onChangeText={setCountInStock}
          style={styles.input}
        />

        <Select
          selectedValue={category}
          placeholder="Seleccionar Categoría"
          onValueChange={(value) => setCategory(value)}
          style={styles.select}
          _selectedItem={{
            bg: "teal.600",
            endIcon: <WarningOutlineIcon size="5" />,
          }}
        >
          {categories.map((c) => (
            <Select.Item key={c._id} label={c.name} value={c._id} />
          ))}
        </Select>

        {err ? <Text color="danger.500">{err}</Text> : null}

        {/* Botón de Confirmar */}
        <Button colorScheme="teal" mt={4} onPress={addProduct}>
          Confirmar
        </Button>
      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    flex: 1,
    width: "100%",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  input: {
    alignSelf: "center",
    height: 50, // Ajusta la altura de los inputs
    fontSize: 16,
  },
  select: {
    alignSelf: "center",
    height: 40, // Reduce la altura del Select
    paddingVertical: 0,
    fontSize: 16,
  },
});

export default ProductForm;
