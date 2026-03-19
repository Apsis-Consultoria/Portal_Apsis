import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";

export default function NovaMovimentacaoMaterialModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    tipo_movimentacao: "entrada",
    material_id: "",
    material_nome: "",
    quantidade: 1,
    unidade: "unidade",
    valor_unitario: 0,
    data_movimentacao: new Date().toISOString().split("T")[0],
    observacao: "",
  });

  const [materiais, setMateriais] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const carregarMateriais = async () => {
      const materiaisData = await base44.entities.Material.filter({ ativo: true }, "-created_date", 200);
      setMateriais(materiaisData || []);
    };
    carregarMateriais();
  }, []);

  const handleMaterialChange = (materialId) => {
    const material = materiais.find((m) => m.id === materialId);
    if (material) {
      setForm({
        ...form,
        material_id: materialId,
        material_nome: material.nome,
        unidade: material.unidade_medida,
        valor_unitario: material.valor_unitario,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const material = materiais.find((m) => m.id === form.material_id);
      const quantidade = parseFloat(form.quantidade) || 0;
      const valor_total = quantidade * (parseFloat(form.valor_unitario) || 0);

      // Registrar movimentação
      await base44.entities.EstoqueMovimentacao.create({
        tipo_movimentacao: form.tipo_movimentacao,
        material: form.material_nome,
        categoria: material?.categoria || "outros",
        quantidade,
        unidade: form.unidade,
        valor_unitario: parseFloat(form.valor_unitario) || 0,
        valor_total,
        data_movimentacao: form.data_movimentacao,
        local_armazenamento: material?.localizacao || "",
        observacao: form.observacao,
        responsavel: "admin@example.com",
      });

      // Atualizar quantidade do material
      let novaQuantidade = material.quantidade_atual + quantidade;
      if (form.tipo_movimentacao === "saida" || form.tipo_movimentacao === "devolucao") {
        novaQuantidade = material.quantidade_atual - quantidade;
      }

      const novoValorTotal = novaQuantidade * (parseFloat(form.valor_unitario) || material.valor_unitario || 0);

      await base44.entities.Material.update(form.material_id, {
        quantidade_atual: Math.max(0, novaQuantidade),
        valor_total: novoValorTotal,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error);
      alert("Erro ao registrar movimentação");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        <div className="border-b border-[#DDE3DE] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1A2B1F]">Nova Movimentação</h2>
          <button onClick={onClose} className="text-[#5C7060] hover:text-[#1A2B1F]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#1A2B1F]">Tipo*</label>
              <select
                value={form.tipo_movimentacao}
                onChange={(e) => setForm({ ...form, tipo_movimentacao: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                required
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
                <option value="devolucao">Devolução</option>
                <option value="ajuste">Ajuste</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A2B1F]">Data*</label>
              <input
                type="date"
                value={form.data_movimentacao}
                onChange={(e) => setForm({ ...form, data_movimentacao: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-[#1A2B1F]">Material*</label>
              <select
                value={form.material_id}
                onChange={(e) => handleMaterialChange(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                required
              >
                <option value="">Selecione um material</option>
                {materiais.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} (Estoque: {m.quantidade_atual} {m.unidade_medida})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A2B1F]">Quantidade*</label>
              <input
                type="number"
                value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A2B1F]">Valor Unitário</label>
              <input
                type="number"
                step="0.01"
                value={form.valor_unitario}
                onChange={(e) => setForm({ ...form, valor_unitario: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                disabled
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-[#1A2B1F]">Observação</label>
              <textarea
                value={form.observacao}
                onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                rows="2"
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-[#DDE3DE]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#DDE3DE] text-[#1A2B1F] rounded-lg hover:bg-[#F4F6F4] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 px-4 py-2 bg-[#1A4731] text-white rounded-lg hover:bg-[#245E40] transition-colors disabled:opacity-50"
            >
              {salvando ? "Registrando..." : "Registrar Movimentação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}