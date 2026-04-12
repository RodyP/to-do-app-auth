import { useAuth } from "../Hooks/Context";
import { Navigate } from "react-router-dom";

function Private({ children }) {
    const { usuario, loading } = useAuth()

if(loading){
    return <h1>Cargando...</h1>
}

    return usuario ? children : <Navigate to={'/login'} />

}

export default Private;