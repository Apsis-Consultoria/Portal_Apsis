import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, ExternalLink, Trash2, Plus, FileCheck, FileClock } from "lucide-react";

const TIPO_ICONS = {
  "Laudo": "📊", "Relatório": "📋", "Contrato": "📝",
  "Proposta": "💼", "Apresentação": "📑", "Planilha": "📈", "Outro": "📄",
};

const STATUS_STYLE = {
  "Rascunho": "bg-slate-100 text-slate-600",
  "Em revisão": "bg-yellow-100 text-yellow-700",
  "Aprovado": "bg-green-100 text-green-700",
  "Entregue": "bg-blue-100 text-blue-700",
};

export default function ProjetosDocumentos({ data, onRefresh }) {
  const { documentos, projetos } = data;
  const [filtroOS, setFiltroOS] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ os_id: "", nome: "", tipo: "Laudo", url: "", versao: "1.0", status: "Rascunho", responsavel: "" });
  const [saving, setSaving] = useState(false);

  const filtrados = documentos.filter(d => {
    const matchOS = filtroOS === "todos" || d.os_id === filtroOS;
    const matchSt = filtroStatus === "todos" || d.status === filtroStatus;
    return matchOS && matchSt;
  });

  const projetoNome = (osId) => projetos.find(p => p.id === osId)?.cliente_nome || "—";

  const handleSave = async () => {
    if (!form.os_id || !form.nome || !form.tipo) return;
    setSaving(true);
    await base44.entities.DocumentoProjeto.create(form);
    setForm({ os_id: "", nome: "", tipo: "Laudo", url: "", versao: "1.0", status: "Rascunho", responsavel: "" });
    setShowForm(false);
    onRefresh();
    setSaving(false);
  };

  const handleStatus = async (doc, novoStatus) => {
    await base44.entities.DocumentoProjeto.update(doc.id, { status: novoStatus });
    onRefresh();
  };

  const handleDelete = async (id) => {
    await base44.entities.DocumentoProjeto.delete(id);
    onRefresh();
  };

  // KPIs
  const total = filtrados.length;
  const aprovados = filtrados.filter(d => d.status === "Aprovado" || d.status === "Entregue").length;
  const emRevisao = filtrados.filter(d => d.status === "Em revisão").length;
  const enviados = filtrados.filter(d => d.enviado_cliente).length;

  return (
    <div className="p-6 space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><FileText size={18} className="text-blue-400" /><div><p className="text-xl font-bold text-slate-800">{total}</p><p className="text-xs text-slate-400">Total</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><FileCheck size={18} className="text-green-500" /><div><p className="text-xl font-bold text-slate-800">{aprovados}</p><p className="text-xs text-slate-400">Aprovados/Entregues</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><FileClock size={18} className="text-amber-400" /><div><p className="text-xl font-bold text-slate-800">{emRevisao}</p><p className="text-xs text-slate-400">Em revisão</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Upload size={18} className="text-[#F47920]" /><div><p className="text-xl font-bold text-slate-800">{enviados}</p><p className="text-xs text-slate-400">Enviados ao cliente</p></div></CardContent></Card>
      </div>

      {/* SharePoint info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <FileText size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-600">
              <p className="font-medium text-slate-800 mb-0.5">Integração SharePoint</p>
              <p>Documentos são gerenciados no SharePoint da APSIS. Cole a URL do documento SharePoint no campo "URL" ao cadastrar.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filtroOS} onValueChange={setFiltroOS}>
          <SelectTrigger className="w-56 h-9"><SelectValue placeholder="Todos os projetos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os projetos</SelectItem>
            {projetos.map(p => <SelectItem key={p.id} value={p.id}>{p.cliente_nome}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="Rascunho">Rascunho</SelectItem>
            <SelectItem value="Em revisão">Em revisão</SelectItem>
            <SelectItem value="Aprovado">Aprovado</SelectItem>
            <SelectItem value="Entregue">Entregue</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5 bg-[#1A4731] hover:bg-[#245E40]">
          <Plus size={13} /> Novo Documento
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-[#1A4731]/20 bg-[#1A4731]/5">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Projeto *</label>
                <Select value={form.os_id} onValueChange={v => setForm(f => ({ ...f, os_id: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{projetos.map(p => <SelectItem key={p.id} value={p.id}>{p.cliente_nome}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Nome *</label>
                <Input className="h-8 text-xs" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Tipo *</label>
                <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Laudo","Relatório","Contrato","Proposta","Apresentação","Planilha","Outro"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-500 mb-1 block">URL SharePoint</label>
                <Input className="h-8 text-xs" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://apsis.sharepoint.com/..." />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Responsável</label>
                <Input className="h-8 text-xs" value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#1A4731] hover:bg-[#245E40]">{saving ? "Salvando..." : "Salvar"}</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtrados.map(d => (
          <Card key={d.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-lg">{TIPO_ICONS[d.tipo] || "📄"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs text-slate-800 truncate">{d.nome}</p>
                    <p className="text-[10px] text-slate-400">{projetoNome(d.os_id)}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(d.id)} className="text-slate-200 hover:text-red-400 flex-shrink-0">
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Select value={d.status} onValueChange={v => handleStatus(d, v)}>
                  <SelectTrigger className="h-6 text-xs border-0 p-0 w-auto">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[d.status] || ""}`}>{d.status}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    <SelectItem value="Em revisão">Em revisão</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Entregue">Entregue</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  {d.responsavel && <span className="text-[10px] text-slate-400">{d.responsavel}</span>}
                  {d.url && (
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-300">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum documento encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}