import { MessageSquare } from 'lucide-react';

export default function PortalClienteComunicacao() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Comunicação</h1>
        <p className="text-[var(--text-secondary)]">Mantenha-se em contato com sua equipe APSIS</p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl p-12 text-center">
        <MessageSquare size={48} className="mx-auto text-[var(--text-secondary)] opacity-50 mb-4" />
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Centro de Comunicação</h2>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          Visualize e responda mensagens, receba notificações e mantenha um histórico organizado de toda comunicação.
        </p>
      </div>
    </div>
  );
}