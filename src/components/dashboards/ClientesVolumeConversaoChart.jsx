import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ClientesVolumeConversaoChart() {
  const data = [
    { period: "1º Trimestre 2023", volume: 115, clientes: 54, taxa: 46 },
    { period: "2º Trimestre 2023", volume: 109, clientes: 48, taxa: 45 },
    { period: "3º Trimestre 2023", volume: 108, clientes: 49, taxa: 49 },
    { period: "4º Trimestre 2023", volume: 108, clientes: 52, taxa: 45 },
    { period: "1º Trimestre 2024", volume: 98, clientes: 56, taxa: 61 },
    { period: "2º Trimestre 2024", volume: 108, clientes: 44, taxa: 46 },
    { period: "3º Trimestre 2024", volume: 130, clientes: 55, taxa: 54 },
    { period: "4º Trimestre 2024", volume: 143, clientes: 66, taxa: 65 },
    { period: "1º Trimestre 2025", volume: 128, clientes: 66, taxa: 67 },
    { period: "2º Trimestre 2025", volume: 102, clientes: 48, taxa: 48 },
    { period: "3º Trimestre 2025", volume: 174, clientes: 64, taxa: 29 },
    { period: "4º Trimestre 2025", volume: 160, clientes: 56, taxa: 29 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#DDE3DE]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#1A2B1F] mb-2">Clientes, Volume de Propostas e Taxa de Conversão</h3>
        <p className="text-xs text-[#5C7060] italic">
          No 2º e 4º trimestre, o relatório do SAN mostrou uma limpeza de base que moveu propostas antigas para "Perdida", dislocando a taxa de conversão do período.
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDE3DE" />
          <XAxis 
            dataKey="period" 
            stroke="#5C7060" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis yAxisId="left" stroke="#5C7060" />
          <YAxis yAxisId="right" orientation="right" stroke="#F47920" />
          <Tooltip contentStyle={{ backgroundColor: "#FFF", border: "1px solid #DDE3DE" }} />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="volume" 
            stroke="#1A4731" 
            strokeWidth={2}
            name="Volume (por data de criação)"
            dot={false}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="clientes" 
            stroke="#999999" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Nº de Clientes"
            dot={false}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="taxa" 
            stroke="#F47920" 
            strokeWidth={2}
            name="Taxa de Conversão"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-[#5C7060] italic mt-4">
        *Apenas a base de volume considera por data de criação de proposta, Nº de cliente e taxa de conversão está considerando data de Aceite ou Perda, portanto o cálculo da taxa de conversão é ganha/total de ganhas e perdidas no período.
      </p>
    </div>
  );
}