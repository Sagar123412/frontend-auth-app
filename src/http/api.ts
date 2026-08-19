import type { CreateUserData, Credentials } from "../types";
import apiClient from "./client";


export const login = async (credentials: Credentials) => apiClient.post("/auth/login", credentials);
export const self = async () => apiClient.get("/auth/self");
export const logout = async () => apiClient.post("/auth/logout");

//get all users
export const getUsers = (queryString: string) => apiClient.get(`/users?${queryString}`);


//create a new user
export const createUser = (userData: CreateUserData) => apiClient.post('/users', userData);


//get all tenants
export const getTenants = () => apiClient.get('/tenants');