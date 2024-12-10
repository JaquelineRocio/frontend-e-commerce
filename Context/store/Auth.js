import React, { useEffect, useReducer, useState } from "react";
import jwt_decode from "jwt-decode";
import * as SecureStore from "expo-secure-store";

import authReducer from "../reducers/Auth.reducer";
import { setCurrentUser } from "../actions/Auth.actions";
import AuthGlobal from "./AuthGlobal";

const Auth = (props) => {
  const [stateUser, dispatch] = useReducer(authReducer, {
    isAuthenticated: null,
    user: {},
  });
  const [showChild, setShowChild] = useState(false);

  // Función para obtener el token de forma segura
  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt");
      return token || "";
    } catch (error) {
      console.error("Error fetching token:", error);
      return "";
    }
  };

  useEffect(() => {
    let isMounted = true; // Controla si el componente sigue montado
    setShowChild(true);

    const checkToken = async () => {
      const jwt = await getToken(); // Obtiene el token almacenado
      if (jwt && isMounted) {
        const decoded = jwt_decode(jwt); // Decodifica el token
        dispatch(setCurrentUser(decoded)); // Establece el usuario actual
      }
    };

    checkToken();

    return () => {
      isMounted = false;
      setShowChild(false);
    };
  }, []);

  if (!showChild) {
    return null;
  } else {
    return (
      <AuthGlobal.Provider
        value={{
          stateUser,
          dispatch,
        }}
      >
        {props.children}
      </AuthGlobal.Provider>
    );
  }
};

export default Auth;
