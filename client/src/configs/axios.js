import axios from "axios";
import { getServiceOrigin } from "./origins";

const redirectToLogin = () => {
  localStorage.clear();
  window.location.href = "/";
};
const client = axios.create({
  baseURL: getServiceOrigin(),
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  paramsSerializer(params) {
    const searchParams = new URLSearchParams();
    for (const key of Object.keys(params)) {
      const param = params[key];
      if (Array.isArray(param)) {
        for (const p of param) {
          searchParams.append(key, p);
        }
      } else if (params[key] !== null && params[key] !== undefined)
        searchParams.append(key, param);
    }
    return searchParams.toString();
  },
});

client.interceptors.request.use(
  async (config) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.access_token)
        config.headers.Authorization = `Bearer ${user.access_token}`;
    } catch {}
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
export default client;
