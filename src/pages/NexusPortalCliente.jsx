export default function NexusPortalCliente() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[var(--border)] rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Portal do Cliente</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Acesso seguro ao portal de cliente com autenticação garantida.
        </p>
        
        <div className="bg-[var(--surface-2)] rounded-lg p-6 text-center">
          <p className="text-[var(--text-secondary)]">Módulo em desenvolvimento</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">Portal seguro com acesso restrito e controle de permissões</p>
        </div>
      </div>
    </div>
  );
}