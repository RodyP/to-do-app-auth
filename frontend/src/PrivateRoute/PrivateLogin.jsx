import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/Context";

function PrivateLogin({ children }) {
    const { usuario } = useAuth()
    return usuario ? <Navigate to='/tareas' /> : children
}

export default PrivateLogin