import { useEffect, useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "@/lib/msalConfig";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a1fc4b60b4c477ea324579/40af152e2_Design-sem-nome.png";

export default function AuthGuard({ children }) {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [loading, setLoading] = useState(false);

  // Limpa estado travado do MSAL no carregamento
  useEffect(() => {
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.includes('interaction.status') || k.includes('msal.interaction')) {
        localStorage.removeItem(k);
      }
    });
  }, []);

  const handleLogin = async () => {
    if (loading || inProgress !== InteractionStatus.None) return;
    setLoading(true);
    try {
      await instance.loginRedirect(loginRequest);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  // Só mostra spinner quando está processando o retorno do redirect Microsoft
  if (inProgress === InteractionStatus.HandleRedirect) {
    return (
      <div className="min-h-screen bg-[#1A4731] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/30 border-t-[#F47920] rounded-full animate-spin" />
          <p className="text-white font-medium">Autenticando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
}