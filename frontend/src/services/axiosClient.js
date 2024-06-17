import axios from "axios";

const api = axios.create({
  baseURL: "https://med-food-explorer-web-server.onrender.com/api/v1",
  withCredentials: true,
});

export default api;
