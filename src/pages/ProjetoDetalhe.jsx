import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, LayoutDashboard, Columns2, Users, DollarSign,
  FileText, AlertTriangle, Calendar, Settings, ChevronRight, Clock, MessageSquare
} from "lucide-react";
import ProjetoResumo from "@/components/projetos/ProjetoResumo";
import ProjetoKanban from "@/components/projetos/ProjetoKanban";
import ProjetoTimesheet from "@/components/projetos/ProjetoTimesheet";
import ProjetoFinanceiro from "@/components/projetos/ProjetoFinanceiro";
import ProjetoDocumentos from "@/components/projetos/ProjetoDocumentos";
import ProjetoRiscos from "@/components/projetos/ProjetoRiscos";
import ProjetoGantt from "@/components/projetos/ProjetoGantt";
import ProjetoConfig from "@/components/projetos/ProjetoConfig";
import ProjetoComunicacao from "@/components/projetos/ProjetoComunicacao";

const STATUS_STYLE = {
  "Ativo":        { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Pausado":      { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  "Cancelado":    { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400"     },
  "Não iniciado": { bg: "bg-slate-100",  text: "text-slate-600",   dot: "bg-slate-400"   },
};

const TABS = [
  { id: "visao-geral",   label: "Visão Geral",    icon: LayoutDashboard },
  { id: "kanban",        label: "Kanban",          icon: Columns2        },
  { id: "timeline",      label: "Timeline",        icon: Calendar        },
  { id: "equipe",        label: "Equipe e Horas",  icon: Users           },
  { id: "financeiro",    label: "Financeiro",      icon: DollarSign      },
  { id: "documentos",    label: "Documentos",      icon: FileText        },
  { id: "comunicacao",   label: "Comunicação",     icon: MessageSquare   },
  { id: "riscos",        label: "Riscos",          icon: AlertTriangle   },
  { id: "configuracoes", label: "Configurações",   icon: Settings        },
];

export default function ProjetoDetalhe() {
  const params = new URLSearchParams(window.location.search);
  const osId   = params.get("id");

  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("visao-geral");

  useEffect(() => {
    if (!osId) return;
    base44.entities.OrdemServico.list("-created_date", 500).then(res => {
      setProjeto(res.find(o => o.id === osId) || null);
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
      {/* Sticky header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="px-6 pt-4 pb-0">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            <Link to="/Projetos" className="hover:text-[#1A4731] transition-colors">Projetos</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium truncate max-w-xs">{projeto.cliente_nome}</span>
          </div>

          {/* Identity row */}
          <div className="flex items-start justify-between gap-4 flex-wrap pb-4">
            <div className="flex items-start gap-3">
              <Link to="/Projetos">
                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors mt-0.5">
                  <ArrowLeft size={15} className="text-slate-500" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">{projeto.cliente_nome || "—"}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {projeto.natureza && <span className="text-xs text-slate-400">{projeto.natureza}</span>}
                  {projeto.proposta_numero && <><span className="text-slate-200">·</span><span className="text-xs font-mono text-slate-400">{projeto.proposta_numero}</span></>}
                  {projeto.responsavel_tecnico && <><span className="text-slate-200">·</span><span className="text-xs text-slate-400">{projeto.responsavel_tecnico}</span></>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{projeto.status}
              </span>
              {atrasado && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-600">
                  <AlertTriangle size={10} /> Atrasado
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${atrasado ? "bg-red-400" : "bg-[#1A4731]"}`}
                    style={{ width: `${projeto.percentual_conclusao || 0}%` }} />
                </div>
                <span className={`text-xs font-bold ${atrasado ? "text-red-500" : "text-slate-600"}`}>
                  {projeto.percentual_conclusao || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto -mx-6 px-6 gap-0">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${
                  tab === id
                    ? "border-[#F47920] text-[#F47920]"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
                }`}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1">
        {tab === "visao-geral"   && <ProjetoResumo     projeto={projeto} onUpdate={setProjeto} osId={osId} />}
        {tab === "kanban"        && <ProjetoKanban      osId={osId} projeto={projeto} />}
        {tab === "timeline"      && <ProjetoGantt       osId={osId} projeto={projeto} />}
        {tab === "equipe"        && <ProjetoTimesheet   osId={osId} projeto={projeto} />}
        {tab === "financeiro"    && <ProjetoFinanceiro  osId={osId} projeto={projeto} />}
        {tab === "documentos"    && <ProjetoDocumentos  osId={osId} projeto={projeto} />}
        {tab === "comunicacao"   && <ProjetoComunicacao osId={osId} projeto={projeto} />}
        {tab === "riscos"        && <ProjetoRiscos      osId={osId} projeto={projeto} />}
        {tab === "configuracoes" && <ProjetoConfig      projeto={projeto} onUpdate={setProjeto} osId={osId} />}
      </div>
    </div>
  );
}