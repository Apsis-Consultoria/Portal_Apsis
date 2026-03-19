import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const INDICADORES_POR_AREA = {
  business_valuation: {
    titulo: 'Business Valuation',
    kpis: [
      { label: 'Avaliações Realizadas', valor: '0', meta: 'Processos em andamento', status: 'neutral' },
      { label: 'Valor em Análise', valor: 'R$ 0', meta: 'Portfolio avaliado', status: 'neutral' },
      { label: 'Prazo Médio', valor: '0 dias', meta: 'Conclusão do processo', status: 'neutral' },
      { label: 'Clientes', valor: '0', meta: 'Empresa atendidas', status: 'neutral' },
    ]
  },
  contabil_fiscal: {
    titulo: 'Consultoria Contábil & Fiscal',
    kpis: [
      { label: 'Laudos Contábeis', valor: '0', meta: 'Serviços realizados', status: 'neutral' },
      { label: 'Consultoria Fiscal', valor: 'R$ 0', meta: 'Faturamento do período', status: 'neutral' },
      { label: 'Conformidade', valor: '100%', meta: 'Documentos em dia', status: 'success' },
      { label: 'Clientes Ativos', valor: '0', meta: 'Portfolio', status: 'neutral' },
    ]
  },
  ativos_fixos: {
    titulo: 'Ativos Fixos',
    kpis: [
      { label: 'Avaliações Ativas', valor: '0', meta: 'Em processamento', status: 'neutral' },
      { label: 'Valor Total', valor: 'R$ 0', meta: 'Patrimônio avaliado', status: 'neutral' },
      { label: 'Taxa Ocupação', valor: '0%', meta: 'Capacidade utilizada', status: 'neutral' },
      { label: 'Documentação', valor: '0%', meta: 'Processos documentados', status: 'neutral' },
    ]
  },
  consultoria_estrategica: {
    titulo: 'Consultoria Estratégica',
    kpis: [
      { label: 'Projetos em Andamento', valor: '0', meta: 'Consultoria ativa', status: 'neutral' },
      { label: 'Valor Contratado', valor: 'R$ 0', meta: 'Receita esperada', status: 'neutral' },
      { label: 'Taxa Conclusão', valor: '0%', meta: 'Projetos finalizados', status: 'neutral' },
      { label: 'Clientes', valor: '0', meta: 'Atendidos', status: 'neutral' },
    ]
  },
  ma: {
    titulo: 'M&A',
    kpis: [
      { label: 'Deals em Pipeline', valor: '0', meta: 'Due Diligence ativo', status: 'neutral' },
      { label: 'Valor em Análise', valor: 'R$ 0', meta: 'Pipeline M&A', status: 'neutral' },
      { label: 'Taxa Conclusão', valor: '0%', meta: 'Transações fechadas', status: 'neutral' },
      { label: 'Valor Realizado', valor: 'R$ 0', meta: 'Transações completas', status: 'neutral' },
    ]
  },
  projetos_especiais: {
    titulo: 'Projetos Especiais',
    kpis: [
      { label: 'Projetos Ativos', valor: '0', meta: 'Em execução', status: 'neutral' },
      { label: 'Valor Empenhado', valor: 'R$ 0', meta: 'Total do portfólio', status: 'neutral' },
      { label: 'Taxa Pontualidade', valor: '0%', meta: 'Dentro do prazo', status: 'neutral' },
      { label: 'Recursos Alocados', valor: '0', meta: 'Horas de trabalho', status: 'neutral' },
    ]
  },
  financeiro: {
    titulo: 'Financeiro',
    kpis: [
      { label: 'Receita Mensal', valor: 'R$ 0', meta: 'Faturamento total', status: 'neutral' },
      { label: 'Contas a Receber', valor: 'R$ 0', meta: 'Pendências', status: 'warning' },
      { label: 'Contas a Pagar', valor: 'R$ 0', meta: 'Obrigações', status: 'warning' },
      { label: 'Fluxo de Caixa', valor: 'R$ 0', meta: 'Saldo líquido', status: 'neutral' },
    ]
  },
  capital_humano: {
    titulo: 'Capital Humano',
    kpis: [
      { label: 'Colaboradores', valor: '0', meta: 'Efetivo total', status: 'neutral' },
      { label: 'Utilização CH', valor: '0%', meta: 'Horas alocadas', status: 'neutral' },
      { label: 'Custo CH', valor: 'R$ 0', meta: 'Despesa mensal', status: 'neutral' },
      { label: 'Produtividade', valor: '0 h/pessoa', meta: 'Média por colaborador', status: 'neutral' },
    ]
  },
  mercado_clientes: {
    titulo: 'Mercado / Clientes',
    kpis: [
      { label: 'Clientes Ativos', valor: '0', meta: 'Portfolio', status: 'neutral' },
      { label: 'Receita por Cliente', valor: 'R$ 0', meta: 'Ticket médio', status: 'neutral' },
      { label: 'Taxa Retenção', valor: '0%', meta: 'Clientes mantidos', status: 'neutral' },
      { label: 'Novos Clientes', valor: '0', meta: 'Período', status: 'neutral' },
    ]
  },
};

function KPICard({ label, valor, meta, status }) {
  const statusColors = {
    success: 'border-green-200 bg-green-50',
    warning: 'border-orange-200 bg-orange-50',
    info: 'border-blue-200 bg-blue-50',
    neutral: 'border-slate-200 bg-white',
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${statusColors[status] || statusColors.neutral}`}>
      <p className="text-xs font-medium text-slate-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mb-2">{valor}</p>
      <p className="text-xs text-slate-500">{meta}</p>
    </div>
  );
}

export default function MarketingIndicadores() {
  const [selectedArea, setSelectedArea] = useState('business_valuation');
  const indicador = INDICADORES_POR_AREA[selectedArea];

  return (
    <div className="space-y-6">
      {/* Header com Dropdown */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Indicadores Estratégicos</h1>
          <p className="text-sm text-slate-500 mt-1">Métricas por área de negócio</p>
        </div>
        
        <div className="relative">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="appearance-none bg-white border-2 border-slate-200 rounded-lg px-4 py-2 pr-10 font-medium text-slate-900 cursor-pointer hover:border-slate-300 focus:outline-none focus:border-orange-500"
          >
            {Object.entries(INDICADORES_POR_AREA).map(([key, data]) => (
              <option key={key} value={key}>{data.titulo}</option>
            ))}
          </select>
          <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicador.kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      {/* Placeholder para Charts */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
        <p className="text-slate-600 font-medium">Gráficos analíticos</p>
        <p className="text-sm text-slate-500 mt-1">
          {indicador.charts.join(' • ')}
        </p>
      </div>
    </div>
  );
}