import { Info, Settings, Layers, Bell } from "lucide-react";

export default function ProjetosConfiguracoes() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-800">Configurações do Módulo</h2>
        <p className="text-xs text-slate-400 mt-1">Preferências gerais do módulo de Projetos</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1A4731]/10 flex items-center justify-center flex-shrink-0">
              <Layers size={15} className="text-[#1A4731]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700">Horas, Alocações, Gantt e Parcelas</div>
              <p className="text-xs text-slate-400 mt-1">
                Estas funcionalidades estão disponíveis dentro de cada projeto individualmente, na aba correspondente da tela de detalhe do projeto.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Bell size={15} className="text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700">Comunicação e Pipeline</div>
              <p className="text-xs text-slate-400 mt-1">
                Comunicação contextual é acessível dentro de cada projeto. Pipeline comercial pertence ao módulo de Vendas.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Info size={15} className="text-blue-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700">Modelos de Avaliação</div>
              <p className="text-xs text-slate-400 mt-1">
                Disponível na área administrativa do portal. Acesse via Configurações globais → Modelos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}