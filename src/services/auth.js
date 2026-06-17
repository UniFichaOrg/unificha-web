import { post, patch, get, setAuthToken, del } from './api.js';

export async function login(login, senha) {
    const response = await post('/auth/login', { login, senha });
    
    if (response.data?.token) {
        setAuthToken(response.data.token);
    }
    
    return response.data;
}

export async function logout() {
    try {
        await post('/auth/logout');
    } finally {
        setAuthToken(null);
    }
}

export async function register(userData) {
    const response = await post('/usuarios/', {
        nome_completo: userData.nomeCompleto,
        nome_social: userData.nomeSocial,
        login: userData.login,
        cpf: userData.cpf,
        cns: userData.cns,
        email: userData.email,
        senha: userData.senha,
        logradouro: userData.logradouro,
        bairro: userData.bairro,
        cep: userData.cep,
        municipio: userData.municipio,
        uf: userData.uf,
    });
    
    return response.data;
}

export async function getCurrentUser() {
    const response = await get('/auth/me');
    return response.data;
}

export async function validateToken() {
    try {
        const response = await get('/auth/validate-token');
        return response.status === 'success';
    } catch {
        return false;
    }
}

export async function changePassword(currentPassword, newPassword) {
    const response = await patch('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
    });
    
    return response.data;
}

export async function forgotPassword(email) {
    const response = await post('/auth/forgot-password', { email });
    return response.data;
}

export async function resetPassword(token, newPassword) {
    const response = await post('/auth/reset-password', {
        reset_token: token,
        new_password: newPassword,
    });
    
    return response.data;
}
