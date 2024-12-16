import { Platform } from "react-native";

let baseURL = "";

{
  Platform.OS == "android"
    ? (baseURL = "https://backend-e-commerce-h86m.onrender.com/api/v1/")
    : (baseURL = "");
}

export default baseURL;
