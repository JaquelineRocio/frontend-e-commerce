import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/Auth.actions";

const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (context.stateUser.isAuthenticated) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: "User Profile" }],
      });
    }
  }, [context.stateUser.isAuthenticated]);

  const validateForm = () => {
    if (!email || !password) {
      setError("Please fill in your credentials");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const user = { email, password };
      loginUser(user, context.dispatch);
    }
  };

  return (
    <FormContainer title="Login">
      <Input
        placeholder="Enter Email"
        name="email"
        id="email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text.toLowerCase())}
      />
      <Input
        placeholder="Enter Password"
        name="password"
        id="password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <EasyButton large primary onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </EasyButton>
      </View>
      <View style={[styles.buttonGroup, { marginTop: 40 }]}>
        <Text style={styles.middleText}>Don't have an account yet?</Text>
        <EasyButton
          large
          secondary
          onPress={() => props.navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
    fontSize: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Login;
