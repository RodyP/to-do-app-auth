import { useEffect, useState } from 'react';
import axios from '../axios/interceptor'
import { AuthContext } from '../Hooks/Context';


function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsuario(JSON.parse(storedUser))
        setToken(storedToken)
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const user = await axios.post(`/auth/login`, { email, password });
            const { usuario, token } = user.data
            localStorage.setItem("user", JSON.stringify(usuario))
            localStorage.setItem("token", token)
            setUsuario(usuario)
            setToken(token)
            return { succes: true }

        } catch (err) {
            return { succes: false, mensaje: err.response.data?.mensaje }
        }
    }

    const register = async (formData) => {
        try {
            const user = await axios.post(`/auth/register`, formData)
            const { usuario, token } = user.data
            localStorage.setItem("user", JSON.stringify(usuario))
            localStorage.setItem("token", token)
            setUsuario(usuario)
            setToken(token)
            return { succes: true }

        } catch (err) {

            return { succes: false, mensaje: err.response.data.mensaje }
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUsuario(null)
        setToken(null)
    }

    const value = {
        login,
        register,
        logout,
        usuario,
        token,
        loading
    }

    return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider;