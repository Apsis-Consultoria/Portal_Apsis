import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import NovaMovimentacaoMaterialModal from "./NovaMovimentacaoMaterialModal";

export default function EstoqueMovimentacoes() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["movimentacoes-material"],
    queryFn: async () => {
      const movs = await base44.entities.EstoqueMovimentacao.list("-created_date", 200);
      return movs || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const movimentacoes = data || [];

  const movimentacoes_filtradas = filtroTipo
    ? movimentacoes.filter((m) => m.tipo_movimentacao === filtroTipo)
    : movimentacoes;

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "entrada":
        return "bg-green-100 text-green-700";
      case "saida":
        return "bg-red-100 text-red-700";
      case "devolucao":
        return "bg-blue-100 text-blue-700";
      case "ajuste":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const tipoLabel = {
    entrada: "Entrada",
    saida: "Saída",
    devolucao: "Devolução",
    ajuste: "Ajuste"
  };

  const fmt = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(v || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#5C7060]">Histórico de movimentações de materiais</p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A4731] text-white rounded-lg hover:bg-[#245E40] transition-colors"
        >
          <Plus size={18} />
          Nova Movimentação
        </button>
      </div>

      {/* Filtro */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-4">
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-3 py-2 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        >
          <option value="">Todos os tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="devolucao">Devolução</option>
          <option value="ajuste">Ajuste</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
        <h2 className="font-semibold text-[#1A2B1F] mb-4">{movimentacoes_filtradas.length} movimentação{movimentacoes_filtradas.length !== 1 ? 's' : ''}</h2>
        {isLoading ? (
          <div className="text-center py-8 text-[#5C7060]">Carregando...</div>
        ) : movimentacoes_filtradas.length === 0 ? (
          <div className="text-center py-8 text-[#5C7060]">Nenhuma movimentação encontrada</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#DDE3DE]">
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Data</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Tipo</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Material</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#1A2B1F]">Qtd</th>
                  <th className="text-right px-4 py-3 font-semibold text-[#1A2B1F]">Valor Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Observação</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes_filtradas.map((mov) => (
                  <tr key={mov.id} className="border-b border-[#DDE3DE] hover:bg-[#F4F6F4] transition-colors">
                    <td className="px-4 py-3 text-[#1A2B1F]">
                      {new Date(mov.data_movimentacao).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTipoColor(mov.tipo_movimentacao)}`}>
                        {tipoLabel[mov.tipo_movimentacao]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1A2B1F]">{mov.material}</td>
                    <td className="text-center px-4 py-3 font-medium text-[#1A2B1F]">{mov.quantidade} {mov.unidade}</td>
                    <td className="text-right px-4 py-3 font-medium text-[#1A2B1F]">{fmt(mov.valor_total)}</td>
                    <td className="px-4 py-3 text-[#5C7060] text-xs max-w-xs truncate">{mov.observacao || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarModal && <NovaMovimentacaoMaterialModal onClose={() => setMostrarModal(false)} onSuccess={refetch} />}
    </div>
  );
}