import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function OrcadoRealizadoAtivoChart() {
  const data = [
    { name: "Avaliação de Bens Móveis", realizado: 2815, orcado: 1075, percentage: 262 },
    { name: "Avaliação de Imóveis", realizado: 4164, orcado: 3400, percentage: 122 },
    { name: "CPC - 27", realizado: 475, orcado: 500, percentage: 95 },
    { name: "Inventário/Conciliação", realizado: 2718, orcado: 3500, percentage: 78 },
    { name: "Jurídico", realizado: 167, orcado: 375, percentage: 44 },
    { name: "Lei das S.A", realizado: 80, orcado: 0, percentage: 0 },
    { name: "PPA", realizado: 824, orcado: 750, percentage: 110 },
    { name: "Projetos Recorrentes", realizado: 91, orcado: 200, percentage: 46 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#DDE3DE]">
      <h3 className="text-lg font-bold text-[#1A2B1F] mb-4">Orçado x Realizado por Grupo de Serviços</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 80, bottom: 80, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDE3DE" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={120}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: 'Milhares', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            label={{ value: '%', angle: 90, position: 'insideRight' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #DDE3DE', borderRadius: '8px' }}
            formatter={(value) => value.toLocaleString('pt-BR')}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="realizado" fill="#1A4731" name="Realizado" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="left" dataKey="orcado" fill="#9CA3A3" name="Orçado" radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#F47920" strokeWidth={3} name="%" dot={{ fill: '#F47920', r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}