import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const STATUS_COLOR = {
  "A fazer": "#94A3B8", "Em andamento": "#3B82F6", "Em revisão": "#F59E0B",
  "Concluída": "#22C55E", "Bloqueada": "#EF4444",
};

export default function ProjetosGantt({ data }) {
  const { projetos, tarefas } = data;
  const [filtroOS, setFiltroOS] = useState(projetos[0]?.id || "");
  const [offsetSemanas, setOffsetSemanas] = useState(0);

  const hoje = new Date();
  const inicioJanela = new Date(hoje);
  inicioJanela.setDate(hoje.getDate() + offsetSemanas * 7 - 14);
  const totalDias = 56;
  const semanas = Array.from({ length: 8 }, (_, i) => { const d = new Date(inicioJanela); d.setDate(inicioJanela.getDate() + i * 7); return d; });

  const tarefasOS = tarefas.filter(t => t.os_id === filtroOS).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  const getTarefaBar = (tarefa) => {
    if (!tarefa.data_inicio || !tarefa.data_fim) return null;
    const inicio = new Date(tarefa.data_inicio + "T00:00:00");
    const fim = new Date(tarefa.data_fim + "T00:00:00");
    const janelaFim = new Date(inicioJanela); janelaFim.setDate(janelaFim.getDate() + totalDias);
    if (fim < inicioJanela || inicio > janelaFim) return null;
    const startOffset = Math.max(0, (inicio - inicioJanela) / (1000 * 60 * 60 * 24));
    const endOffset = Math.min(totalDias, (fim - inicioJanela) / (1000 * 60 * 60 * 24));
    return { left: `${(startOffset / totalDias) * 100}%`, width: `${Math.max(1, ((endOffset - startOffset) / totalDias) * 100)}%`, color: STATUS_COLOR[tarefa.status] || "#94A3B8" };
  };

  const hojeLeft = ((hoje - inicioJanela) / (1000 * 60 * 60 * 24) / totalDias) * 100;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={filtroOS} onValueChange={setFiltroOS}>
          <SelectTrigger className="w-72 h-9"><SelectValue placeholder="Selecione um projeto" /></SelectTrigger>
          <SelectContent>
            {projetos.map(p => <SelectItem key={p.id} value={p.id}>{p.cliente_nome} {p.proposta_numero ? `— ${p.proposta_numero}` : ""}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <button onClick={() => setOffsetSemanas(o => o - 1)} className="p-1.5 rounded-lg border hover:bg-slate-50"><ChevronLeft size={14} /></button>
          <button onClick={() => setOffsetSemanas(0)} className="px-3 py-1.5 text-xs rounded-lg border hover:bg-slate-50 flex items-center gap-1"><Calendar size={12} /> Hoje</button>
          <button onClick={() => setOffsetSemanas(o => o + 1)} className="p-1.5 rounded-lg border hover:bg-slate-50"><ChevronRight size={14} /></button>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {Object.entries(STATUS_COLOR).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} /><span className="text-slate-500">{status}</span></div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-hidden">
          {tarefasOS.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-300 text-sm">{filtroOS ? "Nenhuma tarefa com datas neste projeto" : "Selecione um projeto"}</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="flex border-b border-slate-200">
                  <div className="w-52 flex-shrink-0 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 border-r border-slate-200">Tarefa</div>
                  <div className="flex-1 bg-slate-50 py-2">
                    <div className="flex">
                      {semanas.map((s, i) => (
                        <div key={i} className="flex-1 text-center text-xs text-slate-400 border-r border-slate-100 last:border-0">
                          {s.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {tarefasOS.map((t, idx) => {
                  const bar = getTarefaBar(t);
                  return (
                    <div key={t.id} className={`flex border-b border-slate-100 hover:bg-slate-50 ${idx % 2 === 0 ? "" : "bg-slate-50/40"}`} style={{ height: 40 }}>
                      <div className="w-52 flex-shrink-0 px-3 flex items-center border-r border-slate-200">
                        <div className="flex items-center gap-2 w-full">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_COLOR[t.status] || "#94A3B8" }} />
                          <span className="text-xs text-slate-700 truncate">{t.titulo}</span>
                        </div>
                      </div>
                      <div className="flex-1 relative">
                        {semanas.map((_, i) => (
                          <div key={i} className="absolute top-0 bottom-0 border-r border-slate-100" style={{ left: `${(i / semanas.length) * 100}%` }} />
                        ))}
                        {hojeLeft >= 0 && hojeLeft <= 100 && (
                          <div className="absolute top-0 bottom-0 w-px bg-red-400 z-10" style={{ left: `${hojeLeft}%` }} />
                        )}
                        {bar && (
                          <div className="absolute top-2 bottom-2 rounded-md flex items-center px-2 z-20" style={{ left: bar.left, width: bar.width, background: bar.color, minWidth: 4 }}>
                            {parseFloat(bar.width) > 8 && <span className="text-white text-[10px] font-medium truncate">{t.responsavel || ""}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}