import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Shield, CheckCircle2, XCircle, Plus, Trash2 } from "lucide-react";

const IMPACTO_STYLE = {
  "Baixo": "bg-green-100 text-green-700",
  "Médio": "bg-yellow-100 text-yellow-700",
  "Alto": "bg-orange-100 text-orange-700",
  "Crítico": "bg-red-100 text-red-700",
};

const STATUS_STYLE = {
  "Aberto": "bg-red-100 text-red-700",
  "Em mitigação": "bg-yellow-100 text-yellow-700",
  "Resolvido": "bg-green-100 text-green-700",
  "Aceito": "bg-slate-100 text-slate-600",
};

export default function ProjetosRiscos({ data, onRefresh }) {
  const { riscos, projetos } = data;
  const [filtroOS, setFiltroOS] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ os_id: "", descricao: "", categoria: "Prazo", probabilidade: "Média", impacto: "Médio", status: "Aberto", plano_mitigacao: "", responsavel: "" });
  const [saving, setSaving] = useState(false);

  const filtrados = riscos.filter(r => {
    const matchOS = filtroOS === "todos" || r.os_id === filtroOS;
    const matchSt = filtroStatus === "todos" || r.status === filtroStatus;
    return matchOS && matchSt;
  });

  const abertos = filtrados.filter(r => r.status === "Aberto").length;
  const emMitigacao = filtrados.filter(r => r.status === "Em mitigação").length;
  const resolvidos = filtrados.filter(r => r.status === "Resolvido").length;
  const criticos = filtrados.filter(r => r.impacto === "Crítico" && r.status !== "Resolvido").length;

  const projetoNome = (osId) => projetos.find(p => p.id === osId)?.cliente_nome || "—";

  const handleSave = async () => {
    if (!form.os_id || !form.descricao || !form.categoria) return;
    setSaving(true);
    await base44.entities.RiscoProjeto.create(form);
    setForm({ os_id: "", descricao: "", categoria: "Prazo", probabilidade: "Média", impacto: "Médio", status: "Aberto", plano_mitigacao: "", responsavel: "" });
    setShowForm(false);
    onRefresh();
    setSaving(false);
  };

  const handleStatus = async (risco, novoStatus) => {
    await base44.entities.RiscoProjeto.update(risco.id, { status: novoStatus });
    onRefresh();
  };

  const handleDelete = async (id) => {
    await base44.entities.RiscoProjeto.delete(id);
    onRefresh();
  };

  return (
    <div className="p-6 space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-400" />
            <div><p className="text-xl font-bold text-slate-800">{abertos}</p><p className="text-xs text-slate-400">Abertos</p></div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield size={18} className="text-[#F47920]" />
            <div><p className="text-xl font-bold text-slate-800">{emMitigacao}</p><p className="text-xs text-slate-400">Em Mitigação</p></div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-green-500" />
            <div><p className="text-xl font-bold text-slate-800">{resolvidos}</p><p className="text-xs text-slate-400">Resolvidos</p></div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-600">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle size={18} className="text-red-600" />
            <div><p className="text-xl font-bold text-slate-800">{criticos}</p><p className="text-xs text-slate-400">Impacto Crítico</p></div>
          </CardContent>
        </Card>
      </div>

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
            <SelectItem value="Aberto">Aberto</SelectItem>
            <SelectItem value="Em mitigação">Em mitigação</SelectItem>
            <SelectItem value="Resolvido">Resolvido</SelectItem>
            <SelectItem value="Aceito">Aceito</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5 bg-[#1A4731] hover:bg-[#245E40]">
          <Plus size={13} /> Novo Risco
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
                <label className="text-xs text-slate-500 mb-1 block">Categoria *</label>
                <Select value={form.categoria} onValueChange={v => setForm(f => ({ ...f, categoria: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Prazo","Escopo","Financeiro","Técnico","Comunicação","Recurso"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Impacto</label>
                <Select value={form.impacto} onValueChange={v => setForm(f => ({ ...f, impacto: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Baixo","Médio","Alto","Crítico"].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Probabilidade</label>
                <Select value={form.probabilidade} onValueChange={v => setForm(f => ({ ...f, probabilidade: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Baixa","Média","Alta"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Responsável</label>
                <Input className="h-8 text-xs" value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} />
              </div>
              <div className="col-span-2 md:col-span-3">
                <label className="text-xs text-slate-500 mb-1 block">Descrição *</label>
                <Input className="h-8 text-xs" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
              </div>
              <div className="col-span-2 md:col-span-3">
                <label className="text-xs text-slate-500 mb-1 block">Plano de mitigação</label>
                <Input className="h-8 text-xs" value={form.plano_mitigacao} onChange={e => setForm(f => ({ ...f, plano_mitigacao: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#1A4731] hover:bg-[#245E40]">{saving ? "Salvando..." : "Salvar"}</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Projeto</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Risco</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Categoria</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Prob.</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Impacto</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Responsável</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtrados.map(r => (
                  <tr key={r.id} className={`border-b border-slate-50 hover:bg-slate-50 ${r.impacto === "Crítico" && r.status !== "Resolvido" ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-2.5 font-medium text-slate-700">{projetoNome(r.os_id)}</td>
                    <td className="px-4 py-2.5 text-slate-600 max-w-xs">
                      <div className="truncate">{r.descricao}</div>
                      {r.plano_mitigacao && <div className="text-slate-400 truncate mt-0.5">→ {r.plano_mitigacao}</div>}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{r.categoria}</td>
                    <td className="px-4 py-2.5 text-slate-500">{r.probabilidade}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${IMPACTO_STYLE[r.impacto] || ""}`}>{r.impacto}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <Select value={r.status} onValueChange={v => handleStatus(r, v)}>
                        <SelectTrigger className="h-6 border-0 p-0 w-28 text-xs">
                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[r.status] || ""}`}>{r.status}</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aberto">Aberto</SelectItem>
                          <SelectItem value="Em mitigação">Em mitigação</SelectItem>
                          <SelectItem value="Resolvido">Resolvido</SelectItem>
                          <SelectItem value="Aceito">Aceito</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{r.responsavel || "—"}</td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => handleDelete(r.id)} className="text-slate-300 hover:text-red-400">
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-10 text-slate-300">Nenhum risco registrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}