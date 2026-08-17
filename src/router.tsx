import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login/login";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Dashboard from "./layouts/Dashboard";
import HomePage from "./pages/HomePage/HomePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
                children: [
                    {
                        path: '',
                        element: <HomePage />,
                    },
                ]
            },
            {
                path: "/auth",
                element: <NonAuth />,
                children: [
                    {
                        path: 'login',
                        element: <Login />,
                    },
                ]
            }
        ]
    },

]);