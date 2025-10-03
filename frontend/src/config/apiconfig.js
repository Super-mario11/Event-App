import axios from "axios";

// Use environment variable (works in Vite or CRA)
const apiUrl =
  import.meta.env?.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response Error:", error);
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized, redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
