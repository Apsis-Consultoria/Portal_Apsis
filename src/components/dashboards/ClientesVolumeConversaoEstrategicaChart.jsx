import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ClientesVolumeConversaoEstrategicaChart() {
  const data = [
    { period: "1º T 2024", volume: 7, clientes: 2, conversao: 25 },
    { period: "2º T 2024", volume: 9, clientes: 1, conversao: 10 },
    { period: "3º T 2024", volume: 8, clientes: 4, conversao: 56 },
    { period: "4º T 2024", volume: 8, clientes: 4, conversao: 67 },
    { period: "1º T 2025", volume: 14, clientes: 2, conversao: 50 },
    { period: "2º T 2025", volume: 10, clientes: 2, conversao: 48 },
    { period: "3º T 2025", volume: 3, clientes: 6, conversao: 38 },
    { period: "4º T 2025", volume: 17, clientes: 6, conversao: 64 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#DDE3DE]">
      <h3 className="text-lg font-bold text-[#1A2B1F] mb-2">Clientes, Volume de Propostas e Taxa de Conversão</h3>
      <p className="text-xs text-[#5C7060] mb-4">*A base de volume considera por data de criação de proposta, Nº de Cliente e taxa de conversão está considerando data de Aceite ou Perda, portanto o cálculo da taxa de conversão é ganho/total de ganhos e perdidas no período.</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDE3DE" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: 'Volume / Clientes', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            label={{ value: 'Taxa de Conversão (%)', angle: 90, position: 'insideRight' }}
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #DDE3DE', borderRadius: '8px' }}
            formatter={(value, name) => {
              if (name === 'conversao') return `${value}%`;
              return value;
            }}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="volume" 
            stroke="#1A4731" 
            strokeWidth={2} 
            name="Volume (por data de criação)" 
            dot={{ fill: '#1A4731', r: 4 }}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="clientes" 
            stroke="#5C7060" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            name="Nº de Clientes" 
            dot={{ fill: '#5C7060', r: 4 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="conversao" 
            stroke="#F47920" 
            strokeWidth={2} 
            name="Taxa de Conversão" 
            dot={{ fill: '#F47920', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}