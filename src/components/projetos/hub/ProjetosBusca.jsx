import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Calendar, AlertTriangle, LayoutGrid, List } from "lucide-react";

const fmt = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const STATUS_COLOR = {
  "Ativo": "bg-green-100 text-green-700",
  "Pausado": "bg-yellow-100 text-yellow-700",
  "Cancelado": "bg-red-100 text-red-700",
  "Não iniciado": "bg-slate-100 text-slate-600",
};

export default function ProjetosBusca({ data }) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroResp, setFiltroResp] = useState("todos");
  const [view, setView] = useState("grid");

  const { projetos, parcelas } = data;
  const responsaveis = [...new Set(projetos.map(p => p.responsavel_tecnico).filter(Boolean))];

  const getValorTotal = (osId) => parcelas.filter(x => x.os_id === osId).reduce((s, x) => s + (x.valor || 0), 0);
  const getValorFat = (osId) => parcelas.filter(x => x.os_id === osId && ["Faturada","Recebida"].includes(x.status)).reduce((s, x) => s + (x.valor || 0), 0);

  const filtrados = projetos.filter(p => {
    const text = busca.toLowerCase();
    const matchBusca = !busca || [p.cliente_nome, p.proposta_numero, p.natureza, p.responsavel_tecnico, p.descricao].some(v => v?.toLowerCase().includes(text));
    const matchStatus = filtroStatus === "todos" || p.status === filtroStatus;
    const matchResp = filtroResp === "todos" || p.responsavel_tecnico === filtroResp;
    return matchBusca && matchStatus && matchResp;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input placeholder="Buscar por cliente, responsável, natureza..." className="pl-9 h-9" value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Não iniciado">Não iniciado</SelectItem>
            <SelectItem value="Pausado">Pausado</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroResp} onValueChange={setFiltroResp}>
          <SelectTrigger className="w-48 h-9"><SelectValue placeholder="Responsável" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {responsaveis.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-lg p-1 bg-white">
          <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-slate-100" : ""}`}><LayoutGrid className="w-4 h-4 text-slate-500" /></button>
          <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-slate-100" : ""}`}><List className="w-4 h-4 text-slate-500" /></button>
        </div>
        <span className="text-xs text-slate-400">{filtrados.length} projeto(s)</span>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtrados.map(p => (
            <Link key={p.id} to={`/ProjetoDetalhe?id=${p.id}`}>
              <Card className="hover:shadow-md transition-all cursor-pointer border hover:border-[#1A4731]/30 group">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate group-hover:text-[#1A4731]">{p.cliente_nome || "—"}</p>
                      <p className="text-xs text-slate-400 truncate">{p.natureza}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLOR[p.status] || "bg-slate-100 text-slate-600"}`}>{p.status}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progresso</span>
                      <span>{p.percentual_conclusao || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1A4731] rounded-full" style={{ width: `${p.percentual_conclusao || 0}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1"><Users size={11} /><span className="truncate">{p.responsavel_tecnico || "—"}</span></div>
                    <div className="flex items-center gap-1"><Calendar size={11} /><span>{p.prazo_previsto ? new Date(p.prazo_previsto + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</span></div>
                  </div>
                  {getValorTotal(p.id) > 0 && (
                    <div className="bg-slate-50 rounded-lg p-2 text-xs flex justify-between">
                      <span className="text-slate-400">Faturado</span>
                      <span className="font-semibold text-green-600">{fmt(getValorFat(p.id))}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
          {filtrados.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400">
              <Search size={32} className="mx-auto mb-2 opacity-30" />
              <p>Nenhum projeto encontrado.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Natureza</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Responsável</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Progresso</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Prazo</th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium">Valor</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(p => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/ProjetoDetalhe?id=${p.id}`} className="font-medium text-slate-800 hover:text-[#1A4731]">{p.cliente_nome || "—"}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.natureza || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{p.responsavel_tecnico || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1A4731] rounded-full" style={{ width: `${p.percentual_conclusao || 0}%` }} />
                      </div>
                      <span className="text-slate-500">{p.percentual_conclusao || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.prazo_previsto ? new Date(p.prazo_previsto + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-700">{fmt(getValorTotal(p.id))}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[p.status] || "bg-slate-100 text-slate-600"}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtrados.length === 0 && <div className="text-center py-10 text-slate-300 text-sm">Nenhum projeto encontrado</div>}
        </div>
      )}
    </div>
  );
}