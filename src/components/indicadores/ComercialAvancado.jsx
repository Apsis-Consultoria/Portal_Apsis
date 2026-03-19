import { Card } from '@/components/ui/card';
import MetricCardAvancado from './MetricCardAvancado';
import { TrendingUp, Clock, Target } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DADOS_VENDAS = [
  { mes: 'Jan', vendas: 12, meta: 15, conversao: 8 },
  { mes: 'Fev', vendas: 14, meta: 15, conversao: 9.3 },
  { mes: 'Mar', vendas: 16, meta: 18, conversao: 10.2 },
  { mes: 'Abr', vendas: 18, meta: 18, conversao: 11.5 },
  { mes: 'Mai', vendas: 20, meta: 20, conversao: 12.1 },
  { mes: 'Jun', vendas: 22, meta: 20, conversao: 13.2 }
];

const DADOS_TICKET = [
  { mes: 'Jan', ticket: 125 },
  { mes: 'Fev', ticket: 132 },
  { mes: 'Mar', ticket: 145 },
  { mes: 'Abr', ticket: 156 },
  { mes: 'Mai', ticket: 168 },
  { mes: 'Jun', ticket: 185 }
];

export default function ComercialAvancado({ filtros }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-[var(--border)] bg-white">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Pipeline Total</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">R$ 2.8M</p>
          <p className="text-xs text-green-600 mt-1">↑ 18%</p>
        </Card>

        <Card className="p-4 border-[var(--border)] bg-white">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Oportunidades Abertas</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">34</p>
          <p className="text-xs text-[var(--apsis-orange)] mt-1">prospect</p>
        </Card>

        <Card className="p-4 border-[var(--border)] bg-white">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Taxa de Conversão</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">13.2%</p>
          <p className="text-xs text-green-600 mt-1">↑ 2.1%</p>
        </Card>

        <Card className="p-4 border-[var(--border)] bg-white">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Ticket Médio</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">R$ 185k</p>
          <p className="text-xs text-green-600 mt-1">↑ 48%</p>
        </Card>

        <MetricCardAvancado
          icon={TrendingUp}
          label="Pipeline Ponderado"
          valor="R$ 1.2M"
          variacao={{ valor: 15.3, label: 'crescimento' }}
          tipo="positivo"
          tooltip="Pipeline ajustado por probabilidade de fechamento"
        />

        <MetricCardAvancado
          icon={Target}
          label="Receita Prevista (30 dias)"
          valor="R$ 385k"
          tipo="positivo"
          tooltip="Receita estimada a ser fechada nos próximos 30 dias"
        />

        <MetricCardAvancado
          icon={TrendingUp}
          label="Receita Perdida (MoM)"
          valor="R$ 85k"
          tipo="atencao"
          tooltip="Valor de oportunidades que foram perdidas"
        />

        <MetricCardAvancado
          icon={Target}
          label="Win Rate"
          valor="52.3"
          unidade="%"
          variacao={{ valor: 8.5, label: 'melhoria' }}
          tipo="positivo"
          tooltip="Proporção de propostas que se tornaram vendas"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCardAvancado
          icon={Clock}
          label="Tempo Médio de Fechamento"
          valor="42"
          unidade="dias"
          variacao={{ valor: 7.5, label: 'redução' }}
          tipo="positivo"
          tooltip="Dias médios do primeiro contato até fechamento"
        />

        <MetricCardAvancado
          icon={TrendingUp}
          label="Custo de Aquisição (CAC)"
          valor="R$ 8.5k"
          variacao={{ valor: 2.1, label: 'aumento' }}
          tipo="atencao"
          tooltip="Investimento em vendas/marketing por cliente conquistado"
        />
      </div>

      <Card className="p-6 border-[var(--border)] bg-white">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Vendas vs Meta</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={DADOS_VENDAS}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="mes" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="vendas" fill="var(--apsis-green)" name="Vendas" />
            <Bar yAxisId="left" dataKey="meta" fill="var(--apsis-orange)" name="Meta" />
            <Line yAxisId="right" type="monotone" dataKey="conversao" stroke="#8B5CF6" name="Taxa %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 border-[var(--border)] bg-white">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Evolução do Ticket Médio (R$ mil)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={DADOS_TICKET}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip formatter={(value) => `R$ ${value}k`} />
            <Legend />
            <Line type="monotone" dataKey="ticket" stroke="var(--apsis-green)" strokeWidth={2} name="Ticket Médio" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}