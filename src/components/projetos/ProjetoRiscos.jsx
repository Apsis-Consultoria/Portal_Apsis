import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Plus, Check, Trash2, ShieldCheck } from "lucide-react";

const IMPACTO_COLOR = {
  "Baixo": "bg-green-100 text-green-700",
  "Médio": "bg-yellow-100 text-yellow-700",
  "Alto": "bg-orange-100 text-orange-700",
  "Crítico": "bg-red-100 text-red-700",
};
const STATUS_COLOR = {
  "Aberto": "bg-red-100 text-red-700",
  "Em mitigação": "bg-yellow-100 text-yellow-700",
  "Resolvido": "bg-green-100 text-green-700",
  "Aceito": "bg-gray-100 text-gray-600",
};

export default function ProjetoRiscos({ osId }) {
  const [riscos, setRiscos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    descricao: "", categoria: "Prazo", probabilidade: "Média", impacto: "Médio",
    status: "Aberto", plano_mitigacao: "", responsavel: "", prazo_resolucao: ""
  });

  useEffect(() => {
    base44.entities.RiscoProjeto.filter({ os_id: osId }).then(r => {
      setRiscos(r);
      setLoading(false);
    });
  }, [osId]);

  const salvar = async () => {
    if (!form.descricao || !form.categoria) return;
    const novo = await base44.entities.RiscoProjeto.create({ ...form, os_id: osId });
    setRiscos(prev => [novo, ...prev]);
    setShowForm(false);
    setForm({ descricao: "", categoria: "Prazo", probabilidade: "Média", impacto: "Médio", status: "Aberto", plano_mitigacao: "", responsavel: "", prazo_resolucao: "" });
  };

  const atualizarStatus = async (id, status) => {
    await base44.entities.RiscoProjeto.update(id, { status });
    setRiscos(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const excluir = async (id) => {
    await base44.entities.RiscoProjeto.delete(id);
    setRiscos(prev => prev.filter(r => r.id !== id));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  const abertos = riscos.filter(r => r.status === "Aberto");
  const criticos = riscos.filter(r => ["Alto", "Crítico"].includes(r.impacto) && r.status !== "Resolvido");

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-400"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-500">{abertos.length}</p><p className="text-xs text-slate-500">Abertos</p></CardContent></Card>
        <Card className="border-l-4 border-l-orange-400"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-orange-500">{criticos.length}</p><p className="text-xs text-slate-500">Alto/Crítico impacto</p></CardContent></Card>
        <Card className="border-l-4 border-l-green-400"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{riscos.filter(r => r.status === "Resolvido").length}</p><p className="text-xs text-slate-500">Resolvidos</p></CardContent></Card>
      </div>

      {abertos.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-700">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-sm font-medium">Nenhum risco aberto. Projeto está seguro! ✓</span>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Novo Risco</Button>
      </div>

      {showForm && (
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader><CardTitle className="text-sm">Novo Risco</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Descrição do risco *</label>
              <Input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descreva o risco identificado" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div><label className="text-xs text-slate-500 mb-1 block">Categoria</label>
                <Select value={form.categoria} onValueChange={v => setForm(f => ({ ...f, categoria: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Prazo", "Escopo", "Financeiro", "Técnico", "Comunicação", "Recurso"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Probabilidade</label>
                <Select value={form.probabilidade} onValueChange={v => setForm(f => ({ ...f, probabilidade: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Baixa", "Média", "Alta"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Impacto</label>
                <Select value={form.impacto} onValueChange={v => setForm(f => ({ ...f, impacto: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Baixo", "Médio", "Alto", "Crítico"].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Responsável</label><Input value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Prazo resolução</label><Input type="date" value={form.prazo_resolucao} onChange={e => setForm(f => ({ ...f, prazo_resolucao: e.target.value }))} /></div>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Plano de mitigação</label>
              <Input value={form.plano_mitigacao} onChange={e => setForm(f => ({ ...f, plano_mitigacao: e.target.value }))} placeholder="Como vamos reduzir ou eliminar este risco?" />
            </div>
            <div className="flex gap-2">
              <Button onClick={salvar} className="gap-1"><Check className="w-4 h-4" /> Salvar</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {riscos.map(r => (
          <Card key={r.id} className={`border-l-4 ${r.impacto === "Crítico" ? "border-l-red-500" : r.impacto === "Alto" ? "border-l-orange-400" : "border-l-slate-200"}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-slate-800 text-sm">{r.descricao}</span>
                    <Badge className={`text-xs ${IMPACTO_COLOR[r.impacto] || ""}`}>{r.impacto}</Badge>
                    <Badge className={`text-xs ${STATUS_COLOR[r.status] || ""}`}>{r.status}</Badge>
                    <Badge className="text-xs bg-slate-100 text-slate-600">{r.categoria}</Badge>
                  </div>
                  <div className="flex gap-3 text-xs text-slate-400">
                    <span>Prob: {r.probabilidade}</span>
                    {r.responsavel && <span>Resp: {r.responsavel}</span>}
                    {r.prazo_resolucao && <span>Até: {new Date(r.prazo_resolucao + "T00:00:00").toLocaleDateString("pt-BR")}</span>}
                  </div>
                  {r.plano_mitigacao && (
                    <p className="mt-1 text-xs text-slate-600 bg-slate-50 rounded p-2">
                      🛡️ {r.plano_mitigacao}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {r.status !== "Resolvido" && (
                    <>
                      {r.status === "Aberto" && <button onClick={() => atualizarStatus(r.id, "Em mitigação")} className="text-xs text-yellow-600 border border-yellow-200 rounded px-2 py-0.5 whitespace-nowrap">Mitigar</button>}
                      <button onClick={() => atualizarStatus(r.id, "Resolvido")} className="text-xs text-green-600 border border-green-200 rounded px-2 py-0.5">Resolver</button>
                    </>
                  )}
                  <button onClick={() => excluir(r.id)} className="text-slate-300 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {riscos.length === 0 && <Card><CardContent className="py-10 text-center text-slate-400 text-sm">Nenhum risco identificado ainda.</CardContent></Card>}
      </div>
    </div>
  );
}