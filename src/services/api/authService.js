import axios from "axios";

// Функция для проверки авторизации
export const checkAuth = async () => {
  try {
    const response = await axios.get("/api/auth/verify");
    return response.data.isAuthenticated;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};

// Функция для логина
export const login = async (region) => {
  region = "eu";
  try {
    const response = await axios.get(
      `/api/login/${region}?redirect_url=${window.location.origin}/auth`
    );
    window.location.href = response.data.url;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Функция для логаута
export const logout = async () => {
  try {
    await axios.get("/api/logout", { withCredentials: true });
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};
export const profile = async () => {
  try {
    const response = await axios.get("/api/player");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const reset = async () => {
  const response = await axios.get("/api/reset");
  return response.data;
};
