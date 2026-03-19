import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";

export default function NovaMovimentacaoModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    tipo_movimentacao: "entrega",
    ativo_ti_id: "",
    usuario_email: "",
    usuario_nome: "",
    data_movimentacao: new Date().toISOString().split("T")[0],
    observacao: "",
  });

  const [ativos, setAtivos] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const carregarAtivos = async () => {
      const ativosData = await base44.entities.AtivoTI.list("-created_date", 200);
      setAtivos(ativosData || []);
    };
    carregarAtivos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const ativoSelecionado = ativos.find((a) => a.id === form.ativo_ti_id);

      await base44.entities.MovimentacaoEquipamento.create({
        tipo_movimentacao: form.tipo_movimentacao,
        ativo_ti_id: form.ativo_ti_id,
        ativo_numero_serie: ativoSelecionado?.numero_serie,
        usuario_email: form.usuario_email,
        usuario_nome: form.usuario_nome,
        data_movimentacao: form.data_movimentacao,
        responsavel: "admin@example.com",
        observacao: form.observacao,
        status_anterior: ativoSelecionado?.status,
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
                <option value="entrega">Entrega</option>
                <option value="devolucao">Devolução</option>
                <option value="troca">Troca</option>
                <option value="manutencao">Manutenção</option>
                <option value="reparo">Reparo</option>
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
              <label className="text-sm font-medium text-[#1A2B1F]">Equipamento*</label>
              <select
                value={form.ativo_ti_id}
                onChange={(e) => setForm({ ...form, ativo_ti_id: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                required
              >
                <option value="">Selecione um equipamento</option>
                {ativos.map((ativo) => (
                  <option key={ativo.id} value={ativo.id}>
                    {ativo.tipo} - {ativo.marca} {ativo.modelo} ({ativo.numero_serie})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A2B1F]">Email do Usuário</label>
              <input
                type="email"
                value={form.usuario_email}
                onChange={(e) => setForm({ ...form, usuario_email: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A2B1F]">Nome do Usuário</label>
              <input
                type="text"
                value={form.usuario_nome}
                onChange={(e) => setForm({ ...form, usuario_nome: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-[#1A2B1F]">Observação</label>
              <textarea
                value={form.observacao}
                onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                rows="3"
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