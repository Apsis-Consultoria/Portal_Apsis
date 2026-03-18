import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const STATUS_COLOR = {
  "A fazer": "#94a3b8",
  "Em andamento": "#3b82f6",
  "Em revisão": "#f59e0b",
  "Concluída": "#22c55e",
  "Bloqueada": "#ef4444",
};

function getDays(start, end) {
  const days = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export default function ProjetoGantt({ osId, projeto }) {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewStart, setViewStart] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const DIAS_VISIVEIS = 30;

  useEffect(() => {
    base44.entities.Tarefa.filter({ os_id: osId }).then(t => {
      setTarefas(t);
      setLoading(false);
    });
  }, [osId]);

  const viewEnd = new Date(viewStart);
  viewEnd.setDate(viewEnd.getDate() + DIAS_VISIVEIS - 1);
  const days = getDays(viewStart, viewEnd);

  const navPrev = () => {
    const d = new Date(viewStart);
    d.setDate(d.getDate() - 15);
    setViewStart(d);
  };
  const navNext = () => {
    const d = new Date(viewStart);
    d.setDate(d.getDate() + 15);
    setViewStart(d);
  };
  const hoje = () => {
    const d = new Date();
    d.setDate(1);
    setViewStart(d);
  };

  const getBarProps = (tarefa) => {
    if (!tarefa.data_inicio || !tarefa.data_fim) return null;
    const inicio = new Date(tarefa.data_inicio + "T00:00:00");
    const fim = new Date(tarefa.data_fim + "T00:00:00");

    const startIdx = days.findIndex(d => d.toDateString() === inicio.toDateString());
    const endIdx = days.findIndex(d => d.toDateString() === fim.toDateString());

    // Parcialmente visível
    const left = Math.max(0, startIdx);
    const right = Math.min(DIAS_VISIVEIS - 1, endIdx);

    if (right < 0 || left >= DIAS_VISIVEIS) return null;
    if (endIdx < 0 && startIdx < 0) return null;

    return {
      left: Math.max(0, startIdx) * (100 / DIAS_VISIVEIS),
      width: ((Math.min(endIdx, DIAS_VISIVEIS - 1) - Math.max(0, startIdx) + 1)) * (100 / DIAS_VISIVEIS),
      color: STATUS_COLOR[tarefa.status] || "#94a3b8",
    };
  };

  const todayIdx = days.findIndex(d => d.toDateString() === new Date().toDateString());

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={navPrev}><ChevronLeft className="w-4 h-4" /></Button>
        <Button variant="outline" size="sm" onClick={hoje}>Hoje</Button>
        <Button variant="outline" size="sm" onClick={navNext}><ChevronRight className="w-4 h-4" /></Button>
        <span className="text-sm text-slate-500">
          {viewStart.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </span>
      </div>

      <div className="bg-white border rounded-xl overflow-auto">
        {/* Header de dias */}
        <div className="flex border-b sticky top-0 bg-white z-10">
          <div className="w-48 shrink-0 p-2 border-r bg-slate-50">
            <span className="text-xs font-semibold text-slate-500">TAREFA</span>
          </div>
          <div className="flex flex-1 relative">
            {days.map((d, i) => (
              <div
                key={i}
                className={`flex-1 text-center py-1.5 text-xs border-r last:border-r-0 ${d.toDateString() === new Date().toDateString() ? "bg-blue-50 text-blue-600 font-bold" : d.getDay() === 0 || d.getDay() === 6 ? "bg-slate-50 text-slate-400" : "text-slate-500"}`}
              >
                <div className="font-medium">{d.getDate()}</div>
                <div className="text-xs opacity-60">
                  {d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarefas */}
        {tarefas.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">
            Nenhuma tarefa com datas definidas. Adicione tarefas no Kanban.
          </div>
        )}
        {tarefas.map((t, idx) => {
          const bar = getBarProps(t);
          return (
            <div key={t.id} className={`flex border-b last:border-b-0 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
              <div className="w-48 shrink-0 p-2 border-r">
                <p className="text-xs font-medium text-slate-700 truncate">{t.titulo}</p>
                <p className="text-xs text-slate-400 truncate">{t.responsavel}</p>
              </div>
              <div className="flex-1 relative h-12">
                {/* Linhas de grade */}
                <div className="absolute inset-0 flex">
                  {days.map((d, i) => (
                    <div key={i} className={`flex-1 border-r last:border-r-0 ${d.toDateString() === new Date().toDateString() ? "bg-blue-50/40" : d.getDay() === 0 || d.getDay() === 6 ? "bg-slate-50" : ""}`} />
                  ))}
                </div>

                {/* Barra */}
                {bar && (
                  <div
                    className="absolute top-2 h-8 rounded-md flex items-center px-2 text-white text-xs font-medium shadow-sm z-10"
                    style={{
                      left: `${bar.left}%`,
                      width: `${bar.width}%`,
                      backgroundColor: bar.color,
                      minWidth: "24px",
                    }}
                    title={`${t.titulo} — ${t.status}`}
                  >
                    <span className="truncate">{t.titulo}</span>
                  </div>
                )}

                {/* Linha de hoje */}
                {todayIdx >= 0 && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-blue-500 opacity-60 z-20"
                    style={{ left: `${(todayIdx + 0.5) * (100 / DIAS_VISIVEIS)}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_COLOR).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5 text-xs text-slate-600">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
            {status}
          </div>
        ))}
      </div>
    </div>
  );
}