export default function AlocacaoEquipamentosTable({ alocacoes, isLoading, refetch }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-700";
      case "devolvido":
        return "bg-blue-100 text-blue-700";
      case "substituido":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statusLabel = {
    ativo: "Ativo",
    devolvido: "Devolvido",
    substituido: "Substituído"
  };

  return (
    <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
      <h2 className="font-semibold text-[#1A2B1F] mb-4">
        {alocacoes.length} alocação{alocacoes.length !== 1 ? 's' : ''}
      </h2>
      {isLoading ? (
        <div className="text-center py-8 text-[#5C7060]">Carregando...</div>
      ) : alocacoes.length === 0 ? (
        <div className="text-center py-8 text-[#5C7060]">Nenhuma alocação encontrada</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#DDE3DE]">
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Usuário</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Departamento</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Equipamento</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Nº Série</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Data Entrega</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Status</th>
              </tr>
            </thead>
            <tbody>
              {alocacoes.map((alocacao) => (
                <tr key={alocacao.id} className="border-b border-[#DDE3DE] hover:bg-[#F4F6F4] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1A2B1F]">{alocacao.usuario_nome}</td>
                  <td className="px-4 py-3 text-[#5C7060]">{alocacao.departamento || "-"}</td>
                  <td className="px-4 py-3 capitalize text-[#1A2B1F]">{alocacao.ativo_tipo}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#1A2B1F]">{alocacao.ativo_numero_serie}</td>
                  <td className="px-4 py-3 text-[#5C7060]">
                    {new Date(alocacao.data_entrega).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(alocacao.status)}`}>
                      {statusLabel[alocacao.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}