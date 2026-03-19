import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, DollarSign, Briefcase, Users, FileText, ArrowUpRight } from "lucide-react";

const fmt = (v) =>
  v ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v) : "R$ 0";

export default function VendasDashboard() {
  const [propostas, setPropostas] = useState([]);
  const [oaps, setOaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Proposta.list("-created_date", 200),
      base44.entities.OAP.list("-created_date", 100),
    ]).then(([p, o]) => { setPropostas(p); setOaps(o); setLoading(false); });
  }, []);

  const ganhas = propostas.filter(p => p.status === "Ganha");
  const ativas = propostas.filter(p => ["Em elaboração", "Enviada"].includes(p.status));
  const valorPipeline = ativas.reduce((s, p) => s + (p.valor_total || 0), 0);
  const valorGanho = ganhas.reduce((s, p) => s + (p.valor_total || 0), 0);
  const taxaConversao = propostas.length > 0 ? Math.round((ganhas.length / propostas.length) * 100) : 0;

  const kpis = [
    { label: "Pipeline Ativo", value: fmt(valorPipeline), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Receita Fechada", value: fmt(valorGanho), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Oportunidades Abertas", value: oaps.filter(o => o.status === "Aberta").length, icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Taxa de Conversão", value: `${taxaConversao}%`, icon: ArrowUpRight, color: "text-[#F47920]", bg: "bg-orange-50" },
  ];

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard de Vendas</h1>
        <p className="text-sm text-slate-500 mt-0.5">Visão consolidada da área comercial</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon size={16} className={k.color} />
            </div>
            <p className="text-xs text-slate-500 mb-1">{k.label}</p>
            <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-4">Propostas por Status</p>
          <div className="space-y-2">
            {["Em elaboração","Enviada","Ganha","Perdida","Caducada"].map(s => {
              const count = propostas.filter(p => p.status === s).length;
              const pct = propostas.length > 0 ? Math.round((count / propostas.length) * 100) : 0;
              const colors = { "Em elaboração":"bg-blue-400", "Enviada":"bg-amber-400", "Ganha":"bg-emerald-500", "Perdida":"bg-red-400", "Caducada":"bg-slate-300" };
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-28 truncate">{s}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className={`${colors[s]} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-4">Últimas Oportunidades</p>
          {oaps.slice(0, 5).length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Nenhuma oportunidade</p>
          ) : (
            <div className="space-y-2">
              {oaps.slice(0, 5).map(o => (
                <div key={o.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{o.cliente_nome}</p>
                    <p className="text-[10px] text-slate-400">{o.natureza} · {o.responsavel}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    o.status === "Aberta" ? "bg-blue-50 text-blue-700" :
                    o.status === "Em análise" ? "bg-amber-50 text-amber-700" :
                    "bg-slate-100 text-slate-500"
                  }`}>{o.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}