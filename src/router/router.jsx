import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../view/Login/login'
const routers = [
    {
        path: '/',
        element: <Navigate to="/login" replace />
    },
    {
        path: '/login',
        element: <Login />
    },
]
 
export default createBrowserRouter(routers)
 