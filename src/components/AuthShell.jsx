import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ShieldCheck, Accessibility, CheckCircle2 } from "lucide-react";

export function AuthShell({ title, subtitle, children, footer }) {
    return (
        <div className="grid min-h-screen md:grid-cols-[1.05fr_1fr]">
            <aside
                className="relative hidden overflow-hidden p-10 text-white md:flex md:flex-col md:justify-between bg-gradient-brand"
            >
                <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_15%_15%,white,transparent_45%),radial-gradient(circle_at_85%_85%,white,transparent_40%)]" />

                <Link to="/" className="relative z-10">
                    <Logo variant="light" />
                </Link>

                <div className="relative z-10 max-w-md">
                    <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                        Atenção Primária à Saúde · RN
                    </div>
                    <h2 className="font-display text-4xl font-extrabold leading-tight">
                        Sua ficha, seu horário,<br />seu direito.
                    </h2>
                    <p className="mt-4 max-w-sm text-sm text-white/85 leading-relaxed">
                        Acesso humanizado, previsível e seguro à saúde primária — em total conformidade com a LGPD.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-white/90">
                        <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4" /> Dados Protegidos</span>
                        <span className="inline-flex items-center gap-1.5"><Accessibility className="size-4" /> Fácil de Usar</span>
                        <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4" /> Fila sem Fraudes</span>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-white/70">
                    © 2026 UniFicha · Rede UBS · Brasil
                </div>
            </aside>

            <main className="flex flex-col bg-background px-6 py-10 md:px-14 md:py-14">
                <div className="mb-10 flex items-center justify-between md:hidden">
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>

                <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                        {title}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {subtitle}
                    </p>

                    <div className="mt-8">
                        {children}
                    </div>

                    {footer && (
                        <div className="mt-6 text-sm text-muted-foreground text-center">
                            {footer}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}