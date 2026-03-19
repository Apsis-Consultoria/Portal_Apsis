import { X, Lock, Eye, Shield, LogOut, FileText, CheckCircle } from 'lucide-react';

export default function PortalSecurityModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const features = [
    {
      icon: Lock,
      title: 'Acesso Protegido',
      description: 'O portal do cliente é um ambiente protegido por login e senha, garantindo que apenas usuários autenticados possam acessar.',
    },
    {
      icon: Eye,
      title: 'Visibilidade Controlada',
      description: 'Cada cliente vê apenas seu próprio workspace. Mensagens e documentos seguem regras de visibilidade definidas pela APSIS.',
    },
    {
      icon: FileText,
      title: 'Documentos Seguros',
      description: 'Os documentos não são expostos livremente. O portal controla quem pode visualizar cada arquivo com base em classificações de segurança.',
    },
    {
      icon: Shield,
      title: 'Isolamento de Dados',
      description: 'Cada cliente tem um espaço isolado. Não há risco de um cliente visualizar dados de outro cliente.',
    },
    {
      icon: LogOut,
      title: 'Auditoria Completa',
      description: 'Todos os acessos, downloads e ações ficam registrados em logs de auditoria para rastreabilidade total.',
    },
    {
      icon: CheckCircle,
      title: 'Compliance',
      description: 'O sistema está preparado para atender requisitos de segurança da informação e compliance de dados sensíveis.',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--apsis-green)] to-[var(--apsis-green-light)] text-white p-6 flex items-start justify-between rounded-t-xl">
            <div>
              <h2 className="text-2xl font-bold mb-2">Como Funciona o Acesso Seguro</h2>
              <p className="text-white/80 text-sm">Entenda como o Portal do Cliente protege seus dados</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Intro */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                O Portal do Cliente é um ambiente seguro e controlado onde seus clientes podem acessar documentos, mensagens e projetos com total controle sobre quem pode visualizar o quê.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="border border-[var(--border)] rounded-lg p-4 hover:border-[var(--apsis-orange)]/50 transition-colors">
                    <div className="flex gap-3">
                      <Icon size={20} className="text-[var(--apsis-orange)] flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">{feature.title}</h3>
                        <p className="text-xs text-[var(--text-secondary)]">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Como Funciona Passo a Passo */}
            <div className="border-t border-[var(--border)] pt-6">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Fluxo de Acesso</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--apsis-orange)] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Cliente acessa o portal</p>
                    <p className="text-xs text-[var(--text-secondary)]">Usa e-mail e senha para fazer login de forma segura</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--apsis-orange)] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Carrega workspace isolado</p>
                    <p className="text-xs text-[var(--text-secondary)]">O sistema filtra dados para mostrar apenas o que pertence ao cliente</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--apsis-orange)] text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Acessa documentos e mensagens</p>
                    <p className="text-xs text-[var(--text-secondary)]">Apenas conteúdo compartilhado pela APSIS é visível</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--apsis-orange)] text-white flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Ações registradas</p>
                    <p className="text-xs text-[var(--text-secondary)]">Todos os acessos são auditados para segurança total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Protegidos */}
            <div className="bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)]">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">O que é Protegido</h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li>✓ Cada cliente só vê seu próprio workspace</li>
                <li>✓ Documentos internos (APSIS) nunca são expostos</li>
                <li>✓ Mensagens respeitam regras de visibilidade</li>
                <li>✓ Solicitações são isoladas por cliente</li>
                <li>✓ Histórico de acessos fica registrado</li>
                <li>✓ Nenhum cliente consegue acessar dados de outro</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[var(--border)] bg-[var(--surface-2)] p-4 rounded-b-xl flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[var(--apsis-orange)] text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}