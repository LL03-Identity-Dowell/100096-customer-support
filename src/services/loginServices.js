import axios from "axios";
import { CLIENT_ADMIN_URL, LOGIN_URL } from "../utils/utils";

const loginAxiosInstance = axios.create({
  baseURL: LOGIN_URL,
});

const clientAdminAxiosInstance = axios.create({
  baseURL: CLIENT_ADMIN_URL,
});

export const getUserInfoFromLogin = async (session_id) => {
  return await loginAxiosInstance.post("api/userinfo/", { session_id });
};

export const getUserInfoFromClientAdmin = async (session_id) => {
  return await clientAdminAxiosInstance.post("api/userinfo/", { session_id });
};
