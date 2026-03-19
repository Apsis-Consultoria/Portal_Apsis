import { FileSpreadsheet, Clock, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const tipoLabel = {
  uber: "🚗 Uber",
  cartao_credito: "💳 Cartão de Crédito",
  compras: "🛒 Compras"
};

const statusLabel = {
  em_analise: { label: "Em Análise", color: "text-yellow-600", bg: "bg-yellow-50" },
  validado: { label: "Validado", color: "text-green-600", bg: "bg-green-50" },
  exportado: { label: "Exportado", color: "text-blue-600", bg: "bg-blue-50" }
};

export default function RateioHistoricoTab({ processamentos }) {
  if (processamentos.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-[var(--text-secondary)] opacity-40 mx-auto mb-4" />
        <p className="text-sm text-[var(--text-secondary)]">
          Nenhum processamento realizado ainda
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Quando você processar arquivos, o histórico aparecerá aqui
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {processamentos.map((processo) => {
        const status = statusLabel[processo.status];
        
        return (
          <Card
            key={processo.id}
            className="p-4 border-[var(--border)] hover:border-[var(--apsis-orange)] transition-colors"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Tipo */}
              <div>
                <p className="text-xs text-[var(--text-secondary)] mb-1 font-medium">Tipo</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {tipoLabel[processo.tipo_arquivo]}
                </p>
              </div>

              {/* Data */}
              <div>
                <p className="text-xs text-[var(--text-secondary)] mb-1 font-medium">Data Upload</p>
                <p className="text-sm text-[var(--text-primary)]">
                  {new Date(processo.data_upload).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Resumo */}
              <div>
                <p className="text-xs text-[var(--text-secondary)] mb-1 font-medium">Registros</p>
                <p className="text-sm">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {processo.quantidade_linhas}
                  </span>
                  <span className="text-[var(--text-secondary)]"> linhas</span>
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  R$ {(processo.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-[var(--text-secondary)] mb-1 font-medium">Status</p>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                  {processo.status === "em_analise" && <Clock className="w-3 h-3" />}
                  {processo.status === "validado" && <CheckCircle2 className="w-3 h-3" />}
                  {processo.status === "exportado" && <FileSpreadsheet className="w-3 h-3" />}
                  {status.label}
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end">
                {processo.arquivo_exportado && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 border-[var(--border)]"
                  >
                    <Download className="w-3 h-3" />
                    Baixar
                  </Button>
                )}
              </div>
            </div>

            {/* Detalhes adicionais */}
            <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] space-y-1">
              <p>
                <span className="font-medium text-[var(--text-primary)]">Upload:</span> {processo.usuario_upload}
              </p>
              {processo.validado_por && (
                <p>
                  <span className="font-medium text-[var(--text-primary)]">Validado por:</span> {processo.validado_por}
                  {processo.validado_em && (
                    <span> em {new Date(processo.validado_em).toLocaleDateString('pt-BR')}</span>
                  )}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}