import api from "./axiosClient";

export const user = {
  async getAll() {
    const { data } = await api.get("/foods");
    return data;
  },
  async createOne(newRestaurant) {
    const { data } = await api.post("/foods", { newRestaurant });
    return data;
  },
  async getOne() {
    const { data } = await api.get("/foods/profile");
    return data;
  },
  async uploadPic({ picture }){
    const { data } = await api.post("/users/profile", { picture });
    return data;
  },
};
