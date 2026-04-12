import { Link, useNavigate } from 'react-router-dom'
import { useState } from "react"
import { useAuth } from '../Hooks/Context'

function Register() {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [file, setFile] = useState(null)
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const { register } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault()
        const formData = new FormData()

        formData.append("email", email)
        formData.append("password", password)
        if (file) formData.append("picture", file)

        const res = await register(formData)

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
            <h1>Register</h1>
            <form onSubmit={handleRegister} className="form">
                <div className="input">
                    <label>Email:</label>
                    <input required type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input">
                    <label>Password:</label>
                    <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="input">
                    <label>Foto de perfil:</label>
                    <input style={{cursor:"pointer"}} type="file" name="picture" onChange={(e) => setFile(e.target.files[0])} />
                </div>
                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes uan cuenta? Inicia sesión <Link to='/login'>aquí</Link></p>
        </div>
    )
}

export default Register;