import api from "./axiosClient";

export const auth = {
  async login({username, password}) {
    const { data: { isLoggedIn } } = await api.post("/login", { username, password });
    return { isLoggedIn };
  },
  async logout() {
    await api.post("/login/logout");
    return { isLoggedIn: false };
  },
  async statusOK() {
    const { data: { sessionStatus } } = await api.get("/session");
    return { sessionStatus };
  },
  async getCsrf() {
    const {
      data: { csrfToken },
    } = await api.get("/csrf-token");
    return { csrfToken };
  }
};
