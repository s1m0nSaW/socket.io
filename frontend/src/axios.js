import axios from "axios";
//const api = '/api'; // нужно поменять перед деплоем
const local = 'http://localhost:5000';

const instance = axios.create({
    baseURL: local,
    headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');
    return config;
}, error => {
    console.log(error)
    return Promise.reject(error)
});

export default instance;