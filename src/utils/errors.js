export function getErrorMessage(error) {
    if (!error) return 'Erro desconhecido';
    
    if (typeof error === 'string') {
        return error;
    }

    if (error.message) {
        return error.message;
    }

    if (error.data?.message) {
        return error.data.message;
    }

    if (error.data?.errors && Array.isArray(error.data.errors)) {
        return error.data.errors
            .map(e => typeof e === 'string' ? e : e.message)
            .join(', ');
    }

    return 'Erro ao processar a requisição';
}

export function isAuthError(error) {
    return error?.status === 401;
}

export function isPermissionError(error) {
    return error?.status === 403;
}

export function isNotFoundError(error) {
    return error?.status === 404;
}

export function isConflictError(error) {
    return error?.status === 409;
}

export function isValidationError(error) {
    return error?.status === 400;
}

export function isUnprocessableError(error) {
    return error?.status === 422;
}

export function getFieldErrors(error) {
    if (!error?.data?.errors) return {};
    
    const fieldErrors = {};
    
    if (Array.isArray(error.data.errors)) {
        error.data.errors.forEach(err => {
            if (err.field) {
                fieldErrors[err.field] = err.message;
            }
        });
    }
    
    return fieldErrors;
}

export const HTTP_STATUS_MESSAGES = {
    400: 'Dados inválidos. Por favor, verifique sua entrada.',
    401: 'Sessão expirada. Por favor, faça login novamente.',
    403: 'Você não tem permissão para acessar este recurso.',
    404: 'Recurso não encontrado.',
    409: 'Conflito: Este registro pode já existir ou há violação de restrições.',
    422: 'Dados não podem ser processados. Verifique os valores inseridos.',
    500: 'Erro no servidor. Por favor, tente novamente mais tarde.',
};

export function getHttpStatusMessage(status) {
    return HTTP_STATUS_MESSAGES[status] || 'Erro na requisição';
}
