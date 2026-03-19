import { ArrowRight, MessageSquare, FileText, ClipboardList, FolderKanban, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PortalClienteInicio() {
  const shortcuts = [
    {
      label: 'Comunicação',
      description: 'Mensagens com sua equipe',
      icon: MessageSquare,
      path: '/PortalClienteComunicacao',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Documentos',
      description: 'Arquivos compartilhados',
      icon: FileText,
      path: '/PortalClienteDocumentos',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Solicitações',
      description: 'Acompanhamento de demandas',
      icon: ClipboardList,
      path: '/PortalClienteSolicitacoes',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Projetos',
      description: 'Status dos projetos',
      icon: FolderKanban,
      path: '/PortalClienteProjetos',
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[var(--apsis-green)] to-[var(--apsis-green-light)] text-white rounded-xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Bem-vindo ao Portal APSIS</h1>
        <p className="text-white/90 text-lg">Acesso seguro e centralizado aos seus projetos, documentos e comunicações.</p>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Link
                key={shortcut.path}
                to={shortcut.path}
                className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg hover:border-[var(--apsis-orange)] transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${shortcut.color} p-3 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                  <ArrowRight size={20} className="text-[var(--text-secondary)] group-hover:text-[var(--apsis-orange)] transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{shortcut.label}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{shortcut.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lock size={20} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">Segurança de Dados</h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Sua conexão é criptografada e todos os dados são armazenados com segurança de nível empresarial.
          </p>
        </div>

        {/* Support */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">Suporte Dedicado</h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Entre em contato direto com sua equipe APSIS através do módulo de Comunicação.
          </p>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Atividades Recentes</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Nova mensagem recebida</p>
              <p className="text-xs text-[var(--text-secondary)]">há 2 horas</p>
            </div>
            <MessageSquare size={16} className="text-blue-600" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Documento compartilhado</p>
              <p className="text-xs text-[var(--text-secondary)]">ontem</p>
            </div>
            <FileText size={16} className="text-purple-600" />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Projeto atualizado</p>
              <p className="text-xs text-[var(--text-secondary)]">2 dias atrás</p>
            </div>
            <FolderKanban size={16} className="text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}