import jwt_decode from "jwt-decode";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store"; // Importa SecureStore para reemplazar AsyncStorage
import baseURL from "../../assets/common/baseUrl";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

// Función para guardar datos de forma segura
const saveTokenToSecureStore = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error saving token to SecureStore:", error);
  }
};

// Función para obtener datos de forma segura
const getTokenFromSecureStore = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Error retrieving token from SecureStore:", error);
  }
};

// Función para eliminar datos de forma segura
const removeTokenFromSecureStore = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error removing token from SecureStore:", error);
  }
};

export const loginUser = (user, dispatch) => {
  fetch(`${baseURL}users/login`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        const token = data.token;
        // Guardamos el token de forma segura
        saveTokenToSecureStore("jwt", token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded, user));
      } else {
        logoutUser(dispatch);
      }
    })
    .catch((err) => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please provide correct credentials",
        text2: "",
      });
      logoutUser(dispatch);
    });
};

export const getUserProfile = async (id) => {
  const token = await getTokenFromSecureStore("jwt");
  fetch(`${baseURL}users/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Usa el token almacenado
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => {
      console.error("Error fetching user profile:", err);
    });
};

export const logoutUser = async (dispatch) => {
  // Eliminamos el token de SecureStore
  await removeTokenFromSecureStore("jwt");
  dispatch(setCurrentUser({}));
};

export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user,
  };
};
