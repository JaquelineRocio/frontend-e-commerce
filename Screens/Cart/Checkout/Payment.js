import React, { useState } from "react";
import { View, Button } from "react-native";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Radio,
  Select,
  CheckIcon,
} from "native-base";

const methods = [
  { name: "Cash on Delivery", value: 1 },
  { name: "Bank Transfer", value: 2 },
  { name: "Card Payment", value: 3 },
];

const paymentCards = [
  { name: "Wallet", value: 1 },
  { name: "Visa", value: 2 },
  { name: "MasterCard", value: 3 },
  { name: "Other", value: 4 },
];

const Payment = (props) => {
  const order = props.route.params;

  const [selected, setSelected] = useState();
  const [card, setCard] = useState();

  return (
    <Box flex={1} bg="white" p={4}>
      {/* Header */}
      <Heading textAlign="center" mb={4}>
        Choose your payment method
      </Heading>

      {/* Payment Methods */}
      <VStack space={4}>
        {methods.map((item) => (
          <HStack
            key={item.value}
            alignItems="center"
            justifyContent="space-between"
            p={2}
            borderWidth={1}
            borderColor="gray.300"
            borderRadius="md"
          >
            <Text>{item.name}</Text>
            <Radio.Group
              name="paymentMethods"
              value={selected}
              onChange={(value) => setSelected(value)}
            >
              <Radio value={item.value} />
            </Radio.Group>
          </HStack>
        ))}
      </VStack>

      {/* Card Payment Options */}
      {selected === 3 && (
        <VStack mt={6} space={2}>
          <Text>Select Card</Text>
          <Select
            selectedValue={card}
            minWidth="200"
            accessibilityLabel="Choose Card"
            placeholder="Choose Card"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            onValueChange={(value) => setCard(value)}
          >
            {paymentCards.map((c) => (
              <Select.Item key={c.value} label={c.name} value={c.value} />
            ))}
          </Select>
        </VStack>
      )}

      {/* Confirm Button */}
      <View style={{ marginTop: 40, alignSelf: "center" }}>
        <Button
          title="Confirm"
          onPress={() => props.navigation.navigate("Confirm", { order })}
        />
      </View>
    </Box>
  );
};

export default Payment;
