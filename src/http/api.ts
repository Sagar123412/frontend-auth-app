import type { Credentials } from "../types";
import apiClient from "./client";


export const login = async (credentials: Credentials) => apiClient.post("/auth/login", credentials);
export const self = async () => apiClient.get("/auth/self");
export const logout = async () => apiClient.post("/auth/logout");


