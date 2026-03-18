import { Download, FileSpreadsheet, FolderOpen } from "lucide-react";

const areas = [
  {
    nome: "Ativos Fixos",
    cor: "#1A4731",
    modelos: [
      {
        id: 1,
        nome: "Modelo de Avaliação Bens Móveis",
        arquivo: "Planilha AF - Avaliação.xlsb",
        url: "/modelos/Planilha AF - Avaliação.xlsb",
      },
      {
        id: 2,
        nome: "Modelo de Avaliação Vidas Úteis",
        arquivo: "Planilha AF - VU.xlsb",
        url: "/modelos/Planilha AF - VU.xlsb",
      },
    ],
  },
];

export default function ModelosAvaliacao() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Modelos de Avaliação</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Faça o download dos modelos de planilha para uso nos projetos.
        </p>
      </div>

      {areas.map((area) => (
        <div key={area.nome} className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
          {/* Cabeçalho da área */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)]" style={{ borderLeft: `4px solid ${area.cor}` }}>
            <FolderOpen size={18} className="text-[var(--apsis-orange)]" />
            <h3 className="font-semibold text-[var(--text-primary)]">{area.nome}</h3>
          </div>

          {/* Lista de modelos */}
          <div className="divide-y divide-[var(--border)]">
            {area.modelos.map((modelo) => (
              <div key={modelo.id} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--surface-2)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <FileSpreadsheet size={20} className="text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)] text-sm">{modelo.nome}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{modelo.arquivo}</p>
                  </div>
                </div>

                {modelo.url ? (
                  <a
                    href={modelo.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[var(--apsis-orange)] hover:bg-[#d96910] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download size={15} />
                    Baixar
                  </a>
                ) : (
                  <span className="text-xs text-[var(--text-secondary)] bg-gray-100 px-3 py-2 rounded-lg">
                    Em breve
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}