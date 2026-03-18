import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, DollarSign, AlertTriangle, ChevronRight } from "lucide-react";

const COLUNAS = [
  { id: "Não iniciado", label: "Iniciação", color: "bg-slate-100", dot: "bg-slate-400" },
  { id: "Ativo", label: "Execução", color: "bg-blue-50", dot: "bg-blue-500" },
  { id: "Pausado", label: "Pausado", color: "bg-yellow-50", dot: "bg-yellow-500" },
  { id: "Concluído", label: "Concluído", color: "bg-green-50", dot: "bg-green-500" },
  { id: "Cancelado", label: "Cancelado", color: "bg-red-50", dot: "bg-red-400" },
];

const fmt = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

export default function ProjetosKanban({ data, onRefresh }) {
  const [dragging, setDragging] = useState(null);

  const { projetos, parcelas } = data;

  const getTotal = (osId) => parcelas.filter(p => p.os_id === osId).reduce((s, p) => s + (p.valor || 0), 0);

  const handleDrop = async (colId, e) => {
    e.preventDefault();
    if (!dragging || dragging.status === colId) return;
    await base44.entities.OrdemServico.update(dragging.id, { status: colId });
    onRefresh();
    setDragging(null);
  };

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="flex gap-3 overflow-x-auto h-full pb-2" style={{ minHeight: "calc(100vh - 180px)" }}>
        {COLUNAS.map(col => {
          const items = projetos.filter(p => p.status === col.id);
          return (
            <div
              key={col.id}
              className="flex-shrink-0 w-64 flex flex-col"
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(col.id, e)}
            >
              {/* Column header */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl ${col.color} border border-b-0 border-slate-200`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-xs font-semibold text-slate-700">{col.label}</span>
                </div>
                <span className="text-xs text-slate-400 bg-white px-1.5 py-0.5 rounded-full">{items.length}</span>
              </div>

              {/* Cards */}
              <div className={`flex-1 rounded-b-xl border border-slate-200 ${col.color} p-2 space-y-2 overflow-y-auto`}>
                {items.map(p => {
                  const atrasado = p.prazo_previsto && new Date(p.prazo_previsto) < new Date() && p.percentual_conclusao < 100;
                  const dias = p.prazo_previsto
                    ? Math.ceil((new Date(p.prazo_previsto) - new Date()) / (1000 * 60 * 60 * 24))
                    : null;
                  const total = getTotal(p.id);

                  return (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={() => setDragging(p)}
                      onDragEnd={() => setDragging(null)}
                      className={`bg-white rounded-lg border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
                        atrasado ? "border-red-200" : "border-slate-200"
                      } ${dragging?.id === p.id ? "opacity-50" : ""}`}
                    >
                      <div className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-1">
                          <Link to={`/ProjetoDetalhe?id=${p.id}`} className="font-semibold text-xs text-slate-800 hover:text-[#1A4731] leading-tight flex-1">
                            {p.cliente_nome || "—"}
                          </Link>
                          <Link to={`/ProjetoDetalhe?id=${p.id}`} className="text-slate-300 hover:text-[#1A4731] flex-shrink-0 mt-0.5">
                            <ChevronRight size={12} />
                          </Link>
                        </div>

                        {p.natureza && (
                          <p className="text-[10px] text-slate-400">{p.natureza}</p>
                        )}

                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>Progresso</span>
                            <span className={atrasado ? "text-red-500" : ""}>{p.percentual_conclusao || 0}%</span>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${atrasado ? "bg-red-400" : "bg-[#1A4731]"}`}
                              style={{ width: `${p.percentual_conclusao || 0}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                          {p.responsavel_tecnico && (
                            <div className="flex items-center gap-0.5">
                              <Users size={9} />
                              <span className="truncate max-w-[80px]">{p.responsavel_tecnico}</span>
                            </div>
                          )}
                          {dias !== null && (
                            <div className={`flex items-center gap-0.5 ${atrasado ? "text-red-500 font-medium" : dias <= 7 ? "text-amber-500" : ""}`}>
                              <Calendar size={9} />
                              <span>{atrasado ? `${Math.abs(dias)}d atraso` : `${dias}d`}</span>
                            </div>
                          )}
                          {total > 0 && (
                            <div className="flex items-center gap-0.5 text-green-600">
                              <DollarSign size={9} />
                              <span>{fmt(total)}</span>
                            </div>
                          )}
                        </div>

                        {atrasado && (
                          <div className="flex items-center gap-1 text-[10px] text-red-500">
                            <AlertTriangle size={9} /> Prazo vencido
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-300">
                    Nenhum projeto
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}