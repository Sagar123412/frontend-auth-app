import axios from "axios";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL ?? "",
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});



export default apiClient;
