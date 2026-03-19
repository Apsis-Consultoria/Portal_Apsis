export default function DashboardTIComponent({ porTipo, porDepartamento, ativos }) {
  const tiposSistemaOperacional = {};
  ativos.forEach((a) => {
    if (a.sistema_operacional) {
      tiposSistemaOperacional[a.sistema_operacional] = (tiposSistemaOperacional[a.sistema_operacional] || 0) + 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Distribuição por tipo */}
      <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
        <h3 className="font-semibold text-[#1A2B1F] mb-4">Distribuição por Tipo</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(porTipo).map(([tipo, qtd]) => (
            <div key={tipo} className="bg-[#F4F6F4] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#1A4731]">{qtd}</p>
              <p className="text-xs text-[#5C7060] mt-1 capitalize">{tipo}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribuição por departamento */}
      {Object.keys(porDepartamento).length > 0 && (
        <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
          <h3 className="font-semibold text-[#1A2B1F] mb-4">Equipamentos por Departamento</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(porDepartamento).map(([depto, qtd]) => (
              <div key={depto} className="bg-[#F4F6F4] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#245E40]">{qtd}</p>
                <p className="text-xs text-[#5C7060] mt-1">{depto}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distribuição por SO */}
      {Object.keys(tiposSistemaOperacional).length > 0 && (
        <div className="bg-white rounded-xl border border-[#DDE3DE] p-6">
          <h3 className="font-semibold text-[#1A2B1F] mb-4">Sistemas Operacionais</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(tiposSistemaOperacional).map(([so, qtd]) => (
              <div key={so} className="bg-[#F4F6F4] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#F47920]">{qtd}</p>
                <p className="text-xs text-[#5C7060] mt-1 capitalize">{so}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}