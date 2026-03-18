import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

export default function ProjetosHoras({ data, loading }) {
  const { alocacoes, entradas, projetos } = data;

  // Agrupa horas por colaborador
  const colab = {};
  alocacoes.forEach(a => {
    if (!a.colaborador) return;
    if (!colab[a.colaborador]) colab[a.colaborador] = { previstas: 0, executadas: 0 };
    colab[a.colaborador].previstas += a.horas_previstas || 0;
    colab[a.colaborador].executadas += a.horas_executadas || 0;
  });
  entradas.forEach(e => {
    if (!e.colaborador) return;
    if (!colab[e.colaborador]) colab[e.colaborador] = { previstas: 0, executadas: 0 };
    colab[e.colaborador].executadas += e.horas || 0;
  });

  const colaboradores = Object.entries(colab)
    .map(([nome, h]) => ({
      nome,
      previstas: h.previstas,
      executadas: h.executadas,
      restantes: Math.max(0, h.previstas - h.executadas),
      carga: h.previstas > 0 ? (h.executadas / h.previstas) * 100 : 0,
    }))
    .sort((a, b) => b.executadas - a.executadas);

  const totalPrevistas = alocacoes.reduce((s, a) => s + (a.horas_previstas || 0), 0);
  const totalExecutadas = entradas.reduce((s, e) => s + (e.horas || 0), 0);
  const sobrecarregados = colaboradores.filter(c => c.carga > 100).length;
  const ociosos = colaboradores.filter(c => c.previstas > 0 && c.carga < 30).length;

  const chartData = colaboradores.slice(0, 10).map(c => ({
    name: c.nome.split(" ")[0],
    previstas: c.previstas,
    executadas: c.executadas,
    carga: c.carga,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Clock} color="blue" label="Horas Previstas" value={`${totalPrevistas.toFixed(0)}h`} />
        <KPICard icon={TrendingUp} color="green" label="Horas Executadas" value={`${totalExecutadas.toFixed(0)}h`} />
        <KPICard icon={AlertTriangle} color="orange" label="Sobrecarregados" value={sobrecarregados} />
        <KPICard icon={Users} color="slate" label="Ociosos" value={ociosos} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de carga */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Horas por Colaborador (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="previstas" fill="#CBD5E1" name="Previstas" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="executadas" fill="#1A4731" name="Executadas" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-300 text-sm">Sem dados de alocação</div>
            )}
          </CardContent>
        </Card>

        {/* Ranking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Ranking de Carga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {colaboradores.slice(0, 8).map((c, i) => (
              <div key={c.nome} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-4">{i + 1}</span>
                    <span className="font-medium text-slate-700">{c.nome}</span>
                    {c.carga > 100 && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">Sobrecarga</span>}
                    {c.previstas > 0 && c.carga < 30 && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">Ocioso</span>}
                  </div>
                  <span className={`font-semibold ${c.carga > 100 ? "text-red-500" : c.carga > 80 ? "text-amber-500" : "text-[#1A4731]"}`}>
                    {c.executadas.toFixed(0)}h / {c.previstas.toFixed(0)}h
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${c.carga > 100 ? "bg-red-400" : c.carga > 80 ? "bg-amber-400" : "bg-[#1A4731]"}`}
                    style={{ width: `${Math.min(100, c.carga)}%` }}
                  />
                </div>
              </div>
            ))}
            {colaboradores.length === 0 && (
              <div className="text-center py-8 text-slate-300 text-sm">Sem alocações registradas</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela detalhada */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">Detalhe por Colaborador</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Colaborador</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">Previstas</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">Executadas</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">Restantes</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">Carga</th>
                </tr>
              </thead>
              <tbody>
                {colaboradores.map(c => (
                  <tr key={c.nome} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{c.nome}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{c.previstas.toFixed(0)}h</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-semibold">{c.executadas.toFixed(0)}h</td>
                    <td className="px-4 py-3 text-right text-slate-500">{c.restantes.toFixed(0)}h</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.carga > 100 ? "bg-red-400" : c.carga > 80 ? "bg-amber-400" : "bg-[#1A4731]"}`}
                            style={{ width: `${Math.min(100, c.carga)}%` }}
                          />
                        </div>
                        <span className={`font-medium ${c.carga > 100 ? "text-red-500" : "text-slate-600"}`}>
                          {c.carga.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {colaboradores.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-300">Sem dados de alocação</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ icon: Icon, color, label, value }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-[#F47920]",
    slate: "bg-slate-100 text-slate-500",
  };
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xl font-bold text-slate-800">{value}</p>
          <p className="text-xs text-slate-400">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}