const MetricTable = ({ title, rows }) => (
  <div className="overflow-x-auto mb-6">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold bg-[#1A4731] text-white w-1/3">{title}</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#F47920] text-white">Q1</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#F47920] text-white">Q2</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#F47920] text-white">Q3</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#F47920] text-white">Q4</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#1A4731] text-white">Ref.</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#F47920] text-white">Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F4F6F4]"}>
            <td className="px-6 py-4 text-sm font-medium text-white bg-[#1A4731]">{row.label}</td>
            <td className="px-6 py-4 text-center text-sm text-[#1A2B1F] bg-[#FFC69F]">{row.data[0]}</td>
            <td className="px-6 py-4 text-center text-sm text-[#1A2B1F] bg-[#FFC69F]">{row.data[1]}</td>
            <td className="px-6 py-4 text-center text-sm text-[#1A2B1F] bg-[#FFC69F]">{row.data[2]}</td>
            <td className="px-6 py-4 text-center text-sm text-[#1A2B1F] bg-[#FFC69F]">{row.data[3]}</td>
            <td className="px-6 py-4 text-center text-sm font-semibold text-[#1A2B1F]">{row.data[4]}</td>
            <td className="px-6 py-4 text-center text-sm font-semibold text-white bg-[#F47920]">{row.data[5]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function FinanceiroMetricasTable() {
  const tableRows = [
    { label: "Business Valuation", data: ["43%", "51%", "17%", "52%", "40%", "43%"] },
    { label: "Contábil & Fiscal", data: ["32%", "41%", "28%", "35%", "35%", "34%"] },
    { label: "Ativos Fixos", data: ["48%", "62%", "55%", "58%", "55%", "56%"] }
  ];

  const serviceRevenueRows = [
    { label: "Contabilidade", data: ["12%", "18%", "8%", "15%", "12%", "13%"] },
    { label: "Consultoria Estratégica", data: ["22%", "28%", "19%", "25%", "23%", "24%"] },
    { label: "M&A", data: ["35%", "42%", "30%", "38%", "35%", "36%"] }
  ];

  const marginByUnitRows = [
    { label: "Contabilidade", data: ["18%", "22%", "16%", "20%", "19%", "19%"] },
    { label: "Consultoria", data: ["28%", "35%", "25%", "32%", "30%", "30%"] },
    { label: "M&A", data: ["45%", "52%", "40%", "48%", "46%", "46%"] }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#DDE3DE]">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#1A2B1F] mb-2">Indicadores Financeiros</h2>
          <p className="text-sm text-[#5C7060]">Acompanhamento trimestral de margem EBITDA e receita de serviços</p>
        </div>
        
        <h3 className="text-base font-semibold text-[#1A2B1F] mb-4 mt-6">Margem EBITDA</h3>
        <MetricTable title="Divisão" rows={tableRows} />
        
        <h3 className="text-base font-semibold text-[#1A2B1F] mb-4 mt-6">Crescimento da Receita de Serviços Maduros</h3>
        <MetricTable title="Divisão" rows={serviceRevenueRows} />
        
        <h3 className="text-base font-semibold text-[#1A2B1F] mb-4 mt-6">Margem por Unidade de Negócio</h3>
        <MetricTable title="Unidade" rows={marginByUnitRows} />
      </div>
    </div>
  );
}