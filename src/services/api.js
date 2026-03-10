import axios from 'axios';

const api = axios.create({
  // Vite yêu cầu tiền tố VITE_ để nhận biến môi trường
  baseURL: import.meta.env.VITE_API_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;

// Giữ nguyên các hàm authService, characterService bên dưới...