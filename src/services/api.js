const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Erro na requisição');
    }

    return response.json();
}
