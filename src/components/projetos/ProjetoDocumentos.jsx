import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Upload, Check, Trash2, ExternalLink, Send } from "lucide-react";

const TIPO_ICON = { "Laudo": "📋", "Relatório": "📊", "Contrato": "📝", "Proposta": "💼", "Apresentação": "🖼", "Planilha": "📈", "Outro": "📄" };
const STATUS_COLOR = {
  "Rascunho": "bg-gray-100 text-gray-600",
  "Em revisão": "bg-yellow-100 text-yellow-700",
  "Aprovado": "bg-blue-100 text-blue-700",
  "Entregue": "bg-green-100 text-green-700",
};

export default function ProjetoDocumentos({ osId, projeto }) {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ nome: "", tipo: "Laudo", versao: "1.0", responsavel: "", data_entrega: "", observacoes: "", status: "Rascunho", url: "" });

  useEffect(() => {
    base44.entities.DocumentoProjeto.filter({ os_id: osId }).then(d => {
      setDocumentos(d);
      setLoading(false);
    });
  }, [osId]);

  const salvar = async () => {
    if (!form.nome || !form.tipo) return;
    const novo = await base44.entities.DocumentoProjeto.create({ ...form, os_id: osId });
    setDocumentos(prev => [novo, ...prev]);
    setShowForm(false);
    setForm({ nome: "", tipo: "Laudo", versao: "1.0", responsavel: "", data_entrega: "", observacoes: "", status: "Rascunho", url: "" });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, url: file_url, nome: f.nome || file.name }));
    setUploading(false);
  };

  const atualizarStatus = async (id, status) => {
    await base44.entities.DocumentoProjeto.update(id, { status });
    setDocumentos(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const marcarEntregue = async (id) => {
    await base44.entities.DocumentoProjeto.update(id, { status: "Entregue", enviado_cliente: true });
    setDocumentos(prev => prev.map(d => d.id === id ? { ...d, status: "Entregue", enviado_cliente: true } : d));
  };

  const excluir = async (id) => {
    await base44.entities.DocumentoProjeto.delete(id);
    setDocumentos(prev => prev.filter(d => d.id !== id));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  const porStatus = (s) => documentos.filter(d => d.status === s).length;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {["Rascunho", "Em revisão", "Aprovado", "Entregue"].map(s => (
          <Card key={s}><CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-slate-800">{porStatus(s)}</p>
            <p className="text-xs text-slate-500">{s}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Novo Documento</Button>
      </div>

      {showForm && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader><CardTitle className="text-sm">Novo Documento</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div><label className="text-xs text-slate-500 mb-1 block">Nome *</label><Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Título do documento" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Tipo *</label>
                <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Laudo", "Relatório", "Contrato", "Proposta", "Apresentação", "Planilha", "Outro"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Versão</label><Input value={form.versao} onChange={e => setForm(f => ({ ...f, versao: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Responsável</label><Input value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Prazo entrega</label><Input type="date" value={form.data_entrega} onChange={e => setForm(f => ({ ...f, data_entrega: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Status</label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Rascunho", "Em revisão", "Aprovado", "Entregue"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            {/* Upload */}
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Arquivo (opcional)</label>
              <div className="flex gap-2 items-center">
                <label className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Enviando..." : "Fazer upload"}
                  <input type="file" className="hidden" onChange={handleUpload} />
                </label>
                {form.url && <span className="text-xs text-green-600 font-medium">✓ Arquivo anexado</span>}
                {!form.url && <Input placeholder="Ou cole uma URL" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className="flex-1" />}
              </div>
            </div>
            <Input placeholder="Observações" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} />
            <div className="flex gap-2">
              <Button onClick={salvar} className="gap-1"><Check className="w-4 h-4" /> Salvar</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><FileText className="w-4 h-4" /> Documentos do Projeto</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {documentos.length === 0 && <p className="text-center py-8 text-slate-400 text-sm">Nenhum documento cadastrado.</p>}
            {documentos.map(d => (
              <div key={d.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 flex-wrap">
                <span className="text-xl">{TIPO_ICON[d.tipo] || "📄"}</span>
                <div className="flex-1 min-w-[180px]">
                  <p className="text-sm font-medium text-slate-800">{d.nome}</p>
                  <p className="text-xs text-slate-500">{d.tipo} · v{d.versao} · {d.responsavel || "—"}</p>
                </div>
                {d.data_entrega && <span className="text-xs text-slate-400">{new Date(d.data_entrega + "T00:00:00").toLocaleDateString("pt-BR")}</span>}
                <Badge className={`text-xs ${STATUS_COLOR[d.status] || ""}`}>{d.status}</Badge>
                {d.enviado_cliente && <Badge className="text-xs bg-purple-100 text-purple-700">Entregue ao cliente</Badge>}
                <div className="flex gap-1">
                  {d.url && <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"><ExternalLink className="w-4 h-4" /></a>}
                  {d.status !== "Entregue" && <button onClick={() => marcarEntregue(d.id)} className="text-xs text-purple-500 hover:text-purple-700 border border-purple-200 rounded px-2 py-0.5 flex items-center gap-1"><Send className="w-3 h-3" /> Entregar</button>}
                  {d.status === "Rascunho" && <button onClick={() => atualizarStatus(d.id, "Em revisão")} className="text-xs text-yellow-600 border border-yellow-200 rounded px-2 py-0.5">Revisar</button>}
                  {d.status === "Em revisão" && <button onClick={() => atualizarStatus(d.id, "Aprovado")} className="text-xs text-blue-600 border border-blue-200 rounded px-2 py-0.5">Aprovar</button>}
                </div>
                <button onClick={() => excluir(d.id)} className="text-slate-300 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}