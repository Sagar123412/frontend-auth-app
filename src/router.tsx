import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login/login";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Dashboard from "./layouts/Dashboard";
import HomePage from "./pages/HomePage/HomePage";
import User from "./pages/Users/User";
import Tenants from "./pages/tenants/Tenants";

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
                    {
                        path: 'users',
                        element: <User />,
                    },
                    {
                        path: 'restaurants',
                        element: <Tenants />
                    }
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