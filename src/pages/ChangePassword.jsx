import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/errors.js';
import { validatePassword } from '../utils/validators.js';
import { AppShell } from '../components/AppShell';
import { SectionCard } from '../components/SectionCard';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarSenha: false
  });
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.senhaAtual) {
      newErrors.senhaAtual = 'Senha atual é obrigatória';
    }
    
    if (!validatePassword(form.novaSenha)) {
      newErrors.novaSenha = 'Senha deve ter no mínimo 8 caracteres';
    }
    
    if (form.novaSenha !== form.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não conferem';
    }
    
    if (form.senhaAtual === form.novaSenha) {
      newErrors.novaSenha = 'Nova senha deve ser diferente da atual';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await updatePassword(form.senhaAtual, form.novaSenha);
      setSuccess(true);
      setForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setErrors(prev => ({ ...prev, general: getErrorMessage(err) }));
    } finally {
      setLoading(false);
    }
  };

  const toggleShow = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
      title="Alterar Senha"
      subtitle="Atualize sua senha de forma segura."
    >
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">✓ Senha alterada com sucesso! Redirecionando...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <SectionCard eyebrow="Segurança" title="Alterar Senha">
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg border text-sm text-muted-foreground">
              <p>Use uma senha com no mínimo 8 caracteres para maior segurança.</p>
            </div>

            <Field 
              label="Senha Atual" 
              icon={<Lock className="w-4 h-4" />}
              error={errors.senhaAtual}
              required
            >
              <input
                type={showPasswords.senhaAtual ? 'text' : 'password'}
                name="senhaAtual"
                value={form.senhaAtual}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Digite sua senha atual"
              />
              <button
                type="button"
                onClick={() => toggleShow('senhaAtual')}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                {showPasswords.senhaAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </Field>

            <Field 
              label="Nova Senha" 
              icon={<Lock className="w-4 h-4" />}
              error={errors.novaSenha}
              required
            >
              <input
                type={showPasswords.novaSenha ? 'text' : 'password'}
                name="novaSenha"
                value={form.novaSenha}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Digite sua nova senha"
              />
              <button
                type="button"
                onClick={() => toggleShow('novaSenha')}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                {showPasswords.novaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </Field>

            <Field 
              label="Confirmar Nova Senha" 
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmarSenha}
              required
            >
              <input
                type={showPasswords.confirmarSenha ? 'text' : 'password'}
                name="confirmarSenha"
                value={form.confirmarSenha}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Confirme sua nova senha"
              />
              <button
                type="button"
                onClick={() => toggleShow('confirmarSenha')}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                {showPasswords.confirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </Field>
          </div>
        </SectionCard>

        {/* Ações */}
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading}
            isLoading={loading}
            className="flex-1"
          >
            Salvar Nova Senha
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/profile')}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
