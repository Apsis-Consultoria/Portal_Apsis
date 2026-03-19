import { useState } from 'react';
import { Search, Plus, HelpCircle, FileText, Download, Share2, Eye, Lock, Calendar, Building2, FolderOpen, Tag, ChevronDown } from 'lucide-react';

const documentsMock = [
  { id: 1, name: 'Balanço Contábil 2025', client: 'TechCorp Brasil', project: 'Auditoria Contábil 2025', type: 'Relatório', date: '2025-03-15', status: 'Aprovado', visibility: 'Compartilhado', origin: 'SharePoint', icon: '📊' },
  { id: 2, name: 'Parecer Tributário Q1', client: 'Global Solutions', project: 'Consultoria Tributária', type: 'Parecer', date: '2025-03-10', status: 'Rascunho', visibility: 'Interno', origin: 'Upload', icon: '📋' },
  { id: 3, name: 'Cronograma do Projeto', client: 'TechCorp Brasil', project: 'Auditoria Contábil 2025', type: 'Planejamento', date: '2025-03-05', status: 'Aprovado', visibility: 'Compartilhado', origin: 'SharePoint', icon: '📅' },
  { id: 4, name: 'Análise de Risco M&A', client: 'Global Solutions', project: 'Consultoria M&A', type: 'Análise', date: '2025-02-28', status: 'Em Revisão', visibility: 'Interno', origin: 'SharePoint', icon: '🔍' },
  { id: 5, name: 'Documentação Compliance', client: 'TechCorp Brasil', project: 'Auditoria Contábil 2025', type: 'Conformidade', date: '2025-02-20', status: 'Aprovado', visibility: 'Compartilhado', origin: 'SharePoint', icon: '✅' },
];

const clients = ['TechCorp Brasil', 'Global Solutions', 'Consultoria M&A'];
const projects = ['Auditoria Contábil 2025', 'Consultoria Tributária', 'Consultoria M&A'];
const types = ['Relatório', 'Parecer', 'Planejamento', 'Análise', 'Conformidade'];

const StatusBadge = ({ status }) => {
  const colors = {
    'Rascunho': 'bg-gray-100 text-gray-700',
    'Em Revisão': 'bg-blue-100 text-blue-700',
    'Aprovado': 'bg-green-100 text-green-700',
  };
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
};

const VisibilityBadge = ({ visibility }) => {
  return (
    <div className="flex items-center gap-1 text-xs">
      {visibility === 'Compartilhado' ? (
        <span className="flex items-center gap-1 text-green-600 font-medium">
          <Eye size={13} /> Compartilhado
        </span>
      ) : (
        <span className="flex items-center gap-1 text-amber-600 font-medium">
          <Lock size={13} /> Interno
        </span>
      )}
    </div>
  );
};

const HelpBlock = ({ isOpen, onToggle }) => {
  return (
    <div className="bg-gradient-to-r from-[var(--apsis-orange)]/5 to-[var(--apsis-orange)]/10 border border-[var(--apsis-orange)]/20 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[var(--apsis-orange)]/15 rounded-lg">
            <HelpCircle size={20} className="text-[var(--apsis-orange)]" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Como funciona a Sala de Documentos</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Armazene, organize e compartilhe documentos integrados ao SharePoint</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 pt-4 border-t border-[var(--apsis-orange)]/20">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">💾</span>
                <div>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">Armazenamento SharePoint</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Documentos são sincronizados automaticamente com SharePoint para segurança e controle de versão</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🔗</span>
                <div>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">Cadastro por Link</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Cole o link do arquivo SharePoint para registrá-lo automaticamente no sistema</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🌐</span>
                <div>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">Compartilhamento com Cliente</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Marque documentos como "Compartilhado" para que o cliente veja no portal</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🔍</span>
                <div>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">Localizar Documentos</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Use filtros por projeto, cliente e tipo para encontrar rapidamente</p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 text-xs font-semibold text-[var(--apsis-orange)] hover:text-[var(--apsis-orange)]/80 py-2 border border-[var(--apsis-orange)]/20 rounded-lg hover:bg-[var(--apsis-orange)]/5 transition-colors">
            📖 Ver passo a passo completo
          </button>
        </div>
      )}
    </div>
  );
};

export default function NexusDocumentos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showHelp, setShowHelp] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState(false);

  const filtered = documentsMock.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = !selectedClient || doc.client === selectedClient;
    const matchesProject = !selectedProject || doc.project === selectedProject;
    const matchesType = !selectedType || doc.type === selectedType;
    return matchesSearch && matchesClient && matchesProject && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] px-6 py-4 -m-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sala de Documentos</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Data room premium integrado ao SharePoint</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors">
              <HelpCircle size={16} />
              Ajuda
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--apsis-orange)] text-white rounded-lg text-sm font-medium hover:bg-[var(--apsis-orange)]/90 transition-colors">
              <Plus size={16} />
              Novo Documento
            </button>
          </div>
        </div>
      </div>

      {/* Help Block */}
      <HelpBlock isOpen={showHelp} onToggle={() => setShowHelp(!showHelp)} />

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Buscar por nome do documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <button
            onClick={() => setExpandedFilters(!expandedFilters)}
            className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Tag size={16} />
            Filtros avançados
            <ChevronDown size={16} className={`transition-transform ${expandedFilters ? 'rotate-180' : ''}`} />
          </button>

          {expandedFilters && (
            <div className="grid md:grid-cols-3 gap-3 p-4 bg-[var(--surface-2)] rounded-lg">
              {/* Client Filter */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Cliente</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
                >
                  <option value="">Todos</option>
                  {clients.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Project Filter */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Projeto</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
                >
                  <option value="">Todos</option>
                  {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Tipo</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
                >
                  <option value="">Todos</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-[var(--text-secondary)] font-medium">
        {filtered.length} documento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Documents List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(doc => (
            <div key={doc.id} className="bg-white border border-[var(--border)] rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-2xl pt-0.5">{doc.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="font-semibold text-[var(--text-primary)] truncate">{doc.name}</h3>
                      <StatusBadge status={doc.status} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-[var(--apsis-orange)]" />
                        <span>{doc.client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FolderOpen size={14} className="text-[var(--apsis-orange)]" />
                        <span>{doc.project}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-[var(--apsis-orange)]" />
                        <span>{doc.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[var(--apsis-orange)]" />
                        <span>{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
                      <VisibilityBadge visibility={doc.visibility} />
                      <span className="text-xs text-[var(--text-secondary)]">
                        {doc.origin === 'SharePoint' ? '☁️ SharePoint' : '📤 Upload'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 hover:bg-[var(--surface-2)] rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--apsis-orange)]" title="Download">
                    <Download size={18} />
                  </button>
                  <button className="p-2 hover:bg-[var(--surface-2)] rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--apsis-orange)]" title="Compartilhar">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-[var(--surface-2)] rounded-xl border border-dashed border-[var(--border)]">
          <div className="text-5xl mb-4 opacity-20">📁</div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Nenhum documento encontrado</h3>
          <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm">
            {searchTerm || selectedClient || selectedProject || selectedType
              ? 'Tente ajustar seus filtros ou termos de busca'
              : 'Comece adicionando um novo documento ao sistema'}
          </p>
          <button className="mt-6 flex items-center gap-2 px-4 py-2.5 bg-[var(--apsis-orange)] text-white rounded-lg text-sm font-medium hover:bg-[var(--apsis-orange)]/90 transition-colors">
            <Plus size={16} />
            Novo Documento
          </button>
        </div>
      )}
    </div>
  );
}