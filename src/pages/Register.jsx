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

    const validateForm = () => {
        const errors = {};
        if (!form.nomeCompleto.trim()) errors.nomeCompleto = "Nome completo é obrigatório";
        if (!form.login.trim()) errors.login = "Login é obrigatório";
        if (!validateEmail(form.email)) errors.email = "E-mail inválido";
        if (!validatePassword(form.senha)) errors.senha = "Senha deve ter no mínimo 8 caracteres";
        if (form.senha !== form.confirmarSenha) errors.confirmarSenha = "As senhas não conferem";
        if (!validateCPF(form.cpf)) errors.cpf = "CPF deve ter 11 dígitos";
        if (!validateCNS(form.cns)) errors.cns = "CNS deve ter 15 dígitos";
        if (!validateCEP(form.cep)) errors.cep = "CEP deve ter 8 dígitos";
        if (!form.logradouro.trim()) errors.logradouro = "Logradouro é obrigatório";
        if (!form.bairro.trim()) errors.bairro = "Bairro é obrigatório";
        if (!form.municipio.trim()) errors.municipio = "Município é obrigatório";
        if (!validateUF(form.uf)) errors.uf = "UF inválido";
        return errors;
    };

    const handleCEPChange = async (cepValue) => {
        const cleanCEP = cepValue.replace(/\D/g, "");
        setForm(prev => ({ ...prev, cep: cleanCEP }));

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
                    setFieldErrors(prev => ({ ...prev, cep: "" }));
                }
            } catch (err) {
                console.error("Erro ao buscar CEP:", err);
            } finally {
                setCepLoading(false);
            }
        }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: "" }));
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
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {/* Bloco 1: Dados Pessoais - Cor Accent (Azul) */}
                <Section title="Dados pessoais" colorClass="text-accent border-accent/20">
                    <Row>
                        <Field
                            label="Nome completo"
                            name="nomeCompleto"
                            value={form.nomeCompleto}
                            onChange={handleInputChange}
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
                            maxLength={11}
                            value={form.cpf}
                            onChange={e => handleInputChange({ target: { name: "cpf", value: e.target.value.replace(/\D/g, "") } })}
                            disabled={loading}
                            placeholder="000.000.000-00"
                            mono
                            error={fieldErrors.cpf}
                            required
                        />
                        <Field
                            label="CNS · Cartão SUS"
                            name="cns"
                            maxLength={15}
                            value={form.cns}
                            onChange={e => handleInputChange({ target: { name: "cns", value: e.target.value.replace(/\D/g, "") } })}
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
                            disabled={loading}
                            placeholder="maria.silva"
                            error={fieldErrors.login}
                            required
                        />
                    </Row>
                </Section>

                {/* Bloco 2: Endereço - Cor Primary (Teal) */}
                {/* Linhas customizadas com larguras proporcionais para evitar texto escondido no desktop */}
                <Section title="Endereço" colorClass="text-primary border-primary/20">
                    <div className="grid gap-3 sm:grid-cols-[130px_1fr]">
                        <Field
                            label="CEP"
                            name="cep"
                            maxLength={8}
                            value={form.cep}
                            onChange={e => handleCEPChange(e.target.value)}
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
                            disabled={loading}
                            placeholder="RN"
                            mono
                            error={fieldErrors.uf}
                            required
                        />
                    </div>
                </Section>

                {/* Bloco 3: Configurações de Acesso - Cor Verde */}
                <Section title="Acesso" colorClass="text-green border-green/20">
                    <Row>
                        <Field
                            label="Senha"
                            type={showSenha ? "text" : "password"}
                            name="senha"
                            value={form.senha}
                            onChange={handleInputChange}
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

/* Componentes Estruturais Internos Modificados */
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
                    disabled={disabled}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`w-full rounded-xl border border-border bg-card pl-3.5 pr-10 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/15 ${mono ? "font-mono" : ""}`}
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