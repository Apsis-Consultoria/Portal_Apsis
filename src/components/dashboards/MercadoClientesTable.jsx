const MetricTable = ({ metric, data }) => (
  <div className="overflow-x-auto mb-6">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold bg-[#1A4731] text-white w-1/3">{metric}</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#F47920] text-white">Q1</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#F47920] text-white">Q2</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#F47920] text-white">Q3</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#F47920] text-white">Q4</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#1A4731] text-white">Ref.</th>
          <th className="px-6 py-4 text-center text-sm font-semibold bg-[#F47920] text-white">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-white">
          <td className="px-6 py-4 text-center text-sm text-[#1A2B1F] bg-[#FFC69F]">{data[0]}</td>
          <td className="px-6 py-4 text-center text-sm text-[#1A2B1F] bg-[#FFC69F]">{data[1]}</td>
          <td className="px-6 py-4 text-center text-sm text-[#1A2B1F] bg-[#FFC69F]">{data[2]}</td>
          <td className="px-6 py-4 text-center text-sm text-[#1A2B1F] bg-[#FFC69F]">{data[3]}</td>
          <td className="px-6 py-4 text-center text-sm font-semibold text-[#1A2B1F]">{data[4]}</td>
          <td className="px-6 py-4 text-center text-sm font-semibold text-white bg-[#F47920]">{data[5]}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function MercadoClientesTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#DDE3DE]">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#1A2B1F] mb-2">Mercado / Clientes</h2>
        <p className="text-sm text-[#5C7060]">Métricas de Vendas e Conversão</p>
      </div>

      <MetricTable metric="Vendas Ativas/Vendas Gerais (Esforço do Colaborador)" data={["32%", "20%", "24%", "14%", "30%", "20%"]} />
      <MetricTable metric="% Vendas Geradas por Produtos Estratégicos" data={["6%", "6%", "15%", "7%", "15%", "9%"]} />
      <MetricTable metric="Cross Selling (Propostas)" data={["5%", "9%", "5%", "5%", "5%", "5%"]} />
      <MetricTable metric="Propostas Geradas pelos Meios Digitais" data={["44", "99", "71", "77", "200", "291"]} />
      <MetricTable metric="Taxa de Conversão em Valor" data={["68%", "37%", "31%", "24%", "45%", "31%"]} />
      <MetricTable metric="Taxa de Conversão em Propostas" data={["69%", "43%", "42%", "36%", "47%", "41%"]} />
    </div>
  );
}