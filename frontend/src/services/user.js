import api from "./axiosClient";

export const user = {
  async getAll() {
    const { data } = await api.get("/foods");
    return data;
  },
  async createOne({  }) {
    const { data } = await api.post("/foods", {  });
    return data;
  },
  async getOne() {
    const { data } = await api.get("/foods/profile");
    return data;
  },
  async uploadImage({ avatar }){
    const { data } = await api.post("/users/profile", { avatar });
    return data;
  },
  async getAllMess() {
    const { data } = await api.get("/posts");
    return data;
  },
  async poMessage(messageData) {
    const { data } = await api.post("/posts", messageData);
    return data;
  }, 
  async delMessage(messageId) {
    const { data } = await api.delete(`/posts/${messageId}`);
    return data;
  },
};
