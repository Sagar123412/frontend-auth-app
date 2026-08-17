import axios from "axios";
import { useAuthStore } from "../store";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL ?? "",
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

const refreshToken = async () => {
    await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`,
        {},
        {
            withCredentials: true,
        }
    );
};


apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._isRetry) {
            try {
                originalRequest._isRetry = true;
                const headers = { ...originalRequest.headers };
                await refreshToken();
                return apiClient.request({ ...originalRequest, headers });
            } catch (err) {
                console.error('Token refresh error', err);
                useAuthStore.getState().logout();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);


export default apiClient;
