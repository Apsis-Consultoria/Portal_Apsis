import { ClipboardList } from 'lucide-react';

export default function PortalClienteSolicitacoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Solicitações</h1>
        <p className="text-[var(--text-secondary)]">Acompanhe o status de suas solicitações</p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl p-12 text-center">
        <ClipboardList size={48} className="mx-auto text-[var(--text-secondary)] opacity-50 mb-4" />
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Gerenciador de Solicitações</h2>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          Acompanhe o progresso de documentos solicitados, parecerem e análises em tempo real.
        </p>
      </div>
    </div>
  );
}