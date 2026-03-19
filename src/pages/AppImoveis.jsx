import { ExternalLink } from "lucide-react";

export default function AppImoveis() {
  const appUrl = "https://apsis-imoveis.app"; // Configure com URL real

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A2B1F]">App Imóveis</h1>
        <p className="text-sm text-[#5C7060] mt-1">Gestão e avaliação de propriedades imobiliárias</p>
      </div>

      <div className="bg-white rounded-xl border border-[#DDE3DE] p-8">
        <div className="max-w-2xl">
          <p className="text-[#1A2B1F] mb-6">
            Clique no botão abaixo para ser direcionado ao App Imóveis. Gerencie seu portfólio de propriedades imobiliárias com ferramentas avançadas de análise e avaliação.
          </p>
          
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A4731] text-white rounded-lg hover:bg-[#245E40] transition-colors font-medium"
          >
            <span>Acessar App Imóveis</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}