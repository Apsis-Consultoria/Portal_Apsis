import { useState } from 'react';
import { Search, X, MessageSquare, FileText, TrendingUp, Calendar, Users, Building2, ChevronRight } from 'lucide-react';

const projectsMock = [
  {
    id: 1,
    name: 'Auditoria Contábil 2025',
    client: 'TechCorp Brasil',
    status: 'Ativo',
    responsible: 'Marina APSIS',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    progress: 75,
    updates: [
      { date: '2025-03-15', title: 'Documentação atualizada', type: 'info' },
      { date: '2025-03-10', title: 'Reunião de alinhamento realizada', type: 'success' },
      { date: '2025-03-05', title: 'Fase 2 iniciada', type: 'info' },
    ],
  },
  {
    id: 2,
    name: 'Consultoria Tributária',
    client: 'Global Solutions',
    status: 'Ativo',
    responsible: 'Carlos Silva',
    startDate: '2025-02-01',
    endDate: '2025-05-15',
    progress: 45,
    updates: [
      { date: '2025-03-12', title: 'Parecer em análise', type: 'info' },
      { date: '2025-03-08', title: 'Coleta de documentos finalizada', type: 'success' },
    ],
  },
  {
    id: 3,
    name: 'Consultoria M&A',
    client: 'Global Solutions',
    status: 'Planejamento',
    responsible: 'Fernando Costa',
    startDate: '2025-04-01',
    endDate: '2025-09-30',
    progress: 15,
    updates: [
      { date: '2025-03-18', title: 'Kick-off agendado', type: 'info' },
    ],
  },
  {
    id: 4,
    name: 'Avaliação de Bens Imóveis',
    client: 'TechCorp Brasil',
    status: 'Finalizado',
    responsible: 'Marina APSIS',
    startDate: '2024-11-01',
    endDate: '2025-02-28',
    progress: 100,
    updates: [
      { date: '2025-02-28', title: 'Relatório final entregue', type: 'success' },
    ],
  },
];

const StatusBadge = ({ status }) => {
  const colors = {
    'Ativo': 'bg-blue-100 text-blue-700',
    'Planejamento': 'bg-amber-100 text-amber-700',
    'Finalizado': 'bg-green-100 text-green-700',
    'Pausado': 'bg-gray-100 text-gray-700',
  };
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
};

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-[var(--border)] rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[var(--apsis-orange)] to-[var(--apsis-orange)]/80 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const ProjectCard = ({ project, onClick }) => {
  const daysLeft = Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;

  return (
    <button
      onClick={onClick}
      className="bg-white border border-[var(--border)] rounded-lg p-5 hover:shadow-md hover:border-[var(--apsis-orange)]/30 transition-all text-left"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--text-primary)] text-base mb-1">{project.name}</h3>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Building2 size={13} className="text-[var(--apsis-orange)]" />
            <span>{project.client}</span>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="space-y-3">
        {/* Responsible */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Users size={13} className="text-[var(--apsis-orange)]" />
          <span>{project.responsible}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Calendar size={13} className="text-[var(--apsis-orange)]" />
          <span>{new Date(project.startDate).toLocaleDateString('pt-BR')} até {new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
          {!isOverdue && daysLeft >= 0 && (
            <span className="ml-2 px-2 py-0.5 bg-[var(--apsis-orange)]/10 text-[var(--apsis-orange)] rounded text-xs font-medium">
              {daysLeft} dias
            </span>
          )}
          {isOverdue && (
            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
              Vencido
            </span>
          )}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Progresso</span>
            <span className="text-xs font-semibold text-[var(--apsis-orange)]">{project.progress}%</span>
          </div>
          <ProgressBar progress={project.progress} />
        </div>

        {/* Latest Update */}
        {project.updates.length > 0 && (
          <div className="pt-2 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-secondary)] mb-1">Última atualização:</p>
            <p className="text-xs text-[var(--text-primary)] font-medium">{project.updates[0].title}</p>
            <p className="text-xs text-[var(--text-secondary)]">{new Date(project.updates[0].date).toLocaleDateString('pt-BR')}</p>
          </div>
        )}
      </div>
    </button>
  );
};

const ProjectDetail = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState('visao');

  const tabs = [
    { id: 'visao', label: 'Visão Geral', icon: TrendingUp },
    { id: 'comunicacao', label: 'Comunicação', icon: MessageSquare },
    { id: 'documentos', label: 'Documentos', icon: FileText },
    { id: 'status', label: 'Status', icon: TrendingUp },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50 md:items-center md:justify-center">
      <div className="bg-white w-full md:max-w-2xl max-h-[90vh] overflow-hidden rounded-t-2xl md:rounded-lg flex flex-col">
        {/* Header */}
        <div className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{project.name}</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{project.client}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[var(--surface-2)] rounded-lg">
            <X size={20} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--border)] px-6 flex gap-8 overflow-x-auto bg-white sticky top-[65px]">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-[var(--apsis-orange)] text-[var(--apsis-orange)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'visao' && (
            <div className="space-y-6">
              {/* Key Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[var(--surface-2)] rounded-lg p-4">
                  <p className="text-xs text-[var(--text-secondary)] font-medium uppercase mb-2">Status</p>
                  <StatusBadge status={project.status} />
                </div>
                <div className="bg-[var(--surface-2)] rounded-lg p-4">
                  <p className="text-xs text-[var(--text-secondary)] font-medium uppercase mb-2">Responsável</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{project.responsible}</p>
                </div>
                <div className="bg-[var(--surface-2)] rounded-lg p-4">
                  <p className="text-xs text-[var(--text-secondary)] font-medium uppercase mb-2">Início</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{new Date(project.startDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="bg-[var(--surface-2)] rounded-lg p-4">
                  <p className="text-xs text-[var(--text-secondary)] font-medium uppercase mb-2">Prazo</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{new Date(project.endDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-[var(--surface-2)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[var(--text-secondary)] font-medium uppercase">Andamento</p>
                  <span className="text-lg font-bold text-[var(--apsis-orange)]">{project.progress}%</span>
                </div>
                <ProgressBar progress={project.progress} />
              </div>

              {/* Updates */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Últimas Atualizações</h3>
                <div className="space-y-2">
                  {project.updates.map((update, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-[var(--surface-2)] rounded-lg">
                      <div className="w-1 bg-[var(--apsis-orange)] rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{update.title}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{new Date(update.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comunicacao' && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">Acesse a Sala de Comunicação para conversar com o cliente sobre este projeto.</p>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--apsis-orange)] text-white rounded-lg text-sm font-medium hover:bg-[var(--apsis-orange)]/90 transition-colors w-full">
                <MessageSquare size={16} />
                Ir para Comunicação
                <ChevronRight size={16} className="ml-auto" />
              </button>
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">Acesse a Sala de Documentos para visualizar e compartilhar arquivos deste projeto.</p>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--apsis-orange)] text-white rounded-lg text-sm font-medium hover:bg-[var(--apsis-orange)]/90 transition-colors w-full">
                <FileText size={16} />
                Ir para Documentos
                <ChevronRight size={16} className="ml-auto" />
              </button>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">Status Atual</p>
                <p className="text-sm text-blue-700">{project.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Histórico de Alterações</h4>
                <div className="space-y-2">
                  {project.updates.slice(0, 3).map((update, idx) => (
                    <div key={idx} className="text-xs">
                      <p className="font-medium text-[var(--text-primary)]">{update.title}</p>
                      <p className="text-[var(--text-secondary)]">{new Date(update.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function NexusProjetos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = projectsMock.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] px-6 py-4 -m-6 mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projetos</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Acompanhe projetos em andamento e compartilhe contexto com clientes</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder="Buscar por nome do projeto ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
        />
      </div>

      {/* Projects Grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-[var(--surface-2)] rounded-xl border border-dashed border-[var(--border)]">
          <div className="text-5xl mb-4 opacity-20">📊</div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Nenhum projeto encontrado</h3>
          <p className="text-sm text-[var(--text-secondary)]">Tente ajustar sua busca</p>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}