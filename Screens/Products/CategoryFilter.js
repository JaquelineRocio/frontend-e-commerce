import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Badge, Text, HStack } from "native-base";

const CategoryFilter = (props) => {
  console.log("CategoryFilter props:", props);

  return (
    <ScrollView
      bounces={true}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor: "#f2f2f2" }}
    >
      <HStack space={2} px={4} py={2}>
        {/* Opción ALL */}
        <TouchableOpacity
          onPress={() => {
            console.log("All pressed");
            props.categoryFilter("all");
            props.setActive(-1);
          }}
        >
          <Badge
            variant={props.active === -1 ? "solid" : "subtle"}
            colorScheme={props.active === -1 ? "blue" : "coolGray"}
          >
            <Text style={{ color: props.active === -1 ? "white" : "black" }}>
              All
            </Text>
          </Badge>
        </TouchableOpacity>

        {/* Opciones de Categoría */}
        {props.categories.map((item, index) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => {
              console.log("Category pressed:", item.name);
              props.categoryFilter(item._id);
              props.setActive(index);
            }}
          >
            <Badge
              variant={props.active === index ? "solid" : "subtle"}
              colorScheme={props.active === index ? "blue" : "coolGray"}
            >
              <Text
                style={{ color: props.active === index ? "white" : "black" }}
              >
                {item.name}
              </Text>
            </Badge>
          </TouchableOpacity>
        ))}
      </HStack>
    </ScrollView>
  );
};

export default CategoryFilter;
