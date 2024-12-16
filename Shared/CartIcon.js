import React from "react";
import { StyleSheet } from "react-native";
import { Badge, Text, Box } from "native-base";
import { connect } from "react-redux";

const CartIcon = (props) => {
  return (
    <Box style={styles.container}>
      {props.cartItems.length > 0 && (
        <Badge
          colorScheme="danger"
          rounded="full"
          style={styles.badge}
          _text={{
            fontSize: 12,
            fontWeight: "bold",
            color: "white",
          }}
        >
          {props.cartItems.length}
        </Badge>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems,
  };
};

const styles = StyleSheet.create({
  container: {
    position: "absolute", // Posiciona el badge sobre el ícono
    top: -10, // Ajusta el badge ligeramente hacia arriba
    right: -10, // Ajusta el badge a la derecha
    zIndex: 10, // Se asegura de que el badge esté sobre cualquier otro elemento
  },
  badge: {
    minWidth: 20, // Tamaño mínimo para que sea redondo
    height: 20, // Altura fija
    justifyContent: "center", // Centra el texto verticalmente
    alignItems: "center", // Centra el texto horizontalmente
    paddingHorizontal: 4, // Espaciado horizontal del texto
    backgroundColor: "red", // Color rojo para el fondo
  },
});

export default connect(mapStateToProps)(CartIcon);
