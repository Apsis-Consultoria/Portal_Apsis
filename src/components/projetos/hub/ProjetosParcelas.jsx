import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertTriangle, DollarSign, TrendingUp, CreditCard, Plus, Trash2 } from "lucide-react";

const fmt = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const STATUS_STYLE = {
  "Lançada": "bg-slate-100 text-slate-600",
  "Faturada": "bg-blue-100 text-blue-700",
  "Recebida": "bg-green-100 text-green-700",
  "Em atraso": "bg-red-100 text-red-700",
};

export default function ProjetosParcelas({ data, onRefresh }) {
  const { parcelas, projetos } = data;
  const [filtroOS, setFiltroOS] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ os_id: "", valor: "", data_vencimento: "", status: "Lançada", observacoes: "" });
  const [saving, setSaving] = useState(false);

  const filtradas = parcelas.filter(p => {
    const matchOS = filtroOS === "todos" || p.os_id === filtroOS;
    const matchSt = filtroStatus === "todos" || p.status === filtroStatus;
    return matchOS && matchSt;
  });

  const total = filtradas.reduce((s, p) => s + (p.valor || 0), 0);
  const faturado = filtradas.filter(p => ["Faturada", "Recebida"].includes(p.status)).reduce((s, p) => s + (p.valor || 0), 0);
  const pendente = filtradas.filter(p => p.status === "Lançada").reduce((s, p) => s + (p.valor || 0), 0);
  const emAtraso = filtradas.filter(p => {
    if (p.status === "Recebida") return false;
    return p.data_vencimento && new Date(p.data_vencimento) < new Date();
  }).reduce((s, p) => s + (p.valor || 0), 0);

  const projetoNome = (osId) => projetos.find(p => p.id === osId)?.cliente_nome || "—";

  const handleSave = async () => {
    if (!form.os_id || !form.valor || !form.data_vencimento) return;
    setSaving(true);
    const proj = projetos.find(p => p.id === form.os_id);
    await base44.entities.Parcela.create({
      ...form,
      valor: parseFloat(form.valor),
      cliente_nome: proj?.cliente_nome || "",
      proposta_id: proj?.proposta_id || "",
    });
    setForm({ os_id: "", valor: "", data_vencimento: "", status: "Lançada", observacoes: "" });
    setShowForm(false);
    onRefresh();
    setSaving(false);
  };

  const handleStatus = async (parcela, novoStatus) => {
    await base44.entities.Parcela.update(parcela.id, { status: novoStatus });
    onRefresh();
  };

  const handleDelete = async (id) => {
    await base44.entities.Parcela.delete(id);
    onRefresh();
  };

  return (
    <div className="p-6 space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-blue-400" />
              <div>
                <p className="text-base font-bold text-slate-800">{fmt(total)}</p>
                <p className="text-xs text-slate-400">Total portfólio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              <div>
                <p className="text-base font-bold text-slate-800">{fmt(faturado)}</p>
                <p className="text-xs text-slate-400">Faturado/Recebido</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-amber-400" />
              <div>
                <p className="text-base font-bold text-slate-800">{fmt(pendente)}</p>
                <p className="text-xs text-slate-400">A faturar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-400" />
              <div>
                <p className="text-base font-bold text-slate-800">{fmt(emAtraso)}</p>
                <p className="text-xs text-slate-400">Em atraso</p>
              </div>
            </div>
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
            <SelectItem value="Lançada">Lançada</SelectItem>
            <SelectItem value="Faturada">Faturada</SelectItem>
            <SelectItem value="Recebida">Recebida</SelectItem>
            <SelectItem value="Em atraso">Em atraso</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5 bg-[#1A4731] hover:bg-[#245E40]">
          <Plus size={13} /> Nova Parcela
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-[#1A4731]/20 bg-[#1A4731]/5">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs text-slate-500 mb-1 block">Projeto *</label>
                <Select value={form.os_id} onValueChange={v => setForm(f => ({ ...f, os_id: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {projetos.map(p => <SelectItem key={p.id} value={p.id}>{p.cliente_nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Valor *</label>
                <Input type="number" className="h-8 text-xs" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Vencimento *</label>
                <Input type="date" className="h-8 text-xs" value={form.data_vencimento} onChange={e => setForm(f => ({ ...f, data_vencimento: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#1A4731] hover:bg-[#245E40]">
                {saving ? "Salvando..." : "Salvar"}
              </Button>
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
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">Valor</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Vencimento</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Recebimento</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map(p => {
                  const vencida = !["Recebida", "Faturada"].includes(p.status) && p.data_vencimento && new Date(p.data_vencimento) < new Date();
                  return (
                    <tr key={p.id} className={`border-b border-slate-50 hover:bg-slate-50 ${vencida ? "bg-red-50/30" : ""}`}>
                      <td className="px-4 py-2.5 font-medium text-slate-700">{projetoNome(p.os_id)}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-slate-800">{fmt(p.valor)}</td>
                      <td className={`px-4 py-2.5 ${vencida ? "text-red-500 font-medium" : "text-slate-500"}`}>
                        {p.data_vencimento ? new Date(p.data_vencimento + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                        {vencida && " ⚠"}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500">
                        {p.data_recebimento ? new Date(p.data_recebimento + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <Select value={p.status} onValueChange={v => handleStatus(p, v)}>
                          <SelectTrigger className="h-6 w-28 text-xs border-0 p-0">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[p.status] || "bg-slate-100 text-slate-600"}`}>
                              {p.status}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lançada">Lançada</SelectItem>
                            <SelectItem value="Faturada">Faturada</SelectItem>
                            <SelectItem value="Recebida">Recebida</SelectItem>
                            <SelectItem value="Em atraso">Em atraso</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => handleDelete(p.id)} className="text-slate-300 hover:text-red-400">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtradas.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-slate-300">Nenhuma parcela encontrada</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}