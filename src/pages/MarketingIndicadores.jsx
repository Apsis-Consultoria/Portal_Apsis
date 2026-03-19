import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import ModernBarChart from "@/components/charts/ModernBarChart";
import ModernPieChart from "@/components/charts/ModernPieChart";
import KPICard from "@/components/ui/KPICard";
import LoadingState from "@/components/ui/LoadingState";
import { TrendingUp, DollarSign, GitBranch, Target, AlertTriangle, FileText, Briefcase, BarChart3 } from "lucide-react";

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const BUDGET2026_MES = [
  { mes:"Jan", orcado:725000, real:75862.07 },
  { mes:"Fev", orcado:725000, real:85320.20 },
  { mes:"Mar", orcado:725000, real:0 },
  { mes:"Abr", orcado:725000, real:0 },
  { mes:"Mai", orcado:725000, real:0 },
  { mes:"Jun", orcado:725000, real:0 },
  { mes:"Jul", orcado:725000, real:0 },
  { mes:"Ago", orcado:725000, real:0 },
  { mes:"Set", orcado:725000, real:0 },
  { mes:"Out", orcado:725000, real:0 },
  { mes:"Nov", orcado:725000, real:0 },
  { mes:"Dez", orcado:725000, real:0 },
];

const ABAS = [
  { id: "laudos", label: "Laudos Contábeis", icon: FileText },
  { id: "consultoria", label: "Consultoria", icon: Briefcase },
  { id: "financeiro", label: "Financeiro", icon: BarChart3 },
];

export default function MarketingIndicadores() {
  const [anoSel, setAnoSel] = useState(2026);
  const [abaAtiva, setAbaAtiva] = useState("laudos");

  const { data, isLoading } = useQuery({
    queryKey: ['marketing-indicadores-data'],
    queryFn: async () => {
      const [p, pa, b, os] = await Promise.all([
        base44.entities.Proposta.list(),
        base44.entities.Parcela.list(),
        base44.entities.Budget.list(),
        base44.entities.OrdemServico.list(),
      ]);
      return { propostas: p, parcelas: pa, budgets: b, oss: os };
    },
    staleTime: 5 * 60 * 1000,
  });

  const propostas = data?.propostas || [];
  const parcelas = data?.parcelas || [];
  const budgets = data?.budgets || [];

  const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v || 0);

  const ORCADO_TOTAL_2026 = 8700000;
  const REALIZADO_2026 = 161182.27;
  const PCT_ATINGIDO = ((REALIZADO_2026 / ORCADO_TOTAL_2026) * 100).toFixed(1);

  const propostasAtivas = propostas.filter(p => ["Em elaboração","Enviada"].includes(p.status));
  const propostasGanhas = propostas.filter(p => p.status === "Ganha").length;
  const pipelineEmElaboracao = propostas.filter(p => p.status === "Em elaboração").length;

  const laudosRealizados = 47290.64;
  const consultoriaRealizada = 113891.63;
  const laudosOrcado = 6200000;
  const consultoriaOrcado = 2500000;

  const alocData = [
    { name: "Evelyne Ferrari", value: 39749 },
    { name: "Patrick Gomes", value: 13655 },
    { name: "Amanda Sobral", value: 11408 },
    { name: "Thiago Bastos", value: 996 },
  ].filter(d => d.value > 0);

  const maxAlocacao = 39749;
  const utilizacaoMedia = ((alocData.reduce((s, d) => s + d.value, 0) / (alocData.length * maxAlocacao)) * 100).toFixed(1);

  const budgetData = anoSel === 2026
    ? BUDGET2026_MES
    : MESES.map((mes, i) => {
        const m = i + 1;
        const orcado = budgets.filter(b => b.ano === anoSel && b.mes === m).reduce((s, b) => s + (b.valor_orcado || 0), 0);
        const real = parcelas.filter(p => {
          const d = p.data_recebimento ? new Date(p.data_recebimento) : null;
          return d && d.getFullYear() === anoSel && d.getMonth() + 1 === m && p.status === "Recebida";
        }).reduce((s, p) => s + (p.valor || 0), 0);
        return { mes, orcado, real };
      });

  const naturezaData = [
    { name: "Laudo Contábil", value: 47290.64 },
    { name: "Consultoria", value: 113891.63 },
  ];

  const statusMap = {};
  propostas.forEach(p => { statusMap[p.status] = (statusMap[p.status] || 0) + 1; });
  const pipelineData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  if (isLoading) return <LoadingState message="Carregando indicadores..." />;

  return (
    <div className="space-y-6">
      {/* KPIs Globais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          label="Orçado 2026" 
          value={fmt(ORCADO_TOTAL_2026)} 
          icon={Target} 
          color="green" 
          subtitle="Meta anual total"
          variant="highlight"
        />
        <KPICard 
          label="Realizado 2026" 
          value={fmt(REALIZADO_2026)} 
          icon={DollarSign} 
          color="orange" 
          subtitle={`${PCT_ATINGIDO}% da meta`}
          progress={parseFloat(PCT_ATINGIDO)}
          variant="highlight"
        />
        <KPICard 
          label="Propostas Ativas" 
          value={propostasAtivas.length} 
          icon={GitBranch} 
          color="blue" 
          subtitle={`${pipelineEmElaboracao} em elaboração`}
        />
        <KPICard 
          label="Taxa Conversão" 
          value={`${((propostasGanhas / propostas.length) * 100 || 0).toFixed(1)}%`}
          icon={TrendingUp} 
          color="green" 
          subtitle={`${propostasGanhas} propostas ganhas`}
        />
      </div>

      {/* Abas por Setor */}
      <div className="flex gap-1 bg-white border border-[#DDE3DE] rounded-xl p-1 w-fit">
        {ABAS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setAbaAtiva(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              abaAtiva === id
                ? "bg-[#1A4731] text-white shadow-sm"
                : "text-[#5C7060] hover:bg-[#F4F6F4]"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Conteúdo por Aba */}
      {abaAtiva === "laudos" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#DDE3DE] p-5">
            <p className="text-xs font-medium text-[#5C7060] uppercase tracking-wider mb-2">Laudos Contábeis</p>
            <p className="text-3xl font-bold text-[#1A2B1F]">{fmt(laudosRealizados)}</p>
            <p className="text-sm text-[#5C7060] mt-2">{((laudosRealizados / laudosOrcado) * 100).toFixed(2)}% do orçado</p>
            <div className="w-full bg-[#F4F6F4] rounded-full h-2 mt-4">
              <div className="h-2 bg-[#F47920] rounded-full" style={{ width: `${Math.min((laudosRealizados / laudosOrcado) * 100, 100)}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#DDE3DE] p-6">
            <h2 className="font-semibold text-[#1A2B1F] mb-4">Laudos - Real vs Orçado</h2>
            <ModernBarChart
              data={budgetData}
              dataKeys={[
                { dataKey: "orcado", name: "Orçado" },
                { dataKey: "real", name: "Realizado" }
              ]}
              colors={["#E8EDE9", "#F47920"]}
              formatter={fmt}
              height={260}
            />
          </div>

          <div className="bg-white rounded-2xl border border-[#DDE3DE] p-6">
            <h2 className="font-semibold text-[#1A2B1F] mb-1">Carga por Colaborador</h2>
            <p className="text-xs text-[#5C7060] mb-4">Laudos 2026</p>
            <div className="space-y-3">
              {alocData.map((item, i) => {
                const max = Math.max(...alocData.map(d => d.value));
                const pct = max > 0 ? (item.value / max) * 100 : 0;
                const alto = pct > 80;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#1A2B1F] font-medium">{item.name}</span>
                      <span className={alto ? "text-red-500 font-semibold" : "text-[#5C7060]"}>{fmt(item.value)}</span>
                    </div>
                    <div className="w-full bg-[#F4F6F4] rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${alto ? "bg-red-400" : "bg-[#F47920]"}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {abaAtiva === "consultoria" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#DDE3DE] p-5">
            <p className="text-xs font-medium text-[#5C7060] uppercase tracking-wider mb-2">Consultoria</p>
            <p className="text-3xl font-bold text-[#1A2B1F]">{fmt(consultoriaRealizada)}</p>
            <p className="text-sm text-[#5C7060] mt-2">{((consultoriaRealizada / consultoriaOrcado) * 100).toFixed(2)}% do orçado</p>
            <div className="w-full bg-[#F4F6F4] rounded-full h-2 mt-4">
              <div className="h-2 bg-[#1A4731] rounded-full" style={{ width: `${Math.min((consultoriaRealizada / consultoriaOrcado) * 100, 100)}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#DDE3DE] p-6">
            <h2 className="font-semibold text-[#1A2B1F] mb-4">Consultoria - Real vs Orçado</h2>
            <ModernBarChart
              data={budgetData}
              dataKeys={[
                { dataKey: "orcado", name: "Orçado" },
                { dataKey: "real", name: "Realizado" }
              ]}
              colors={["#E8EDE9", "#1A4731"]}
              formatter={fmt}
              height={260}
            />
          </div>
        </div>
      )}

      {abaAtiva === "financeiro" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#DDE3DE] p-5">
              <p className="text-xs font-medium text-[#5C7060] uppercase tracking-wider mb-2">Orçado Total 2026</p>
              <p className="text-3xl font-bold text-[#1A2B1F]">{fmt(ORCADO_TOTAL_2026)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#DDE3DE] p-5">
              <p className="text-xs font-medium text-[#5C7060] uppercase tracking-wider mb-2">Realizado 2026</p>
              <p className="text-3xl font-bold text-[#F47920]">{fmt(REALIZADO_2026)}</p>
              <p className="text-sm text-[#5C7060] mt-2">{((REALIZADO_2026 / ORCADO_TOTAL_2026) * 100).toFixed(1)}% da meta</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#DDE3DE] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-[#1A2B1F]">Real vs Orçado — Vendas Mensais</h2>
              <select className="text-xs border border-[#DDE3DE] rounded-lg px-3 py-1.5 text-[#5C7060] focus:outline-none"
                value={anoSel} onChange={e => setAnoSel(Number(e.target.value))}>
                {[2025,2026].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <ModernBarChart
              data={budgetData}
              dataKeys={[
                { dataKey: "orcado", name: "Orçado" },
                { dataKey: "real", name: "Realizado" }
              ]}
              colors={["#E8EDE9", "#F47920"]}
              formatter={fmt}
              height={260}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#DDE3DE] p-6">
              <h2 className="font-semibold text-[#1A2B1F] mb-1">Receita por Natureza</h2>
              <p className="text-xs text-[#5C7060] mb-4">Contábil vs Consultoria (2026)</p>
              <ModernPieChart
                data={naturezaData}
                colors={["#F47920", "#1A4731"]}
                formatter={fmt}
                height={200}
                innerRadius={50}
                outerRadius={80}
              />
            </div>

            <div className="bg-white rounded-2xl border border-[#DDE3DE] p-6">
              <h2 className="font-semibold text-[#1A2B1F] mb-1">Pipeline por Status</h2>
              <p className="text-xs text-[#5C7060] mb-4">Distribuição das propostas</p>
              {pipelineData.length > 0 ? (
                <ModernPieChart
                  data={pipelineData}
                  height={200}
                  innerRadius={50}
                  outerRadius={80}
                />
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-[#5C7060]">Sem dados</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}