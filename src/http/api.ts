import type { Credentials } from "../types";
import apiClient from "./client";


export const login = async (credentials: Credentials) => apiClient.post("/auth/login", credentials);


