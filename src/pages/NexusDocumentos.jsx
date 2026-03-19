import { useState } from 'react';
import { FileText, Lock, Eye, Share2, Download, MoreVertical, Search, Filter, ChevronDown, Clock, User, Shield, AlertCircle } from 'lucide-react';

const DocumentHeader = () => (
  <div className="bg-gradient-to-r from-[var(--apsis-green)] to-[var(--apsis-green-light)] text-white rounded-lg p-6 mb-6">
    <h1 className="text-2xl font-bold mb-2">Data Room</h1>
    <p className="text-white/80 text-sm">Sala segura de documentos com controle granular de acesso, trilha de auditoria e compartilhamento controlado.</p>
  </div>
);

const DocumentCard = ({ doc, onView }) => {
  const typeIcons = {
    'Contrato': '📄',
    'Relatório': '📊',
    'Laudo': '🔍',
    'Apresentação': '🎯',
    'Planilha': '📈',
  };

  const statusColors = {
    'Ativo': 'bg-green-100 text-green-700',
    'Revisão': 'bg-amber-100 text-amber-700',
    'Arquivado': 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white border border-[var(--border)] rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{typeIcons[doc.type] || '📄'}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">{doc.name}</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{doc.projeto}</p>
          </div>
        </div>
        <button className="p-1 hover:bg-[var(--surface-2)] rounded">
          <MoreVertical size={16} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-secondary)]">Status</span>
          <span className={`px-2 py-1 rounded-full font-medium ${statusColors[doc.status] || 'bg-gray-100'}`}>
            {doc.status}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-secondary)]">Adicionado</span>
          <span className="font-medium text-[var(--text-primary)]">{doc.addedDate}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-secondary)]">Por</span>
          <span className="font-medium text-[var(--text-primary)]">{doc.addedBy}</span>
        </div>
      </div>

      {/* Visibility Info */}
      <div className="bg-[var(--surface-2)] rounded p-2 mb-3">
        <div className="flex items-center gap-2 text-xs mb-1">
          {doc.visibleToClient ? (
            <>
              <Eye size={13} className="text-green-600" />
              <span className="font-medium text-green-700">Compartilhado com cliente</span>
            </>
          ) : (
            <>
              <Lock size={13} className="text-amber-600" />
              <span className="font-medium text-amber-700">Apenas equipe interna</span>
            </>
          )}
        </div>
        {doc.accessLog && (
          <p className="text-xs text-[var(--text-secondary)]">Visualizado {doc.accessLog} vezes</p>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={onView} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-[var(--apsis-orange)] border border-[var(--apsis-orange)] rounded hover:bg-[var(--apsis-orange)]/5">
          <Eye size={14} /> Visualizar
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded hover:bg-[var(--surface-2)]">
          <Download size={14} /> Download
        </button>
      </div>
    </div>
  );
};

const AuditLog = ({ logs }) => (
  <div className="bg-white border border-[var(--border)] rounded-lg p-4">
    <h3 className="font-semibold text-[var(--text-primary)] mb-4">Histórico de Acesso</h3>
    <div className="space-y-3">
      {logs.map((log, i) => (
        <div key={i} className="pb-3 border-b border-[var(--border)] last:border-0 last:pb-0">
          <div className="flex items-start justify-between mb-1">
            <p className="text-sm font-medium text-[var(--text-primary)]">{log.action}</p>
            <span className="text-xs text-[var(--text-secondary)]">{log.time}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">por {log.user}</p>
          {log.details && <p className="text-xs text-[var(--text-secondary)] mt-1">📋 {log.details}</p>}
        </div>
      ))}
    </div>
  </div>
);

export default function NexusDocumentos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const documents = [
    { id: 1, name: 'Contrato de Serviços 2026', tipo: 'Contrato', type: 'Contrato', project: 'TechCorp Brasil', projeto: 'TechCorp Brasil', status: 'Ativo', addedDate: '5 dias', addedBy: 'João Silva', visibleToClient: true, accessLog: '3' },
    { id: 2, name: 'Relatório Financeiro Q1', type: 'Relatório', projeto: 'Auditoria 2025', status: 'Revisão', addedDate: '2 dias', addedBy: 'Marina Silva', visibleToClient: false, accessLog: '1' },
    { id: 3, name: 'Laudo de Conformidade', type: 'Laudo', projeto: 'Global Solutions', status: 'Ativo', addedDate: 'ontem', addedBy: 'Carlos Santos', visibleToClient: true, accessLog: '2' },
    { id: 4, name: 'Apresentação Executiva', type: 'Apresentação', projeto: 'TechCorp Brasil', status: 'Ativo', addedDate: '10 dias', addedBy: 'Ana Costa', visibleToClient: true, accessLog: '5' },
    { id: 5, name: 'Planilha de Orçamento', type: 'Planilha', projeto: 'Consultoria M&A', status: 'Revisão', addedDate: '3 dias', addedBy: 'Pedro Oliveira', visibleToClient: false, accessLog: '0' },
    { id: 6, name: 'Parecer Tributário', type: 'Relatório', projeto: 'Logística Global', status: 'Ativo', addedDate: '1 semana', addedBy: 'Beatriz Rocha', visibleToClient: true, accessLog: '4' },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = selectedClient === 'Todos' || doc.projeto === selectedClient;
    const matchesType = selectedType === 'Todos' || doc.type === selectedType;
    return matchesSearch && matchesClient && matchesType;
  });

  const auditLogs = [
    { action: 'Documento compartilhado', user: 'João Silva', time: 'há 2h', details: 'Com cliente TechCorp Brasil' },
    { action: 'Download realizado', user: 'Cliente - João Silva', time: 'há 1h', details: 'Contrato_2026.pdf' },
    { action: 'Novo documento adicionado', user: 'Marina Silva', time: 'há 4h', details: 'Relatório_Q1_2026.xlsx' },
    { action: 'Permissão modificada', user: 'Admin', time: 'ontem', details: 'Acesso restrito para revisor' },
  ];

  return (
    <div className="space-y-6">
      <DocumentHeader />

      {/* Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">Buscar</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Nome do documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">Cliente</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
            >
              <option>Todos</option>
              <option>TechCorp Brasil</option>
              <option>Global Solutions</option>
              <option>Logística Global</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">Tipo</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
            >
              <option>Todos</option>
              <option>Contrato</option>
              <option>Relatório</option>
              <option>Laudo</option>
              <option>Apresentação</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">Visualização</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[var(--apsis-orange)] text-white'
                    : 'bg-[var(--surface-2)] text-[var(--text-secondary)]'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-[var(--apsis-orange)] text-white'
                    : 'bg-[var(--surface-2)] text-[var(--text-secondary)]'
                }`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>{filteredDocs.length} documento(s) encontrado(s)</span>
          <button className="text-[var(--apsis-orange)] hover:underline flex items-center gap-1">
            <Shield size={14} /> Ver política de segurança
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => (
            <DocumentCard key={doc.id} doc={doc} onView={() => setSelectedDoc(doc)} />
          ))}
        </div>
      )}

      {/* Documents List */}
      {viewMode === 'list' && (
        <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">Documento</th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">Cliente</th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">Visibilidade</th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">Acessos</th>
                  <th className="px-4 py-3 text-center font-semibold text-[var(--text-primary)]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => (
                  <tr key={doc.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📄</span>
                        <span className="font-medium text-[var(--text-primary)]">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{doc.projeto}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        doc.status === 'Ativo' ? 'bg-green-100 text-green-700' :
                        doc.status === 'Revisão' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs">
                        {doc.visibleToClient ? (
                          <>
                            <Eye size={13} className="text-green-600" />
                            <span>Cliente</span>
                          </>
                        ) : (
                          <>
                            <Lock size={13} className="text-amber-600" />
                            <span>Interno</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text-secondary)]">{doc.accessLog}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-[var(--apsis-orange)] hover:underline text-xs font-medium">
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AuditLog logs={auditLogs} />
        </div>
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Informações de Segurança</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <Shield size={14} className="text-[var(--apsis-orange)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">Encriptação AES-256</p>
                <p className="text-[var(--text-secondary)]">Em repouso e em trânsito</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-[var(--apsis-orange)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">Auditoria Completa</p>
                <p className="text-[var(--text-secondary)]">Todos os acessos registrados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}