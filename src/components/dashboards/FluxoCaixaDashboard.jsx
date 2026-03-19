import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Calendar,
  ArrowRightLeft,
} from "lucide-react";
import ModernBarChart from "@/components/charts/ModernBarChart";
import ModernLineChart from "@/components/charts/ModernLineChart";

export default function FluxoCaixaDashboard() {
  const [filtroPeriodo, setFiltroPeriodo] = useState("30");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroProjeto, setFiltroProjeto] = useState("");

  // Dados consolidados de Contas a Receber e Pagar
  const saldoAtual = 850000;
  const totalAReceber = 4770000;
  const totalAPagar = 3550000;
  const resultadoPeriodo = totalAReceber - totalAPagar;
  const saldoProjetado = saldoAtual + resultadoPeriodo;

  // Fluxo por período
  const fluxoPorPeriodo = [
    {
      periodo: "Hoje",
      dias: "0",
      aReceber: 45000,
      aPagar: 85000,
      saldo: -40000,
      acumulado: saldoAtual - 40000,
    },
    {
      periodo: "7 dias",
      dias: "7",
      aReceber: 320000,
      aPagar: 210000,
      saldo: 110000,
      acumulado: saldoAtual - 40000 + 110000,
    },
    {
      periodo: "15 dias",
      dias: "15",
      aReceber: 580000,
      aPagar: 485000,
      saldo: 95000,
      acumulado: saldoAtual - 40000 + 110000 + 95000,
    },
    {
      periodo: "30 dias",
      dias: "30",
      aReceber: 1200000,
      aPagar: 950000,
      saldo: 250000,
      acumulado: saldoAtual - 40000 + 110000 + 95000 + 250000,
    },
    {
      periodo: "60 dias",
      dias: "60",
      aReceber: 2150000,
      aPagar: 1850000,
      saldo: 300000,
      acumulado: saldoAtual - 40000 + 110000 + 95000 + 250000 + 300000,
    },
    {
      periodo: "90 dias",
      dias: "90",
      aReceber: 3200000,
      aPagar: 2750000,
      saldo: 450000,
      acumulado: saldoAtual - 40000 + 110000 + 95000 + 250000 + 300000 + 450000,
    },
  ];

  // Dados para gráfico de evolução
  const evolucaoMensalData = [
    { mes: "Jan", entrada: 1100000, saida: 780000, saldo: 320000 },
    { mes: "Fev", entrada: 1080000, saida: 850000, saldo: 230000 },
    { mes: "Mar", entrada: 1130000, saida: 810000, saldo: 320000 },
    { mes: "Abr", entrada: 1095000, saida: 840000, saldo: 255000 },
    { mes: "Mai", entrada: 1120000, saida: 825000, saldo: 295000 },
  ];

  // Dados para gráfico de linha (saldo acumulado)
  const saldoAcumuladoData = [
    { mes: "Jan", saldo: 320000 },
    { mes: "Fev", saldo: 550000 },
    { mes: "Mar", saldo: 870000 },
    { mes: "Abr", saldo: 1125000 },
    { mes: "Mai", saldo: 1420000 },
  ];

  // Indicadores
  const fluxoPositivo = resultadoPeriodo > 0;
  const picoSaida = 950000;
  const picoEntrada = 1200000;
  const diasCriticos = fluxoPorPeriodo.filter((p) => p.acumulado < 0);
  const tendencia = "positiva";

  // Alertas
  const alertas = [
    {
      tipo: "sucesso",
      titulo: "Fluxo Positivo",
      mensagem: `Saldo positivo de R$ ${fmt(resultadoPeriodo)}`,
    },
    ...(diasCriticos.length > 0
      ? [
          {
            tipo: "alerta",
            titulo: "Atenção: Saldo Negativo",
            mensagem: `Potencial saldo negativo em ${diasCriticos[0].periodo}`,
          },
        ]
      : []),
    {
      tipo: "info",
      titulo: "Concentração de Saída",
      mensagem: `Pico de pagamento em 30 dias: R$ ${fmt(picoSaida)}`,
    },
  ];

  const fmt = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(v || 0);

  const corSaldo = (valor) => {
    if (valor > 0) return "text-green-700";
    if (valor < 0) return "text-red-700";
    return "text-[#5C7060]";
  };

  const fundoSaldo = (valor) => {
    if (valor > 0) return "bg-gradient-to-br from-green-50 to-green-100 border-green-200";
    if (valor < 0)
      return "bg-gradient-to-br from-red-50 to-red-100 border-red-200";
    return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200";
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2B1F]">Fluxo de Caixa</h1>
          <p className="text-sm text-[#5C7060] mt-1">
            Dashboard consolidado de entradas e saídas
          </p>
        </div>
      </div>

      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all">
          <p className="text-xs font-semibold text-[#5C7060] uppercase tracking-wider">
            Saldo Atual
          </p>
          <p className="text-2xl font-bold text-blue-700 mt-2">
            {fmt(saldoAtual)}
          </p>
          <p className="text-xs text-[#5C7060] mt-1">Caixa hoje</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all">
          <p className="text-xs font-semibold text-[#5C7060] uppercase tracking-wider">
            A Receber
          </p>
          <p className="text-2xl font-bold text-green-700 mt-2">
            {fmt(totalAReceber)}
          </p>
          <p className="text-xs text-[#5C7060] mt-1">Entradas previstas</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 hover:shadow-md transition-all">
          <p className="text-xs font-semibold text-[#5C7060] uppercase tracking-wider">
            A Pagar
          </p>
          <p className="text-2xl font-bold text-red-700 mt-2">
            {fmt(totalAPagar)}
          </p>
          <p className="text-xs text-[#5C7060] mt-1">Saídas previstas</p>
        </div>

        <div className={`rounded-xl p-4 border hover:shadow-md transition-all ${fundoSaldo(resultadoPeriodo)}`}>
          <p className="text-xs font-semibold text-[#5C7060] uppercase tracking-wider">
            Resultado
          </p>
          <p className={`text-2xl font-bold mt-2 ${corSaldo(resultadoPeriodo)}`}>
            {fmt(resultadoPeriodo)}
          </p>
          <p className="text-xs text-[#5C7060] mt-1">Receber - Pagar</p>
        </div>

        <div className={`rounded-xl p-4 border hover:shadow-md transition-all ${fundoSaldo(saldoProjetado)}`}>
          <p className="text-xs font-semibold text-[#5C7060] uppercase tracking-wider">
            Saldo Projetado
          </p>
          <p className={`text-2xl font-bold mt-2 ${corSaldo(saldoProjetado)}`}>
            {fmt(saldoProjetado)}
          </p>
          <p className="text-xs text-[#5C7060] mt-1">Em 90 dias</p>
        </div>
      </div>

      {/* Alertas */}
      <div className="space-y-2">
        {alertas.map((alerta, idx) => {
          const cores = {
            sucesso:
              "bg-green-50 border-l-4 border-green-500 text-green-900 pl-4",
            alerta: "bg-orange-50 border-l-4 border-orange-500 text-orange-900 pl-4",
            info: "bg-blue-50 border-l-4 border-blue-500 text-blue-900 pl-4",
          };
          return (
            <div
              key={idx}
              className={`rounded-lg p-3 border border-l-0 ${cores[alerta.tipo] || cores.info}`}
            >
              <p className="text-sm font-semibold">{alerta.titulo}</p>
              <p className="text-xs mt-0.5 opacity-90">{alerta.mensagem}</p>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-4 flex flex-wrap gap-3">
        <select
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value)}
          className="px-3 py-1.5 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        >
          <option value="30">Próximos 30 dias</option>
          <option value="60">Próximos 60 dias</option>
          <option value="90">Próximos 90 dias</option>
          <option value="180">Próximos 180 dias</option>
        </select>
        <input
          type="text"
          placeholder="Filtrar cliente..."
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="px-3 py-1.5 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        />
        <input
          type="text"
          placeholder="Filtrar projeto..."
          value={filtroProjeto}
          onChange={(e) => setFiltroProjeto(e.target.value)}
          className="px-3 py-1.5 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        />
      </div>

      {/* Fluxo por Período - Tabela */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
        <div className="mb-4">
          <h2 className="font-semibold text-[#1A2B1F]">Fluxo por Período</h2>
          <p className="text-xs text-[#5C7060] mt-0.5">
            Consolidação de entradas e saídas
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#DDE3DE]">
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">
                  Período
                </th>
                <th className="text-right px-4 py-3 font-semibold text-green-700">
                  A Receber
                </th>
                <th className="text-right px-4 py-3 font-semibold text-red-700">
                  A Pagar
                </th>
                <th className="text-right px-4 py-3 font-semibold text-[#1A2B1F]">
                  Saldo
                </th>
                <th className="text-right px-4 py-3 font-semibold text-[#F47920]">
                  Acumulado
                </th>
              </tr>
            </thead>
            <tbody>
              {fluxoPorPeriodo.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#DDE3DE] hover:bg-[#F4F6F4] transition-colors"
                >
                  <td className="px-4 py-3 text-[#1A2B1F] font-medium">
                    {item.periodo}
                  </td>
                  <td className="text-right px-4 py-3 text-green-700 font-medium">
                    {fmt(item.aReceber)}
                  </td>
                  <td className="text-right px-4 py-3 text-red-700 font-medium">
                    {fmt(item.aPagar)}
                  </td>
                  <td className={`text-right px-4 py-3 font-bold ${corSaldo(item.saldo)}`}>
                    {fmt(item.saldo)}
                  </td>
                  <td
                    className={`text-right px-4 py-3 font-bold ${corSaldo(
                      item.acumulado
                    )} bg-opacity-10`}
                  >
                    {fmt(item.acumulado)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entrada vs Saída */}
        <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-[#1A2B1F]">Entrada vs Saída</h2>
            <p className="text-xs text-[#5C7060] mt-0.5">
              Comparativo mensal
            </p>
          </div>
          <ModernBarChart
            data={evolucaoMensalData}
            dataKeys={[
              { dataKey: "entrada", name: "Entrada" },
              { dataKey: "saida", name: "Saída" },
            ]}
            colors={["#1A4731", "#EF4444"]}
            formatter={fmt}
            height={220}
          />
        </div>

        {/* Saldo Acumulado */}
        <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-[#1A2B1F]">Saldo Acumulado</h2>
            <p className="text-xs text-[#5C7060] mt-0.5">Evolução histórica</p>
          </div>
          <ModernLineChart
            data={saldoAcumuladoData}
            dataKey="saldo"
            color="#F47920"
            formatter={fmt}
            height={220}
            name="Saldo"
          />
        </div>
      </div>

      {/* Indicadores Avançados */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
        <h2 className="font-semibold text-[#1A2B1F] mb-4">Indicadores Avançados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-[#F4F6F4] rounded-lg">
            <p className="text-xs text-[#5C7060] font-semibold uppercase tracking-wider mb-2">
              Fluxo Resultado
            </p>
            <p className={`text-xl font-bold ${fluxoPositivo ? "text-green-700" : "text-red-700"}`}>
              {fluxoPositivo ? "Positivo" : "Negativo"}
            </p>
            <p className="text-xs text-[#5C7060] mt-1">{fmt(resultadoPeriodo)}</p>
          </div>

          <div className="p-4 bg-[#F4F6F4] rounded-lg">
            <p className="text-xs text-[#5C7060] font-semibold uppercase tracking-wider mb-2">
              Pico de Saída
            </p>
            <p className="text-xl font-bold text-red-700">{fmt(picoSaida)}</p>
            <p className="text-xs text-[#5C7060] mt-1">30 dias</p>
          </div>

          <div className="p-4 bg-[#F4F6F4] rounded-lg">
            <p className="text-xs text-[#5C7060] font-semibold uppercase tracking-wider mb-2">
              Pico de Entrada
            </p>
            <p className="text-xl font-bold text-green-700">{fmt(picoEntrada)}</p>
            <p className="text-xs text-[#5C7060] mt-1">30 dias</p>
          </div>

          <div className="p-4 bg-[#F4F6F4] rounded-lg">
            <p className="text-xs text-[#5C7060] font-semibold uppercase tracking-wider mb-2">
              Dias Críticos
            </p>
            <p className="text-xl font-bold text-orange-700">
              {diasCriticos.length}
            </p>
            <p className="text-xs text-[#5C7060] mt-1">Saldo negativo previsto</p>
          </div>

          <div className="p-4 bg-[#F4F6F4] rounded-lg">
            <p className="text-xs text-[#5C7060] font-semibold uppercase tracking-wider mb-2">
              Tendência
            </p>
            <p className="text-xl font-bold text-[#1A4731]">
              {tendencia === "positiva" ? "↑" : "↓"} Positiva
            </p>
            <p className="text-xs text-[#5C7060] mt-1">Próximos 90 dias</p>
          </div>
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