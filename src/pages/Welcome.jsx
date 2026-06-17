import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo.jsx";
import {
    ArrowRight,
    CheckCircle2,
    Stethoscope,
    ShieldCheck,
    Clock3,
    LaptopMinimalCheck,
    CalendarCheck2,
    Users,
    Tags
} from "lucide-react";

export default function Welcome() {
    return (
        <div className="min-h-screen bg-background">
            {/* Top hero */}
            <header className="relative overflow-hidden text-white bg-gradient-brand">
                <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_10%,white,transparent_45%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]" />

                <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <Logo variant="light" />
                    <nav className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="rounded-full px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
                        >
                            Entrar
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:shadow-md"
                        >
                            Criar conta
                        </Link>
                    </nav>
                </div>

                <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-12 md:grid-cols-2 md:pt-20">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                            <span className="size-1.5 rounded-full bg-white" /> Atenção Primária à Saúde · RN
                        </div>

                        <h1 className="font-display text-5xl font-extrabold leading-[1.05] md:text-6xl">
                            Saúde com acesso justo,<br />organizado em uma<br />
                            <span className="text-white/85">ficha digital.</span>
                        </h1>

                        <p className="mt-6 max-w-md text-base text-white/85">
                            Sua porta de entrada para o SUS de forma humana e segura. Emitimos sua ficha virtual vinculada territorialmente, eliminando as filas da madrugada e fraudes.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                to="/register"
                                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-soft"
                            >
                                Criar minha conta
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
                            >
                                Já tenho cadastro
                            </Link>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-white/80">
                            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4" /> Dados Protegidos</span>
                            <span className="inline-flex items-center gap-1.5"><LaptopMinimalCheck className="size-4" /> Fácil de Usar</span>
                            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4" /> Fila sem Fraudes</span>
                        </div>
                    </div>

                    {/* Floating ficha card */}
                    <div className="relative">
                        <div className="absolute -left-6 top-10 hidden h-40 w-40 rounded-full bg-white/10 blur-2xl md:block" />

                        <div className="relative mx-auto max-w-sm rounded-3xl bg-card p-5 text-card-foreground shadow-soft">
                            <div className="flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                <span>Vaga Reservada</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-verde-acesso/15 px-2 py-0.5 text-verde-acesso">
                  <CheckCircle2 className="size-3" /> Auditável
                </span>
                            </div>

                            <h3 className="mt-2 font-display text-lg font-extrabold">Cidadao Conectado</h3>

                            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                                <div>
                                    <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Unidade</div>
                                    <div className="font-mono text-sm font-semibold">UBS Bom Pastor</div>
                                </div>
                                <div>
                                    <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Turno</div>
                                    <div className="font-mono text-sm font-semibold">Manhã</div>
                                </div>
                                <div>
                                    <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Cota</div>
                                    <div className="font-mono text-sm font-semibold">Geral</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-3 rounded-2xl p-3 bg-gradient-brand">
                                <div className="grid size-14 place-items-center rounded-xl bg-white text-primary">
                                    <Stethoscope className="size-7" />
                                </div>
                                <div className="text-white">
                                    <div className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] opacity-80">Ficha Virtual Registrada</div>
                                    <div className="font-mono text-sm font-semibold">UF-BOMP-2026</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> Abertura dos portões: 07h</span>
                                <span>Atenção Primária</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Feature strip */}
            <section className="mx-auto max-w-6xl px-6 py-20">
                <div className="mb-10 flex items-end justify-between gap-6">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Gestão sociotécnica</div>
                        <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">Distribuição eficiente e integrada de vagas.</h2>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {[
                        {
                            icon: ShieldCheck,
                            title: "Prevenção a Fraudes",
                            desc: "Mecanismos com bloqueios transacionais baseados em hardware e rede para extinguir o cambismo ilegal de vagas físicas."
                        },
                        {
                            icon: CalendarCheck2,
                            title: "Territorialização Vinculada",
                            desc: "Validação unificada via CPF e Cartão do SUS que conecta o cidadão automaticamente à sua unidade de saúde de referência."
                        },
                        {
                            icon: Tags,
                            title: "Equidade de Cotas",
                            desc: "Parametrização dinâmica das janelas de atendimento para gerenciar de forma transparente as demandas gerais e prioritárias."
                        },
                        {
                            icon: Users,
                            title: "Apoio Comunitário Dedicado",
                            desc: "Não tem internet ou celular? Os agentes de saúde conseguem emitir e gerenciar a sua ficha diretamente pela plataforma deles."
                        },
                    ].map((f) => (
                        <div key={f.title} className="group rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-0.5">
                            <div className="mb-4 inline-grid size-11 place-items-center rounded-2xl text-white bg-gradient-brand">
                                <f.icon className="size-5" />
                            </div>
                            <h3 className="font-display text-lg font-bold">{f.title}</h3>
                            <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-card">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-8 text-xs text-muted-foreground">
                    <div className="space-y-2">
                        <Logo size={28} />
                        <p className="text-[11px] leading-relaxed opacity-70">
                            Anel Viário Contorno do Campus s/n - Capim Macio, Natal - RN, 59078-970<br />
                            Escola de Ciências e Tecnologia (ECT/UFRN)
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <span>contato.unificha@gmail.com</span>
                        <span>Transparência Pública</span>
                        <span>Privacidade Assegurada</span>
                    </div>
                    <div className="font-semibold">© 2026 UniFicha</div>
                </div>
            </footer>
        </div>
    );
}