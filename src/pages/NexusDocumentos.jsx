import { useState } from 'react';
import { Search, Filter, Upload } from 'lucide-react';
import DocumentosHeader from '@/components/DocumentosHeader';
import DocumentosList from '@/components/DocumentosList';

// Mock data - todos os documentos (APSIS pode ver internos também)
const mockDocumentos = [
  {
    id: 1,
    file_name: 'Laudo_Auditoria_2025.pdf',
    tipo_documental: 'laudo',
    client_id: 'workspace_1',
    project_id: 'proj_auditoria_2025',
    descricao: 'Laudo completo da auditoria contábil - exercício 2025',
    visibilidade: 'compartilhado',
    sharepoint_url: 'https://sharepoint.com/docs/laudo_auditoria',
    version: '1.2',
    uploaded_by: 'marina@apsis.com',
    uploaded_at: '2026-03-15T10:30:00',
    status: 'aprovado',
  },
  {
    id: 2,
    file_name: 'Notas_Internas_Auditoria.docx',
    tipo_documental: 'outro',
    client_id: 'workspace_1',
    project_id: 'proj_auditoria_2025',
    descricao: 'Notas internas e pontos de atenção - não compartilhar',
    visibilidade: 'interno',
    sharepoint_url: 'https://sharepoint.com/docs/notas_internas',
    version: '1.0',
    uploaded_by: 'marina@apsis.com',
    uploaded_at: '2026-03-14T16:45:00',
    status: 'rascunho',
  },
  {
    id: 3,
    file_name: 'Proposta_Consultoria.pdf',
    tipo_documental: 'proposta',
    client_id: 'workspace_1',
    descricao: 'Proposta de consultoria tributária',
    visibilidade: 'compartilhado',
    sharepoint_url: 'https://sharepoint.com/docs/proposta',
    version: '2.0',
    uploaded_by: 'carlos@apsis.com',
    uploaded_at: '2026-03-10T14:00:00',
    status: 'aprovado',
  },
  {
    id: 4,
    file_name: 'Relatorio_Financeiro_Q1.xlsx',
    tipo_documental: 'relatorio',
    client_id: 'workspace_1',
    project_id: 'proj_auditoria_2025',
    descricao: 'Relatório financeiro consolidado - 1º trimestre 2026',
    visibilidade: 'compartilhado',
    sharepoint_url: 'https://sharepoint.com/docs/relatorio_q1',
    version: '1.0',
    uploaded_by: 'ana@apsis.com',
    uploaded_at: '2026-03-05T09:15:00',
    status: 'aprovado',
  },
  {
    id: 5,
    file_name: 'Rascunho_Parecer_Legal.pdf',
    tipo_documental: 'contrato',
    client_id: 'workspace_1',
    descricao: 'Parecer legal em revisão - aguardando aprovação',
    visibilidade: 'interno',
    sharepoint_url: 'https://sharepoint.com/docs/parecer_draft',
    version: '0.9',
    uploaded_by: 'patricia@apsis.com',
    uploaded_at: '2026-03-12T11:20:00',
    status: 'em_revisao',
  },
];

export default function NexusDocumentos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState(null);

  const tiposDisponiveis = [
    { valor: 'laudo', label: 'Laudos' },
    { valor: 'relatorio', label: 'Relatórios' },
    { valor: 'contrato', label: 'Contratos' },
    { valor: 'proposta', label: 'Propostas' },
    { valor: 'planilha', label: 'Planilhas' },
    { valor: 'apresentacao', label: 'Apresentações' },
    { valor: 'outro', label: 'Outros' },
  ];

  const handleDownload = (doc) => {
    console.log('Baixar documento:', doc.file_name);
  };

  const handleToggleVisibility = (docId) => {
    console.log('Alternar visibilidade do documento:', docId);
  };

  const handleDelete = (docId) => {
    console.log('Excluir documento:', docId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[var(--apsis-green)] to-[var(--apsis-green-light)] text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Data Room</h1>
        <p className="text-white/80 text-sm">Gerenciar documentos de clientes com visibilidade e versionamento seguro.</p>
      </div>

      <DocumentosHeader />

      {/* Filtros, Busca e Ações */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Documentos do Cliente</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--apsis-orange)] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium">
            <Upload size={16} />
            Novo Documento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              Buscar Documento
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Nome do arquivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
              />
            </div>
          </div>

          {/* Filtro rápido */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              Status
            </label>
            <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50">
              <option>Todos</option>
              <option>Aprovado</option>
              <option>Em Revisão</option>
              <option>Rascunho</option>
              <option>Arquivado</option>
            </select>
          </div>
        </div>

        {/* Filtro por tipo */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
            Tipo de Documento
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroTipo(null)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroTipo === null
                  ? 'bg-[var(--apsis-orange)] text-white'
                  : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-white border border-[var(--border)]'
              }`}
            >
              Todos
            </button>
            {tiposDisponiveis.map((tipo) => (
              <button
                key={tipo.valor}
                onClick={() => setFiltroTipo(tipo.valor)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filtroTipo === tipo.valor
                    ? 'bg-[var(--apsis-orange)] text-white'
                    : 'bg-white border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--apsis-orange)]/50'
                }`}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6">
        <DocumentosList
          documentos={mockDocumentos}
          currentUserType="apsis"
          onDownload={handleDownload}
          onToggleVisibility={handleToggleVisibility}
          onDelete={handleDelete}
          filtroTipo={filtroTipo}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}