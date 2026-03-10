import api from "./api";

//Định nghĩa các hàm gọi API cụ thể
export const getCharacters = {
  // Lấy danh sách tất cả nhân vật
  getAll: async () => {
    const response = await api.get('/characters.php');
    return response.data;
  },
};

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/login.php', { username, password });
    return response.data; // Trả về { success: true, message: "...", user: {...} }
  },
  register: async (username, password) => {
    const response = await api.post('/register.php', { username, password });
    return response.data;
  }
};