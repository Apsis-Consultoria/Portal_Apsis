import { useState } from "react";
import { TrendingDown, Calendar, AlertTriangle, CheckCircle2, BarChart3, PieChart } from "lucide-react";
import ModernBarChart from "@/components/charts/ModernBarChart";
import ModernPieChart from "@/components/charts/ModernPieChart";
import MetricTableComponent from "@/components/dashboards/MetricTableComponent";

export default function ContasApagarTable() {
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("2026");

  // Dados consolidados para integração SAN
  const dadosSAN = {
    totalAPagar: 3550000,
    pagoPmMes: 950000,
    vencido: 405000,
    adimplencia: 88,
    pmp: 31,
    fluxoCaixa: 1245000,
  };

  // KPIs
  const cards = [
    {
      label: "Total a Pagar",
      valor: "R$ 3.55M",
      subtexto: "Obrigações em aberto",
      icon: BarChart3,
      cor: "blue",
      destaque: true,
    },
    {
      label: "Pago no Mês",
      valor: "R$ 950K",
      subtexto: "+8% vs. mês anterior",
      icon: CheckCircle2,
      cor: "green",
      destaque: false,
    },
    {
      label: "Vencido",
      valor: "R$ 405K",
      subtexto: "40 títulos atrasados",
      icon: AlertTriangle,
      cor: "red",
      destaque: false,
    },
    {
      label: "Fluxo de Caixa",
      valor: "R$ 1.24M",
      subtexto: "Previsto 30 dias",
      icon: TrendingDown,
      cor: "orange",
      destaque: false,
    },
    {
      label: "Prazo Médio (PMP)",
      valor: "31 dias",
      subtexto: "Dias para pagamento",
      icon: Calendar,
      cor: "purple",
      destaque: false,
    },
  ];

  // Tabela de dados
  const tableRows = [
    { label: "Vencidas", data: ["15", "8", "12", "5", "12", "40"] },
    { label: "A vencer (0-30 dias)", data: ["45", "38", "42", "40", "41", "165"] },
    { label: "A vencer (31-60 dias)", data: ["28", "35", "30", "32", "31", "125"] },
    { label: "A vencer (61+ dias)", data: ["22", "19", "25", "23", "23", "89"] },
  ];

  const valueRows = [
    { label: "Total Vencidas", data: ["R$ 125K", "R$ 95K", "R$ 110K", "R$ 75K", "R$ 101K", "R$ 405K"] },
    { label: "Total a Pagar", data: ["R$ 850K", "R$ 920K", "R$ 880K", "R$ 900K", "R$ 890K", "R$ 3.55M"] },
    { label: "% Adimplência", data: ["85%", "90%", "87%", "92%", "87%", "88%"] },
  ];

  const indicadoresAvancados = [
    { label: "Dias Médios de Pagamento", data: ["32", "28", "35", "30", "32", "31"] },
    { label: "Ticket Médio a Pagar", data: ["R$ 18.5K", "R$ 24.2K", "R$ 20.9K", "R$ 22.1K", "R$ 21.7K", "R$ 21.5K"] },
    { label: "Rotatividade de Fornecedores", data: ["12", "14", "11", "13", "12", "13"] },
    { label: "% de Atraso", data: ["15%", "10%", "13%", "8%", "13%", "12%"] },
  ];

  // Dados de gráficos
  const agingData = [
    { name: "0-30 dias", value: 1450000 },
    { name: "31-60 dias", value: 980000 },
    { name: "61+ dias", value: 720000 },
    { name: "Vencidas", value: 405000 },
  ];

  const evolucaoMensalData = [
    { mes: "Jan", total: 850000, pago: 780000 },
    { mes: "Fev", total: 920000, pago: 850000 },
    { mes: "Mar", total: 880000, pago: 810000 },
    { mes: "Abr", total: 900000, pago: 840000 },
    { mes: "Mai", total: 890000, pago: 825000 },
  ];

  const corCard = (cor) => {
    const cores = {
      blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
      green: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
      red: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
      orange: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
      purple: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
    };
    return cores[cor] || cores.blue;
  };

  const corTexto = (cor) => {
    const cores = {
      blue: "text-blue-700",
      green: "text-green-700",
      red: "text-red-700",
      orange: "text-orange-700",
      purple: "text-purple-700",
    };
    return cores[cor] || cores.blue;
  };

  const fmt = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(v || 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2B1F]">Contas a Pagar</h1>
          <p className="text-sm text-[#5C7060] mt-1">Dashboard executivo de obrigações e pagamentos</p>
        </div>
      </div>

      {/* KPIs - Resumo Executivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-xl p-4 border transition-all duration-200 hover:shadow-md ${corCard(card.cor)} ${
                card.destaque ? "ring-2 ring-offset-2 ring-[#F47920] lg:col-span-2" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-[#5C7060] uppercase tracking-wider">{card.label}</p>
                  <p className={`text-2xl font-bold mt-2 ${corTexto(card.cor)}`}>{card.valor}</p>
                </div>
                <Icon size={20} className={corTexto(card.cor)} />
              </div>
              <p className="text-xs text-[#5C7060]">{card.subtexto}</p>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Filtrar fornecedor..."
          value={filtroFornecedor}
          onChange={(e) => setFiltroFornecedor(e.target.value)}
          className="px-3 py-1.5 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-3 py-1.5 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        >
          <option value="">Todos os status</option>
          <option value="vencido">Vencido</option>
          <option value="0-30">0-30 dias</option>
          <option value="31-60">31-60 dias</option>
          <option value="61+">61+ dias</option>
        </select>
        <select
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value)}
          className="px-3 py-1.5 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        >
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aging Financeiro */}
        <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-[#1A2B1F]">Aging Financeiro</h2>
            <p className="text-xs text-[#5C7060] mt-0.5">Distribuição por faixa de vencimento</p>
          </div>
          <ModernPieChart
            data={agingData}
            colors={["#1A4731", "#F47920", "#FDB913", "#EF4444"]}
            formatter={fmt}
            height={220}
            innerRadius={45}
            outerRadius={85}
          />
        </div>

        {/* Evolução Mensal */}
        <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-[#1A2B1F]">Evolução de Pagamentos</h2>
            <p className="text-xs text-[#5C7060] mt-0.5">Títulos vs. Pagos por período</p>
          </div>
          <ModernBarChart
            data={evolucaoMensalData}
            dataKeys={[
              { dataKey: "total", name: "Total a Pagar" },
              { dataKey: "pago", name: "Pago" },
            ]}
            colors={["#E8EDE9", "#1A4731"]}
            formatter={fmt}
            height={220}
          />
        </div>
      </div>

      {/* Tabelas Detalhadas */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
          <h3 className="font-semibold text-[#1A2B1F] mb-4">Quantidade de Títulos por Status</h3>
          <MetricTableComponent title="Status" rows={tableRows} />
        </div>

        <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
          <h3 className="font-semibold text-[#1A2B1F] mb-4">Valores por Período</h3>
          <MetricTableComponent title="Período" rows={valueRows} />
        </div>

        <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
          <h3 className="font-semibold text-[#1A2B1F] mb-4">Indicadores Avançados</h3>
          <MetricTableComponent title="Indicador" rows={indicadoresAvancados} />
        </div>
      </div>

      {/* CSS para animação */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}