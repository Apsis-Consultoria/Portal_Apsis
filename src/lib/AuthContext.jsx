import React, { createContext, useContext } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "@/lib/msalConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const user = accounts[0] ? {
    name: accounts[0].name,
    email: accounts[0].username,
    id: accounts[0].localAccountId,
  } : null;

  const logout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
  };

  const login = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};