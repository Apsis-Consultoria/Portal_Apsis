import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Package, Users, Wrench, TrendingUp, AlertCircle } from "lucide-react";
import DashboardTIComponent from "@/components/tecnologia/DashboardTIComponent";

export default function DashboardTI() {
  const { data: ativos } = useQuery({
    queryKey: ["ativos-ti-dashboard"],
    queryFn: async () => {
      return await base44.entities.AtivoTI.list("-created_date", 200) || [];
    },
  });

  const { data: alocacoes } = useQuery({
    queryKey: ["alocacoes-dashboard"],
    queryFn: async () => {
      return await base44.entities.AlocacaoEquipamento.list("-created_date", 200) || [];
    },
  });

  const { data: movimentacoes } = useQuery({
    queryKey: ["movimentacoes-dashboard"],
    queryFn: async () => {
      return await base44.entities.MovimentacaoEquipamento.list("-created_date", 200) || [];
    },
  });

  const ativosData = ativos || [];
  const alocacoesData = alocacoes || [];
  const movimentacoesData = movimentacoes || [];

  // Cálculos
  const totalAtivos = ativosData.length;
  const emEstoque = ativosData.filter((a) => a.status === "em_estoque").length;
  const emUso = ativosData.filter((a) => a.status === "em_uso").length;
  const emManutencao = ativosData.filter((a) => a.status === "em_manutencao").length;
  const alocacoesAtivas = alocacoesData.filter((a) => a.status === "ativo").length;

  // Distribuição por tipo
  const porTipo = {};
  ativosData.forEach((a) => {
    porTipo[a.tipo] = (porTipo[a.tipo] || 0) + 1;
  });

  // Distribuição por departamento
  const porDepartamento = {};
  alocacoesData.forEach((a) => {
    if (a.departamento) {
      porDepartamento[a.departamento] = (porDepartamento[a.departamento] || 0) + 1;
    }
  });

  const valor_total = ativosData.reduce((sum, a) => sum + (a.valor || 0), 0);

  const fmt = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(v || 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1A2B1F]">Dashboard de TI</h1>
        <p className="text-[#5C7060] mt-2">Visão executiva de ativos e alocações</p>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5C7060] uppercase">Total de Ativos</p>
              <p className="text-3xl font-bold text-blue-700 mt-2">{totalAtivos}</p>
              <p className="text-xs text-[#5C7060] mt-1">{fmt(valor_total)}</p>
            </div>
            <Package size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5C7060] uppercase">Em Uso</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{emUso}</p>
              <p className="text-xs text-[#5C7060] mt-1">{alocacoesAtivas} alocações</p>
            </div>
            <Users size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5C7060] uppercase">Em Estoque</p>
              <p className="text-3xl font-bold text-orange-700 mt-2">{emEstoque}</p>
              <p className="text-xs text-[#5C7060] mt-1">Disponíveis</p>
            </div>
            <Package size={24} className="text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5C7060] uppercase">Em Manutenção</p>
              <p className="text-3xl font-bold text-red-700 mt-2">{emManutencao}</p>
              <p className="text-xs text-[#5C7060] mt-1">Aguardando</p>
            </div>
            <Wrench size={24} className="text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5C7060] uppercase">Movimentações</p>
              <p className="text-3xl font-bold text-purple-700 mt-2">{movimentacoesData.length}</p>
              <p className="text-xs text-[#5C7060] mt-1">Últimos registros</p>
            </div>
            <TrendingUp size={24} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Gráficos e distribuição */}
      <DashboardTIComponent
        porTipo={porTipo}
        porDepartamento={porDepartamento}
        ativos={ativosData}
      />
    </div>
  );
}