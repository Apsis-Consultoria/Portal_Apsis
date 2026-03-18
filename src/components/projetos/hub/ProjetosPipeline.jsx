import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingUp, DollarSign, AlertTriangle, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const fmt = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

const STATUS_STYLE = {
  "Em elaboração": "bg-slate-100 text-slate-600",
  "Enviada": "bg-blue-100 text-blue-700",
  "Ganha": "bg-green-100 text-green-700",
  "Perdida": "bg-red-100 text-red-700",
  "Caducada": "bg-gray-100 text-gray-500",
};

const TEMP_STYLE = {
  "Quente": "text-red-500",
  "Morna": "text-amber-500",
  "Fria": "text-blue-400",
};

export default function ProjetosPipeline({ data, loading, onRefresh }) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTemp, setFiltroTemp] = useState("todos");

  const { propostas, projetos } = data;

  const ganhoConvertido = propostas.filter(p => p.status === "Ganha" && projetos.some(o => o.proposta_id === p.id));

  const filtradas = propostas.filter(p => {
    const text = busca.toLowerCase();
    const matchBusca = !busca || [p.cliente_nome, p.numero_ap, p.responsavel, p.natureza]
      .some(v => v?.toLowerCase().includes(text));
    const matchStatus = filtroStatus === "todos" || p.status === filtroStatus;
    const matchTemp = filtroTemp === "todos" || p.temperatura === filtroTemp;
    return matchBusca && matchStatus && matchTemp;
  });

  const totalPipeline = propostas.filter(p => p.status === "Enviada" || p.status === "Em elaboração")
    .reduce((s, p) => s + (p.valor_total || 0), 0);
  const totalGanho = propostas.filter(p => p.status === "Ganha").reduce((s, p) => s + (p.valor_total || 0), 0);
  const qtdAguardandoFollowup = propostas.filter(p => {
    if (p.status !== "Enviada") return false;
    if (!p.ultimo_followup) return true;
    const dias = Math.ceil((new Date() - new Date(p.ultimo_followup)) / (1000 * 60 * 60 * 24));
    return dias > 7;
  }).length;

  // Follow-up atrasado
  const semFollowup = propostas.filter(p => {
    if (p.status !== "Enviada") return false;
    if (!p.ultimo_followup) return true;
    return Math.ceil((new Date() - new Date(p.ultimo_followup)) / (1000 * 60 * 60 * 24)) > 7;
  });

  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <p className="text-xl font-bold text-slate-800">{fmt(totalPipeline)}</p>
            <p className="text-xs text-slate-400">Pipeline ativo</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-xl font-bold text-slate-800">{fmt(totalGanho)}</p>
            <p className="text-xs text-slate-400">Total ganho</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-[#F47920]" />
            <div>
              <p className="text-xl font-bold text-slate-800">{qtdAguardandoFollowup}</p>
              <p className="text-xs text-slate-400">Aguardando follow-up</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-400">
          <CardContent className="p-4">
            <p className="text-xl font-bold text-slate-800">{propostas.length}</p>
            <p className="text-xs text-slate-400">Total de propostas</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de follow-up */}
      {semFollowup.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-[#F47920] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">⚠️ Propostas aguardando follow-up</p>
                <div className="flex flex-wrap gap-2">
                  {semFollowup.slice(0, 5).map(p => (
                    <span key={p.id} className="text-xs bg-white border border-orange-200 text-slate-700 px-2 py-1 rounded-lg">
                      {p.cliente_nome} — {fmt(p.valor_total)}
                    </span>
                  ))}
                  {semFollowup.length > 5 && (
                    <span className="text-xs text-slate-500">+{semFollowup.length - 5} mais</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input placeholder="Buscar proposta, cliente..." className="pl-9 h-9" value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="Em elaboração">Em elaboração</SelectItem>
            <SelectItem value="Enviada">Enviada</SelectItem>
            <SelectItem value="Ganha">Ganha</SelectItem>
            <SelectItem value="Perdida">Perdida</SelectItem>
            <SelectItem value="Caducada">Caducada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroTemp} onValueChange={setFiltroTemp}>
          <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Temperatura</SelectItem>
            <SelectItem value="Quente">🔴 Quente</SelectItem>
            <SelectItem value="Morna">🟡 Morna</SelectItem>
            <SelectItem value="Fria">🔵 Fria</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-slate-400">{filtradas.length} propostas</span>
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Natureza</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Responsável</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">Valor</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Temperatura</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Último Follow-up</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">OS</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map(p => {
                  const osVinculada = projetos.find(o => o.proposta_id === p.id);
                  const diasFollowup = p.ultimo_followup
                    ? Math.ceil((new Date() - new Date(p.ultimo_followup)) / (1000 * 60 * 60 * 24))
                    : null;
                  const followupAtrasado = p.status === "Enviada" && (!p.ultimo_followup || diasFollowup > 7);

                  return (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{p.cliente_nome || "—"}</td>
                      <td className="px-4 py-3 text-slate-500">{p.natureza || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{p.responsavel || "—"}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-700">{fmt(p.valor_total)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${TEMP_STYLE[p.temperatura] || "text-slate-400"}`}>
                          {p.temperatura === "Quente" ? "🔴" : p.temperatura === "Morna" ? "🟡" : p.temperatura === "Fria" ? "🔵" : "—"} {p.temperatura || "—"}
                        </span>
                      </td>
                      <td className={`px-4 py-3 ${followupAtrasado ? "text-red-500 font-medium" : "text-slate-500"}`}>
                        {p.ultimo_followup ? `${diasFollowup}d atrás` : "Nunca"}
                        {followupAtrasado && " ⚠️"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[p.status] || "bg-slate-100 text-slate-600"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {osVinculada ? (
                          <Link to={`/ProjetoDetalhe?id=${osVinculada.id}`} className="flex items-center gap-1 text-[#1A4731] hover:underline">
                            <CheckCircle2 size={11} className="text-green-500" /> Ver OS
                          </Link>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtradas.length === 0 && (
              <div className="text-center py-10 text-slate-300 text-sm">Nenhuma proposta encontrada</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}