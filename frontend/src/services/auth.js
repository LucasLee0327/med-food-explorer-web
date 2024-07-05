import api from "./axiosClient";

export const auth = {
  async getCsrf() {
    try {
      const { data: { csrfToken } } = await api.get("/csrf-token");
      console.log('CSRF Token:', csrfToken); // 在控制台顯示token
      return { csrfToken };
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return { csrfToken: null };
    }
  }
};
