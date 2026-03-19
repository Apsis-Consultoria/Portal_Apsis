import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Package, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function EstoqueDashboard() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [formData, setFormData] = useState({
    tipo_movimentacao: "entrada",
    material: "",
    categoria: "cabos",
    quantidade: 1,
    unidade: "unidade",
    valor_unitario: 0,
    data_movimentacao: new Date().toISOString().split("T")[0],
    local_armazenamento: "",
    observacao: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["estoque-movimentacoes"],
    queryFn: async () => {
      const movs = await base44.entities.EstoqueMovimentacao.list("-created_date", 100);
      return movs || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const movimentacoes = data || [];

  // Calcular resumo
  const totalEntrada = movimentacoes
    .filter((m) => m.tipo_movimentacao === "entrada")
    .reduce((s, m) => s + (m.valor_total || 0), 0);

  const totalSaida = movimentacoes
    .filter((m) => m.tipo_movimentacao === "saida")
    .reduce((s, m) => s + (m.valor_total || 0), 0);

  const saldo = totalEntrada - totalSaida;

  const quantidadeItens = movimentacoes
    .filter((m) => m.tipo_movimentacao === "entrada")
    .reduce((s, m) => s + (m.quantidade || 0), 0);

  const fmt = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(v || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valor_total = (formData.quantidade || 0) * (formData.valor_unitario || 0);
    try {
      await base44.entities.EstoqueMovimentacao.create({
        ...formData,
        valor_total,
        responsavel: "admin@example.com",
      });
      setFormData({
        tipo_movimentacao: "entrada",
        material: "",
        categoria: "cabos",
        quantidade: 1,
        unidade: "unidade",
        valor_unitario: 0,
        data_movimentacao: new Date().toISOString().split("T")[0],
        local_armazenamento: "",
        observacao: "",
      });
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2B1F]">Estoque de Infraestrutura</h1>
          <p className="text-sm text-[#5C7060] mt-1">Controle de entradas e saídas de materiais</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A4731] text-white rounded-lg hover:bg-[#245E40] transition-colors"
        >
          <Plus size={18} />
          Nova Movimentação
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase tracking-wider">Total Estoque</p>
          <p className="text-2xl font-bold text-blue-700 mt-2">{fmt(saldo)}</p>
          <p className="text-xs text-[#5C7060] mt-1">{quantidadeItens} itens</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5C7060] uppercase tracking-wider">Entradas</p>
              <p className="text-2xl font-bold text-green-700 mt-2">{fmt(totalEntrada)}</p>
            </div>
            <TrendingUp size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5C7060] uppercase tracking-wider">Saídas</p>
              <p className="text-2xl font-bold text-red-700 mt-2">{fmt(totalSaida)}</p>
            </div>
            <TrendingDown size={24} className="text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#5C7060] uppercase tracking-wider">Movimentações</p>
          <p className="text-2xl font-bold text-orange-700 mt-2">{movimentacoes.length}</p>
          <p className="text-xs text-[#5C7060] mt-1">Total registrado</p>
        </div>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
          <h2 className="font-semibold text-[#1A2B1F] mb-4">Registrar Movimentação</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-[#1A2B1F]">Tipo</label>
                <select
                  value={formData.tipo_movimentacao}
                  onChange={(e) => setFormData({ ...formData, tipo_movimentacao: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                >
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                  <option value="devolucao">Devolução</option>
                  <option value="ajuste">Ajuste</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A2B1F]">Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="Ex: Cabo ethernet CAT6"
                  className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A2B1F]">Categoria</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                >
                  <option value="cabos">Cabos</option>
                  <option value="conectores">Conectores</option>
                  <option value="servidores">Servidores</option>
                  <option value="switches">Switches</option>
                  <option value="racks">Racks</option>
                  <option value="licencas">Licenças</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A2B1F]">Quantidade</label>
                <input
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A2B1F]">Unidade</label>
                <select
                  value={formData.unidade}
                  onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                >
                  <option value="unidade">Unidade</option>
                  <option value="metro">Metro</option>
                  <option value="caixa">Caixa</option>
                  <option value="rolo">Rolo</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A2B1F]">Valor Unitário</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor_unitario}
                  onChange={(e) => setFormData({ ...formData, valor_unitario: parseFloat(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A2B1F]">Data</label>
                <input
                  type="date"
                  value={formData.data_movimentacao}
                  onChange={(e) => setFormData({ ...formData, data_movimentacao: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A2B1F]">Local de Armazenamento</label>
                <input
                  type="text"
                  value={formData.local_armazenamento}
                  onChange={(e) => setFormData({ ...formData, local_armazenamento: e.target.value })}
                  placeholder="Ex: Rack A1"
                  className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="text-sm font-medium text-[#1A2B1F]">Observações</label>
                <textarea
                  value={formData.observacao}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  placeholder="Adicione observações se necessário"
                  rows="2"
                  className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#1A4731] text-white rounded-lg hover:bg-[#245E40] transition-colors font-medium"
              >
                Registrar Movimentação
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="flex-1 px-4 py-2 border border-[#DDE3DE] text-[#1A2B1F] rounded-lg hover:bg-[#F4F6F4] transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-4 flex flex-wrap gap-3">
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-3 py-1.5 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        >
          <option value="">Todos os tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="devolucao">Devolução</option>
          <option value="ajuste">Ajuste</option>
        </select>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-3 py-1.5 border border-[#DDE3DE] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
        >
          <option value="">Todas as categorias</option>
          <option value="cabos">Cabos</option>
          <option value="conectores">Conectores</option>
          <option value="servidores">Servidores</option>
          <option value="switches">Switches</option>
          <option value="racks">Racks</option>
          <option value="licencas">Licenças</option>
          <option value="outros">Outros</option>
        </select>
      </div>

      {/* Tabela de Movimentações */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
        <h2 className="font-semibold text-[#1A2B1F] mb-4">Histórico de Movimentações</h2>
        {isLoading ? (
          <div className="text-center py-8 text-[#5C7060]">Carregando...</div>
        ) : movimentacoes.length === 0 ? (
          <div className="text-center py-8 text-[#5C7060]">Nenhuma movimentação registrada</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#DDE3DE]">
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Data</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Tipo</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Material</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Categoria</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#1A2B1F]">Qtd</th>
                  <th className="text-right px-4 py-3 font-semibold text-[#1A2B1F]">Valor Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Local</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes
                  .filter((m) => (!filtroTipo || m.tipo_movimentacao === filtroTipo) && (!filtroCategoria || m.categoria === filtroCategoria))
                  .map((mov) => (
                    <tr key={mov.id} className="border-b border-[#DDE3DE] hover:bg-[#F4F6F4] transition-colors">
                      <td className="px-4 py-3 text-[#1A2B1F]">
                        {new Date(mov.data_movimentacao).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            mov.tipo_movimentacao === "entrada"
                              ? "bg-green-100 text-green-700"
                              : mov.tipo_movimentacao === "saida"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {mov.tipo_movimentacao}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1A2B1F]">{mov.material}</td>
                      <td className="px-4 py-3 text-[#5C7060]">{mov.categoria}</td>
                      <td className="text-center px-4 py-3 font-medium text-[#1A2B1F]">
                        {mov.quantidade} {mov.unidade}
                      </td>
                      <td className="text-right px-4 py-3 font-medium text-[#1A2B1F]">{fmt(mov.valor_total || 0)}</td>
                      <td className="px-4 py-3 text-[#5C7060] text-xs">{mov.local_armazenamento}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
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