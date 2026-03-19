import { useNavigate } from "react-router-dom";
import { Package, Users, TrendingDown, BarChart3 } from "lucide-react";

export default function TecnologiaInicio() {
  const navigate = useNavigate();

  const modulos = [
    {
      title: "Estoque de Ativos",
      description: "Cadastro e gerenciamento de equipamentos",
      icon: Package,
      page: "EstoqueAtivos",
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    {
      title: "Alocação de Equipamentos",
      description: "Vincular equipamentos a usuários",
      icon: Users,
      page: "AlocacaoEquipamentos",
      color: "from-green-50 to-green-100",
      borderColor: "border-green-200"
    },
    {
      title: "Movimentações",
      description: "Histórico de entrega, devolução e manutenção",
      icon: TrendingDown,
      page: "MovimentacoesEquipamentos",
      color: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200"
    },
    {
      title: "Dashboard",
      description: "Visão executiva de ativos e alocações",
      icon: BarChart3,
      page: "DashboardTI",
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1A2B1F]">Tecnologia e Inovação</h1>
        <p className="text-[#5C7060] mt-2">Gerenciamento de ativos de TI e equipamentos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modulos.map((modulo) => {
          const Icon = modulo.icon;
          return (
            <button
              key={modulo.page}
              onClick={() => navigate(`/${modulo.page}`)}
              className={`bg-gradient-to-br ${modulo.color} border ${modulo.borderColor} rounded-xl p-6 hover:shadow-lg transition-all text-left`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/50 rounded-lg">
                  <Icon size={24} className="text-[#1A4731]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1A2B1F] text-lg">{modulo.title}</h3>
                  <p className="text-sm text-[#5C7060] mt-1">{modulo.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}