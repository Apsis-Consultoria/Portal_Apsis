import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Save, User, Calendar, Percent, FileText, AlertCircle } from "lucide-react";

const STATUS_OPTIONS = ["Não iniciado", "Ativo", "Pausado", "Cancelado"];

export default function ProjetoConfig({ projeto, onUpdate, osId }) {
  const [form, setForm] = useState({
    status: projeto.status || "Não iniciado",
    responsavel_tecnico: projeto.responsavel_tecnico || "",
    prazo_previsto: projeto.prazo_previsto || "",
    percentual_conclusao: projeto.percentual_conclusao ?? 0,
    descricao: projeto.descricao || "",
    observacoes: projeto.observacoes || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const updated = await base44.entities.OrdemServico.update(osId, form);
    onUpdate({ ...projeto, ...form });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-800">Configurações do Projeto</h2>
        <p className="text-xs text-slate-400 mt-1">Edite os dados operacionais e de controle deste projeto</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        {/* Status */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <AlertCircle size={12} /> Status
          </label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setForm(f => ({ ...f, status: s }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  form.status === s
                    ? "bg-[#1A4731] text-white border-[#1A4731]"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Responsável técnico */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <User size={12} /> Responsável Técnico
          </label>
          <input
            value={form.responsavel_tecnico}
            onChange={e => setForm(f => ({ ...f, responsavel_tecnico: e.target.value }))}
            placeholder="Nome do responsável"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4731]/20 focus:border-[#1A4731]/40"
          />
        </div>

        {/* Prazo + Percentual */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Calendar size={12} /> Prazo Previsto
            </label>
            <input
              type="date"
              value={form.prazo_previsto}
              onChange={e => setForm(f => ({ ...f, prazo_previsto: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4731]/20 focus:border-[#1A4731]/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Percent size={12} /> % Conclusão
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.percentual_conclusao}
                onChange={e => setForm(f => ({ ...f, percentual_conclusao: Number(e.target.value) }))}
                className="flex-1 accent-[#1A4731]"
              />
              <span className="text-sm font-semibold text-slate-700 w-10 text-right">{form.percentual_conclusao}%</span>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <FileText size={12} /> Descrição
          </label>
          <textarea
            value={form.descricao}
            onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
            rows={3}
            placeholder="Descrição do projeto..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1A4731]/20 focus:border-[#1A4731]/40"
          />
        </div>

        {/* Observações */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <FileText size={12} /> Observações Internas
          </label>
          <textarea
            value={form.observacoes}
            onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
            rows={2}
            placeholder="Notas internas..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1A4731]/20 focus:border-[#1A4731]/40"
          />
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1A4731] hover:bg-[#245E40] text-white gap-1.5 text-xs"
          >
            <Save size={13} /> {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
          {saved && <span className="text-xs text-emerald-600 font-medium">✓ Salvo com sucesso</span>}
        </div>
      </div>
    </div>
  );
}