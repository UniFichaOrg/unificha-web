import { get, post, put, del } from './api.js';

export async function listAgendas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await get(`/agenda?${queryString}`);
    return response.data;
}

export async function getAgenda(id) {
    const response = await get(`/agenda/${id}`);
    return response.data;
}

export async function createAgenda(agendaData) {
    const response = await post('/agenda', {
        ubs_id: agendaData.ubsId,
        especialidade: agendaData.especialidade,
        horario_abertura: agendaData.horarioAbertura,
        horario_fechamento: agendaData.horarioFechamento,
        cota_geral: agendaData.cotaGeral,
        cota_prioritaria: agendaData.cotaPrioritaria,
        limite_fichas_por_cidadao: agendaData.limiteFichasPorCidadao || 3,
    });
    
    return response.data;
}

export async function updateAgenda(id, agendaData) {
    const response = await put(`/agenda/${id}`, {
        especialidade: agendaData.especialidade,
        horario_abertura: agendaData.horarioAbertura,
        horario_fechamento: agendaData.horarioFechamento,
        cota_geral: agendaData.cotaGeral,
        cota_prioritaria: agendaData.cotaPrioritaria,
        limite_fichas_por_cidadao: agendaData.limiteFichasPorCidadao,
    });
    
    return response.data;
}

export async function deleteAgenda(id) {
    const response = await del(`/agenda/${id}`);
    return response.data;
}

export async function hardDeleteAgenda(id) {
    const response = await del(`/agenda/${id}/hard`);
    return response.data;
}
