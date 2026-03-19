export default function NexusDocumentos() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[var(--border)] rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Documentos</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Acesso centralizado a documentos, relatórios e arquivos do seu projeto.
        </p>
        
        <div className="bg-[var(--surface-2)] rounded-lg p-6 text-center">
          <p className="text-[var(--text-secondary)]">Módulo em desenvolvimento</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">Integração com SharePoint para acesso seguro a documentos</p>
        </div>
      </div>
    </div>
  );
}