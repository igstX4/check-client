import axios from 'axios';

const API_URL = 'https://checkplatform.ru/api';
export const SERVER_URL = 'https://checkplatform.ru';

// const API_URL = 'http://localhost:4000/api';
// export const SERVER_URL = 'http://localhost:4000';
// const API_URL = 'http://138.124.78.106/api';

// Инстанс для клиентских запросов
export const clientApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Инстанс для админских запросов
export const adminApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Интерцептор для клиентских запросов
clientApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('client');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Интерцептор для админских запросов
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Добавляем обработку ошибок авторизации


export default {
    client: clientApi,
    admin: adminApi
}; 