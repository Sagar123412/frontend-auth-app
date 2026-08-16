import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login/login";
import App from "./App";

export const router = createBrowserRouter([
    {
        path: "/auth/login",
        element: <Login />
    },
    {
        path: "/",
        element: <App />
    }
]);