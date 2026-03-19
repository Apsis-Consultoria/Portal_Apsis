import { useState, useEffect } from 'react';
import { Mail, MailCheck, AlertCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ClientEmailSection = ({ workspace, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email_principal: workspace?.email_principal || '',
    email_secundario: workspace?.email_secundario || '',
    notificacoes_ativas: workspace?.notificacoes_ativas ?? true,
  });

  const handleSave = async () => {
    if (workspace?.id) {
      try {
        await base44.entities.ClientWorkspace.update(workspace.id, formData);
        setEditMode(false);
        onUpdate?.();
      } catch (error) {
        console.error('Erro ao salvar configuração:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">E-mail e Notificações</h3>
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors"
        >
          {editMode ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {!editMode ? (
        <div className="space-y-3">
          {/* Email Principal */}
          <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={16} className="text-[var(--apsis-orange)]" />
              <p className="text-sm font-medium text-[var(--text-secondary)]">E-mail Principal</p>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{workspace?.email_principal || 'Não configurado'}</p>
          </div>

          {/* Email Secundário */}
          {workspace?.email_secundario && (
            <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-gray-400" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">E-mail Secundário</p>
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{workspace.email_secundario}</p>
            </div>
          )}

          {/* Status Notificações */}
          <div className={`rounded-lg p-4 border ${workspace?.notificacoes_ativas ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {workspace?.notificacoes_ativas ? (
                  <MailCheck size={16} className="text-green-600" />
                ) : (
                  <EyeOff size={16} className="text-gray-500" />
                )}
                <p className="text-sm font-medium">
                  {workspace?.notificacoes_ativas ? (
                    <span className="text-green-700">✓ Notificações Ativas</span>
                  ) : (
                    <span className="text-gray-700">Notificações Desabilitadas</span>
                  )}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {workspace?.notificacoes_ativas
                ? 'Cliente receberá notificações sobre interações relevantes'
                : 'Cliente não receberá notificações por e-mail'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Editar Email Principal */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">E-mail Principal *</label>
            <input
              type="email"
              value={formData.email_principal}
              onChange={(e) => setFormData({ ...formData, email_principal: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
            />
          </div>

          {/* Editar Email Secundário */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">E-mail Secundário (opcional)</label>
            <input
              type="email"
              value={formData.email_secundario}
              onChange={(e) => setFormData({ ...formData, email_secundario: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
            />
          </div>

          {/* Toggle Notificações */}
          <div className="flex items-center justify-between bg-[var(--surface-2)] p-3 rounded-lg border border-[var(--border)]">
            <label className="text-sm font-medium text-[var(--text-primary)]">Habilitar Notificações</label>
            <button
              onClick={() => setFormData({ ...formData, notificacoes_ativas: !formData.notificacoes_ativas })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.notificacoes_ativas
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {formData.notificacoes_ativas ? 'Ativo' : 'Inativo'}
            </button>
          </div>

          {/* Botões Ação */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-[var(--apsis-orange)] text-white rounded-lg font-medium hover:bg-[var(--apsis-orange)]/90 transition-colors"
            >
              Salvar Alterações
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 px-4 py-2 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg font-medium hover:bg-[var(--surface-2)] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EmailHistorySection = ({ workspaceId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const result = await base44.entities.EmailNotifications.filter(
          { context_id: workspaceId },
          '-created_date',
          5
        );
        setNotifications(result || []);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      loadNotifications();
    }
  }, [workspaceId]);

  const eventTypeLabels = {
    mensagem: '💬 Mensagem',
    documento: '📄 Documento',
    solicitacao: '📝 Solicitação',
  };

  const statusColors = {
    enviada: 'bg-green-100 text-green-700',
    pendente: 'bg-amber-100 text-amber-700',
    erro: 'bg-red-100 text-red-700',
    cancelada: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock size={18} className="text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Histórico de Notificações</h3>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-sm text-[var(--text-secondary)]">Carregando...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-[var(--surface-2)] rounded-lg p-6 text-center">
          <p className="text-sm text-[var(--text-secondary)]">Nenhuma notificação enviada ainda</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div key={notif.id} className="bg-white border border-[var(--border)] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {eventTypeLabels[notif.event_type] || notif.event_type}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{notif.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[notif.status] || statusColors.pendente}`}>
                  {notif.status}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {notif.sent_at ? new Date(notif.sent_at).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function NexusPortalCliente() {
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        // Simulando cliente padrão - em produção, seria baseado no usuário logado
        const result = await base44.entities.ClientWorkspace.list('-created_date', 1);
        if (result && result.length > 0) {
          setWorkspace(result[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar workspace:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspace();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">Carregando portal do cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--apsis-green)] to-[var(--apsis-green-light)] text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Portal do Cliente</h1>
        <p className="text-white/80 text-sm">Acesso seguro com controle de e-mails e notificações.</p>
      </div>

      {/* Informações do Cliente */}
      {workspace ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna 1: Email e Notificações */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <ClientEmailSection workspace={workspace} />
          </div>

          {/* Coluna 2: Informações Gerais */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Informações da Empresa</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Razão Social</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{workspace.cliente_nome}</p>
              </div>

              {workspace.cliente_cnpj && (
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">CNPJ</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{workspace.cliente_cnpj}</p>
                </div>
              )}

              {workspace.contato_nome && (
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Contato Principal</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{workspace.contato_nome}</p>
                </div>
              )}

              <div className="pt-2 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--text-secondary)]">Status do Workspace</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${workspace.ativo ? 'bg-green-600' : 'bg-gray-400'}`} />
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {workspace.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[var(--border)] rounded-lg p-8 text-center">
          <AlertCircle size={32} className="mx-auto text-[var(--text-secondary)] opacity-50 mb-3" />
          <p className="text-[var(--text-secondary)]">Nenhum workspace de cliente configurado</p>
        </div>
      )}

      {/* Histórico */}
      {workspace && (
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <EmailHistorySection workspaceId={workspace.id} />
        </div>
      )}
    </div>
  );
}