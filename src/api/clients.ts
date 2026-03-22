import axios from "axios";

export const client = axios.create({
  baseURL: "/api/v1/",
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      await axios.post("/api/v1/auth/jwt/refresh/", null, { withCredentials: true });
      return client(original);
    }
    return Promise.reject(error);
  }
);
