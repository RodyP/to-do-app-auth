import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from './Context/AuthContext'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Private from './PrivateRoute/Private'
import Tarea from './Pages/Tarea'
import PrivateLogin from './PrivateRoute/PrivateLogin'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={
            <PrivateLogin>
              <Login />
            </PrivateLogin>
          } />
          <Route path='/register' element={<Register />} />
          <Route path='/tareas' element={
            <Private>
              <Tarea />
            </Private>
          } />
          <Route path='/' element={<Navigate to='/login' />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
