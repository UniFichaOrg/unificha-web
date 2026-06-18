import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/errors.js";
import {
    validateCPF,
    validateCNS,
    validateEmail,
    validatePassword,
    validateCEP,
    validateUF
} from "../utils/validators.js";
import { formatCPF, formatCNS, formatCEP } from "../utils/formatters.js";
import { AuthShell } from "../components/AuthShell";
import { CheckCircle2, Eye, EyeOff, Loader } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [cepLoading, setCepLoading] = useState(false);

    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);

    const [form, setForm] = useState({
        nomeCompleto: "",
        nomeSocial: "",
        login: "",
        senha: "",
        confirmarSenha: "",
        email: "",
        cpf: "",
        cns: "",
        cep: "",
        logradouro: "",
        bairro: "",
        municipio: "",
        uf: ""
    });

    const validateField = (name, value) => {
        let errorMsg = "";

        switch (name) {
            case "nomeCompleto":
                if (!value.trim()) errorMsg = "Nome completo é obrigatório";
                break;
            case "login":
                if (!value.trim()) errorMsg = "Login é obrigatório";
                else if (value.trim().length < 3) errorMsg = "Login deve ter no mínimo 3 caracteres";
                break;
            case "email":
                if (!value.trim()) errorMsg = "E-mail é obrigatório";
                else if (!validateEmail(value)) errorMsg = "E-mail inválido";
                break;
            case "senha":
                if (!value) errorMsg = "Senha é obrigatória";
                else if (!validatePassword(value)) errorMsg = "Senha deve ter no mínimo 8 caracteres";
                break;
            case "confirmarSenha":
                if (!value) errorMsg = "Confirmação de senha é obrigatória";
                else if (value !== form.senha) errorMsg = "As senhas não conferem";
                break;
            case "cpf":
                if (!value) errorMsg = "CPF é obrigatório";
                else if (!validateCPF(value)) errorMsg = "CPF inválido ou incompleto";
                break;
            case "cns":
                if (!value) errorMsg = "CNS é obrigatório";
                else if (!validateCNS(value)) errorMsg = "CNS inválido (deve conter 15 dígitos)";
                break;
            case "cep":
                if (!value) errorMsg = "CEP é obrigatório";
                else if (!validateCEP(value)) errorMsg = "CEP inválido (deve conter 8 dígitos)";
                break;
            case "logradouro":
                if (!value.trim()) errorMsg = "Logradouro é obrigatório";
                break;
            case "bairro":
                if (!value.trim()) errorMsg = "Bairro é obrigatório";
                break;
            case "municipio":
                if (!value.trim()) errorMsg = "Município é obrigatório";
                break;
            case "uf":
                if (!value.trim()) errorMsg = "UF é obrigatória";
                else if (!validateUF(value)) errorMsg = "UF inválida";
                break;
            default:
                break;
        }

        setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const validateForm = () => {
        const errors = {};
        if (!form.nomeCompleto.trim()) errors.nomeCompleto = "Nome completo é obrigatório";
        if (!form.login.trim()) errors.login = "Login é obrigatório";
        else if (form.login.trim().length < 3) errors.login = "Login deve ter no mínimo 3 caracteres";

        if (!form.email.trim()) errors.email = "E-mail é obrigatório";
        else if (!validateEmail(form.email)) errors.email = "E-mail inválido";

        if (!form.senha) errors.senha = "Senha é obrigatória";
        else if (!validatePassword(form.senha)) errors.senha = "Senha deve ter no mínimo 8 caracteres";

        if (!form.confirmarSenha) errors.confirmarSenha = "Confirmação de senha é obrigatória";
        else if (form.senha !== form.confirmarSenha) errors.confirmarSenha = "As senhas não conferem";

        if (!form.cpf) errors.cpf = "CPF é obrigatório";
        else if (!validateCPF(form.cpf)) errors.cpf = "CPF inválido";

        if (!form.cns) errors.cns = "CNS é obrigatório";
        else if (!validateCNS(form.cns)) errors.cns = "CNS inválido";

        if (!form.cep) errors.cep = "CEP é obrigatório";
        else if (!validateCEP(form.cep)) errors.cep = "CEP inválido";

        if (!form.logradouro.trim()) errors.logradouro = "Logradouro é obrigatório";
        if (!form.bairro.trim()) errors.bairro = "Bairro é obrigatório";
        if (!form.municipio.trim()) errors.municipio = "Município é obrigatório";

        if (!form.uf.trim()) errors.uf = "UF é obrigatória";
        else if (!validateUF(form.uf)) errors.uf = "UF inválida";

        return errors;
    };

    const handleCEPChange = async (e) => {
        const rawValue = e.target.value;
        const cleanCEP = rawValue.replace(/\D/g, "").slice(0, 8);

        setForm(prev => ({ ...prev, cep: cleanCEP }));
        if (fieldErrors.cep) setFieldErrors(prev => ({ ...prev, cep: "" }));

        if (cleanCEP.length === 8) {
            setCepLoading(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
                const data = await response.json();
                if (data.erro) {
                    setFieldErrors(prev => ({ ...prev, cep: "CEP não encontrado" }));
                } else {
                    setForm(prev => ({
                        ...prev,
                        logradouro: data.logradouro || "",
                        bairro: data.bairro || "",
                        municipio: data.localidade || "",
                        uf: data.uf || ""
                    }));
                    setFieldErrors(prev => ({ ...prev, cep: "", logradouro: "", bairro: "", municipio: "", uf: "" }));
                }
            } catch (err) {
                console.error("Erro ao buscar CEP:", err);
                setFieldErrors(prev => ({ ...prev, cep: "Erro ao buscar CEP remoto" }));
            } finally {
                setCepLoading(false);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        if (name === "cpf" || name === "cns") {
            finalValue = value.replace(/\D/g, "");
        }
        if (name === "uf") {
            finalValue = value.toUpperCase().slice(0, 2);
        }

        setForm(prev => ({ ...prev, [name]: finalValue }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);
        try {
            await signUp(form);
            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            navigate("/login");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            title="Criar sua conta"
            subtitle="Cadastro rápido e seguro. Você poderá agendar fichas em qualquer UBS da sua rede."
            footer={
                <span>
                    Já possui conta?{" "}
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                        Entrar
                    </Link>
                </span>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                <Section title="Dados pessoais" colorClass="text-accent border-accent/20">
                    <Row>
                        <Field
                            label="Nome completo"
                            name="nomeCompleto"
                            value={form.nomeCompleto}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="Maria Aparecida Silva"
                            error={fieldErrors.nomeCompleto}
                            required
                        />
                        <Field
                            label="Nome social (opcional)"
                            name="nomeSocial"
                            value={form.nomeSocial}
                            onChange={handleInputChange}
                            disabled={loading}
                            placeholder="Maria"
                            error={fieldErrors.nomeSocial}
                        />
                    </Row>
                    <Row>
                        <Field
                            label="CPF"
                            name="cpf"
                            maxLength={14}
                            value={formatCPF(form.cpf)}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="000.000.000-00"
                            mono
                            error={fieldErrors.cpf}
                            required
                        />
                        <Field
                            label="CNS · Cartão SUS"
                            name="cns"
                            maxLength={18}
                            value={formatCNS(form.cns)}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="000 0000 0000 0000"
                            mono
                            error={fieldErrors.cns}
                            required
                        />
                    </Row>
                    <Row>
                        <Field
                            label="Email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="voce@email.com"
                            error={fieldErrors.email}
                            required
                        />
                        <Field
                            label="Apelido (login)"
                            name="login"
                            value={form.login}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="maria.silva"
                            error={fieldErrors.login}
                            required
                        />
                    </Row>
                </Section>

                <Section title="Endereço" colorClass="text-primary border-primary/20">
                    <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                        <Field
                            label="CEP"
                            name="cep"
                            maxLength={9}
                            value={formatCEP(form.cep)}
                            onChange={handleCEPChange}
                            onBlur={handleBlur}
                            disabled={loading || cepLoading}
                            placeholder="00000-000"
                            mono
                            error={fieldErrors.cep}
                            required
                            icon={cepLoading && <Loader className="size-3.5 animate-spin text-primary" />}
                        />
                        <Field
                            label="Logradouro"
                            name="logradouro"
                            value={form.logradouro}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="Rua, número, apartamento"
                            error={fieldErrors.logradouro}
                            required
                        />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_90px]">
                        <Field
                            label="Bairro"
                            name="bairro"
                            value={form.bairro}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="Centro"
                            error={fieldErrors.bairro}
                            required
                        />
                        <Field
                            label="Município"
                            name="municipio"
                            value={form.municipio}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="Natal"
                            error={fieldErrors.municipio}
                            required
                        />
                        <Field
                            label="UF"
                            name="uf"
                            maxLength={2}
                            value={form.uf}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="RN"
                            mono
                            error={fieldErrors.uf}
                            required
                        />
                    </div>
                </Section>

                <Section title="Acesso" colorClass="text-green border-green/20">
                    <Row>
                        <Field
                            label="Senha"
                            type={showSenha ? "text" : "password"}
                            name="senha"
                            value={form.senha}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="Mínimo 8 caracteres"
                            error={fieldErrors.senha}
                            required
                            icon={
                                <button type="button" onClick={() => setShowSenha(!showSenha)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                                    {showSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            }
                        />
                        <Field
                            label="Confirmar Senha"
                            type={showConfirmar ? "text" : "password"}
                            name="confirmarSenha"
                            value={form.confirmarSenha}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="Repita sua senha"
                            error={fieldErrors.confirmarSenha}
                            required
                            icon={
                                <button type="button" onClick={() => setShowConfirmar(!showConfirmar)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                                    {showConfirmar ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            }
                        />
                    </Row>
                </Section>

                <label className="flex items-start gap-2.5 rounded-xl bg-secondary p-3 text-xs text-muted-foreground cursor-pointer select-none">
                    <input type="checkbox" required className="mt-0.5 accent-primary" />
                    <span>
                        Concordo com os Termos de Uso e a Política de Privacidade (LGPD). Este dispositivo será registrado e vinculado à minha conta.
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? "Criando conta..." : "Criar conta"}
                </button>

                <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground justify-center">
                    <CheckCircle2 className="size-3.5 text-green" />
                    Ambiente 100% criptografado e em conformidade com as diretrizes do SUS.
                </div>
            </form>
        </AuthShell>
    );
}

/* Componentes Estruturais Internos */
function Section({ title, colorClass = "text-muted-foreground border-border", children }) {
    return (
        <div className="space-y-3 pt-2">
            <div className={`text-[0.7rem] font-bold uppercase tracking-[0.18em] border-b pb-1 ${colorClass}`}>
                {title}
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function Row({ children, className = "" }) {
    return <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>{children}</div>;
}

function Field({
                   label,
                   name,
                   value,
                   onChange,
                   onBlur,
                   disabled,
                   placeholder,
                   maxLength,
                   type = "text",
                   mono = false,
                   error,
                   icon,
                   required = false
               }) {
    return (
        <div className="block w-full">
            <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-0.5">
                {label}
                {required && <span className="text-destructive font-bold text-sm leading-none mt-0.5">*</span>}
            </div>
            <div className="relative flex items-center">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`w-full rounded-xl border bg-card pl-3.5 pr-10 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 ${
                        error
                            ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/15"
                            : "border-border focus:border-primary focus:ring-2 focus:ring-primary/15"
                    } ${mono ? "font-mono" : ""}`}
                />
                {icon && (
                    <div className="absolute right-3.5 flex items-center justify-center">
                        {icon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-xs font-medium text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}