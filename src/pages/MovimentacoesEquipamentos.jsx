import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import MovimentacoesTable from "@/components/tecnologia/MovimentacoesTable";
import NovaMovimentacaoModal from "@/components/tecnologia/NovaMovimentacaoModal";

export default function MovimentacoesEquipamentos() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["movimentacoes-equipamento"],
    queryFn: async () => {
      const movs = await base44.entities.MovimentacaoEquipamento.list("-created_date", 200);
      return movs || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const movimentacoes = data || [];

  const movimentacoes_filtradas = filtroTipo
    ? movimentacoes.filter((m) => m.tipo_movimentacao === filtroTipo)
    : movimentacoes;

  const contadores = {
    entrega: movimentacoes.filter((m) => m.tipo_movimentacao === "entrega").length,
    devolucao: movimentacoes.filter((m) => m.tipo_movimentacao === "devolucao").length,
    troca: movimentacoes.filter((m) => m.tipo_movimentacao === "troca").length,
    manutencao: movimentacoes.filter((m) => m.tipo_movimentacao === "manutencao").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2B1F]">Movimentações</h1>
          <p className="text-sm text-[#5C7060] mt-1">Histórico de entrega, devolução e manutenção</p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A4731] text-white rounded-lg hover:bg-[#245E40] transition-colors"
        >
          <Plus size={18} />
          Nova Movimentação
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Entregas</p>
          <p className="text-2xl font-bold text-blue-700 mt-2">{contadores.entrega}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Devoluções</p>
          <p className="text-2xl font-bold text-green-700 mt-2">{contadores.devolucao}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Trocas</p>
          <p className="text-2xl font-bold text-orange-700 mt-2">{contadores.troca}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Manutenção</p>
          <p className="text-2xl font-bold text-red-700 mt-2">{contadores.manutencao}</p>
        </div>
      </div>

      {/* Filtro */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-4">
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-3 py-2 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        >
          <option value="">Todos os tipos</option>
          <option value="entrega">Entrega</option>
          <option value="devolucao">Devolução</option>
          <option value="troca">Troca</option>
          <option value="manutencao">Manutenção</option>
          <option value="reparo">Reparo</option>
        </select>
      </div>

      {/* Tabela */}
      <MovimentacoesTable movimentacoes={movimentacoes_filtradas} isLoading={isLoading} refetch={refetch} />

      {/* Modal */}
      {mostrarModal && (
        <NovaMovimentacaoModal onClose={() => setMostrarModal(false)} onSuccess={refetch} />
      )}
    </div>
  );
}