import { get, put, del } from './api.js';

export async function getUserProfile(id) {
    const response = await get(`/usuarios/${id}`);
    return response.data;
}

export async function updateUserProfile(id, userData) {
    const response = await put(`/usuarios/${id}`, {
        nome_completo: userData.nomeCompleto,
        nome_social: userData.nomeSocial,
        email: userData.email,
        logradouro: userData.logradouro,
        bairro: userData.bairro,
        cep: userData.cep,
        municipio: userData.municipio,
        uf: userData.uf,
    });
    
    return response.data;
}

export async function listUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await get(`/usuarios?${queryString}`);
    return response.data;
}

export async function deleteUser(id) {
    const response = await del(`/usuarios/${id}`);
    return response.data;
}
