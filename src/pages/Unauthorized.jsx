import { ShieldX, Mail } from "lucide-react";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a1fc4b60b4c477ea324579/40af152e2_Design-sem-nome.png";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-[#F4F6F4] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <img src={LOGO_URL} alt="APSIS" className="w-16 h-16 object-contain mx-auto mb-6 rounded" />
        
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldX size={32} className="text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-[#1A4731] mb-2">Acesso Não Autorizado</h1>
        <p className="text-gray-500 text-sm mb-6">
          Você não possui permissão para acessar o Portal APSIS. Para solicitar acesso, entre em contato com o suporte.
        </p>

        <a
          href="mailto:suporte@apsis.com.br"
          className="inline-flex items-center gap-2 bg-[#F47920] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d96910] transition-colors"
        >
          <Mail size={18} />
          suporte@apsis.com.br
        </a>
      </div>
    </div>
  );
}