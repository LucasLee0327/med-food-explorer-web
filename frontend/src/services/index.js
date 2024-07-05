import { user } from "./user";
import { auth } from "./auth";
import api from "./axiosClient";

const services = {
  auth,
  user,
};

api.interceptors.request.use(
  async (config) => {
    const { csrfToken } = await auth.getCsrf();
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    } else {
      console.error('CSRF token not found!');
    }
    return config;
  },
  null,
  {
    runWhen: (config) =>
      ["post", "put", "patch", "delete"].includes(config.method),
  }
);

export default services;
