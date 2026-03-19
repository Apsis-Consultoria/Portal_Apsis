import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import AlocacaoEquipamentosTable from "@/components/tecnologia/AlocacaoEquipamentosTable";
import NovaAlocacaoModal from "@/components/tecnologia/NovaAlocacaoModal";

export default function AlocacaoEquipamentos() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["alocacoes-equipamento"],
    queryFn: async () => {
      const alocacoes = await base44.entities.AlocacaoEquipamento.list("-created_date", 200);
      return alocacoes || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const alocacoes = data || [];

  const alocacoes_filtradas = filtroStatus 
    ? alocacoes.filter((a) => a.status === filtroStatus)
    : alocacoes;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2B1F]">Alocação de Equipamentos</h1>
          <p className="text-sm text-[#5C7060] mt-1">Vincular equipamentos a usuários</p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A4731] text-white rounded-lg hover:bg-[#245E40] transition-colors"
        >
          <Plus size={18} />
          Nova Alocação
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Alocações Ativas</p>
          <p className="text-2xl font-bold text-green-700 mt-2">
            {alocacoes.filter((a) => a.status === "ativo").length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Devolvidas</p>
          <p className="text-2xl font-bold text-blue-700 mt-2">
            {alocacoes.filter((a) => a.status === "devolvido").length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Total de Alocações</p>
          <p className="text-2xl font-bold text-orange-700 mt-2">{alocacoes.length}</p>
        </div>
      </div>

      {/* Filtro */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-4">
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-3 py-2 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="devolvido">Devolvido</option>
          <option value="substituido">Substituído</option>
        </select>
      </div>

      {/* Tabela */}
      <AlocacaoEquipamentosTable alocacoes={alocacoes_filtradas} isLoading={isLoading} refetch={refetch} />

      {/* Modal */}
      {mostrarModal && (
        <NovaAlocacaoModal onClose={() => setMostrarModal(false)} onSuccess={refetch} />
      )}
    </div>
  );
}