import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalisisTipoVendaChart() {
  const data = [
    { year: "2023", Ativa: 8163, Mida: 2214, Parceiro: 2535, Passiva: 17197 },
    { year: "2024", Ativa: 7632, Mida: 1392, Parceiro: 4046, Passiva: 25642 },
    { year: "2025", Ativa: 7193, Mida: 1579, Parceiro: 7193, Passiva: 25286 },
  ];

  const percentuals = [
    { year: "2023", Ativa: 27, Mida: 7, Parceiro: 8, Passiva: 57 },
    { year: "2024", Ativa: 20, Mida: 4, Parceiro: 10, Passiva: 66 },
    { year: "2025", Ativa: 16, Mida: 3, Parceiro: 16, Passiva: 56 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const year = payload[0].payload.year;
      const percentData = percentuals.find(p => p.year === year);
      return (
        <div className="bg-white border border-[#DDE3DE] rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm text-[#1A2B1F]">{year}</p>
          {payload.map((entry, idx) => {
            const key = entry.dataKey;
            const pct = percentData[key];
            return (
              <p key={idx} style={{ color: entry.fill }} className="text-xs">
                {key}: {entry.value.toLocaleString('pt-BR')} ({pct}%)
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#DDE3DE]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#1A2B1F] mb-1">Análise por Tipo de Venda</h3>
        <p className="text-sm text-[#5C7060]">(%) Peso nas vendas</p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDE3DE" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#5C7060" }} />
          <YAxis label={{ value: 'Milhares', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12, fill: "#5C7060" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Ativa" fill="#B8C5BD" name="Ativa" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Mida" fill="#1A4731" name="Mídia" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Parceiro" fill="#F47920" name="Parceiro" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Passiva" fill="#245E40" name="Passiva" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}