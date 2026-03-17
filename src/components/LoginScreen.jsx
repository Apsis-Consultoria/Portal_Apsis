import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/lib/msalConfig';

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a1fc4b60b4c477ea324579/40af152e2_Design-sem-nome.png";

export default function LoginScreen() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <div className="min-h-screen bg-[#1A4731] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center gap-6">
        <img src={LOGO_URL} alt="APSIS" className="w-16 h-16 object-contain rounded-xl" />

        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A4731]">Portal APSIS</h1>
          <p className="text-[#5C7060] mt-1 text-sm">Faça login com sua conta corporativa</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-[#0078D4] hover:bg-[#006BBE] text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" className="w-5 h-5">
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Entrar com Microsoft
        </button>

        <p className="text-xs text-[#5C7060] text-center">
          Acesso restrito a colaboradores APSIS.<br />
          Use sua conta <strong>@apsis.com.br</strong>
        </p>
      </div>
    </div>
  );
}