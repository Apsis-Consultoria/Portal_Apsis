import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, Filter, ChevronRight, Users, Calendar, DollarSign, AlertTriangle, Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import NovoProjetoModal from "@/components/projetos/NovoProjetoModal";

const STATUS_STYLE = {
  "Ativo": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Não iniciado": { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  "Pausado": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  "Cancelado": { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
};

const STATUS_LABEL = {
  "Ativo": "Em Execução",
  "Não iniciado": "Iniciação",
  "Pausado": "Pausado",
  "Cancelado": "Cancelado",
};

const fmt = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

export default function ProjetosLista({ data, onRefresh }) {
  const { projetos, parcelas } = data;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sort, setSort] = useState("cliente");
  const [showNovo, setShowNovo] = useState(false);

  const getTotal = (osId) => parcelas.filter(p => p.os_id === osId).reduce((s, p) => s + (p.valor || 0), 0);

  const filtered = projetos
    .filter(p => {
      const q = search.toLowerCase();
      const match = !q || p.cliente_nome?.toLowerCase().includes(q) || p.natureza?.toLowerCase().includes(q) || p.responsavel_tecnico?.toLowerCase().includes(q);
      const statusMatch = statusFilter === "todos" || p.status === statusFilter;
      return match && statusMatch;
    })
    .sort((a, b) => {
      if (sort === "cliente") return (a.cliente_nome || "").localeCompare(b.cliente_nome || "");
      if (sort === "prazo") return (a.prazo_previsto || "").localeCompare(b.prazo_previsto || "");
      if (sort === "progresso") return (b.percentual_conclusao || 0) - (a.percentual_conclusao || 0);
      return 0;
    });

  const statuses = ["todos", "Ativo", "Não iniciado", "Pausado", "Cancelado"];

  return (
    <div className="p-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                statusFilter === s
                  ? "bg-[#1A4731] text-white border-[#1A4731]"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {s === "todos" ? "Todos" : STATUS_LABEL[s] || s}
              {s !== "todos" && (
                <span className="ml-1.5 opacity-60">
                  {projetos.filter(p => p.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar cliente, natureza, responsável..."
              className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#1A4731]/20 focus:border-[#1A4731]/40 bg-white"
            />
          </div>
          <Button size="sm" className="bg-[#F47920] hover:bg-[#d96a18] text-white gap-1.5 text-xs" onClick={() => setShowNovo(true)}>
            <Plus size={13} /> Novo Projeto
          </Button>
        </div>
      </div>

      {/* Sort bar */}
      <div className="flex gap-4 mb-3 text-xs text-slate-400">
        {[["cliente","Cliente"],["prazo","Prazo"],["progresso","Progresso"]].map(([k,l]) => (
          <button key={k} onClick={() => setSort(k)} className={`flex items-center gap-1 hover:text-slate-600 transition-colors ${sort === k ? "text-[#1A4731] font-semibold" : ""}`}>
            <ArrowUpDown size={10} /> {l}
          </button>
        ))}
        <span className="ml-auto">{filtered.length} projeto{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Projects table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Cliente / Projeto</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Responsável</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Progresso</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Prazo</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Valor Total</th>
              <th className="px-4 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(p => {
              const s = STATUS_STYLE[p.status] || STATUS_STYLE["Não iniciado"];
              const total = getTotal(p.id);
              const atrasado = p.prazo_previsto && new Date(p.prazo_previsto) < new Date() && p.percentual_conclusao < 100;
              const dias = p.prazo_previsto ? Math.ceil((new Date(p.prazo_previsto) - new Date()) / 86400000) : null;
              return (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-5 py-4">
                    <Link to={`/ProjetoDetalhe?id=${p.id}`} className="block">
                      <div className="font-semibold text-sm text-slate-800 group-hover:text-[#1A4731] transition-colors">{p.cliente_nome || "—"}</div>
                      {p.natureza && <div className="text-xs text-slate-400 mt-0.5">{p.natureza}</div>}
                    </Link>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#1A4731]/10 flex items-center justify-center">
                        <Users size={10} className="text-[#1A4731]" />
                      </div>
                      <span className="text-xs text-slate-600 truncate max-w-[120px]">{p.responsavel_tecnico || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {STATUS_LABEL[p.status] || p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${atrasado ? "bg-red-400" : "bg-[#1A4731]"}`} style={{ width: `${p.percentual_conclusao || 0}%` }} />
                      </div>
                      <span className={`text-xs font-medium ${atrasado ? "text-red-500" : "text-slate-500"}`}>{p.percentual_conclusao || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    {dias !== null ? (
                      <div className={`flex items-center gap-1 text-xs ${atrasado ? "text-red-500 font-semibold" : dias <= 7 ? "text-amber-500 font-medium" : "text-slate-500"}`}>
                        {atrasado && <AlertTriangle size={11} />}
                        <Calendar size={11} />
                        <span>{atrasado ? `${Math.abs(dias)}d atraso` : `${dias}d`}</span>
                      </div>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-4 hidden xl:table-cell">
                    <span className="text-xs font-medium text-slate-700">{total > 0 ? fmt(total) : <span className="text-slate-300">—</span>}</span>
                  </td>
                  <td className="px-4 py-4">
                    <Link to={`/ProjetoDetalhe?id=${p.id}`}>
                      <ChevronRight size={15} className="text-slate-300 group-hover:text-[#1A4731] transition-colors" />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-14 text-sm text-slate-300">
                  {search ? `Nenhum projeto encontrado para "${search}"` : "Nenhum projeto cadastrado"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showNovo && (
        <NovoProjetoModal onClose={() => setShowNovo(false)} onSaved={() => { setShowNovo(false); onRefresh(); }} />
      )}
    </div>
  );
}