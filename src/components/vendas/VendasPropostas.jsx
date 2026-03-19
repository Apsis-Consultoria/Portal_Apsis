import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Search, Plus, Download, TrendingUp, X, Edit2, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const fmt = (v) =>
  v ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v) : "—";

const STATUS_OPTS = ["Em elaboração", "Enviada", "Aprovada", "Recusada", "Caducada"];

const STATUS_STYLE = {
  "Em elaboração": "bg-blue-50 text-blue-700",
  "Enviada":       "bg-amber-50 text-amber-700",
  "Aprovada":      "bg-emerald-50 text-emerald-700",
  "Recusada":      "bg-red-50 text-red-600",
  "Caducada":      "bg-slate-100 text-slate-500",
  "Ganha":         "bg-emerald-50 text-emerald-700",
  "Perdida":       "bg-red-50 text-red-600",
};

const empty = {
  cliente_nome: "", numero_ap: "", natureza: "Contábil - Laudo", departamento: "",
  valor_total: 0, status: "Em elaboração", data_envio: "", responsavel: "", observacoes: "",
};

const exportCSV = (rows) => {
  const header = ["AP","Cliente","Natureza","Responsável","Valor","Status","Data Envio"];
  const body = rows.map(p => [
    p.numero_ap || "", p.cliente_nome, p.natureza, p.responsavel || "",
    p.valor_total || 0, p.status, p.data_envio || "",
  ]);
  const csv = [header, ...body].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "propostas.csv"; a.click();
};

const exportPDF = async (rows) => {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  doc.setFontSize(16); doc.text("Propostas", 14, 18);
  doc.setFontSize(9);
  const headers = ["AP","Cliente","Valor","Status","Responsável","Data"];
  let y = 30;
  doc.setFont(undefined, "bold");
  headers.forEach((h, i) => doc.text(h, 14 + i * 32, y));
  doc.setFont(undefined, "normal"); y += 7;
  rows.forEach(p => {
    if (y > 270) { doc.addPage(); y = 20; }
    const row = [
      p.numero_ap || "—", p.cliente_nome, fmt(p.valor_total), p.status,
      p.responsavel || "—", p.data_envio ? format(new Date(p.data_envio + "T00:00:00"), "dd/MM/yy") : "—",
    ];
    row.forEach((c, i) => doc.text(String(c).substring(0, 14), 14 + i * 32, y));
    y += 7;
  });
  doc.save("propostas.pdf");
};

export default function VendasPropostas() {
  const [propostas, setPropostas] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState({});

  const load = () => base44.entities.Proposta.list("-created_date", 500).then(setPropostas);
  useEffect(() => { load(); }, []);

  const filtradas = propostas.filter(p => {
    const matchBusca = !busca ||
      p.cliente_nome?.toLowerCase().includes(busca.toLowerCase()) ||
      p.numero_ap?.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "Todos" || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const total = filtradas.reduce((s, p) => s + (p.valor_total || 0), 0);
  const ganhas = filtradas.filter(p => ["Ganha","Aprovada"].includes(p.status));
  const valorGanho = ganhas.reduce((s, p) => s + (p.valor_total || 0), 0);

  const salvar = async () => {
    setSaving(true);
    if (modal.editing?.id) await base44.entities.Proposta.update(modal.editing.id, modal.data);
    else await base44.entities.Proposta.create(modal.data);
    await load(); setModal(null); setSaving(false);
  };

  const excluir = async (id) => {
    if (!confirm("Confirma exclusão?")) return;
    await base44.entities.Proposta.delete(id); await load();
  };

  const toggleRow = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const Field = ({ label, field, type = "text", options, colSpan }) => (
    <div className={colSpan === 2 ? "col-span-2" : ""}>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      {options ? (
        <select value={modal?.data?.[field] || ""}
          onChange={e => setModal(m => ({ ...m, data: { ...m.data, [field]: e.target.value } }))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#F47920] bg-white">
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={modal?.data?.[field] || ""}
          onChange={e => setModal(m => ({ ...m, data: { ...m.data, [field]: type === "number" ? Number(e.target.value) : e.target.value } }))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#F47920]" />
      )}
    </div>
  );

  // parse log de observacoes como histórico simples
  const getHistorico = (p) => {
    if (!p.observacoes) return [];
    try {
      const parsed = JSON.parse(p.observacoes);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [{ timestamp: p.updated_date || p.created_date, user: p.responsavel || "—", content: p.observacoes }];
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Propostas</h1>
          <p className="text-sm text-slate-500 mt-1">Gestão e acompanhamento de propostas comerciais</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => exportCSV(filtradas)}
            className="flex items-center gap-2 border border-slate-200 bg-white text-slate-600 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download size={14} /> CSV
          </button>
          <button onClick={() => exportPDF(filtradas)}
            className="flex items-center gap-2 border border-slate-200 bg-white text-slate-600 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download size={14} /> PDF
          </button>
          <button onClick={() => setModal({ data: { ...empty }, editing: null })}
            className="flex items-center gap-2 bg-[#1A4731] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#245E40] transition-colors">
            <Plus size={15} /> Nova Proposta
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total de Propostas", value: filtradas.length, color: "text-slate-700" },
          { label: "Valor Total", value: fmt(total), color: "text-[#F47920]" },
          { label: "Valor Fechado", value: fmt(valorGanho), color: "text-emerald-600" },
          { label: "Taxa Ganhas", value: filtradas.length > 0 ? `${Math.round((ganhas.length / filtradas.length) * 100)}%` : "0%", color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">{k.label}</p>
            <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={busca} onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por cliente ou número AP..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#F47920]" />
        </div>
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none min-w-[160px]">
          {["Todos", ...STATUS_OPTS].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FileText size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Nenhuma proposta encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {["", "Número AP", "Cliente", "Natureza", "Responsável", "Valor", "Status", "Data Envio", ""].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtradas.map((p, i) => {
                  const id = p.id || i;
                  const isOpen = !!expanded[id];
                  const historico = getHistorico(p);
                  return (
                    <>
                      <tr key={id}
                        className={`border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group ${isOpen ? "bg-slate-50" : ""}`}
                        onClick={() => toggleRow(id)}>
                        <td className="pl-4 pr-2 py-4 w-6">
                          {isOpen
                            ? <ChevronDown size={13} className="text-[#F47920]" />
                            : <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-400" />}
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-slate-500">{p.numero_ap || "—"}</td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-slate-800">{p.cliente_nome}</p>
                          {p.departamento && <p className="text-[10px] text-slate-400 mt-0.5">{p.departamento}</p>}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 max-w-[130px] truncate">{p.natureza}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{p.responsavel || "—"}</td>
                        <td className="px-4 py-4">
                          <span className="text-base font-black text-slate-800">{fmt(p.valor_total)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[p.status] || "bg-slate-100 text-slate-500"}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {p.data_envio ? format(new Date(p.data_envio + "T00:00:00"), "dd/MM/yyyy") : "—"}
                        </td>
                        <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setModal({ data: { ...p }, editing: p })}
                              className="p-1.5 hover:bg-slate-100 rounded-lg"><Edit2 size={13} className="text-slate-400" /></button>
                            <button onClick={() => excluir(p.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={13} className="text-red-400" /></button>
                          </div>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr key={`${id}-detail`}>
                          <td colSpan={9} className="px-6 py-4 bg-orange-50 border-l-4 border-[#F47920]">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-3">
                              {[
                                ["Horas", p.quantidade_horas ? `${p.quantidade_horas}h` : "—"],
                                ["Taxa Média", p.taxa_media ? fmt(p.taxa_media) : "—"],
                                ["Desconto", p.desconto_percentual != null ? `${p.desconto_percentual}%` : "—"],
                                ["Chance Conversão", p.chance_conversao != null ? `${p.chance_conversao}%` : "—"],
                                ["Nível Follow-up", p.nivel_followup || "—"],
                                ["Data Envio", p.data_envio ? format(new Date(p.data_envio + "T00:00:00"), "dd/MM/yyyy") : "—"],
                                ["Último Follow-up", p.ultimo_followup ? format(new Date(p.ultimo_followup + "T00:00:00"), "dd/MM/yyyy") : "—"],
                                ["OAP Origem", p.oap_origem || "—"],
                              ].map(([lbl, val]) => (
                                <div key={lbl}>
                                  <p className="text-slate-400 uppercase tracking-wide mb-0.5 text-[10px]">{lbl}</p>
                                  <p className="text-slate-700 font-semibold">{val}</p>
                                </div>
                              ))}
                            </div>
                            {historico.length > 0 && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Histórico</p>
                                <div className="space-y-1.5">
                                  {historico.map((h, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs">
                                      <span className="text-slate-400 whitespace-nowrap">
                                        {h.timestamp ? format(new Date(h.timestamp), "dd/MM/yy HH:mm") : "—"}
                                      </span>
                                      <span className="font-semibold text-[#1A4731]">{h.user}</span>
                                      <span className="text-slate-600">{h.content}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">{modal.editing ? "Editar" : "Nova"} Proposta</h2>
                <p className="text-xs text-slate-400 mt-0.5">Preencha os dados da proposta</p>
              </div>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={16} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2"><Field label="Cliente *" field="cliente_nome" /></div>
              <Field label="Número AP" field="numero_ap" />
              <Field label="Responsável" field="responsavel" />
              <Field label="Departamento" field="departamento"
                options={["","Contábil","Tributária","Societária","M&A","Projetos Especiais","Outros"]} />
              <div className="col-span-2">
                <Field label="Natureza" field="natureza"
                  options={["Contábil - Laudo","Contábil - Parecer","Consultoria - Tributária","Consultoria - Societária","Consultoria - M&A","Outros"]} />
              </div>
              <Field label="Valor Total (R$)" field="valor_total" type="number" />
              <Field label="Status" field="status" options={STATUS_OPTS} />
              <Field label="Data Envio" field="data_envio" type="date" />
              <Field label="Último Follow-up" field="ultimo_followup" type="date" />
              <Field label="Chance Conversão (%)" field="chance_conversao" type="number" />
              <Field label="Nível Follow-up" field="nivel_followup" options={["","N1","N2","N3","N4","N5"]} />
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Observações</label>
                <textarea rows={3}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#F47920]"
                  value={modal?.data?.observacoes || ""}
                  onChange={e => setModal(m => ({ ...m, data: { ...m.data, observacoes: e.target.value } }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setModal(null)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50">Cancelar</button>
              <button onClick={salvar} disabled={saving}
                className="px-6 py-2.5 bg-[#1A4731] text-white rounded-xl text-sm font-semibold hover:bg-[#245E40] disabled:opacity-60">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}