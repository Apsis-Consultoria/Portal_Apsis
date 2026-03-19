import { FolderKanban } from 'lucide-react';

export default function PortalClienteProjetos() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Projetos</h1>
        <p className="text-[var(--text-secondary)]">Visualize o status e progresso de seus projetos</p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl p-12 text-center">
        <FolderKanban size={48} className="mx-auto text-[var(--text-secondary)] opacity-50 mb-4" />
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Painel de Projetos</h2>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          Acompanhe o progresso, cronogramas e próximas etapas de todos os seus projetos em um único lugar.
        </p>
      </div>
    </div>
  );
}