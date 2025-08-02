import axios from "axios";

const axiosInstance = axios.create({

    baseURL:`http://localhost:2432/api`,
    // baseURL: `https://api.zealweb.in/api`,
    

});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
