import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Search, Plus, TrendingUp } from "lucide-react";
import { format } from "date-fns";

const fmt = (v) => v ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v) : "—";

const STATUS_COLORS = {
  "Em elaboração": "bg-blue-50 text-blue-700",
  "Enviada":        "bg-amber-50 text-amber-700",
  "Ganha":          "bg-emerald-50 text-emerald-700",
  "Perdida":        "bg-red-50 text-red-600",
  "Caducada":       "bg-slate-100 text-slate-500",
};

export default function VendasPropostas() {
  const [propostas, setPropostas] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  useEffect(() => { base44.entities.Proposta.list("-created_date", 200).then(setPropostas); }, []);

  const filtradas = propostas.filter(p => {
    const matchBusca = !busca || p.cliente_nome?.toLowerCase().includes(busca.toLowerCase()) || p.numero_ap?.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "Todos" || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const total = filtradas.reduce((s, p) => s + (p.valor_total || 0), 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Propostas</h1>
        <p className="text-sm text-slate-500 mt-0.5">Histórico e acompanhamento de todas as propostas</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por cliente ou AP..."
            className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#F47920]" />
        </div>
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none">
          {["Todos","Em elaboração","Enviada","Ganha","Perdida","Caducada"].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
          <TrendingUp size={13} className="text-[#F47920]" />
          <span className="text-xs font-bold text-slate-700">{fmt(total)}</span>
          <span className="text-xs text-slate-400">total</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <FileText size={28} className="text-slate-200" />
            <p className="text-sm text-slate-400">Nenhuma proposta encontrada</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Número AP","Cliente","Natureza","Responsável","Valor","Status","Data Envio"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((p, i) => (
                <tr key={p.id || i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-medium text-slate-600">{p.numero_ap || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{p.cliente_nome}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-[140px] truncate">{p.natureza}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.responsavel || "—"}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{fmt(p.valor_total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[p.status] || "bg-slate-100 text-slate-500"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.data_envio ? format(new Date(p.data_envio + "T00:00:00"), "dd/MM/yyyy") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}