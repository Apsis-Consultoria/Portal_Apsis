import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ClientesVolumeConversaoMAChart() {
  const data = [
    { quarter: "1º Trim 2024", volume: 18, clientes: 1, taxa: 16 },
    { quarter: "2º Trim 2024", volume: 7, clientes: 1, taxa: 33 },
    { quarter: "3º Trim 2024", volume: 3, clientes: 1, taxa: 50 },
    { quarter: "4º Trim 2024", volume: 12, clientes: 3, taxa: 56 },
    { quarter: "1º Trim 2025", volume: 5, clientes: 3, taxa: 50 },
    { quarter: "2º Trim 2025", volume: 9, clientes: 2, taxa: 50 },
    { quarter: "3º Trim 2025", volume: 14, clientes: 3, taxa: 27 },
    { quarter: "4º Trim 2025", volume: 9, clientes: 3, taxa: 30 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#DDE3DE]">
      <h3 className="text-lg font-bold text-[#1A2B1F] mb-4">Clientes, Volume de Propostas e Taxa de Conversão</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDE3DE" />
          <XAxis 
            dataKey="quarter" 
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: 'Volume / Clientes', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            label={{ value: 'Taxa de Conversão (%)', angle: 90, position: 'insideRight' }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #DDE3DE', borderRadius: '8px' }}
            formatter={(value) => value}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="volume" 
            stroke="#1A4731" 
            strokeWidth={2.5}
            name="Volume (por data de criação)"
            dot={{ fill: '#1A4731', r: 5 }}
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
            dataKey="taxa" 
            stroke="#F47920" 
            strokeWidth={2.5}
            name="Taxa de Conversão"
            dot={{ fill: '#F47920', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-[#5C7060] mt-4 italic">
        *A base de volume considera por data de criação de proposta, Nº de cliente e taxa de conversão está considerando data de Aceite ou Perda, portanto o cálculo da taxa de conversão é ganho/total de ganhos e perdidas no período.
      </p>
    </div>
  );
}