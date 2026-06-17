import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as usuariosService from '../services/usuarios.js';
import { getErrorMessage } from '../utils/errors.js';
import { validateEmail, validateCEP, validateUF } from '../utils/validators.js';
import { AppShell } from '../components/AppShell';
import { SectionCard } from '../components/SectionCard';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Mail, MapPin, Loader } from 'lucide-react';

export default function Profile() {
  const { user, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nomeCompleto: user?.nome_completo || '',
    nomeSocial: user?.nome_social || '',
    email: user?.email || '',
    cep: user?.cep || '',
    logradouro: user?.logradouro || '',
    bairro: user?.bairro || '',
    municipio: user?.municipio || '',
    uf: user?.uf || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCEPChange = async (cepValue) => {
    const cleanCEP = cepValue.replace(/\D/g, '');
    setForm(prev => ({ ...prev, cep: cleanCEP }));

    if (cleanCEP.length === 8) {
      setCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await response.json();
        if (data.erro) {
          setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }));
        } else {
          setForm(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            municipio: data.localidade,
            uf: data.uf
          }));
          setErrors(prev => ({ ...prev, cep: '' }));
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validateEmail(form.email)) {
      setErrors(prev => ({ ...prev, email: 'E-mail inválido' }));
      return;
    }

    if (form.cep && !validateCEP(form.cep)) {
      setErrors(prev => ({ ...prev, cep: 'CEP deve ter 8 dígitos' }));
      return;
    }

    if (form.uf && !validateUF(form.uf)) {
      setErrors(prev => ({ ...prev, uf: 'UF inválido' }));
      return;
    }

    setLoading(true);
    try {
      await usuariosService.updateUsuario(user.id, form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrors(prev => ({ ...prev, general: getErrorMessage(err) }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <AppShell
      title="Seu Perfil"
      subtitle="Gerencie suas informações pessoais e dados de contato."
    >
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">✓ Perfil atualizado com sucesso!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Dados Pessoais */}
        <SectionCard eyebrow="Perfil" title="Dados Pessoais">
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg border text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Aviso:</p>
              <p>CPF, CNS e Login não podem ser alterados. Estes dados são imutáveis por questões de segurança.</p>
            </div>

            <Field 
              label="Nome Completo" 
              error={errors.nomeCompleto}
            >
              <input
                type="text"
                name="nomeCompleto"
                value={form.nomeCompleto}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Seu nome completo"
              />
            </Field>

            <Field 
              label="Nome Social (Opcional)" 
              error={errors.nomeSocial}
            >
              <input
                type="text"
                name="nomeSocial"
                value={form.nomeSocial}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Seu nome social (se houver)"
              />
            </Field>

            <Field 
              label="E-mail" 
              icon={<Mail className="w-4 h-4" />}
              error={errors.email}
            >
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="seu@email.com"
              />
            </Field>
          </div>
        </SectionCard>

        {/* Endereço */}
        <SectionCard eyebrow="Endereço" title="Endereço Residencial">
          <div className="space-y-4">
            <Field 
              label="CEP" 
              icon={cepLoading ? <Loader className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              error={errors.cep}
            >
              <input
                type="text"
                maxLength={8}
                name="cep"
                value={form.cep}
                onChange={e => handleCEPChange(e.target.value)}
                disabled={loading || cepLoading}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="00000000"
              />
            </Field>

            <Field 
              label="Logradouro" 
              icon={<MapPin className="w-4 h-4" />}
              error={errors.logradouro}
            >
              <input
                type="text"
                name="logradouro"
                value={form.logradouro}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Rua, Avenida, etc"
              />
            </Field>

            <Field 
              label="Bairro" 
              icon={<MapPin className="w-4 h-4" />}
              error={errors.bairro}
            >
              <input
                type="text"
                name="bairro"
                value={form.bairro}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Seu bairro"
              />
            </Field>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Field 
                  label="Município" 
                  icon={<MapPin className="w-4 h-4" />}
                  error={errors.municipio}
                >
                  <input
                    type="text"
                    name="municipio"
                    value={form.municipio}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Seu município"
                  />
                </Field>
              </div>
              <Field 
                label="UF" 
                icon={<MapPin className="w-4 h-4" />}
                error={errors.uf}
              >
                <input
                  type="text"
                  maxLength={2}
                  name="uf"
                  value={form.uf}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full bg-transparent text-sm outline-none uppercase"
                  placeholder="RN"
                />
              </Field>
            </div>
          </div>
        </SectionCard>

        {/* Ações */}
        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={loading}
            isLoading={loading}
            className="flex-1"
          >
            Salvar Alterações
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/change-password')}
            className="flex-1"
          >
            Alterar Senha
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
