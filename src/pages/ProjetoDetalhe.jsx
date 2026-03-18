import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft, LayoutDashboard, Kanban, Clock, DollarSign,
  FileText, MessageSquare, AlertTriangle, BarChart2, Calendar
} from "lucide-react";
import ProjetoResumo from "@/components/projetos/ProjetoResumo";
import ProjetoKanban from "@/components/projetos/ProjetoKanban";
import ProjetoTimesheet from "@/components/projetos/ProjetoTimesheet";
import ProjetoFinanceiro from "@/components/projetos/ProjetoFinanceiro";
import ProjetoDocumentos from "@/components/projetos/ProjetoDocumentos";
import ProjetoComunicacao from "@/components/projetos/ProjetoComunicacao";
import ProjetoRiscos from "@/components/projetos/ProjetoRiscos";
import ProjetoGantt from "@/components/projetos/ProjetoGantt";

const STATUS_COLOR = {
  "Ativo": "bg-green-100 text-green-700",
  "Pausado": "bg-yellow-100 text-yellow-700",
  "Cancelado": "bg-red-100 text-red-700",
  "Não iniciado": "bg-gray-100 text-gray-600",
};

export default function ProjetoDetalhe() {
  const params = new URLSearchParams(window.location.search);
  const osId = params.get("id");

  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("resumo");

  useEffect(() => {
    if (!osId) return;
    base44.entities.OrdemServico.list("-created_date", 500).then(res => {
      const found = res.find(o => o.id === osId);
      setProjeto(found || null);
      setLoading(false);
    });
  }, [osId]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  if (!projeto) return (
    <div className="p-8 text-center text-slate-400">
      <p className="text-lg">Projeto não encontrado.</p>
      <Link to="/Projetos"><Button variant="outline" className="mt-4">Voltar</Button></Link>
    </div>
  );

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/Projetos">
              <Button variant="ghost" size="sm" className="gap-1 text-slate-500">
                <ArrowLeft className="w-4 h-4" /> Projetos
              </Button>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">{projeto.cliente_nome || "—"}</h1>
              <p className="text-xs text-slate-500">{projeto.natureza} · {projeto.proposta_numero || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-sm ${STATUS_COLOR[projeto.status] || "bg-gray-100 text-gray-600"}`}>
              {projeto.status}
            </Badge>
            <span className="text-sm text-slate-500">
              {projeto.percentual_conclusao || 0}% concluído
            </span>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${projeto.percentual_conclusao || 0}%` }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-3 -mb-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="h-9 gap-1 bg-transparent p-0 border-b-0 flex flex-wrap">
              {[
                { id: "resumo", label: "Resumo", icon: LayoutDashboard },
                { id: "kanban", label: "Kanban", icon: Kanban },
                { id: "gantt", label: "Cronograma", icon: Calendar },
                { id: "timesheet", label: "Timesheet", icon: Clock },
                { id: "financeiro", label: "Financeiro", icon: DollarSign },
                { id: "documentos", label: "Documentos", icon: FileText },
                { id: "comunicacao", label: "Comunicação", icon: MessageSquare },
                { id: "riscos", label: "Riscos", icon: AlertTriangle },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-t-md transition-colors border-b-2 ${
                    tab === id
                      ? "border-blue-600 text-blue-600 font-medium"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {tab === "resumo" && <ProjetoResumo projeto={projeto} onUpdate={setProjeto} osId={osId} />}
        {tab === "kanban" && <ProjetoKanban osId={osId} projeto={projeto} />}
        {tab === "gantt" && <ProjetoGantt osId={osId} projeto={projeto} />}
        {tab === "timesheet" && <ProjetoTimesheet osId={osId} projeto={projeto} />}
        {tab === "financeiro" && <ProjetoFinanceiro osId={osId} projeto={projeto} />}
        {tab === "documentos" && <ProjetoDocumentos osId={osId} projeto={projeto} />}
        {tab === "comunicacao" && <ProjetoComunicacao osId={osId} projeto={projeto} />}
        {tab === "riscos" && <ProjetoRiscos osId={osId} projeto={projeto} />}
      </div>
    </div>
  );
}