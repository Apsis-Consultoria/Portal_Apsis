import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";

export default function RateioTabela({ lancamentos, setLancamentos }) {
  const atualizarLancamento = (index, campo, valor) => {
    setLancamentos(prev => {
      const novo = [...prev];
      novo[index] = { ...novo[index], [campo]: valor };
      return novo;
    });
  };

  const toggleValidado = (index) => {
    atualizarLancamento(index, "validado", !lancamentos[index].validado);
  };

  const removerLancamento = (index) => {
    setLancamentos(prev => prev.filter((_, i) => i !== index));
  };

  const validados = lancamentos.filter(l => l.validado).length;

  return (
    <div className="space-y-4">
      {/* Resumo */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-4 text-sm">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Total de registros</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">{lancamentos.length}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Valor total</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">
              R$ {lancamentos.reduce((sum, l) => sum + (l.valor || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Validados</p>
            <p className="text-lg font-bold text-green-600">{validados}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Pendentes</p>
            <p className="text-lg font-bold text-yellow-600">{lancamentos.length - validados}</p>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--surface-2)] border-b border-[var(--border)]">
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)] w-12">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Data</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Descrição</th>
              <th className="text-right px-4 py-3 font-semibold text-[var(--text-primary)]">Valor</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Projeto</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Centro de Custo</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Tipo</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Notas</th>
              <th className="text-center px-4 py-3 font-semibold text-[var(--text-primary)]">Status</th>
              <th className="text-center px-4 py-3 font-semibold text-[var(--text-primary)] w-12">Ação</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map((lancamento, idx) => (
              <tr
                key={idx}
                className={`border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors ${
                  lancamento.validado ? "bg-green-50" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={lancamento.data}
                    onChange={(e) => atualizarLancamento(idx, "data", e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-[var(--border)] rounded focus:outline-none focus:border-[var(--apsis-orange)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={lancamento.descricao || ""}
                    onChange={(e) => atualizarLancamento(idx, "descricao", e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-[var(--border)] rounded focus:outline-none focus:border-[var(--apsis-orange)]"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    value={lancamento.valor}
                    onChange={(e) => atualizarLancamento(idx, "valor", parseFloat(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-[var(--border)] rounded text-right focus:outline-none focus:border-[var(--apsis-orange)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={lancamento.projeto || ""}
                    onChange={(e) => atualizarLancamento(idx, "projeto", e.target.value)}
                    placeholder="Projeto"
                    className="w-full px-2 py-1 text-xs border border-[var(--border)] rounded focus:outline-none focus:border-[var(--apsis-orange)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={lancamento.centro_custo || ""}
                    onChange={(e) => atualizarLancamento(idx, "centro_custo", e.target.value)}
                    placeholder="Centro de Custo"
                    className="w-full px-2 py-1 text-xs border border-[var(--border)] rounded focus:outline-none focus:border-[var(--apsis-orange)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={lancamento.tipo_despesa || ""}
                    onChange={(e) => atualizarLancamento(idx, "tipo_despesa", e.target.value)}
                    placeholder="Tipo"
                    className="w-full px-2 py-1 text-xs border border-[var(--border)] rounded focus:outline-none focus:border-[var(--apsis-orange)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={lancamento.notas || ""}
                    onChange={(e) => atualizarLancamento(idx, "notas", e.target.value)}
                    placeholder="Notas"
                    className="w-full px-2 py-1 text-xs border border-[var(--border)] rounded focus:outline-none focus:border-[var(--apsis-orange)]"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  {lancamento.validado ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      ✓ Validado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                      ◯ Pendente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleValidado(idx)}
                    className="inline-flex items-center justify-center p-1 hover:bg-[var(--surface-2)] rounded transition-colors"
                    title={lancamento.validado ? "Desvalidar" : "Validar"}
                  >
                    {lancamento.validado ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}