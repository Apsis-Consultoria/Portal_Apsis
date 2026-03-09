import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function OrcadoRealizadoChart() {
  const data = [
    { grupo: "Fairness Opinion", realizado: 999, orcado: 500, percentual: 200 },
    { grupo: "Jurídico", realizado: 856, orcado: 825, percentual: 104 },
    { grupo: "Lei das S.A", realizado: 6656, orcado: 1800, percentual: 370 },
    { grupo: "PPA", realizado: 2604, orcado: 2800, percentual: 93 },
    { grupo: "Projetos Recorrentes", realizado: 3285, orcado: 4290, percentual: 77 },
    { grupo: "Recuperação Judicial", realizado: 1225, orcado: 900, percentual: 136 },
    { grupo: "Valuation", realizado: 3224, orcado: 2685, percentual: 120 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#DDE3DE]">
      <h3 className="text-lg font-bold text-[#1A2B1F] mb-4">Orçado x Realizado por Grupo de Serviços</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDE3DE" />
          <XAxis dataKey="grupo" stroke="#5C7060" angle={-45} textAnchor="end" height={80} />
          <YAxis yAxisId="left" stroke="#5C7060" />
          <YAxis yAxisId="right" orientation="right" stroke="#F47920" />
          <Tooltip contentStyle={{ backgroundColor: "#FFF", border: "1px solid #DDE3DE" }} />
          <Legend />
          <Bar yAxisId="left" dataKey="realizado" fill="#1A4731" name="Realizado (R$ milhões)" />
          <Bar yAxisId="left" dataKey="orcado" fill="#999999" name="Orçado (R$ milhões)" />
          <Line yAxisId="right" type="monotone" dataKey="percentual" stroke="#F47920" strokeWidth={2} name="% Realizado vs Orçado" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}