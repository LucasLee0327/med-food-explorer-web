import api from "./axiosClient";

export const auth = {
  async getCsrf() {
    try {
      const { data: { csrfToken } } = await api.get("/csrf-token");
      return { csrfToken };
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return { csrfToken: null };
    }
  }
};
