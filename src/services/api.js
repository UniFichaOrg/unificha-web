const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

function getAuthToken() {
    return localStorage.getItem('@UniFicha:token');
}

function setAuthToken(token) {
    if (token) {
        localStorage.setItem('@UniFicha:token', token);
    } else {
        localStorage.removeItem('@UniFicha:token');
    }
}

export async function request(path, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message || data?.error || 'Erro na requisição';
        throw new ApiError(message, response.status, data);
    }

    return data;
}

export async function get(path, options = {}) {
    return request(path, { ...options, method: 'GET' });
}

export async function post(path, body, options = {}) {
    return request(path, { ...options, method: 'POST', body: JSON.stringify(body) });
}

export async function put(path, body, options = {}) {
    return request(path, { ...options, method: 'PUT', body: JSON.stringify(body) });
}

export async function patch(path, body, options = {}) {
    return request(path, { ...options, method: 'PATCH', body: JSON.stringify(body) });
}

export async function del(path, options = {}) {
    return request(path, { ...options, method: 'DELETE' });
}

export { ApiError, getAuthToken, setAuthToken };
