import { ExternalLink } from "lucide-react";

export default function AppAtivoFixo() {
  const appUrl = "https://apsis-ativo-fixo.app"; // Configure com URL real

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A2B1F]">APP Ativo Fixo</h1>
        <p className="text-sm text-[#5C7060] mt-1">Gestão de patrimônio e avaliação de ativos fixos</p>
      </div>

      <div className="bg-white rounded-xl border border-[#DDE3DE] p-8">
        <div className="max-w-2xl">
          <p className="text-[#1A2B1F] mb-6">
            Clique no botão abaixo para ser direcionado ao APP Ativo Fixo. Esta aplicação permite gerenciar e avaliar seus ativos fixos de forma integrada e segura.
          </p>
          
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A4731] text-white rounded-lg hover:bg-[#245E40] transition-colors font-medium"
          >
            <span>Acessar APP Ativo Fixo</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}