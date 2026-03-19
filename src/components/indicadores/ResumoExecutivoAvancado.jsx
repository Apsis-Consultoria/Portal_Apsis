import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle, Percent, BarChart3 } from 'lucide-react';
import MetricCardAvancado from './MetricCardAvancado';

export default function ResumoExecutivoAvancado({ filtros }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCardAvancado
        icon={Percent}
        label="Margem Bruta"
        valor="45.2"
        unidade="%"
        variacao={{ valor: 2.1, label: 'vs período anterior' }}
        tipo="positivo"
        tooltip="Receita menos custos diretos, sem despesas operacionais"
      />

      <MetricCardAvancado
        icon={Percent}
        label="Margem Líquida"
        valor="32.5"
        unidade="%"
        variacao={{ valor: 1.5, label: 'vs período anterior' }}
        tipo="positivo"
        tooltip="Lucro líquido dividido pela receita total"
      />

      <MetricCardAvancado
        icon={DollarSign}
        label="Receita Recorrente"
        valor="R$ 1.8M"
        variacao={{ valor: 8.3, label: 'crescimento' }}
        tipo="positivo"
        tooltip="Receita de contratos contínuos (mensal/trimestral/anual)"
      />

      <MetricCardAvancado
        icon={BarChart3}
        label="Ticket Médio por Cliente"
        valor="R$ 235k"
        variacao={{ valor: 5.7, label: 'aumento' }}
        tipo="positivo"
        tooltip="Receita total dividida pelo número de clientes ativos"
      />

      <MetricCardAvancado
        icon={DollarSign}
        label="Custo Operacional"
        valor="R$ 1.71M"
        variacao={{ valor: 3.2, label: 'aumento' }}
        tipo="atencao"
        tooltip="Despesas de operação (folha, overhead, infraestrutura)"
      />

      <MetricCardAvancado
        icon={BarChart3}
        label="Receita por Projeto"
        valor="R$ 238k"
        variacao={{ valor: 12.5, label: 'média' }}
        tipo="positivo"
        tooltip="Receita média por projeto em execução"
      />

      <MetricCardAvancado
        icon={TrendingUp}
        label="Crescimento MoM"
        valor="6.2"
        unidade="%"
        variacao={{ valor: 2.1, label: 'aceleração' }}
        tipo="positivo"
        tooltip="Variação de receita do mês atual em relação ao mês anterior"
      />

      <MetricCardAvancado
        icon={DollarSign}
        label="Eficiência de Custo"
        valor="60.1"
        unidade="%"
        variacao={{ valor: 1.8, label: 'melhoria' }}
        tipo="positivo"
        tooltip="Percentual da receita não gasto com custos operacionais"
      />
    </div>
  );
}