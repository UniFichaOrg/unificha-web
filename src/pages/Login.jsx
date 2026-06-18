import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/errors.js";
import { formatCPF } from "../utils/formatters.js";
import { validateCPF, validatePassword } from "../utils/validators.js";
import { AuthShell } from "../components/AuthShell";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ login: "", senha: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateLoginForm = () => {
        const localErrors = {};
        const loginValue = form.login.trim();

        if (!loginValue) {
            localErrors.login = "CPF ou Nome de usuário é obrigatório";
        } else if (/^\d+/.test(loginValue.charAt(0))) {
            const cleanCPF = loginValue.replace(/\D/g, "");
            if (cleanCPF.length < 11 || !validateCPF(cleanCPF)) {
                localErrors.login = "CPF inválido ou incompleto";
            }
        } else if (loginValue.length < 3) {
            localErrors.login = "O usuário deve ter pelo menos 3 caracteres";
        }

        if (!form.senha) {
            localErrors.senha = "A senha é obrigatória";
        } else if (!validatePassword(form.senha)) {
            localErrors.senha = "A senha deve ter no mínimo 8 caracteres";
        }

        return localErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const localErrors = validateLoginForm();
        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            return;
        }

        setLoading(true);

        const cleanDigits = form.login.replace(/\D/g, "");
        const finalLogin = cleanDigits.length === 11 ? cleanDigits : form.login.trim();

        try {
            const idMaquina = localStorage.getItem('@UniFicha:machine_id');
            await signIn({ login: finalLogin, senha: form.senha, idMaquina });
            navigate("/home");
        } catch (err) {
            const message = getErrorMessage(err);
            setErrors({ general: message });
        } finally {
            setLoading(false);
        }
    };

    const handleLoginChange = (e) => {
        const { value } = e.target;
        const firstCharIsDigit = /^\d+$/.test(value.charAt(0));
        let processedValue = value;

        if (firstCharIsDigit) {
            const digits = value.replace(/\D/g, "").slice(0, 11);
            processedValue = formatCPF(digits);
        }

        setForm(prev => ({ ...prev, login: processedValue }));

        if (errors.login) {
            setErrors(prev => ({ ...prev, login: "" }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const isCPFInput = /^\d+$/.test(form.login.charAt(0));

    return (
        <AuthShell
            title="Entrar no UniFicha"
            subtitle="Use seu CPF ou login para acessar suas fichas e agendamentos."
            footer={
                <span>
                    Ainda não tem cadastro?{" "}
                    <Link to="/register" className="font-semibold text-primary hover:underline">
                        Criar conta
                    </Link>
                </span>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-700">
                        {errors.general}
                    </div>
                )}

                <Field
                    label="CPF ou Nome de Usuário"
                    name="login"
                    value={form.login}
                    onChange={handleLoginChange}
                    maxLength={isCPFInput ? 14 : undefined}
                    disabled={loading}
                    placeholder="Ex: 000.000.000-00 ou seu_login"
                    mono={isCPFInput}
                    error={errors.login}
                    required
                />

                <Field
                    label="Senha"
                    type={showPassword ? "text" : "password"}
                    name="senha"
                    value={form.senha}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="••••••••"
                    error={errors.senha}
                    required
                    icon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    }
                />

                <div className="flex items-center justify-between text-xs select-none">
                    <label className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
                        <input type="checkbox" className="rounded border-border accent-primary" />
                        Manter conectado
                    </label>
                    <Link to="/login" className="font-semibold text-accent hover:underline">
                        Esqueci a senha
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>

                <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground justify-center">
                    <CheckCircle2 className="size-3.5 text-green" />
                    Conexão segura · Validação transacional ativa
                </div>
            </form>
        </AuthShell>
    );
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
                <p className="mt-1 text-xs font-medium text-destructive animate-fade-in">
                    {error}
                </p>
            )}
        </div>
    );
}