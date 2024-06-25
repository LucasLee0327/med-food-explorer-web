import api from "./axiosClient";

export const user = {
  async getAll(queryString) {
    const { data } = await api.get(`/foods?${queryString}`);
    return data;
  },
  async createOne(newRestaurant) {
    const { data } = await api.post("/foods", { newRestaurant });
    return data;
  },
  async draw(queryString) {
    const { data } = await api.get(`/foods/draw?${queryString}`);
    return data;
  },
  async getCandidates() {
    const { data } = await api.get("/foods/candidates");
    return data;
  },
  async createCandidate({ newCandidate }){
    const { data } = await api.post("/users/candidates", { newCandidate });
    return data;
  },
};
