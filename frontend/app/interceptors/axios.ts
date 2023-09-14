import axios from 'axios';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth } from '@/redux/authSlice';
import type { InternalAxiosRequestConfig } from 'axios';

export const authFetch = axios.create({
    baseURL: 'http://localhost:8000/api/',
    withCredentials: true,
    headers: { Accept: 'application/json' }
});

let refresh = false;


authFetch.interceptors.response.use(
    function (response) { return response; },
    async function (error) {
        if (error.response.status === 401 && !refresh) {
            refresh = true;
            const response = await authFetch.post('refresh/');
            if (response.status === 200) {
                authFetch.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
                localStorage.setItem('access_token', response.data.access_token);
                return authFetch.request(error.config);
            }
        }
    }
)

authFetch.interceptors.request.use(
    function (config) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
        return config;
    },
    function (error) {
        return Promise.reject(error);
    })

// authFetch.interceptors.response.use(response => response, async error => {
//     if (error.response.status === 401 && !refresh) {
//         refresh = true;
//         const response = await authFetch.post('refresh/');

//         if (response.status === 200) {
//             authFetch.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
//             return authFetch.request(error.config);
//         }
//     }
//     refresh = false;
//     return error;
// })