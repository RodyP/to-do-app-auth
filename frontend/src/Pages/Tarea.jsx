import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "../axios/interceptor"
import { useEffect } from "react"
import { useAuth } from '../Hooks/Context';

// const urlApi = import.meta.env.VITE_URL_BACKEND

function Tarea() {
    const [tareas, setTareas] = useState([])
    const [nuevaTarea, setNuevaTarea] = useState('')
    const navigate = useNavigate()
    const [userN, setUserN] =useState('')
    // , token
    const { logout, usuario } = useAuth()
    // const defaultProfile = import.meta.env.VITE_DEFAULT_PROFILE

    useEffect(() => {
        const obtenerTareas = async () => {
            try {
                const tareas = await axios.get('/tarea')
                setTareas(tareas.data)
            } catch (err) {
                logout()
                alert(err.response.data.mensaje)
            }
        }
        const obtenerPerfil = async () => {
            try {
                const user = await axios.get(`/img/perfil/${usuario.id}`)
                setUserN(user.data)
                console.log(user.data.url)
            } catch (err) {
                console.log(err.message)
            }
        }
        obtenerTareas()
        obtenerPerfil()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const crearTarea = async (e) => {
        e.preventDefault()
        if (!nuevaTarea.trim()) return

        const crearTarea = await axios.post('/tarea', { titulo: nuevaTarea })
        setTareas([...tareas, crearTarea.data])
        setNuevaTarea('')
    }

    const handleToggle = async (id, estado) => {
        const updatedTarea = await axios.put(`/tarea/${id}`, { completada: !estado })
        setTareas(tareas.map(t => t._id == id ? updatedTarea.data : t))
    }

    const handleEliminar = async (id) => {
        setTareas(tareas.filter(t => t._id !== id));
        await axios.delete(`/tarea/${id}`);
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const deleteUser = async (id) => {
        try {
            handleLogout()
            await axios.delete(`/auth/deleteAcount/${id}`)
            alert("Usuario eliminado")
        } catch (err) {
            console.log(err.message)
        }
    }

    // <img alt="Foto Perfil" title="Foto Perfil" src={`${urlApi}/auth/profile/${token}`} style={{ width: "100px", borderRadius: "50%" }} />
    // <img alt="Foto Perfil" title="Foto Perfil" src={`http://192.168.88.46:5000/api/auth/profile/${usuario.id}`} style={{ width: "100px", borderRadius: "50%" }} />
    // <img alt="Foto Perfil" title="Foto Perfil" src={usuario.perfil !== "sin foto" ? usuario.perfil : defaultProfile} style={{ width: "100px", borderRadius: "50%" }} />
    return (
        <div style={{ paddingTop: "10px" }}>
            <div>
                <img alt="Foto Perfil" title="Foto Perfil" src={userN.url} style={{ width: "100px", borderRadius: "50%" }} />
            </div>
            <button onClick={handleLogout}>Cerrar sesion</button>
            <h1>Tareas de: </h1>
            <h2>{usuario?.email}</h2>
            <button onClick={() => deleteUser(usuario.id)}>Eliminar Cuenta</button>

            <form style={{ marginTop: "10px" }} onSubmit={crearTarea}>
                <input
                    type="text"
                    value={nuevaTarea}
                    onChange={(e) => setNuevaTarea(e.target.value)}
                    placeholder="Ingrese el titulo" />
                <button type="submit">Agregar</button>
            </form>

            <ul style={{ width: "250px", margin: "0 auto", padding: "0" }}>
                {tareas.map((tarea) => {
                    return (
                        <li key={tarea._id} style={{ listStyle: "none" }}>
                            <span onClick={() => handleToggle(tarea._id, tarea.completada)} style={{ cursor: "pointer", textDecoration: tarea.completada ? "line-through" : "none" }}>
                                {tarea.titulo}
                            </span>
                            <button style={{ cursor: "pointer" }} onClick={() => handleEliminar(tarea._id)}>Eliminar</button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Tarea