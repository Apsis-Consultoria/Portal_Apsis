import { useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "@/lib/msalConfig";
import Unauthorized from "@/pages/Unauthorized";

export default function AuthGuard({ children }) {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      instance.loginRedirect(loginRequest).catch(() => {
        // erro tratado na tela de Unauthorized
      });
    }
  }, [isAuthenticated, inProgress, instance]);

  if (inProgress !== InteractionStatus.None) {
    return (
      <div className="min-h-screen bg-[#F4F6F4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#1A4731] border-t-[#F47920] rounded-full animate-spin" />
          <p className="text-[#1A4731] font-medium">Autenticando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // aguardando redirect
  }

  return children;
}