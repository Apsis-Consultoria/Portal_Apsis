import { FileText } from 'lucide-react';

export default function PortalClienteDocumentos() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Documentos</h1>
        <p className="text-[var(--text-secondary)]">Acesse documentos compartilhados com segurança</p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl p-12 text-center">
        <FileText size={48} className="mx-auto text-[var(--text-secondary)] opacity-50 mb-4" />
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Biblioteca de Documentos</h2>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          Acesse propostas, relatórios, laudos e outros documentos compartilhados pelo seu consultor.
        </p>
      </div>
    </div>
  );
}