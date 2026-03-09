const MetricTable = ({ rows }) => (
  <div className="overflow-x-auto mb-6">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold bg-[#1A4731] text-white w-1/3">Métrica</th>
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

export default function CapitalHumanoTable() {
  const tableRows = [
    { label: "HR de Treinamento Time e Lideranças", data: ["4,6", "7,6", "0", "0", "45", "12,2"] },
    { label: "Rotatividade Geral (Admissões+Demissões)", data: ["5%", "16%", "5%", "6%", "15%", "29%"] },
    { label: "Desligamentos Ativos", data: ["5%", "3%", "3%", "4%", "10%", "15%"] },
    { label: "% de Mulheres na área", data: ["40%", "40%", "40%", "37%", "40%", "39%"] }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#DDE3DE]">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#1A2B1F] mb-2">Capital Humano</h2>
        <p className="text-sm text-[#5C7060]">Métricas de Desenvolvimento e Gestão de Pessoas</p>
      </div>

      <MetricTable rows={tableRows} />
    </div>
  );
}