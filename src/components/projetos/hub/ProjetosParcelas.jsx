import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DollarSign, TrendingUp, CreditCard, AlertTriangle,
  Search, X, ChevronLeft, ChevronRight, FileText,
  Plus, Upload, Link, Trash2, Eye, Download
} from "lucide-react";

const fmt = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "—";

const STATUS_PARCELA_STYLE = {
  "Pendente":              { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400" },
  "Lançado":               { bg: "bg-slate-100",   text: "text-slate-600",   dot: "bg-slate-400" },
  "Liberado para Faturar": { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-400" },
  "Faturado Parcialmente": { bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-400" },
  "Faturado":              { bg: "bg-cyan-100",    text: "text-cyan-700",    dot: "bg-cyan-400" },
  "Recebido Parcialmente": { bg: "bg-emerald-100", text: "text-emerald-600", dot: "bg-emerald-300" },
  "Recebido":              { bg: "bg-green-100",   text: "text-green-700",   dot: "bg-green-500" },
  "Cancelado":             { bg: "bg-red-100",     text: "text-red-600",     dot: "bg-red-400" },
};

const STATUS_PROJETO_OPTS = ["Iniciação","Execução","Aprovação","Concluído","Cancelado","Pausado"];
const STATUS_PARCELA_OPTS = ["Pendente","Lançado","Liberado para Faturar","Faturado Parcialmente","Faturado","Recebido Parcialmente","Recebido","Cancelado"];
const TIPO_OPTS = ["Automático","Manual"];
const TIPO_DOC_OPTS = ["Nota Fiscal","Boleto","Comprovante","Aprovação","Outro"];

const PAGE_SIZE = 20;

function StatusBadge({ status, map }) {
  const s = map[status] || { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-300" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {status}
    </span>
  );
}

// ── DETALHE MODAL ─────────────────────────────────────────────────────────────
function ParcelaDetalhe({ parcela, projetos, onClose, onRefresh }) {
  const [tab, setTab] = useState("dados");
  const [editStatus, setEditStatus] = useState(parcela.status);
  const [saving, setSaving] = useState(false);
  const [nota, setNota] = useState("");
  const [anexos, setAnexos] = useState([]);
  const [loadingAnexos, setLoadingAnexos] = useState(true);
  const [anexoForm, setAnexoForm] = useState({ nome: "", tipo_documento: "Outro", observacao: "", sharepoint_url: "", via_sharepoint: false });
  const [showAnexoForm, setShowAnexoForm] = useState(false);
  const [savingAnexo, setSavingAnexo] = useState(false);

  const projeto = projetos.find(p => p.id === parcela.os_id);

  useEffect(() => {
    base44.entities.InstallmentAnexo.filter({ installment_id: parcela.id }).then(r => {
      setAnexos(r);
      setLoadingAnexos(false);
    });
  }, [parcela.id]);

  const salvarStatus = async () => {
    setSaving(true);
    await base44.entities.ProjectInstallment.update(parcela.id, { status: editStatus });
    onRefresh();
    setSaving(false);
  };

  const adicionarNota = async () => {
    if (!nota.trim()) return;
    const agora = new Date().toLocaleString("pt-BR");
    const novaLinha = `[${agora}] - Sistema\n${nota.trim()}`;
    const obsAtual = parcela.observacoes || "";
    const novaObs = obsAtual ? obsAtual + "\n\n" + novaLinha : novaLinha;
    await base44.entities.ProjectInstallment.update(parcela.id, { observacoes: novaObs });
    setNota("");
    onRefresh();
  };

  const salvarAnexo = async () => {
    if (!anexoForm.nome) return;
    setSavingAnexo(true);
    await base44.entities.InstallmentAnexo.create({
      ...anexoForm,
      installment_id: parcela.id,
      uploaded_at: new Date().toISOString().split("T")[0],
      uploaded_by: "Sistema",
    });
    setAnexos(prev => [...prev, { ...anexoForm, installment_id: parcela.id }]);
    setAnexoForm({ nome: "", tipo_documento: "Outro", observacao: "", sharepoint_url: "", via_sharepoint: false });
    setShowAnexoForm(false);
    setSavingAnexo(false);
  };

  const excluirAnexo = async (id) => {
    await base44.entities.InstallmentAnexo.delete(id);
    setAnexos(prev => prev.filter(a => a.id !== id));
  };

  const TABS = [{ id: "dados", label: "Dados" }, { id: "observacoes", label: "Observações" }, { id: "anexos", label: `Anexos (${anexos.length})` }];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-[#1A4731]/5 to-transparent flex-shrink-0">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Detalhe da Parcela</p>
            <h2 className="text-lg font-bold text-slate-900">{parcela.cliente_nome || projeto?.cliente_nome || "—"}</h2>
            <p className="text-sm text-slate-500">{fmt(parcela.valor)} · Vence {fmtDate(parcela.data_prevista)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X size={16} className="text-slate-400" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 flex-shrink-0 px-6">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${tab === t.id ? "border-[#F47920] text-[#F47920]" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ABA DADOS */}
          {tab === "dados" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Projeto", value: projeto?.nome_projeto || projeto?.cliente_nome || "—" },
                  { label: "Cliente", value: parcela.cliente_nome || "—" },
                  { label: "Valor", value: fmt(parcela.valor) },
                  { label: "Tipo", value: parcela.tipo || "Manual" },
                  { label: "Data Prevista", value: fmtDate(parcela.data_prevista) },
                  { label: "Data Faturamento", value: fmtDate(parcela.data_faturamento) },
                  { label: "Data Recebimento", value: fmtDate(parcela.data_recebimento) },
                  { label: "Nota Fiscal", value: parcela.nota_fiscal || "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-2">Alterar Status</p>
                <div className="flex items-center gap-3">
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className="h-9 text-sm w-64"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_PARCELA_OPTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={salvarStatus} disabled={saving || editStatus === parcela.status}
                    className="bg-[#1A4731] hover:bg-[#245E40] text-white">
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ABA OBSERVAÇÕES */}
          {tab === "observacoes" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 block">Nova Observação</label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#1A4731]/30 h-24"
                  placeholder="Digite sua observação..."
                  value={nota}
                  onChange={e => setNota(e.target.value)}
                />
                <Button size="sm" onClick={adicionarNota} disabled={!nota.trim()} className="bg-[#1A4731] hover:bg-[#245E40] text-white">
                  <Plus size={12} /> Adicionar Observação
                </Button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-3">Histórico</p>
                {parcela.observacoes ? (
                  <div className="space-y-3">
                    {parcela.observacoes.split("\n\n").reverse().map((bloco, i) => {
                      const linhas = bloco.split("\n");
                      const header = linhas[0];
                      const corpo = linhas.slice(1).join("\n");
                      return (
                        <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <p className="text-[11px] text-slate-400 font-mono mb-1">{header}</p>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{corpo}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 italic text-center py-6">Nenhuma observação registrada</p>
                )}
              </div>
            </div>
          )}

          {/* ABA ANEXOS */}
          {tab === "anexos" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">Arquivos e documentos vinculados</p>
                <Button size="sm" variant="outline" onClick={() => setShowAnexoForm(!showAnexoForm)} className="gap-1.5 text-xs">
                  <Plus size={12} /> Adicionar
                </Button>
              </div>

              {showAnexoForm && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Nome do arquivo *</label>
                      <Input className="h-8 text-xs" value={anexoForm.nome}
                        onChange={e => setAnexoForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: NF-001.pdf" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Tipo de documento</label>
                      <Select value={anexoForm.tipo_documento} onValueChange={v => setAnexoForm(f => ({ ...f, tipo_documento: v }))}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{TIPO_DOC_OPTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Link SharePoint / URL</label>
                    <Input className="h-8 text-xs" value={anexoForm.sharepoint_url}
                      onChange={e => setAnexoForm(f => ({ ...f, sharepoint_url: e.target.value }))} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Observação</label>
                    <Input className="h-8 text-xs" value={anexoForm.observacao}
                      onChange={e => setAnexoForm(f => ({ ...f, observacao: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={salvarAnexo} disabled={savingAnexo || !anexoForm.nome} className="bg-[#1A4731] hover:bg-[#245E40] text-white">
                      {savingAnexo ? "Salvando..." : "Salvar Anexo"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAnexoForm(false)}>Cancelar</Button>
                  </div>
                </div>
              )}

              {loadingAnexos ? (
                <p className="text-xs text-slate-300 text-center py-6">Carregando anexos...</p>
              ) : anexos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <FileText size={20} className="text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400">Nenhum anexo vinculado</p>
                  <p className="text-xs text-slate-300">Adicione notas fiscais, boletos ou comprovantes</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {anexos.map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <FileText size={14} className="text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{a.nome}</p>
                        <p className="text-[11px] text-slate-400">{a.tipo_documento} · {fmtDate(a.uploaded_at)}</p>
                        {a.observacao && <p className="text-[11px] text-slate-400 truncate">{a.observacao}</p>}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {a.sharepoint_url && (
                          <a href={a.sharepoint_url} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-400 hover:text-blue-600 transition-colors">
                            <Link size={13} />
                          </a>
                        )}
                        <button onClick={() => excluirAnexo(a.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function ProjetosParcelas({ data }) {
  const { projetos } = data;

  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatusProjeto, setFiltroStatusProjeto] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busca, setBusca] = useState("");
  const [aplicado, setAplicado] = useState({ statusProjeto: "todos", status: "todos", tipo: "todos", busca: "" });
  const [page, setPage] = useState(1);
  const [selecionada, setSelecionada] = useState(null);

  const loadParcelas = useCallback(async () => {
    setLoading(true);
    const r = await base44.entities.ProjectInstallment.list("-data_prevista", 2000);
    setParcelas(r);
    setLoading(false);
  }, []);

  useEffect(() => { loadParcelas(); }, [loadParcelas]);

  const pesquisar = () => {
    setAplicado({ statusProjeto: filtroStatusProjeto, status: filtroStatus, tipo: filtroTipo, busca });
    setPage(1);
  };

  const limpar = () => {
    setFiltroStatusProjeto("todos"); setFiltroStatus("todos"); setFiltroTipo("todos"); setBusca("");
    setAplicado({ statusProjeto: "todos", status: "todos", tipo: "todos", busca: "" });
    setPage(1);
  };

  const filtradas = parcelas.filter(p => {
    if (aplicado.statusProjeto !== "todos" && p.status_projeto !== aplicado.statusProjeto) return false;
    if (aplicado.status !== "todos" && p.status !== aplicado.status) return false;
    if (aplicado.tipo !== "todos" && p.tipo !== aplicado.tipo) return false;
    if (aplicado.busca) {
      const q = aplicado.busca.toLowerCase();
      if (!((p.cliente_nome || "").toLowerCase().includes(q) || (p.codigo_projeto || "").toLowerCase().includes(q))) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE));
  const paginadas = filtradas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // KPIs
  const totalValor = filtradas.reduce((s, p) => s + (p.valor || 0), 0);
  const recebido   = filtradas.filter(p => p.status === "Recebido").reduce((s, p) => s + (p.valor || 0), 0);
  const pendente   = filtradas.filter(p => ["Pendente","Lançado"].includes(p.status)).reduce((s, p) => s + (p.valor || 0), 0);
  const hoje = new Date();
  const emAtraso = filtradas.filter(p => !["Recebido","Cancelado"].includes(p.status) && p.data_prevista && new Date(p.data_prevista) < hoje).reduce((s, p) => s + (p.valor || 0), 0);

  const projetoNome = (p) => {
    const proj = projetos.find(pr => pr.id === p.os_id);
    return proj?.nome_projeto || proj?.cliente_nome || p.cliente_nome || "—";
  };

  const isAtrasada = (p) => !["Recebido","Cancelado"].includes(p.status) && p.data_prevista && new Date(p.data_prevista) < hoje;

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Total Portfólio", value: fmt(totalValor), color: "blue", border: "border-blue-200", bg: "bg-blue-50", iconColor: "text-blue-500" },
          { icon: TrendingUp, label: "Recebido", value: fmt(recebido), color: "green", border: "border-green-200", bg: "bg-green-50", iconColor: "text-green-600" },
          { icon: CreditCard, label: "Pendente / A faturar", value: fmt(pendente), color: "amber", border: "border-amber-200", bg: "bg-amber-50", iconColor: "text-amber-500" },
          { icon: AlertTriangle, label: "Em atraso", value: fmt(emAtraso), color: "red", border: "border-red-200", bg: "bg-red-50", iconColor: "text-red-500" },
        ].map(({ icon: Icon, label, value, border, bg, iconColor }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} p-4 flex items-center gap-3 hover:shadow-md transition-shadow`}>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={iconColor} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 leading-tight">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Filtros</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Status do Projeto</label>
            <Select value={filtroStatusProjeto} onValueChange={setFiltroStatusProjeto}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {STATUS_PROJETO_OPTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Status da Parcela</label>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {STATUS_PARCELA_OPTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Tipo de Parcela</label>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {TIPO_OPTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Buscar cliente / código</label>
            <Input className="h-9 text-sm" placeholder="Digite para buscar..." value={busca} onChange={e => setBusca(e.target.value)}
              onKeyDown={e => e.key === "Enter" && pesquisar()} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button size="sm" onClick={pesquisar} className="bg-[#1A4731] hover:bg-[#245E40] text-white gap-1.5">
            <Search size={13} /> Pesquisar
          </Button>
          <Button size="sm" variant="outline" onClick={limpar} className="gap-1.5">
            <X size={13} /> Limpar
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-sm font-semibold text-slate-700">
            {loading ? "Carregando..." : `${filtradas.length} parcela${filtradas.length !== 1 ? "s" : ""} encontrada${filtradas.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Cód. Projeto","Cliente","Status Projeto","Status Parcela","Tipo","Valor","Data Prevista"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-300 text-sm">Carregando parcelas...</td></tr>
              ) : paginadas.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <CreditCard size={24} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">Nenhuma parcela encontrada</p>
                      <p className="text-xs text-slate-300">Ajuste os filtros ou crie uma nova parcela</p>
                    </div>
                  </td>
                </tr>
              ) : paginadas.map(p => {
                const atrasada = isAtrasada(p);
                const sp = STATUS_PARCELA_STYLE[p.status] || STATUS_PARCELA_STYLE["Pendente"];
                return (
                  <tr key={p.id}
                    onClick={() => setSelecionada(p)}
                    className={`border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${atrasada ? "bg-red-50/30 hover:bg-red-50/50" : ""}`}>
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{p.codigo_projeto || "—"}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{p.cliente_nome || projetoNome(p)}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-500">{p.status_projeto || "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} map={STATUS_PARCELA_STYLE} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{p.tipo || "Manual"}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900 text-right whitespace-nowrap">{fmt(p.valor)}</td>
                    <td className={`px-5 py-3.5 text-xs whitespace-nowrap ${atrasada ? "text-red-500 font-medium" : "text-slate-500"}`}>
                      {fmtDate(p.data_prevista)}{atrasada && " ⚠"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-xs text-slate-400">Página {page} de {totalPages}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors">
                <ChevronLeft size={15} className="text-slate-500" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <button key={pg} onClick={() => setPage(pg)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${pg === page ? "bg-[#1A4731] text-white" : "hover:bg-slate-100 text-slate-500"}`}>
                    {pg}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors">
                <ChevronRight size={15} className="text-slate-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detalhe */}
      {selecionada && (
        <ParcelaDetalhe
          parcela={selecionada}
          projetos={projetos}
          onClose={() => setSelecionada(null)}
          onRefresh={() => { loadParcelas(); setSelecionada(null); }}
        />
      )}
    </div>
  );
}