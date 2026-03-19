import { useState } from "react";
import { TrendingUp, Calendar, AlertCircle, CheckCircle2, BarChart3, PieChart } from "lucide-react";
import ModernBarChart from "@/components/charts/ModernBarChart";
import ModernPieChart from "@/components/charts/ModernPieChart";
import MetricTableComponent from "@/components/dashboards/MetricTableComponent";

export default function ContasAreceberTable() {
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("2026");

  // Dados consolidados para integração SAN
  const dadosSAN = {
    totalAReceber: 4770000,
    recebidoMes: 1250000,
    atrasado: 163000,
    inadimplencia: 8,
    pmr: 28,
  };

  // KPIs
  const cards = [
    {
      label: "Total a Receber",
      valor: "R$ 4.77M",
      subtexto: "Créditos em aberto",
      icon: BarChart3,
      cor: "blue",
      destaque: true,
    },
    {
      label: "Recebido no Mês",
      valor: "R$ 1.25M",
      subtexto: "+12% vs. mês anterior",
      icon: CheckCircle2,
      cor: "green",
      destaque: false,
    },
    {
      label: "Atrasado",
      valor: "R$ 163K",
      subtexto: "27 títulos vencidos",
      icon: AlertCircle,
      cor: "red",
      destaque: false,
    },
    {
      label: "Inadimplência",
      valor: "8%",
      subtexto: "Taxa histórica",
      icon: TrendingUp,
      cor: "orange",
      destaque: false,
    },
    {
      label: "Prazo Médio (PMR)",
      valor: "28 dias",
      subtexto: "Dias até recebimento",
      icon: Calendar,
      cor: "purple",
      destaque: false,
    },
  ];

  // Tabela de dados
  const tableRows = [
    { label: "Vencidas", data: ["8", "5", "10", "4", "7", "27"] },
    { label: "A receber (0-30 dias)", data: ["52", "48", "55", "50", "51", "205"] },
    { label: "A receber (31-60 dias)", data: ["35", "40", "38", "42", "39", "155"] },
    { label: "A receber (61+ dias)", data: ["25", "22", "28", "26", "25", "101"] },
  ];

  const valueRows = [
    { label: "Total Vencidas", data: ["R$ 45K", "R$ 35K", "R$ 55K", "R$ 28K", "R$ 41K", "R$ 163K"] },
    { label: "Total a Receber", data: ["R$ 1.2M", "R$ 1.15M", "R$ 1.25M", "R$ 1.18M", "R$ 1.19M", "R$ 4.77M"] },
    { label: "Taxa de Recebimento", data: ["92%", "94%", "90%", "93%", "92%", "92%"] },
  ];

  const indicadoresAvancados = [
    { label: "Dias Médios de Recebimento", data: ["28", "25", "32", "26", "29", "28"] },
    { label: "Ticket Médio de Venda", data: ["R$ 22.8K", "R$ 23.9K", "R$ 22.7K", "R$ 23.6K", "R$ 23.3K", "R$ 23.2K"] },
    { label: "Concentração Top 10 Clientes", data: ["42%", "45%", "40%", "43%", "42%", "42%"] },
    { label: "Taxa de Inadimplência", data: ["8%", "6%", "10%", "7%", "8%", "8%"] },
  ];

  // Dados de gráficos
  const agingData = [
    { name: "0-30 dias", value: 1820000 },
    { name: "31-60 dias", value: 1240000 },
    { name: "61+ dias", value: 1547000 },
    { name: "Vencidas", value: 163000 },
  ];

  const evolucaoMensalData = [
    { mes: "Jan", total: 1200000, recebido: 1100000 },
    { mes: "Fev", total: 1150000, recebido: 1080000 },
    { mes: "Mar", total: 1250000, recebido: 1130000 },
    { mes: "Abr", total: 1180000, recebido: 1095000 },
    { mes: "Mai", total: 1190000, recebido: 1120000 },
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
          <h1 className="text-2xl font-bold text-[#1A2B1F]">Contas a Receber</h1>
          <p className="text-sm text-[#5C7060] mt-1">Dashboard executivo de créditos e recebimentos</p>
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
          placeholder="Filtrar cliente..."
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
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
            <h2 className="font-semibold text-[#1A2B1F]">Evolução de Recebimentos</h2>
            <p className="text-xs text-[#5C7060] mt-0.5">Títulos vs. Recebido por período</p>
          </div>
          <ModernBarChart
            data={evolucaoMensalData}
            dataKeys={[
              { dataKey: "total", name: "Total a Receber" },
              { dataKey: "recebido", name: "Recebido" },
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