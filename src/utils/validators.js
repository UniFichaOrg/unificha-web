export function validateCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.length === 11 && /^\d+$/.test(cleaned);
}

export function validateCNS(cns) {
    const cleaned = cns.replace(/\D/g, '');
    return cleaned.length === 15 && /^\d+$/.test(cleaned);
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password) {
    return password && password.length >= 8;
}

export function validateCEP(cep) {
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.length === 8 && /^\d+$/.test(cleaned);
}

export function validateUF(uf) {
    const states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    return states.includes(uf.toUpperCase());
}

export function validateLogin(login) {
    return login && login.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(login);
}

export const validators = {
    cpf: validateCPF,
    cns: validateCNS,
    email: validateEmail,
    password: validatePassword,
    cep: validateCEP,
    uf: validateUF,
    login: validateLogin,
};
