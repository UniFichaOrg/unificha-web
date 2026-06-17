import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Fichas from '../pages/Fichas';
import Ubs from '../pages/Ubs';
import Profile from '../pages/Profile';
import ChangePassword from '../pages/ChangePassword';

export default function AppRoutes() {
    const { signed, loading } = useAuth();

    if (loading) return <div className="p-8 text-center">Carregando...</div>;

    return (
        <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={!signed ? <Login /> : <Navigate to="/home" />} />
            <Route path="/register" element={<Register />} />


            {/* Rotas Privadas */}
            {signed ? (
                <>
                    <Route path="/home" element={<Home />} />
                    <Route path="/fichas" element={<Fichas />} />
                    <Route path="/ubs" element={<Ubs />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </>
            ) : (
                <Route path="*" element={<Navigate to="/login" />} />
            )}
        </Routes>
    );
}