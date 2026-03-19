import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";

export default function NovaAlocacaoModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    usuario_email: "",
    usuario_nome: "",
    ativo_ti_id: "",
    data_entrega: new Date().toISOString().split("T")[0],
    departamento: "",
  });

  const [ativos, setAtivos] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const carregarAtivos = async () => {
      const ativosData = await base44.entities.AtivoTI.filter({ status: "em_estoque" }, "-created_date", 100);
      setAtivos(ativosData || []);
    };
    carregarAtivos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.usuario_email || !form.ativo_ti_id) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    setSalvando(true);
    try {
      const ativoSelecionado = ativos.find((a) => a.id === form.ativo_ti_id);

      await base44.entities.AlocacaoEquipamento.create({
        usuario_email: form.usuario_email,
        usuario_nome: form.usuario_nome,
        ativo_ti_id: form.ativo_ti_id,
        ativo_numero_serie: ativoSelecionado?.numero_serie,
        ativo_tipo: ativoSelecionado?.tipo,
        data_entrega: form.data_entrega,
        status: "ativo",
        departamento: form.departamento,
        responsavel_alocacao: "admin@example.com",
      });

      // Atualizar status do ativo para "em_uso"
      await base44.entities.AtivoTI.update(form.ativo_ti_id, { status: "em_uso" });

      // Registrar movimentação
      await base44.entities.MovimentacaoEquipamento.create({
        tipo_movimentacao: "entrega",
        ativo_ti_id: form.ativo_ti_id,
        ativo_numero_serie: ativoSelecionado?.numero_serie,
        usuario_email: form.usuario_email,
        usuario_nome: form.usuario_nome,
        data_movimentacao: form.data_entrega,
        responsavel: "admin@example.com",
        status_anterior: "em_estoque",
        status_novo: "em_uso",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao criar alocação:", error);
      alert("Erro ao criar alocação");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        <div className="border-b border-[#DDE3DE] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1A2B1F]">Nova Alocação</h2>
          <button onClick={onClose} className="text-[#5C7060] hover:text-[#1A2B1F]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#1A2B1F]">Email do Usuário*</label>
              <input
                type="email"
                value={form.usuario_email}
                onChange={(e) => setForm({ ...form, usuario_email: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                required
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

            <div>
              <label className="text-sm font-medium text-[#1A2B1F]">Departamento</label>
              <input
                type="text"
                value={form.departamento}
                onChange={(e) => setForm({ ...form, departamento: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A2B1F]">Data Entrega*</label>
              <input
                type="date"
                value={form.data_entrega}
                onChange={(e) => setForm({ ...form, data_entrega: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-[#1A2B1F]">Equipamento (Em Estoque)*</label>
              <select
                value={form.ativo_ti_id}
                onChange={(e) => setForm({ ...form, ativo_ti_id: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-[#DDE3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47920]/50"
                required
              >
                <option value="">Selecione um equipamento</option>
                {ativos.map((ativo) => (
                  <option key={ativo.id} value={ativo.id}>
                    {ativo.tipo.charAt(0).toUpperCase() + ativo.tipo.slice(1)} - {ativo.marca} {ativo.modelo} ({ativo.numero_serie})
                  </option>
                ))}
              </select>
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
              {salvando ? "Alocando..." : "Alocar Equipamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}