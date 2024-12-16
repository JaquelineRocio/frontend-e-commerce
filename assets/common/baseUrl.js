import { Platform } from "react-native";

let baseURL = "";

{
  Platform.OS == "android"
    ? (baseURL = "http://192.168.1.44:3000/api/v1/")
    : (baseURL = "");
}

export default baseURL;
