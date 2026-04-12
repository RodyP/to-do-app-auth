import { Link, useNavigate } from 'react-router-dom'
import { useState } from "react"
import { useAuth } from '../Hooks/Context'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login } = useAuth();


    const handleLogin = async (e) => {
        e.preventDefault()
        const res = await login(email, password)
        if (res.succes) {
            navigate('/tareas')
            setError('')
        } else {
            setError(res.mensaje)
        }
    }

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h1>Login</h1>
            <form onSubmit={handleLogin} className="form">
                <div className="input">
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
            <p>¿Aun no tienes cuenta? Registrate <Link to='/register'>aquí</Link></p>
        </div>
    )
}

export default Login