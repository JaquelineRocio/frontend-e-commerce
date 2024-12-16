import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

const { width } = Dimensions.get("window");

const ListItem = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  console.log("Props recibidas en ListItem:", props);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                top: 5,
                right: 10,
              }}
            >
              <Icon name="close" size={20} />
            </TouchableOpacity>
            <EasyButton
              medium
              secondary
              onPress={() => {
                props.navigation.navigate("ProductForm", { item: props });
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Edit</Text>
            </EasyButton>
            <EasyButton
              medium
              danger
              onPress={() => {
                if (typeof props.delete === "function") {
                  props.delete(props._id);
                  setModalVisible(false);
                } else {
                  console.error("La función delete no está definida");
                }
              }}
            >
              <Text style={styles.textStyle}>Delete</Text>
            </EasyButton>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Product Detail", { item: props });
        }}
        onLongPress={() => setModalVisible(true)}
        style={[
          styles.container,
          { backgroundColor: props.index % 2 === 0 ? "white" : "gainsboro" },
        ]}
      >
        <Image
          source={{
            uri:
              props.image?.length > 0
                ? props.image
                : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
          }}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.item}>{props.brand || "Unknown Brand"}</Text>
        <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
          {props.name || "Unknown Name"}
        </Text>
        <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
          {props.category?.name || "No Category"}
        </Text>
        <Text style={styles.item}>$ {props.price || "0.00"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    width: width,
  },
  image: {
    borderRadius: 10,
    width: width / 4,
    height: width / 4,
    margin: 5,
  },
  item: {
    flexWrap: "wrap",
    margin: 3,
    width: width / 6,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ListItem;
