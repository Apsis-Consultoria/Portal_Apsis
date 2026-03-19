export default function NexusConfiguracoes() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[var(--border)] rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Configurações</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Gerencie suas preferências, permissões e acesso ao APSIS Nexus.
        </p>
        
        <div className="space-y-4">
          <div className="border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Preferências</h3>
            <p className="text-sm text-[var(--text-secondary)]">Notificações, idioma e temas</p>
          </div>
          
          <div className="border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Acesso e Segurança</h3>
            <p className="text-sm text-[var(--text-secondary)]">Gerenciar permissões e autenticação</p>
          </div>
          
          <div className="border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Integrações</h3>
            <p className="text-sm text-[var(--text-secondary)]">SharePoint, e-mail e notificações</p>
          </div>
        </div>
      </div>
    </div>
  );
}