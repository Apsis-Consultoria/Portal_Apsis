import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NovoProjetoModal from "@/components/projetos/NovoProjetoModal";
import ProjetosDashboard from "@/components/projetos/hub/ProjetosDashboard";
import ProjetosLista from "@/components/projetos/hub/ProjetosLista";
import ProjetosKanban from "@/components/projetos/hub/ProjetosKanban";
import ProjetosDocumentos from "@/components/projetos/hub/ProjetosDocumentos";
import ProjetosRiscos from "@/components/projetos/hub/ProjetosRiscos";
import ProjetosConfiguracoes from "@/components/projetos/hub/ProjetosConfiguracoes";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "lista", label: "Lista de Projetos" },
  { id: "kanban", label: "Kanban" },
  { id: "documentos", label: "Documentos" },
  { id: "riscos", label: "Riscos" },
  { id: "configuracoes", label: "Configurações" },
];

export default function Projetos() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const activeTab = urlParams.get("tab") || "dashboard";

  const [showNovo, setShowNovo] = useState(false);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    projetos: [],
    parcelas: [],
    tarefas: [],
    entradas: [],
    alocacoes: [],
    propostas: [],
    comunicacoes: [],
    documentos: [],
    riscos: [],
  });

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [projetos, parcelas, tarefas, entradas, alocacoes, propostas, comunicacoes, documentos, riscos] = await Promise.all([
      base44.entities.OrdemServico.list("-created_date", 500),
      base44.entities.Parcela.list("-created_date", 1000),
      base44.entities.Tarefa.list("-created_date", 1000),
      base44.entities.EntradaTempo.list("-data", 2000),
      base44.entities.AlocacaoHoras.list("-created_date", 500),
      base44.entities.Proposta.list("-created_date", 500),
      base44.entities.ComunicacaoProjeto.list("-data", 1000),
      base44.entities.DocumentoProjeto.list("-created_date", 500),
      base44.entities.RiscoProjeto.list("-created_date", 500),
    ]);
    setData({ projetos, parcelas, tarefas, entradas, alocacoes, propostas, comunicacoes, documentos, riscos });
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const currentTab = TABS.find(t => t.id === activeTab) || TABS[0];

  const renderContent = () => {
    const props = { data, onRefresh: loadAll, loading };
    switch (activeTab) {
      case "dashboard": return <ProjetosDashboard {...props} />;
      case "lista": return <ProjetosLista {...props} />;
      case "kanban": return <ProjetosKanban {...props} />;
      case "documentos": return <ProjetosDocumentos {...props} />;
      case "riscos": return <ProjetosRiscos {...props} />;
      case "configuracoes": return <ProjetosConfiguracoes />;
      default: return <ProjetosDashboard {...props} />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] overflow-hidden bg-[#F4F6F4]">
      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>

      {showNovo && (
        <NovoProjetoModal
          onClose={() => setShowNovo(false)}
          onSaved={() => { setShowNovo(false); loadAll(); }}
        />
      )}
    </div>
  );
}