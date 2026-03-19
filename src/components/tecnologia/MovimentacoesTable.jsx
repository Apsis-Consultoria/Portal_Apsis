export default function MovimentacoesTable({ movimentacoes, isLoading }) {
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "entrega":
        return "bg-blue-100 text-blue-700";
      case "devolucao":
        return "bg-green-100 text-green-700";
      case "troca":
        return "bg-orange-100 text-orange-700";
      case "manutencao":
      case "reparo":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const tipoLabel = {
    entrega: "Entrega",
    devolucao: "Devolução",
    troca: "Troca",
    manutencao: "Manutenção",
    reparo: "Reparo"
  };

  return (
    <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
      <h2 className="font-semibold text-[#1A2B1F] mb-4">
        {movimentacoes.length} movimentação{movimentacoes.length !== 1 ? 's' : ''}
      </h2>
      {isLoading ? (
        <div className="text-center py-8 text-[#5C7060]">Carregando...</div>
      ) : movimentacoes.length === 0 ? (
        <div className="text-center py-8 text-[#5C7060]">Nenhuma movimentação encontrada</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#DDE3DE]">
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Data</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Tipo</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Nº Série</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Usuário</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1A2B1F]">Observação</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((mov) => (
                <tr key={mov.id} className="border-b border-[#DDE3DE] hover:bg-[#F4F6F4] transition-colors">
                  <td className="px-4 py-3 text-[#1A2B1F]">
                    {new Date(mov.data_movimentacao).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTipoColor(mov.tipo_movimentacao)}`}>
                      {tipoLabel[mov.tipo_movimentacao]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#1A2B1F]">{mov.ativo_numero_serie}</td>
                  <td className="px-4 py-3 text-[#5C7060]">{mov.usuario_nome || mov.usuario_email}</td>
                  <td className="px-4 py-3 text-[#5C7060] text-xs max-w-xs truncate">{mov.observacao || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}