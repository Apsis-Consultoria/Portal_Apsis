import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Users, Calendar, DollarSign, Clock, CheckCircle2, AlertTriangle,
  FileText, MessageSquare, TrendingUp, Edit2, Save, X
} from "lucide-react";

const fmt = (v) => v?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "R$ 0";

export default function ProjetoResumo({ projeto, onUpdate, osId }) {
  const [tarefas, setTarefas] = useState([]);
  const [parcelas, setParcelas] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [riscos, setRiscos] = useState([]);
  const [comunicacoes, setComunicacoes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ ...projeto });

  useEffect(() => {
    Promise.all([
      base44.entities.Tarefa.filter({ os_id: osId }),
      base44.entities.Parcela.filter({ os_id: osId }),
      base44.entities.EntradaTempo.filter({ os_id: osId }),
      base44.entities.RiscoProjeto.filter({ os_id: osId }),
      base44.entities.ComunicacaoProjeto.filter({ os_id: osId }),
    ]).then(([t, p, e, r, c]) => {
      setTarefas(t);
      setParcelas(p);
      setEntradas(e);
      setRiscos(r);
      setComunicacoes(c);
    });
  }, [osId]);

  const salvar = async () => {
    const atualizado = await base44.entities.OrdemServico.update(projeto.id, form);
    onUpdate(atualizado);
    setEditando(false);
  };

  const tarefasConcluidas = tarefas.filter(t => t.status === "Concluída").length;
  const valorFaturado = parcelas.filter(p => ["Faturada", "Recebida"].includes(p.status)).reduce((s, p) => s + (p.valor || 0), 0);
  const valorTotal = parcelas.reduce((s, p) => s + (p.valor || 0), 0);
  const horasTotal = entradas.reduce((s, e) => s + (e.horas || 0), 0);
  const riscosAbertos = riscos.filter(r => r.status === "Aberto").length;
  const atrasado = projeto.prazo_previsto && new Date(projeto.prazo_previsto) < new Date() && projeto.percentual_conclusao < 100;

  const proximaParcela = parcelas
    .filter(p => p.status === "Lançada" && p.data_vencimento)
    .sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento))[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cabeçalho editável */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Informações do Projeto</CardTitle>
            {editando ? (
              <div className="flex gap-2">
                <Button size="sm" onClick={salvar} className="gap-1"><Save className="w-3.5 h-3.5" /> Salvar</Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditando(false); setForm({ ...projeto }); }}><X className="w-3.5 h-3.5" /></Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEditando(true)} className="gap-1"><Edit2 className="w-3.5 h-3.5" /> Editar</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <InfoField label="Cliente" value={form.cliente_nome} editando={editando} onChange={v => setForm(f => ({ ...f, cliente_nome: v }))} />
              <InfoField label="Natureza" value={form.natureza} editando={editando} onChange={v => setForm(f => ({ ...f, natureza: v }))} />
              <InfoField label="Responsável Técnico" value={form.responsavel_tecnico} editando={editando} onChange={v => setForm(f => ({ ...f, responsavel_tecnico: v }))} />
              <InfoField label="Nº Proposta" value={form.proposta_numero} editando={editando} onChange={v => setForm(f => ({ ...f, proposta_numero: v }))} />
            </div>
            <div className="space-y-3">
              {editando ? (
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Status</label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Ativo", "Pausado", "Cancelado", "Não iniciado"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <InfoField label="Status" value={form.status} />
              )}
              <InfoField label="Prazo Previsto" value={form.prazo_previsto} type="date" editando={editando} onChange={v => setForm(f => ({ ...f, prazo_previsto: v }))} />
              <div>
                <label className="text-xs text-slate-500 block mb-1">Progresso</label>
                {editando ? (
                  <Input type="number" min={0} max={100} value={form.percentual_conclusao || 0} onChange={e => setForm(f => ({ ...f, percentual_conclusao: Number(e.target.value) }))} />
                ) : (
                  <div className="flex items-center gap-3">
                    <Progress value={form.percentual_conclusao || 0} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{form.percentual_conclusao || 0}%</span>
                  </div>
                )}
              </div>
              <InfoField label="Descrição" value={form.descricao} editando={editando} onChange={v => setForm(f => ({ ...f, descricao: v }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={CheckCircle2} color="blue" label="Tarefas concluídas" value={`${tarefasConcluidas}/${tarefas.length}`} />
        <KPICard icon={Clock} color="purple" label="Horas lançadas" value={`${horasTotal.toFixed(1)}h`} />
        <KPICard icon={DollarSign} color="green" label="Faturado" value={fmt(valorFaturado)} sub={`de ${fmt(valorTotal)}`} />
        <KPICard icon={AlertTriangle} color={riscosAbertos > 0 ? "orange" : "green"} label="Riscos abertos" value={riscosAbertos} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarefas recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Últimas Tarefas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tarefas.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-slate-700">{t.titulo}</span>
                <StatusBadge status={t.status} />
              </div>
            ))}
            {tarefas.length === 0 && <p className="text-slate-400 text-sm text-center py-4">Nenhuma tarefa cadastrada.</p>}
          </CardContent>
        </Card>

        {/* Próximas parcelas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> Parcelas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {parcelas.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{p.data_vencimento ? new Date(p.data_vencimento + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</span>
                <span className="font-medium">{fmt(p.valor)}</span>
                <Badge className={`text-xs ${p.status === "Recebida" ? "bg-green-100 text-green-700" : p.status === "Faturada" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</Badge>
              </div>
            ))}
            {parcelas.length === 0 && <p className="text-slate-400 text-sm text-center py-4">Nenhuma parcela cadastrada.</p>}
          </CardContent>
        </Card>

        {/* Comunicações recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" /> Comunicações Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {comunicacoes.slice(0, 5).map(c => (
              <div key={c.id} className="text-sm border-l-2 border-slate-200 pl-3">
                <p className="font-medium text-slate-700">{c.titulo}</p>
                <p className="text-xs text-slate-400">{c.tipo} · {c.data ? new Date(c.data + "T00:00:00").toLocaleDateString("pt-BR") : "—"} · {c.autor}</p>
              </div>
            ))}
            {comunicacoes.length === 0 && <p className="text-slate-400 text-sm text-center py-4">Nenhuma comunicação registrada.</p>}
          </CardContent>
        </Card>

        {/* Riscos abertos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" /> Riscos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {riscos.filter(r => r.status !== "Resolvido").slice(0, 5).map(r => (
              <div key={r.id} className="flex items-start gap-2 text-sm">
                <Badge className={`text-xs shrink-0 ${r.impacto === "Crítico" || r.impacto === "Alto" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{r.impacto}</Badge>
                <span className="text-slate-700 text-xs">{r.descricao}</span>
              </div>
            ))}
            {riscos.filter(r => r.status !== "Resolvido").length === 0 && <p className="text-slate-400 text-sm text-center py-4">Nenhum risco aberto. ✓</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoField({ label, value, editando, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      {editando && onChange ? (
        <Input type={type} value={value || ""} onChange={e => onChange(e.target.value)} />
      ) : (
        <p className="text-sm text-slate-800 font-medium">
          {type === "date" && value
            ? new Date(value + "T00:00:00").toLocaleDateString("pt-BR")
            : value || "—"}
        </p>
      )}
    </div>
  );
}

function KPICard({ icon: Icon, color, label, value, sub }) {
  const colors = {
    blue: "text-blue-500 bg-blue-50",
    green: "text-green-500 bg-green-50",
    purple: "text-purple-500 bg-purple-50",
    orange: "text-orange-500 bg-orange-50",
  };
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className={`w-5 h-5 ${colors[color].split(" ")[0]}`} />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-800">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }) {
  const m = {
    "Concluída": "bg-green-100 text-green-700",
    "Em andamento": "bg-blue-100 text-blue-700",
    "A fazer": "bg-gray-100 text-gray-600",
    "Bloqueada": "bg-red-100 text-red-700",
    "Em revisão": "bg-yellow-100 text-yellow-700",
  };
  return <Badge className={`text-xs ${m[status] || "bg-gray-100 text-gray-600"}`}>{status}</Badge>;
}