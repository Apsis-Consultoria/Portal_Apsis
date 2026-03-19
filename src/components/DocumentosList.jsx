import { FileText, Eye, Lock, Download, Clock, User, Trash2 } from 'lucide-react';

const tipoIcons = {
  laudo: '📋',
  relatorio: '📊',
  contrato: '📝',
  proposta: '💼',
  planilha: '📑',
  apresentacao: '🎯',
  outro: '📄',
};

const tipoLabels = {
  laudo: 'Laudo',
  relatorio: 'Relatório',
  contrato: 'Contrato',
  proposta: 'Proposta',
  planilha: 'Planilha',
  apresentacao: 'Apresentação',
  outro: 'Outro',
};

const statusColors = {
  rascunho: 'bg-gray-100 text-gray-700',
  em_revisao: 'bg-amber-100 text-amber-700',
  aprovado: 'bg-green-100 text-green-700',
  arquivado: 'bg-slate-100 text-slate-700',
};

const statusLabels = {
  rascunho: 'Rascunho',
  em_revisao: 'Em Revisão',
  aprovado: 'Aprovado',
  arquivado: 'Arquivado',
};

export default function DocumentosList({
  documentos = [],
  currentUserType = 'cliente',
  onDownload = null,
  onToggleVisibility = null,
  onDelete = null,
  filtroTipo = null,
  searchTerm = '',
}) {
  // Filtrar documentos
  let filtered = documentos.filter((doc) => {
    // Cliente não vê documentos internos
    if (currentUserType === 'cliente' && doc.visibilidade === 'interno') {
      return false;
    }

    // Filtro por tipo
    if (filtroTipo && doc.tipo_documental !== filtroTipo) {
      return false;
    }

    // Busca por nome
    if (searchTerm && !doc.file_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3 opacity-20">📭</div>
        <p className="text-sm text-[var(--text-secondary)]">Nenhum documento encontrado</p>
        {searchTerm && <p className="text-xs text-[var(--text-secondary)] mt-1">Tente ajustar sua busca</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((doc) => {
        const isInternal = doc.visibilidade === 'interno';
        const isShared = doc.visibilidade === 'compartilhado';

        return (
          <div
            key={doc.id}
            className={`p-4 rounded-lg border transition-all ${
              isInternal ? 'bg-amber-50 border-amber-200' : 'bg-white border-[var(--border)] hover:border-[var(--apsis-orange)]/50'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Ícone */}
              <div className="text-3xl flex-shrink-0">{tipoIcons[doc.tipo_documental]}</div>

              {/* Informações */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">{doc.file_name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${statusColors[doc.status]}`}>
                    {statusLabels[doc.status]}
                  </span>
                </div>

                {doc.descricao && <p className="text-xs text-[var(--text-secondary)] mb-2">{doc.descricao}</p>}

                <div className="flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
                  <span className="font-medium">{tipoLabels[doc.tipo_documental]}</span>

                  <div className="flex items-center gap-1">
                    <User size={12} />
                    {doc.uploaded_by}
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(doc.uploaded_at).toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  {doc.version && <span>v{doc.version}</span>}
                </div>

                {/* Visibilidade */}
                <div className="flex items-center gap-2 mt-2">
                  {isShared && (
                    <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
                      <Eye size={12} />
                      Compartilhado
                    </div>
                  )}
                  {isInternal && (
                    <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      <Lock size={12} />
                      Interno
                    </div>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Toggle visibilidade (apenas APSIS) */}
                {currentUserType === 'apsis' && onToggleVisibility && (
                  <button
                    onClick={() => onToggleVisibility(doc.id)}
                    className="p-2 hover:bg-[var(--surface-2)] rounded transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    title={isInternal ? 'Compartilhar com cliente' : 'Ocultar do cliente'}
                  >
                    {isInternal ? <Lock size={16} /> : <Eye size={16} />}
                  </button>
                )}

                {/* Download */}
                {onDownload && (
                  <button
                    onClick={() => onDownload(doc)}
                    className="p-2 hover:bg-[var(--surface-2)] rounded transition-colors text-[var(--apsis-orange)]"
                    title="Baixar documento"
                  >
                    <Download size={16} />
                  </button>
                )}

                {/* Delete (apenas APSIS) */}
                {currentUserType === 'apsis' && onDelete && (
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                    title="Excluir documento"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}