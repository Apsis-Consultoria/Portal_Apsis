import { MessageSquare, FileText, LayoutDashboard, Globe } from "lucide-react";

export default function NexusInicio() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            <MessageSquare size={20} className="text-blue-600" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Comunicação</h3>
          <p className="text-sm text-[var(--text-secondary)]">Mensagens e atualizações em tempo real</p>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
            <FileText size={20} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Documentos</h3>
          <p className="text-sm text-[var(--text-secondary)]">Acesso a arquivos e documentação</p>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
            <LayoutDashboard size={20} className="text-purple-600" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Projetos</h3>
          <p className="text-sm text-[var(--text-secondary)]">Acompanhamento de seus projetos</p>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
            <Globe size={20} className="text-cyan-600" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Portal</h3>
          <p className="text-sm text-[var(--text-secondary)]">Acesso seguro ao portal do cliente</p>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-lg p-8">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Bem-vindo ao APSIS Nexus</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          Uma plataforma premium para relacionamento entre APSIS e você. Simplifique a comunicação, acompanhe projetos 
          em tempo real e acesse documentos de forma segura e organizada.
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          Explore as seções acima ou use o menu lateral para começar.
        </p>
      </div>
    </div>
  );
}