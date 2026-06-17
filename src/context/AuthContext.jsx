import { createContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.js';
import { ApiError } from '../services/api.js';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem('@UniFicha:user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    // Validar se o token ainda é válido
                    const isValid = await authService.validateToken();
                    if (isValid) {
                        setUser(userData);
                    } else {
                        localStorage.removeItem('@UniFicha:user');
                        localStorage.removeItem('@UniFicha:token');
                    }
                }
            } catch (err) {
                console.error('Erro ao inicializar autenticação:', err);
                localStorage.removeItem('@UniFicha:user');
                localStorage.removeItem('@UniFicha:token');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const signIn = async (credentials) => {
        try {
            setError(null);
            const userData = await authService.login(credentials.login, credentials.senha);
            
            // Armazenar dados do usuário (sem senha)
            const userToStore = {
                id: userData.id,
                nome_completo: userData.nome_completo,
                nome_social: userData.nome_social,
                email: userData.email,
                cpf: userData.cpf,
                perfis: userData.perfis,
            };
            
            setUser(userToStore);
            localStorage.setItem('@UniFicha:user', JSON.stringify(userToStore));
            
            return userToStore;
        } catch (err) {
            const message = err instanceof ApiError 
                ? err.message 
                : 'Erro ao fazer login';
            setError(message);
            throw err;
        }
    };

    const signUp = async (formData) => {
        try {
            setError(null);
            await authService.register(formData);
            return true;
        } catch (err) {
            const message = err instanceof ApiError 
                ? err.message 
                : 'Erro ao criar conta';
            setError(message);
            throw err;
        }
    };

    const signOut = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Erro ao fazer logout:', err);
        } finally {
            setUser(null);
            setError(null);
            localStorage.removeItem('@UniFicha:user');
            localStorage.removeItem('@UniFicha:token');
        }
    };

    const updatePassword = async (currentPassword, newPassword) => {
        try {
            setError(null);
            await authService.changePassword(currentPassword, newPassword);
            return true;
        } catch (err) {
            const message = err instanceof ApiError 
                ? err.message 
                : 'Erro ao alterar senha';
            setError(message);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            signed: !!user,
            loading,
            error,
            signIn,
            signUp,
            signOut,
            updatePassword,
            setError,
        }}>
            {children}
        </AuthContext.Provider>
    );
};