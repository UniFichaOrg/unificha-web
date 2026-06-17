import { get, post, put, del } from './api.js';

export async function listUbs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await get(`/ubs?${queryString}`);
    return response.data;
}

export async function getUbs(id) {
    const response = await get(`/ubs/${id}`);
    return response.data;
}

export async function createUbs(ubsData) {
    const response = await post('/ubs', {
        nome: ubsData.nome,
        latitude: ubsData.latitude,
        longitude: ubsData.longitude,
        bairro: ubsData.bairro,
        municipio: ubsData.municipio,
        politica_atendimento: ubsData.politicaAtendimento,
    });
    
    return response.data;
}

export async function updateUbs(id, ubsData) {
    const response = await put(`/ubs/${id}`, {
        nome: ubsData.nome,
        latitude: ubsData.latitude,
        longitude: ubsData.longitude,
        bairro: ubsData.bairro,
        municipio: ubsData.municipio,
        politica_atendimento: ubsData.politicaAtendimento,
    });
    
    return response.data;
}

export async function deleteUbs(id) {
    const response = await del(`/ubs/${id}`);
    return response.data;
}
