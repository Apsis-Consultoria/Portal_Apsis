import { useState } from 'react';
import { Home, FileText, MessageSquare, Clock, Users, Shield, ChevronRight, Lock, Eye, Download, Share2, AlertCircle } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subtext, trend }) => (
  <div className="bg-white border border-[var(--border)] rounded-lg p-4">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 bg-[var(--apsis-orange)]/10 rounded-lg">
        <Icon size={18} className="text-[var(--apsis-orange)]" />
      </div>
      {trend && <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>}
    </div>
    <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
    <p className="text-lg font-bold text-[var(--text-primary)]">{value}</p>
    {subtext && <p className="text-xs text-[var(--text-secondary)] mt-2">{subtext}</p>}
  </div>
);

const WorkspaceCard = ({ client, projects, lastUpdate, status }) => (
  <div className="bg-white border border-[var(--border)] rounded-lg p-5">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-[var(--text-primary)]">{client}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            status === 'Ativo' ? 'bg-green-100 text-green-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">{projects} projetos ativos</p>
      </div>
      <Lock size={16} className="text-[var(--apsis-orange)]" />
    </div>
    <div className="space-y-2 pt-3 border-t border-[var(--border)]">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">Última atualização</span>
        <span className="font-medium text-[var(--text-primary)]">{lastUpdate}</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded hover:bg-[var(--surface-2)]">
          <FileText size={14} /> Documentos
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded hover:bg-[var(--surface-2)]">
          <MessageSquare size={14} /> Chat
        </button>
      </div>
    </div>
  </div>
);

const ActivityLog = ({ items }) => (
  <div className="bg-white border border-[var(--border)] rounded-lg p-5">
    <h3 className="font-semibold text-[var(--text-primary)] mb-4">Histórico de Atividades</h3>
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 pb-3 border-b border-[var(--border)] last:border-0 last:pb-0">
          <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2 bg-[var(--apsis-orange)]" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
              <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">{item.time}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{item.description}</p>
            {item.actor && <p className="text-xs text-[var(--text-secondary)] mt-1">por {item.actor}</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function NexusInicio() {
  return (
    <div className="space-y-6">
      {/* Header Workspace */}
      <div className="bg-gradient-to-r from-[var(--apsis-green)] to-[var(--apsis-green-light)] text-white rounded-lg p-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold mb-2">APSIS Workspace</h1>
          <p className="text-white/80 text-sm mb-4">Gerencie relacionamentos com clientes, documentos seguros e projetos em um único espaço corporativo.</p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>Portal Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={16} />
              <span>Visibilidade Controlada</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>Auditável</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Clientes Ativos" value="12" subtext="Workspaces criados" />
        <StatCard icon={FileText} label="Documentos" value="284" subtext="Na sala segura" trend={5} />
        <StatCard icon={MessageSquare} label="Comunicações" value="47" subtext="Última semana" />
        <StatCard icon={Clock} label="Tempo Médio" value="2.4h" subtext="Resposta a solicitações" />
      </div>

      {/* Workspaces Principais */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Seus Workspaces Principais</h2>
          <a href="/NexusProjetos" className="text-xs font-medium text-[var(--apsis-orange)] hover:underline flex items-center gap-1">
            Ver todos <ChevronRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <WorkspaceCard client="Industria Brasil SA" projects="3" lastUpdate="há 2 horas" status="Ativo" />
          <WorkspaceCard client="Tech Innovations Ltd" projects="2" lastUpdate="há 4 horas" status="Ativo" />
          <WorkspaceCard client="Logística Global Inc" projects="1" lastUpdate="há 1 dia" status="Ativo" />
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityLog items={[
            {
              title: 'Documentos compartilhados',
              description: 'Relatório Financeiro Q1 2026',
              time: '14:32',
              actor: 'João Silva'
            },
            {
              title: 'Projeto atualizado',
              description: 'Status mudou para "Em Execução"',
              time: '10:15',
              actor: 'Sistema'
            },
            {
              title: 'Mensagem lida',
              description: 'Proposta de Consultoria revisada',
              time: 'ontem',
              actor: 'Cliente'
            },
            {
              title: 'Permissão revisada',
              description: 'Acesso concedido a novo colaborador',
              time: '2 dias atrás',
              actor: 'Gestor de Projetos'
            }
          ]} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-5 h-fit">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-left">
              <FileText size={16} className="text-[var(--apsis-orange)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Acessar Data Room</p>
                <p className="text-xs text-[var(--text-secondary)]">Documentos & contratos</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-left">
              <MessageSquare size={16} className="text-[var(--apsis-orange)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Communication Center</p>
                <p className="text-xs text-[var(--text-secondary)]">Mensagens & solicitações</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-left">
              <Clock size={16} className="text-[var(--apsis-orange)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Service Requests</p>
                <p className="text-xs text-[var(--text-secondary)]">Minhas solicitações</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}