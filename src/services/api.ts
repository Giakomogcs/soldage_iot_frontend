import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://3.142.185.19:3333',
  baseURL: 'http://localhost:3333/',
});

export default api;
