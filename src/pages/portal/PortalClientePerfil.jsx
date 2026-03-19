import { User, Shield } from 'lucide-react';

export default function PortalClientePerfil() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Perfil e Segurança</h1>
        <p className="text-[var(--text-secondary)]">Gerencie suas configurações e preferências</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perfil */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Informações Pessoais</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[var(--text-secondary)] mb-1">Nome</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">Seu Nome Aqui</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] mb-1">E-mail</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">seu.email@empresa.com</p>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Segurança</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--text-primary)]">Autenticação</span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Ativa</span>
            </div>
            <button className="w-full px-4 py-2 border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors">
              Alterar Senha
            </button>
          </div>
        </div>
      </div>

      {/* Notificações */}
      <div className="bg-white border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Preferências de Notificação</h3>
        <div className="space-y-3">
          {['Notificações por e-mail', 'Atualizações de projeto', 'Novas mensagens'].map((pref) => (
            <div key={pref} className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--text-primary)]">{pref}</span>
              <button className="px-4 py-1.5 bg-[var(--apsis-orange)]/10 text-[var(--apsis-orange)] rounded-lg text-xs font-medium">
                Ativo
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}