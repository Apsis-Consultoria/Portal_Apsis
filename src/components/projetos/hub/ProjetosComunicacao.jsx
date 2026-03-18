import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Mail, Phone, Video, FileText, Bell, Plus, Trash2, AlertCircle } from "lucide-react";

const TIPO_CONFIG = {
  "Reunião": { icon: Video, color: "text-purple-500", bg: "bg-purple-100" },
  "Email": { icon: Mail, color: "text-blue-500", bg: "bg-blue-100" },
  "WhatsApp": { icon: MessageSquare, color: "text-green-500", bg: "bg-green-100" },
  "Ligação": { icon: Phone, color: "text-amber-500", bg: "bg-amber-100" },
  "Nota interna": { icon: FileText, color: "text-slate-500", bg: "bg-slate-100" },
  "Alerta": { icon: Bell, color: "text-red-500", bg: "bg-red-100" },
};

export default function ProjetosComunicacao({ data, onRefresh }) {
  const { comunicacoes, projetos } = data;
  const [filtroOS, setFiltroOS] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ os_id: "", tipo: "Nota interna", titulo: "", descricao: "", autor: "", data: new Date().toISOString().split("T")[0], visivel_cliente: false, acao_requerida: false, acao_descricao: "", acao_responsavel: "" });
  const [saving, setSaving] = useState(false);

  const filtradas = comunicacoes.filter(c => {
    const matchOS = filtroOS === "todos" || c.os_id === filtroOS;
    const matchTipo = filtroTipo === "todos" || c.tipo === filtroTipo;
    return matchOS && matchTipo;
  }).sort((a, b) => new Date(b.data) - new Date(a.data));

  const projetoNome = (osId) => projetos.find(p => p.id === osId)?.cliente_nome || "—";
  const acoesAbertas = comunicacoes.filter(c => c.acao_requerida && c.acao_descricao);

  const handleSave = async () => {
    if (!form.os_id || !form.titulo || !form.autor) return;
    setSaving(true);
    await base44.entities.ComunicacaoProjeto.create(form);
    setForm({ os_id: "", tipo: "Nota interna", titulo: "", descricao: "", autor: "", data: new Date().toISOString().split("T")[0], visivel_cliente: false, acao_requerida: false, acao_descricao: "", acao_responsavel: "" });
    setShowForm(false);
    onRefresh();
    setSaving(false);
  };

  const handleDelete = async (id) => { await base44.entities.ComunicacaoProjeto.delete(id); onRefresh(); };

  return (
    <div className="p-6 space-y-4">
      {acoesAbertas.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-2">Ações pendentes ({acoesAbertas.length})</p>
                <div className="space-y-1">
                  {acoesAbertas.slice(0, 3).map(c => (
                    <div key={c.id} className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="font-medium">{projetoNome(c.os_id)}:</span>
                      <span>{c.acao_descricao}</span>
                      {c.acao_responsavel && <span className="text-slate-400">→ {c.acao_responsavel}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filtroOS} onValueChange={setFiltroOS}>
          <SelectTrigger className="w-56 h-9"><SelectValue placeholder="Todos os projetos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os projetos</SelectItem>
            {projetos.map(p => <SelectItem key={p.id} value={p.id}>{p.cliente_nome}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            {Object.keys(TIPO_CONFIG).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5 bg-[#1A4731] hover:bg-[#245E40]"><Plus size={13} /> Nova Comunicação</Button>
      </div>

      {showForm && (
        <Card className="border-[#1A4731]/20 bg-[#1A4731]/5">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Projeto *</label>
                <Select value={form.os_id} onValueChange={v => setForm(f => ({ ...f, os_id: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{projetos.map(p => <SelectItem key={p.id} value={p.id}>{p.cliente_nome}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Tipo</label>
                <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.keys(TIPO_CONFIG).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Data</label>
                <Input type="date" className="h-8 text-xs" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-500 mb-1 block">Título *</label>
                <Input className="h-8 text-xs" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Autor *</label>
                <Input className="h-8 text-xs" value={form.autor} onChange={e => setForm(f => ({ ...f, autor: e.target.value }))} />
              </div>
              <div className="col-span-2 md:col-span-3">
                <label className="text-xs text-slate-500 mb-1 block">Descrição</label>
                <Input className="h-8 text-xs" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Ação requerida?</label>
                <Select value={form.acao_requerida ? "sim" : "nao"} onValueChange={v => setForm(f => ({ ...f, acao_requerida: v === "sim" }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="nao">Não</SelectItem><SelectItem value="sim">Sim</SelectItem></SelectContent>
                </Select>
              </div>
              {form.acao_requerida && (
                <>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Descrição da ação</label>
                    <Input className="h-8 text-xs" value={form.acao_descricao} onChange={e => setForm(f => ({ ...f, acao_descricao: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Responsável</label>
                    <Input className="h-8 text-xs" value={form.acao_responsavel} onChange={e => setForm(f => ({ ...f, acao_responsavel: e.target.value }))} />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#1A4731] hover:bg-[#245E40]">{saving ? "Salvando..." : "Salvar"}</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {filtradas.map(c => {
          const cfg = TIPO_CONFIG[c.tipo] || TIPO_CONFIG["Nota interna"];
          const Icon = cfg.icon;
          return (
            <Card key={c.id} className={`hover:shadow-sm transition-shadow ${c.acao_requerida ? "border-amber-200" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${cfg.bg} flex-shrink-0 mt-0.5`}>
                    <Icon size={14} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.titulo}</p>
                        <p className="text-xs text-slate-400">{projetoNome(c.os_id)} · {c.autor} · {c.data ? new Date(c.data + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</p>
                      </div>
                      <button onClick={() => handleDelete(c.id)} className="text-slate-200 hover:text-red-400 flex-shrink-0"><Trash2 size={12} /></button>
                    </div>
                    {c.descricao && <p className="text-xs text-slate-600 mt-1">{c.descricao}</p>}
                    {c.acao_requerida && c.acao_descricao && (
                      <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 text-xs">
                        <Bell size={11} className="text-amber-500" />
                        <span className="text-slate-700">{c.acao_descricao}</span>
                        {c.acao_responsavel && <span className="text-slate-400">→ {c.acao_responsavel}</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color}`}>{c.tipo}</span>
                      {c.visivel_cliente && <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full">Visível ao cliente</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtradas.length === 0 && (
          <div className="text-center py-12 text-slate-300">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma comunicação registrada</p>
          </div>
        )}
      </div>
    </div>
  );
}