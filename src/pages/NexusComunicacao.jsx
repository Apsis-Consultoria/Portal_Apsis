export default function NexusComunicacao() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[var(--border)] rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Comunicação</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Central de mensagens e notificações com sua equipe APSIS.
        </p>
        
        <div className="bg-[var(--surface-2)] rounded-lg p-6 text-center">
          <p className="text-[var(--text-secondary)]">Módulo em desenvolvimento</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">Preparado para integração com e-mail e notificações em tempo real</p>
        </div>
      </div>
    </div>
  );
}