import { get, post, patch, put, del } from './api.js';

export async function getFichasMe() {
    const response = await get('/fichas/me');
    return response.data;
}

export async function listFichas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await get(`/fichas?${queryString}`);
    return response.data;
}

export async function getFicha(id) {
    const response = await get(`/fichas/${id}`);
    return response.data;
}

export async function createFicha(fichaData) {
    const response = await post('/fichas', {
        configuracao_agenda_id: fichaData.configAgendaId,
        data_atendimento: fichaData.dataAtendimento,
        tipo_cota: fichaData.tipoCota || 'NORMAL',
        justificativa: fichaData.justificativa,
    });
    
    return response.data;
}

export async function updateFichaStatus(id, newStatus) {
    const response = await patch(`/fichas/${id}/status`, {
        novo_status: newStatus,
    });
    
    return response.data;
}

export async function deleteFicha(id) {
    const response = await del(`/fichas/${id}`);
    return response.data;
}

export async function hardDeleteFicha(id) {
    const response = await del(`/fichas/${id}/hard`);
    return response.data;
}
