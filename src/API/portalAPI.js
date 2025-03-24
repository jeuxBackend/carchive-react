import axios from "axios";
import { BASE_URL } from "./constants";

const API = axios.create({
  baseURL: BASE_URL, 
  timeout: 60000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("CarchivePortalToken"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        localStorage.removeItem("CarchivePortalToken");
        window.location.href = "/";
      } else if (error.response?.status === 500) {
        console.error("Server error. Please try again later.");
      }
      return Promise.reject(error);
    }
  );
  

export default API;
