import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

export default function NovoProjetoModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    cliente_nome: "", natureza: "", responsavel_tecnico: "",
    proposta_numero: "", prazo_previsto: "", descricao: "",
    status: "Não iniciado", percentual_conclusao: 0,
  });
  const [saving, setSaving] = useState(false);

  const salvar = async () => {
    if (!form.cliente_nome || !form.responsavel_tecnico) return;
    setSaving(true);
    await base44.entities.OrdemServico.create({
      ...form,
      proposta_id: form.proposta_numero || "manual",
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-slate-800 text-lg">Novo Projeto</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-slate-500 mb-1 block">Cliente *</label>
              <Input value={form.cliente_nome} onChange={e => setForm(f => ({ ...f, cliente_nome: e.target.value }))} placeholder="Nome do cliente" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Natureza</label>
              <Input value={form.natureza} onChange={e => setForm(f => ({ ...f, natureza: e.target.value }))} placeholder="Ex: Laudo, Consultoria..." />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Nº Proposta</label>
              <Input value={form.proposta_numero} onChange={e => setForm(f => ({ ...f, proposta_numero: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Responsável Técnico *</label>
              <Input value={form.responsavel_tecnico} onChange={e => setForm(f => ({ ...f, responsavel_tecnico: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Prazo Previsto</label>
              <Input type="date" value={form.prazo_previsto} onChange={e => setForm(f => ({ ...f, prazo_previsto: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Status</label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Não iniciado", "Ativo", "Pausado", "Cancelado"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-500 mb-1 block">Descrição</label>
              <Input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descrição do escopo do projeto" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-5 border-t">
          <Button onClick={salvar} disabled={saving} className="flex-1 gap-2">
            <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Criar Projeto"}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}