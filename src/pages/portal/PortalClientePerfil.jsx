import { useState } from 'react';
import { Save, Lock, LogOut, Eye, EyeOff, Check, AlertCircle, Shield, Clock, Bell, Mail } from 'lucide-react';

export default function PortalClientePerfil() {
  // Perfil
  const [perfil, setPerfil] = useState({
    nome: 'João Silva',
    email: 'joao@techcorp.com',
    empresa: 'TechCorp Ltda',
    telefone: '(11) 98765-4321',
  });

  // Segurança
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [senhaConfirm, setSenhaConfirm] = useState('');
  const [showSenhas, setShowSenhas] = useState(false);
  const [ultimoAcesso, setUltimoAcesso] = useState('2026-03-19 14:30:00');

  // Sessões
  const [sessoes, setSessoes] = useState([
    {
      id: 1,
      device: 'Chrome no Windows',
      ip: '192.168.1.100',
      location: 'São Paulo, BR',
      ultimaAtividade: '2026-03-19 14:30:00',
      atual: true,
    },
    {
      id: 2,
      device: 'Safari no iPhone',
      ip: '189.45.67.123',
      location: 'São Paulo, BR',
      ultimaAtividade: '2026-03-18 10:15:00',
      atual: false,
    },
    {
      id: 3,
      device: 'Chrome no Android',
      ip: '187.23.45.67',
      location: 'Rio de Janeiro, BR',
      ultimaAtividade: '2026-03-15 09:20:00',
      atual: false,
    },
  ]);

  // Notificações
  const [notificacoes, setNotificacoes] = useState({
    email_geral: true,
    email_mensagens: true,
    email_documentos: true,
    email_solicitacoes: true,
  });

  const [editingPerfil, setEditingPerfil] = useState(false);
  const [sucessoPerfil, setSucessoPerfil] = useState(false);
  const [sucessoSenha, setSucessoSenha] = useState(false);
  const [successNotif, setSuccessNotif] = useState(false);

  const handleSavePerfil = () => {
    setSucessoPerfil(true);
    setEditingPerfil(false);
    setTimeout(() => setSucessoPerfil(false), 3000);
  };

  const handleChangeSenha = () => {
    if (senhaNova !== senhaConfirm) {
      alert('Senhas não correspondem');
      return;
    }
    if (senhaNova.length < 10) {
      alert('Senha deve ter no mínimo 10 caracteres');
      return;
    }
    setSucessoSenha(true);
    setSenhaAtual('');
    setSenhaNova('');
    setSenhaConfirm('');
    setTimeout(() => setSucessoSenha(false), 3000);
  };

  const handleLogoutOtherSessions = () => {
    const novasSessoes = sessoes.filter((s) => s.atual);
    setSessoes(novasSessoes);
    alert('Outras sessões encerradas com sucesso');
  };

  const handleToggleNotificacao = (tipo) => {
    setNotificacoes((prev) => ({
      ...prev,
      [tipo]: !prev[tipo],
    }));
    setSuccessNotif(true);
    setTimeout(() => setSuccessNotif(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Perfil e Segurança</h1>
        <p className="text-[var(--text-secondary)]">Gerencie seus dados de acesso e configurações de segurança</p>
      </div>

      {/* ===== SEÇÃO 1: MEU PERFIL ===== */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Meu Perfil</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Informações básicas da sua conta</p>
          </div>
          {!editingPerfil && (
            <button
              onClick={() => setEditingPerfil(true)}
              className="px-4 py-2 border border-[var(--apsis-orange)] text-[var(--apsis-orange)] rounded-lg hover:bg-[var(--apsis-orange)]/5 transition-colors text-sm font-medium"
            >
              Editar
            </button>
          )}
        </div>

        {sucessoPerfil && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Perfil atualizado com sucesso</p>
              <p className="text-xs text-green-700 mt-0.5">Suas alterações foram salvas</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              Nome Completo
            </label>
            {editingPerfil ? (
              <input
                type="text"
                value={perfil.nome}
                onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
              />
            ) : (
              <p className="text-sm text-[var(--text-primary)]">{perfil.nome}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              E-mail
            </label>
            <p className="text-sm text-[var(--text-secondary)]">{perfil.email}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Não pode ser alterado</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              Empresa
            </label>
            {editingPerfil ? (
              <input
                type="text"
                value={perfil.empresa}
                onChange={(e) => setPerfil({ ...perfil, empresa: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
              />
            ) : (
              <p className="text-sm text-[var(--text-primary)]">{perfil.empresa}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              Telefone
            </label>
            {editingPerfil ? (
              <input
                type="tel"
                value={perfil.telefone}
                onChange={(e) => setPerfil({ ...perfil, telefone: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
              />
            ) : (
              <p className="text-sm text-[var(--text-primary)]">{perfil.telefone}</p>
            )}
          </div>
        </div>

        {editingPerfil && (
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <button
              onClick={handleSavePerfil}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--apsis-orange)] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
            >
              <Save size={16} />
              Salvar Alterações
            </button>
            <button
              onClick={() => setEditingPerfil(false)}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-2)] transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* ===== SEÇÃO 2: SEGURANÇA DA CONTA ===== */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Segurança da Conta</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Mantenha sua conta protegida</p>
        </div>

        {sucessoSenha && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Senha alterada com sucesso</p>
              <p className="text-xs text-green-700 mt-0.5">Use sua nova senha no próximo login</p>
            </div>
          </div>
        )}

        {/* Alterar Senha */}
        <div className="space-y-4 pb-6 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Alterar Senha</h3>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showSenhas ? 'text' : 'password'}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50 pr-10"
              />
              <button
                onClick={() => setShowSenhas(!showSenhas)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {showSenhas ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              Nova Senha
            </label>
            <input
              type={showSenhas ? 'text' : 'password'}
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              ✓ Mínimo 10 caracteres ✓ Letras maiúsculas ✓ Números ✓ Caracteres especiais
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              Confirmar Nova Senha
            </label>
            <input
              type={showSenhas ? 'text' : 'password'}
              value={senhaConfirm}
              onChange={(e) => setSenhaConfirm(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
            />
          </div>

          <button
            onClick={handleChangeSenha}
            className="px-4 py-2 bg-[var(--apsis-orange)] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
          >
            Atualizar Senha
          </button>
        </div>

        {/* Informações de Segurança */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Informações de Segurança</h3>

          <div className="flex items-start gap-3 p-4 bg-[var(--surface-2)] rounded-lg">
            <Clock size={18} className="text-[var(--apsis-orange)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">Último acesso</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{ultimoAcesso}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Verificação em duas etapas</p>
              <p className="text-xs text-blue-700 mt-1">Proteja sua conta adicionando uma camada extra de segurança</p>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2 underline">
                Ativar agora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SEÇÃO 3: SESSÕES ===== */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Sessões Ativas</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Dispositivos conectados na sua conta</p>
          </div>
          {sessoes.length > 1 && (
            <button
              onClick={handleLogoutOtherSessions}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              Encerrar Outras
            </button>
          )}
        </div>

        <div className="space-y-3">
          {sessoes.map((sessao) => (
            <div key={sessao.id} className={`p-4 rounded-lg border ${sessao.atual ? 'bg-green-50 border-green-200' : 'bg-[var(--surface-2)] border-[var(--border)]'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{sessao.device}</p>
                    {sessao.atual && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">Atual</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">IP: {sessao.ip}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Local: {sessao.location}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Última atividade: {sessao.ultimaAtividade}</p>
                </div>
                {!sessao.atual && (
                  <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium transition-colors">
                    Sair
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SEÇÃO 4: NOTIFICAÇÕES ===== */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Preferências de Notificação</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Controle como você recebe notificações</p>
        </div>

        {successNotif && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Preferências atualizadas</p>
              <p className="text-xs text-green-700 mt-0.5">Suas configurações foram salvas automaticamente</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Notificações Gerais */}
          <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-lg">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[var(--apsis-orange)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Todas as notificações</p>
                <p className="text-xs text-[var(--text-secondary)]">Receba e-mails sobre sua conta</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleNotificacao('email_geral')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificacoes.email_geral ? 'bg-[var(--apsis-orange)]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificacoes.email_geral ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notificações de Mensagens */}
          <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-lg">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-blue-500" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Novas mensagens</p>
                <p className="text-xs text-[var(--text-secondary)]">Receba notificações quando nossa equipe enviar mensagens</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleNotificacao('email_mensagens')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificacoes.email_mensagens ? 'bg-[var(--apsis-orange)]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificacoes.email_mensagens ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notificações de Documentos */}
          <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-lg">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-purple-500" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Novos documentos</p>
                <p className="text-xs text-[var(--text-secondary)]">Receba notificações quando documentos forem compartilhados</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleNotificacao('email_documentos')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificacoes.email_documentos ? 'bg-[var(--apsis-orange)]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificacoes.email_documentos ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notificações de Solicitações */}
          <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-lg">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Novas solicitações</p>
                <p className="text-xs text-[var(--text-secondary)]">Receba notificações sobre novas solicitações de serviço</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleNotificacao('email_solicitacoes')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificacoes.email_solicitacoes ? 'bg-[var(--apsis-orange)]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificacoes.email_solicitacoes ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}