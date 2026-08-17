import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store";

function NonAuth() {
    const { user } = useAuthStore();

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div>
            <Outlet />
        </div>
    )
}

export default NonAuth