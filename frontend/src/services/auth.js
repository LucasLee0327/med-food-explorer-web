import api from "./axiosClient";

export const auth = {
  async getCsrf() {
    const {
      data: { csrfToken },
    } = await api.get("/csrf-token");
    return { csrfToken };
  }
};
