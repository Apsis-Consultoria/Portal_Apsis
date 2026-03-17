import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "@/lib/msalConfig";
import AuthGuard from "@/components/AuthGuard";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <MsalProvider instance={msalInstance}>
    <AuthGuard>
      <App />
    </AuthGuard>
  </MsalProvider>
)