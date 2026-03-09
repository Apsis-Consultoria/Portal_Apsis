import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, ResponsiveContainer } from "recharts";

export default function VendasTicketContabilChart() {
  const data = [
    { trimestre: "1º Trimestre", vendas2023: 1368, vendas2024: 1924, vendas2025: 2070, ticket2023: 44734, ticket2024: 30100, ticket2025: 32460 },
    { trimestre: "2º Trimestre", vendas2023: 1363, vendas2024: 1204, vendas2025: 1817, ticket2023: 67312, ticket2024: 28132, ticket2025: 53859 },
    { trimestre: "3º Trimestre", vendas2023: 1294, vendas2024: 2316, vendas2025: 2860, ticket2023: 31824, ticket2024: 32460, ticket2025: 86666 },
    { trimestre: "4º Trimestre", vendas2023: 1480, vendas2024: 1628, vendas2025: 1646, ticket2023: 35249, ticket2024: 44495, ticket2025: 40878 },
  ];

  const totalData = [
    { label: "Total", vendas2023: 5506, vendas2024: 7072, vendas2025: 8393, ticket2023: 31823, ticket2024: 40878, ticket2025: 58288 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#DDE3DE]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#1A2B1F] mb-2">Vendas e Ticket Médio</h3>
        <p className="text-xs text-[#5C7060]">Orçado: <span className="font-semibold">R$ 7.750.000</span></p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDE3DE" />
          <XAxis 
            dataKey="trimestre" 
            stroke="#5C7060"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis yAxisId="left" stroke="#5C7060" label={{ value: "Vendas (Milhões)", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" stroke="#F47920" label={{ value: "Ticket Médio", angle: 90, position: "insideRight" }} />
          <Tooltip contentStyle={{ backgroundColor: "#FFF", border: "1px solid #DDE3DE" }} />
          <Legend />
          
          <Bar yAxisId="left" dataKey="vendas2023" fill="#D3D3D3" name="Vendas 2023" />
          <Bar yAxisId="left" dataKey="vendas2024" fill="#245E40" name="Vendas 2024" />
          <Bar yAxisId="left" dataKey="vendas2025" fill="#F47920" name="Vendas 2025" />
          
          <Line yAxisId="right" type="monotone" dataKey="ticket2023" stroke="#999999" strokeWidth={2} name="Ticket Médio 2023" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="ticket2024" stroke="#245E40" strokeWidth={2} name="Ticket Médio 2024" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="ticket2025" stroke="#F47920" strokeWidth={2} name="Ticket Médio 2025" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-[#1A2B1F] mb-3">Resumo Anual</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded border border-[#DDE3DE]">
            <div className="text-2xl font-bold text-gray-400">5.506</div>
            <div className="text-xs text-[#5C7060]">Vendas 2023</div>
            <div className="text-sm font-semibold text-gray-600 mt-1">31.823</div>
          </div>
          <div className="text-center p-3 bg-white rounded border border-[#DDE3DE]">
            <div className="text-2xl font-bold text-[#245E40]">7.072</div>
            <div className="text-xs text-[#5C7060]">Vendas 2024</div>
            <div className="text-sm font-semibold text-[#245E40] mt-1">40.878</div>
          </div>
          <div className="text-center p-3 bg-white rounded border border-[#DDE3DE]">
            <div className="text-2xl font-bold text-[#F47920]">8.393</div>
            <div className="text-xs text-[#5C7060]">Vendas 2025</div>
            <div className="text-sm font-semibold text-[#F47920] mt-1">58.288</div>
          </div>
        </div>
      </div>
    </div>
  );
}