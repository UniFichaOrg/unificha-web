import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/errors.js";
import { AuthShell } from "../components/AuthShell";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ login: "", senha: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await signIn(form);
            navigate("/home");
        } catch (err) {
            const message = getErrorMessage(err);
            setErrors({ general: message });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

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
            <form onSubmit={handleSubmit} className="space-y-5">
                {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-700">
                        {errors.general}
                    </div>
                )}

                <Field
                    label="CPF ou Nome de Usuário"
                    name="login"
                    value={form.login}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Ex: 000.000.000-00 ou seu_login"
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
                   type = "text",
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
                    required={required}
                    className="w-full rounded-xl border border-border bg-card pl-3.5 pr-10 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
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