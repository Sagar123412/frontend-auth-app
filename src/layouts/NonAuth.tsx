import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../store";

function NonAuth() {
    const { user } = useAuthStore();
    const location = useLocation();

    if (user && user !== null) {
        const returningPath = new URLSearchParams(location.search).get('returnTo') || '/';
        return <Navigate to={returningPath} replace={true} />;
    }
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default NonAuth