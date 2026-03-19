import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, LayoutDashboard, Kanban, Users, DollarSign,
  FileText, AlertTriangle, Calendar, Settings, ChevronRight
} from "lucide-react";
import ProjetoResumo from "@/components/projetos/ProjetoResumo";
import ProjetoKanban from "@/components/projetos/ProjetoKanban";
import ProjetoTimesheet from "@/components/projetos/ProjetoTimesheet";
import ProjetoFinanceiro from "@/components/projetos/ProjetoFinanceiro";
import ProjetoDocumentos from "@/components/projetos/ProjetoDocumentos";
import ProjetoRiscos from "@/components/projetos/ProjetoRiscos";
import ProjetoGantt from "@/components/projetos/ProjetoGantt";
import ProjetoConfig from "@/components/projetos/ProjetoConfig";

const STATUS_STYLE = {
  "Ativo":        { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Em Execução" },
  "Pausado":      { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   label: "Pausado" },
  "Cancelado":    { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400",     label: "Cancelado" },
  "Não iniciado": { bg: "bg-slate-100",  text: "text-slate-600",  dot: "bg-slate-400",  label: "Iniciação" },
};

const TABS = [
  { id: "visao-geral",   label: "Visão Geral",         icon: LayoutDashboard },
  { id: "kanban",        label: "Kanban",               icon: Kanban },
  { id: "equipe",        label: "Equipe e Horas",       icon: Users },
  { id: "financeiro",    label: "Financeiro",           icon: DollarSign },
  { id: "timeline",      label: "Timeline",             icon: Calendar },
  { id: "documentos",    label: "Documentos",           icon: FileText },
  { id: "riscos",        label: "Riscos",               icon: AlertTriangle },
  { id: "configuracoes", label: "Configurações",        icon: Settings },
];

export default function ProjetoDetalhe() {
  const params = new URLSearchParams(window.location.search);
  const osId = params.get("id");

  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("visao-geral");

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
      <div className="w-7 h-7 border-2 border-slate-200 border-t-[#1A4731] rounded-full animate-spin" />
    </div>
  );

  if (!projeto) return (
    <div className="p-8 text-center text-slate-400">
      <p>Projeto não encontrado.</p>
      <Link to="/Projetos"><Button variant="outline" className="mt-4">Voltar</Button></Link>
    </div>
  );

  const s = STATUS_STYLE[projeto.status] || STATUS_STYLE["Não iniciado"];
  const atrasado = projeto.prazo_previsto && new Date(projeto.prazo_previsto) < new Date() && (projeto.percentual_conclusao || 0) < 100;

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F4]">
      {/* Breadcrumb + header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="px-6 pt-4 pb-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            <Link to="/Projetos" className="hover:text-[#1A4731] transition-colors">Projetos</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium truncate max-w-xs">{projeto.cliente_nome}</span>
          </div>

          {/* Project identity row */}
          <div className="flex items-start justify-between gap-4 flex-wrap pb-4">
            <div className="flex items-start gap-4">
              <Link to="/Projetos">
                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors mt-0.5">
                  <ArrowLeft size={15} className="text-slate-500" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">{projeto.cliente_nome || "—"}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {projeto.natureza && <span className="text-xs text-slate-400">{projeto.natureza}</span>}
                  {projeto.proposta_numero && (
                    <>
                      <span className="text-slate-200">·</span>
                      <span className="text-xs font-mono text-slate-400">{projeto.proposta_numero}</span>
                    </>
                  )}
                  {projeto.responsavel_tecnico && (
                    <>
                      <span className="text-slate-200">·</span>
                      <span className="text-xs text-slate-400">{projeto.responsavel_tecnico}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${atrasado ? "bg-red-400" : "bg-[#1A4731]"}`}
                    style={{ width: `${projeto.percentual_conclusao || 0}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold ${atrasado ? "text-red-500" : "text-slate-600"}`}>
                  {projeto.percentual_conclusao || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Tab nav */}
          <div className="flex gap-0 overflow-x-auto -mx-6 px-6">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${
                  tab === id
                    ? "border-[#F47920] text-[#F47920]"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1">
        {tab === "visao-geral"   && <ProjetoResumo    projeto={projeto} onUpdate={setProjeto} osId={osId} />}
        {tab === "kanban"        && <ProjetoKanban    osId={osId} projeto={projeto} />}
        {tab === "equipe"        && <ProjetoTimesheet osId={osId} projeto={projeto} />}
        {tab === "financeiro"    && <ProjetoFinanceiro osId={osId} projeto={projeto} />}
        {tab === "timeline"      && <ProjetoGantt     osId={osId} projeto={projeto} />}
        {tab === "documentos"    && <ProjetoDocumentos osId={osId} projeto={projeto} />}
        {tab === "riscos"        && <ProjetoRiscos    osId={osId} projeto={projeto} />}
        {tab === "configuracoes" && <ProjetoConfig     projeto={projeto} onUpdate={setProjeto} osId={osId} />}
      </div>
    </div>
  );

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