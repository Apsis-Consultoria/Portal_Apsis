import { useState } from "react";
import { Info, Settings, Layers, Bell, Cloud } from "lucide-react";
import SharePointConfig from "@/components/projetos/configuracoes/SharePointConfig";

const TABS = [
  { id: "geral", label: "Geral", icon: Settings },
  { id: "sharepoint", label: "Configuração SharePoint", icon: Cloud },
];

export default function ProjetosConfiguracoes() {
  const [tab, setTab] = useState("geral");

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Configurações</h2>
        <p className="text-sm text-slate-400 mt-0.5">Parâmetros e integrações do módulo de Projetos</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
              tab === t.id
                ? "border-[#F47920] text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}>
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Geral */}
      {tab === "geral" && (
        <div className="max-w-2xl space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1A4731]/10 flex items-center justify-center flex-shrink-0">
                <Layers size={15} className="text-[#1A4731]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700">Horas, Alocações, Gantt e Parcelas</div>
                <p className="text-xs text-slate-400 mt-1">
                  Estas funcionalidades estão disponíveis dentro de cada projeto individualmente, na aba correspondente da tela de detalhe do projeto.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Bell size={15} className="text-amber-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700">Comunicação e Pipeline</div>
                <p className="text-xs text-slate-400 mt-1">
                  Comunicação contextual é acessível dentro de cada projeto. Pipeline comercial pertence ao módulo de Vendas.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Info size={15} className="text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700">Modelos de Avaliação</div>
                <p className="text-xs text-slate-400 mt-1">
                  Disponível na área administrativa do portal. Acesse via Configurações globais → Modelos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: SharePoint */}
      {tab === "sharepoint" && <SharePointConfig />}
    </div>
  );
}