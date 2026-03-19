import { Settings, GitBranch, Users, Bell } from "lucide-react";

export default function VendasConfiguracoes() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Configurações de Vendas</h1>
        <p className="text-sm text-slate-500 mt-0.5">Personalize o módulo comercial</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: GitBranch, title: "Estágios do Pipeline", desc: "Defina as etapas do funil de vendas", tag: "Em breve" },
          { icon: Users, title: "Equipe Comercial", desc: "Gerencie responsáveis e territórios", tag: "Em breve" },
          { icon: Bell, title: "Notificações", desc: "Alertas de follow-up e vencimentos", tag: "Em breve" },
          { icon: Settings, title: "Integrações", desc: "Conecte com Projetos e Financeiro", tag: "Em breve" },
        ].map(({ icon: Icon, title, desc, tag }) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4 shadow-sm opacity-70">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-700">{title}</p>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{tag}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}