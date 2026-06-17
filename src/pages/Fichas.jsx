import { useState, useEffect } from 'react';
import * as fichasService from '../services/fichas.js';
import * as agendaService from '../services/agenda.js';
import { getErrorMessage } from '../utils/errors.js';
import { AppShell } from '../components/AppShell';
import { SectionCard } from '../components/SectionCard';
import { Button } from '../components/Button';
import { Dialog } from '../components/Dialog';
import { Field } from '../components/Field';
import { FileText, Plus, Trash2, Filter } from 'lucide-react';

export default function Fichas() {
  const [fichas, setFichas] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({ agenda_id: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fichasRes, agendasRes] = await Promise.all([
        fichasService.getFichasMe(),
        agendaService.listAgendas()
      ]);
      setFichas(fichasRes || []);
      setAgendas(agendasRes || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFicha = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fichasService.createFicha(formData);
      setOpenModal(false);
      setFormData({ agenda_id: '' });
      await loadData();
      alert('Ficha criada com sucesso!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFicha = async (id) => {
    if (!window.confirm('Deseja cancelar esta ficha?')) return;
    try {
      await fichasService.deleteFicha(id);
      await loadData();
      alert('Ficha cancelada com sucesso!');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const filteredFichas = filterStatus 
    ? fichas.filter(f => f.status === filterStatus)
    : fichas;

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
      title="Minhas Fichas"
      subtitle="Solicite, gerencie e acompanhe suas fichas de atendimento."
      actions={
        <Button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Solicitar Ficha
        </Button>
      }
    >
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['', 'PENDENTE', 'CONFIRMADA', 'CONCLUIDA', 'CANCELADA'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filterStatus === status
                ? 'bg-teal text-white'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            {status || 'Todas'} ({fichas.filter(f => !status || f.status === status).length})
          </button>
        ))}
      </div>

      {/* Lista de Fichas */}
      <SectionCard eyebrow="Fichas" title={`Total: ${filteredFichas.length}`}>
        {filteredFichas.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {filterStatus ? 'Nenhuma ficha encontrada com este status.' : 'Você ainda não tem fichas.'}
            </p>
            <Button onClick={() => setOpenModal(true)}>
              Solicitar Primeira Ficha
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFichas.map((ficha) => (
              <div key={ficha.id} className="p-4 border rounded-lg hover:bg-secondary/50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {ficha.agenda?.especialidade || 'Especialidade'}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ficha #{ficha.numero} • {ficha.agenda?.ubs || 'UBS'}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        ficha.status === 'PENDENTE' ? 'bg-amber-100 text-amber-700' :
                        ficha.status === 'CONFIRMADA' ? 'bg-blue-100 text-blue-700' :
                        ficha.status === 'CONCLUIDA' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {ficha.status}
                      </span>
                      {ficha.data_solicitacao && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(ficha.data_solicitacao).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  {ficha.status === 'PENDENTE' && (
                    <button
                      onClick={() => handleDeleteFicha(ficha.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Cancelar ficha"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Modal de Criação */}
      <Dialog
        open={openModal}
        onOpenChange={setOpenModal}
        title="Solicitar Nova Ficha"
      >
        <form onSubmit={handleCreateFicha} className="space-y-4">
          <Field 
            label="Selecione a Especialidade/UBS" 
            required
          >
            <select
              value={formData.agenda_id}
              onChange={(e) => setFormData({ agenda_id: e.target.value })}
              disabled={submitting}
              className="w-full bg-transparent text-sm outline-none"
            >
              <option value="">-- Selecione --</option>
              {agendas.map((agenda) => (
                <option key={agenda.id} value={agenda.id}>
                  {agenda.especialidade} - {agenda.ubs}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={submitting || !formData.agenda_id}
              isLoading={submitting}
              className="flex-1"
            >
              Solicitar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Dialog>
    </AppShell>
  );
}
