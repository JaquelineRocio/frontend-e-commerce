import { configureStore } from "@reduxjs/toolkit";
import cartItemsReducer from "./Reducers/cartItem";

const store = configureStore({
  reducer: {
    cartItems: cartItemsReducer,
  },
});

export default store;
