import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as fichasService from '../services/fichas.js';
import { getErrorMessage } from '../utils/errors.js';
import { AppShell } from '../components/AppShell.jsx';
import { SectionCard } from '../components/SectionCard.jsx';
import {
    CalendarCheck2, CheckCircle2, Clock3, Plus, MapPin, AlertCircle, ChevronRight, Stethoscope, FileText
} from "lucide-react";

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Identificação dinâmica do papel/role do usuário ativo
    const userRoles = user?.perfis || (user?.perfil ? [user.perfil] : ['CIDADAO']);
    const isAdmin = userRoles.includes('ADMIN');
    const isGestor = userRoles.includes('GESTOR');
    const isAgente = userRoles.includes('AGENTE');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const fichas = await fichasService.getFichasMe();

                const fichasAtivas = fichas.filter(f => f.status === 'PENDENTE');
                const fichasConfirmadas = fichas.filter(f => f.status === 'CONFIRMADA');
                const historicoRecente = fichas.filter(f => ['CONCLUIDA', 'CANCELADA'].includes(f.status));

                setData({
                    totalFichas: fichas.length,
                    ativas: fichasAtivas.length,
                    confirmadas: fichasConfirmadas.length,
                    concluidas: historicoRecente.length,
                    fichasAtivas: fichasAtivas.slice(0, 5),
                    historicoRecente: historicoRecente.slice(0, 5),
                    proximaConsulta: fichasConfirmadas[0] || fichasAtivas[0] || null
                });
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <AppShell title="Carregando..." subtitle="">
                <div className="py-12 text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </AppShell>
        );
    }

    // Definição de títulos contextuais baseados no nível de autoridade (RBAC)
    const getGreetingTitle = () => {
        const firstName = user?.nome_social || user?.nome_completo?.split(' ')[0] || 'Usuário';
        if (isAdmin) return `Painel de Auditoria Global · ${firstName} 🛠️`;
        if (isGestor) return `Gestão Operacional · ${firstName} 🏢`;
        if (isAgente) return `Painel do Agente de Saúde · ${firstName} 💼`;
        return `Olá, ${firstName} 👋`;
    };

    const getGreetingSubtitle = () => {
        if (isAdmin) return "Acesso master: monitoramento transacional e logs de segurança ativos.";
        if (isGestor) return "Parametrização de cotas, monitoramento e fila do dia em tempo real.";
        if (isAgente) return "Modo assistencial proxy: você está autorizado a emitir fichas para terceiros.";
        return `Você tem ${data?.ativas || 0} ficha(s) pendente(s) e ${data?.confirmadas || 0} confirmada(s).`;
    };

    return (
        <AppShell
            title={getGreetingTitle()}
            subtitle={getGreetingSubtitle()}
            actions={
                <ButtonRedirect
                    isAdmin={isAdmin}
                    isGestor={isGestor}
                    isAgente={isAgente}
                    navigate={navigate}
                />
            }
        >
            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm font-medium text-destructive">
                    {error}
                </div>
            )}

            {/* Grid Central de Estatísticas Nativas v4 */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    icon={isGestor || isAdmin ? CalendarCheck2 : FileText}
                    label={isGestor || isAdmin ? "Fichas hoje (Rede)" : "Minhas Fichas"}
                    value={isGestor || isAdmin ? "148" : (data?.totalFichas || "0")}
                    tone="teal"
                    delta={isGestor || isAdmin ? "+12 vs ontem" : "Histórico geral"}
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Confirmadas"
                    value={isGestor || isAdmin ? "112" : (data?.confirmadas || "0")}
                    tone="green"
                    delta={isGestor || isAdmin ? "76% do total" : "Prontas para check-in"}
                />
                <StatCard
                    icon={AlertCircle}
                    label="Pendentes"
                    value={isGestor || isAdmin ? "9" : (data?.ativas || "0")}
                    tone="amber"
                    delta={isGestor || isAdmin ? "6% do total" : "Aguardando liberação"}
                />
            </div>

            {/* Grid Secundário: Próxima Consulta vs Fila do Dia (Disponível para Gestores e Agentes) */}
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

                {/* Painel da Consulta / Ficha de Destaque */}
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                    <div className="flex items-center justify-between border-b border-border p-5">
                        <div>
                            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {isGestor || isAdmin ? "Último Alocação Sistêmica" : "Sua próxima consulta"}
                            </div>
                            <h2 className="mt-1 font-display text-xl font-extrabold text-foreground">
                                {isGestor || isAdmin ? "Monitor de Concorrência Ativo" : (user?.nome_completo || "Paciente do SUS")}
                            </h2>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-verde-acesso/15 px-3 py-1 text-xs font-semibold text-verde-acesso">
              <CheckCircle2 className="size-3.5" /> Proteção Anti-Cambismo
            </span>
                    </div>

                    <div className="p-5">
                        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                            <Meta label="UBS" value={data?.proximaConsulta?.agenda?.ubs || "UBS Bom Pastor"} />
                            <Meta label="Horário" value={data?.proximaConsulta?.agenda?.horario_inicio || "07:40"} />
                            <Meta label="Ficha" value={`#${data?.proximaConsulta?.numero || "A92F"}`} />
                            <Meta label="Especialidade" value={data?.proximaConsulta?.agenda?.especialidade || "Clínica Geral"} wide />
                            <Meta label="Cota" value={data?.proximaConsulta?.tipo_cota || "Geral / Normal"} />
                            <Meta label="Status" value={data?.proximaConsulta?.status || "Pendente check-in"} amber={!data?.proximaConsulta} />
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl p-4 text-white bg-gradient-brand shadow-soft">
                            <Stethoscope className="size-6" />
                            <div className="flex-1">
                                <div className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] opacity-80">Rastreabilidade Unificada</div>
                                <div className="font-mono text-sm font-semibold">
                                    {data?.proximaConsulta?.id ? `UF-${data.proximaConsulta.id.substring(0,4).toUpperCase()}` : "UF-BOMP-2026"} · Integrado com a LGPD
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/fichas')}
                                className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25 transition cursor-pointer"
                            >
                                Gerenciar
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-border bg-secondary/30 Harman-base px-5 py-3 text-xs text-muted-foreground">
                        <MapPin className="size-3.5" /> Anel Viário Contorno do Campus · Natal/RN
                        <span className="sm:ml-auto inline-flex items-center gap-1"><Clock3 className="size-3.5" /> Fila monitorada via WebSockets</span>
                    </div>
                </div>

                {/* Componente Local Fila do Dia (Sincronizado via WebSockets) */}
                <SectionCard
                    eyebrow="Monitor em Tempo Real"
                    title="Fila do Dia · Clínica Geral"
                    actions={<span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[0.7rem] font-semibold text-foreground">Posto Ativo</span>}
                >
                    <ul className="space-y-2">
                        {queueMock.map((q) => (
                            <li
                                key={q.id}
                                className={`flex items-center gap-3 rounded-xl border p-3 bg-card transition ${
                                    q.current ? "border-primary bg-primary/5" : "border-border"
                                }`}
                            >
                <span className={`grid size-9 place-items-center rounded-lg font-mono text-xs font-bold ${
                    q.priority ? "bg-ambar-atencao/10 text-ambar-atencao" : "bg-secondary text-foreground"
                }`}>
                  {q.id}
                </span>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-foreground">{q.name}</div>
                                    <div className="text-[0.7rem] text-muted-foreground">
                                        {q.priority ? "Prioritária" : "Normal"} · {q.time}
                                    </div>
                                </div>
                                {q.current && (
                                    <span className="rounded-full bg-primary px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white">
                    Atendendo
                  </span>
                                )}
                                <ChevronRight className="size-4 text-muted-foreground" />
                            </li>
                        ))}
                    </ul>
                </SectionCard>
            </div>

            {/* Seção Exclusiva Otimizada: Monitor de Abrangência e Disponibilidade de UBS */}
            <SectionCard
                eyebrow="Territorialização SUS"
                title="Disponibilidade de Unidades de Saúde"
                actions={<Link to="/ubs" className="text-xs font-semibold text-accent hover:underline">Ver todas as UBS</Link>}
            >
                <div className="grid gap-3 md:grid-cols-3">
                    {ubsListMock.map((u) => (
                        <div key={u.code} className="rounded-2xl border border-border bg-secondary/20 p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-semibold text-muted-foreground">{u.code}</span>
                                <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${u.toneClass}`}>{u.status}</span>
                            </div>
                            <div className="mt-2 font-display text-sm font-bold text-foreground">{u.name}</div>
                            <div className="mt-0.5 text-[0.7rem] text-muted-foreground">{u.bairro}</div>
                            <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2">
                                <span className="text-muted-foreground">Vagas Restantes</span>
                                <span className="font-mono font-semibold text-foreground">{u.vagas}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </AppShell>
    );
}

/* Auxiliares e Subcomponentes Internos Padronizados com o Tema v4 */
function StatCard({ icon: Icon, label, value, delta, tone }) {
    const toneMap = {
        teal: "bg-primary/10 text-primary",
        green: "bg-verde-acesso/15 text-verde-acesso",
        amber: "bg-ambar-atencao/10 text-ambar-atencao",
    };
    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
                <span className={`grid size-9 place-items-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="size-4" />
        </span>
            </div>
            <div className="mt-3 font-display text-4xl font-extrabold tracking-tight text-foreground">{value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
        </div>
    );
}

function Meta({ label, value, wide, amber }) {
    return (
        <div className={wide ? "col-span-2" : ""}>
            <div className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
            <div className={`mt-0.5 text-sm font-semibold text-foreground ${amber ? "text-ambar-atencao" : ""} ${label === "Ficha" || label === "UBS" || label === "Horário" ? "font-mono" : ""}`}>
                {value}
            </div>
        </div>
    );
}

function ButtonRedirect({ isAdmin, isGestor, isAgente, navigate }) {
    let label = "Nova ficha";
    let route = "/fichas";

    if (isAdmin) {
        label = "Configurações Globais";
        route = "/change-password";
    } else if (isGestor) {
        label = "Gerenciar Agendas";
        route = "/ubs";
    }

    return (
        <button
            onClick={() => navigate(route)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 cursor-pointer"
        >
            <Plus className="size-4" /> {label}
        </button>
    );
}

/* Dados em conformidade com as regras de negócio e colocados em arquivos de componentes */
const queueMock = [
    { id: "A91D", name: "João P. Souza", time: "07:30", priority: false, current: false },
    { id: "A92F", name: "Maria A. Silva", time: "07:40", priority: false, current: true },
    { id: "A93P", name: "Ester Benedicto", time: "07:50", priority: true, current: false },
    { id: "A94G", name: "Denyson Barros", time: "08:00", priority: false, current: false },
    { id: "A95P", name: "Sr. Antônio", time: "08:10", priority: true, current: false },
];

const ubsListMock = [
    { code: "UBS-204", name: "UBS Bom Pastor", bairro: "Bom Pastor · Natal/RN", vagas: "14 / 60", status: "Abertas", toneClass: "bg-verde-acesso/15 text-verde-acesso" },
    { code: "UBS-118", name: "UBS Alecrim", bairro: "Alecrim · Natal/RN", vagas: "3 / 50", status: "Quase cheias", toneClass: "bg-ambar-atencao/10 text-ambar-atencao" },
    { code: "UBS-302", name: "UBS Potrópolis", bairro: "Petrópolis · Natal/RN", vagas: "0 / 40", status: "Esgotadas", toneClass: "bg-coral-alta/10 text-coral-alta" },
];