import axios from "axios";

const axiosInstance = axios.create({

  // baseURL:`https://b.zealweb.in:2432/api`,
    baseURL:`http://localhost:2432/api`,

});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
