import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, AlertTriangle } from "lucide-react";
import NovoMaterialModal from "./NovoMaterialModal";

export default function EstoqueMateriais() {
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["materiais"],
    queryFn: async () => {
      const materiais = await base44.entities.Material.filter({ ativo: true }, "-created_date", 200);
      return materiais || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const materiais = data || [];

  const materiais_filtrados = materiais.filter((m) => {
    const matchBusca = !busca || m.nome?.toLowerCase().includes(busca.toLowerCase()) ||
                       m.codigo?.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = !filtroCategoria || m.categoria === filtroCategoria;
    return matchBusca && matchCategoria;
  });

  const totalValor = materiais.reduce((sum, m) => sum + (m.valor_total || 0), 0);
  const alerta_quantidade = materiais.filter((m) => m.quantidade_atual <= m.quantidade_minima);

  const fmt = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(v || 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Total de Itens</p>
          <p className="text-2xl font-bold text-blue-700 mt-2">{materiais.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Valor Total</p>
          <p className="text-2xl font-bold text-green-700 mt-2">{fmt(totalValor)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Em Estoque</p>
          <p className="text-2xl font-bold text-orange-700 mt-2">
            {materiais.reduce((s, m) => s + (m.quantidade_atual || 0), 0)}
          </p>
        </div>
        <div className={`bg-gradient-to-br ${alerta_quantidade.length > 0 ? 'from-red-50 to-red-100 border-red-200' : 'from-gray-50 to-gray-100 border-gray-200'} border rounded-xl p-4`}>
          <p className="text-xs font-semibold text-[#5C7060] uppercase">Alerta Estoque Baixo</p>
          <p className={`text-2xl font-bold mt-2 ${alerta_quantidade.length > 0 ? 'text-red-700' : 'text-gray-700'}`}>
            {alerta_quantidade.length}
          </p>
        </div>
      </div>

      {/* Alertas */}
      {alerta_quantidade.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">Atenção: Estoque baixo</p>
            <p className="text-sm text-red-600 mt-1">
              {alerta_quantidade.map(m => m.nome).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-4 flex gap-3 flex-wrap">
        <div className="flex-1 min-w-64 flex items-center gap-2 bg-[#F4F6F4] px-3 py-2 rounded-lg">
          <Search size={16} className="text-[#5C7060]" />
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-3 py-2 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        >
          <option value="">Todas as categorias</option>
          <option value="componentes">Componentes</option>
          <option value="consumiveis">Consumíveis</option>
          <option value="ferramentas">Ferramentas</option>
          <option value="equipamentos">Equipamentos</option>
          <option value="outros">Outros</option>
        </select>
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A4731] text-white rounded-lg hover:bg-[#245E40] transition-colors"
        >
          <Plus size={18} />
          Novo Material
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
        <h2 className="font-semibold text-[#1A2B1F] mb-4">{materiais_filtrados.length} material{materiais_filtrados.length !== 1 ? 'is' : ''}</h2>
        {isLoading ? (
          <div className="text-center py-8 text-[#5C7060]">Carregando...</div>
        ) : materiais_filtrados.length === 0 ? (
          <div className="text-center py-8 text-[#5C7060]">Nenhum material encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#DDE3DE]">
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Material</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Código</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Categoria</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#1A2B1F]">Qtd</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#1A2B1F]">Mín</th>
                  <th className="text-right px-4 py-3 font-semibold text-[#1A2B1F]">Valor Unit</th>
                  <th className="text-right px-4 py-3 font-semibold text-[#1A2B1F]">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Local</th>
                </tr>
              </thead>
              <tbody>
                {materiais_filtrados.map((material) => (
                  <tr 
                    key={material.id} 
                    className={`border-b border-[#DDE3DE] hover:bg-[#F4F6F4] transition-colors ${
                      material.quantidade_atual <= material.quantidade_minima ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-[#1A2B1F]">{material.nome}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#5C7060]">{material.codigo || "-"}</td>
                    <td className="px-4 py-3 capitalize text-[#5C7060]">{material.categoria}</td>
                    <td className="text-center px-4 py-3 font-medium text-[#1A2B1F]">
                      {material.quantidade_atual} {material.unidade_medida}
                    </td>
                    <td className="text-center px-4 py-3 text-[#5C7060]">{material.quantidade_minima}</td>
                    <td className="text-right px-4 py-3 text-[#5C7060]">{fmt(material.valor_unitario)}</td>
                    <td className="text-right px-4 py-3 font-medium text-[#1A2B1F]">{fmt(material.valor_total)}</td>
                    <td className="px-4 py-3 text-[#5C7060] text-xs">{material.localizacao || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarModal && <NovoMaterialModal onClose={() => setMostrarModal(false)} onSuccess={refetch} />}
    </div>
  );
}