import { useState, useEffect } from 'react';
import * as ubsService from '../services/ubs.js';
import * as agendaService from '../services/agenda.js';
import { getErrorMessage } from '../utils/errors.js';
import { AppShell } from '../components/AppShell';
import { SectionCard } from '../components/SectionCard';
import { Button } from '../components/Button';
import { Building2, MapPin, Phone, Clock } from 'lucide-react';

export default function Ubs() {
  const [ubsList, setUbsList] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterEspecialidade, setFilterEspecialidade] = useState('');
  const [expandedUbs, setExpandedUbs] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ubsRes, agendasRes] = await Promise.all([
        ubsService.getUbs(),
        agendaService.listAgendas()
      ]);
      setUbsList(ubsRes || []);
      setAgendas(agendasRes || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getAgendasByUbs = (ubsId) => {
    return agendas.filter(a => a.ubs_id === ubsId);
  };

  const especialidades = Array.from(
    new Set(agendas.map(a => a.especialidade))
  ).sort();

  const filteredAgendas = filterEspecialidade
    ? agendas.filter(a => a.especialidade === filterEspecialidade)
    : agendas;

  if (loading) {
    return (
      <AppShell title="Carregando..." subtitle="">
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Agendas e UBS"
      subtitle="Consulte os horários disponíveis nas unidades básicas de saúde."
    >
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Filtro por Especialidade */}
      {especialidades.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Filtrar por Especialidade
          </label>
          <div className="flex gap-2 flex-wrap">
            {['', ...especialidades].map(esp => (
              <button
                key={esp}
                onClick={() => setFilterEspecialidade(esp)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filterEspecialidade === esp
                    ? 'bg-teal text-white'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {esp || 'Todas'} ({
                  (esp ? filteredAgendas : agendas).filter(a => !esp || a.especialidade === esp).length
                })
              </button>
            ))}
          </div>
        </div>
      )}

      {/* UBS e Agendas */}
      {ubsList.length === 0 ? (
        <SectionCard eyebrow="UBS" title="Nenhuma Unidade Encontrada">
          <div className="py-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma UBS cadastrada no sistema.</p>
          </div>
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {ubsList.map((ubs) => {
            const ubsAgendas = getAgendasByUbs(ubs.id).filter(
              a => !filterEspecialidade || a.especialidade === filterEspecialidade
            );
            
            if (ubsAgendas.length === 0 && filterEspecialidade) return null;

            return (
              <SectionCard
                key={ubs.id}
                eyebrow="UBS"
                title={ubs.nome}
                actions={
                  <button
                    onClick={() => setExpandedUbs(expandedUbs === ubs.id ? null : ubs.id)}
                    className="text-sm font-semibold text-teal hover:text-teal-deep"
                  >
                    {expandedUbs === ubs.id ? 'Fechar' : 'Expandir'}
                  </button>
                }
              >
                <div className="space-y-3">
                  {/* Informações da UBS */}
                  <div className="grid gap-3 text-sm">
                    {ubs.endereco && (
                      <div className="flex gap-2 items-start">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{ubs.endereco}</span>
                      </div>
                    )}
                    {ubs.telefone && (
                      <div className="flex gap-2 items-center">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{ubs.telefone}</span>
                      </div>
                    )}
                  </div>

                  {/* Agendas */}
                  {expandedUbs === ubs.id && (
                    <div className="pt-3 border-t space-y-2">
                      {ubsAgendas.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">
                          Nenhuma agenda disponível
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {ubsAgendas.map((agenda) => (
                            <div 
                              key={agenda.id} 
                              className="p-3 bg-secondary/50 rounded-lg border text-sm"
                            >
                              <div className="flex items-start justify-between mb-1">
                                <h5 className="font-semibold text-foreground">
                                  {agenda.especialidade}
                                </h5>
                                {agenda.profissional && (
                                  <span className="text-xs text-muted-foreground">
                                    Dra/Dr. {agenda.profissional}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                                {agenda.horario_inicio && (
                                  <div className="flex gap-1 items-center">
                                    <Clock className="w-3 h-3" />
                                    {agenda.horario_inicio} - {agenda.horario_fim}
                                  </div>
                                )}
                                {agenda.dias_semana && (
                                  <span>{agenda.dias_semana}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
