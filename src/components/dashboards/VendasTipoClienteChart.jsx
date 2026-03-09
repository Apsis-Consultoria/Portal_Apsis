import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function VendasTipoClienteChart() {
  const data = [
    { year: "2023", Novo: 7044, Premium: 13904, Reativado: 2568, Recorrente: 6592 },
    { year: "2024", Novo: 8784, Premium: 15193, Reativado: 2130, Recorrente: 12606 },
    { year: "2025", Novo: 6208, Premium: 6811, Reativado: 2829, Recorrente: 29591 },
  ];

  const percentuals = [
    { year: "2023", Novo: 23, Premium: 46, Reativado: 9, Recorrente: 22 },
    { year: "2024", Novo: 23, Premium: 39, Reativado: 6, Recorrente: 33 },
    { year: "2025", Novo: 14, Premium: 15, Reativado: 6, Recorrente: 65 },
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
        <h3 className="text-lg font-bold text-[#1A2B1F] mb-1">Vendas por Tipo de Cliente</h3>
        <p className="text-sm text-[#5C7060]">(%) Peso</p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDE3DE" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#5C7060" }} />
          <YAxis label={{ value: 'Milhares', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12, fill: "#5C7060" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Novo" fill="#A8B5AD" name="Novo" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Premium" fill="#1A4731" name="Premium" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Reativado" fill="#3B5945" name="Reativado" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Recorrente" fill="#F47920" name="Recorrente" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}