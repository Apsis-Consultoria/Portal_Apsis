export default function NexusSolicitacoes() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[var(--border)] rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Solicitações</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Crie, acompanhe e gerencie solicitações junto à APSIS.
        </p>
        
        <div className="bg-[var(--surface-2)] rounded-lg p-6 text-center">
          <p className="text-[var(--text-secondary)]">Módulo em desenvolvimento</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">Sistema de gerenciamento de solicitações com rastreamento de status</p>
        </div>
      </div>
    </div>
  );
}