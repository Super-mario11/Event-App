import axios from "axios";

<<<<<<< HEAD
const apiUrl = import.meta.env.VITE_API_URL;
// const apiUrl = 'http://localhost:5000/api';
=======
// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = 'http://localhost:5000/api';
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (import.meta.env.MODE === "development") {
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.MODE === "development") {
    }
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized, redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;