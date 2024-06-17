import axios from "axios";

const api = axios.create({
  baseURL: "https://midterm-website-for-padn-v4-backend.onrender.com/api/v1",
  withCredentials: true,
});

export default api;
