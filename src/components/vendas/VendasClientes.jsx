import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search, Building2, Mail, Phone, Edit2, Trash2, X } from "lucide-react";

const empty = { nome: "", cnpj: "", segmento: "", contato_nome: "", contato_email: "", ativo: true };

export default function VendasClientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => base44.entities.Cliente.list("-created_date", 200).then(setClientes);
  useEffect(() => { load(); }, []);

  const filtrados = clientes.filter(c =>
    !busca || c.nome?.toLowerCase().includes(busca.toLowerCase()) || c.cnpj?.includes(busca)
  );

  const salvar = async () => {
    setSaving(true);
    if (modal.editing?.id) await base44.entities.Cliente.update(modal.editing.id, modal.data);
    else await base44.entities.Cliente.create(modal.data);
    await load(); setModal(null); setSaving(false);
  };

  const excluir = async (id) => {
    if (!confirm("Confirma exclusão?")) return;
    await base44.entities.Cliente.delete(id); await load();
  };

  const Field = ({ label, field, type = "text" }) => (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input type={type} value={modal?.data?.[field] || ""}
        onChange={e => setModal(m => ({ ...m, data: { ...m.data, [field]: e.target.value } }))}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F47920]" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500 mt-0.5">Cadastro de clientes da área comercial</p>
        </div>
        <button onClick={() => setModal({ data: { ...empty }, editing: null })}
          className="flex items-center gap-2 bg-[#1A4731] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#245E40] transition-colors">
          <Plus size={15} /> Novo Cliente
        </button>
      </div>

      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome ou CNPJ..."
          className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#F47920]" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Building2 size={28} className="text-slate-200" />
            <p className="text-sm text-slate-400">Nenhum cliente encontrado</p>
            <button onClick={() => setModal({ data: { ...empty }, editing: null })}
              className="flex items-center gap-2 bg-[#1A4731] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#245E40] transition-colors">
              <Plus size={14} /> Novo Cliente
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Nome","CNPJ","Segmento","Contato","Email","Status",""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(c => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{c.nome}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{c.cnpj || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{c.segmento || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{c.contato_nome || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{c.contato_email || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.ativo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                      {c.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setModal({ data: { ...c }, editing: c })} className="p-1.5 hover:bg-slate-100 rounded-lg"><Edit2 size={13} className="text-slate-400" /></button>
                      <button onClick={() => excluir(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={13} className="text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">{modal.editing ? "Editar" : "Novo"} Cliente</h2>
              <button onClick={() => setModal(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2"><Field label="Nome" field="nome" /></div>
              <Field label="CNPJ" field="cnpj" />
              <Field label="Segmento" field="segmento" />
              <Field label="Contato" field="contato_nome" />
              <Field label="Email" field="contato_email" type="email" />
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50">Cancelar</button>
              <button onClick={salvar} disabled={saving} className="px-5 py-2 bg-[#1A4731] text-white rounded-xl text-sm font-medium hover:bg-[#245E40] disabled:opacity-60">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}