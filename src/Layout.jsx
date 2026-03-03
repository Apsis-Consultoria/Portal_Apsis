import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, GitBranch, FolderKanban,
  DollarSign, BarChart3, FileText, ChevronLeft,
  ChevronRight, Bell, Menu, X, Megaphone, TrendingUp, PieChart, Settings, LogOut
} from "lucide-react";
import AssistantWidget from "@/components/AssistantWidget";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a1fc4b60b4c477ea324579/40af152e2_Design-sem-nome.png";

const navItems = [
  { label: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { label: "Pipeline", page: "Pipeline", icon: GitBranch },
  { label: "Projetos", page: "Projetos", icon: FolderKanban },
  { label: "Financeiro", page: "Financeiro", icon: DollarSign },
  { label: "Budget", page: "Budget", icon: BarChart3 },
  { label: "Relatórios", page: "Relatorios", icon: FileText },
  {
    label: "Marketing", page: "Marketing", icon: Megaphone,
    children: [
      { label: "Comercial", page: "MarketingComercial", icon: TrendingUp },
      { label: "Orçado vs Real", page: "MarketingOrcado", icon: PieChart },
    ]
  },
  { label: "Configurações", page: "Configuracoes", icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDepartamento, setUserDepartamento] = useState(null);
  const [openSubmenus, setOpenSubmenus] = useState({});

  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const toggleSubmenu = (label) => setOpenSubmenus(prev => ({ ...prev, [label]: !prev[label] }));

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      if (!u) return;
      setUser(u);
      const cols = await base44.entities.Colaborador.filter({ email: u.email });
      if (cols && cols.length > 0 && cols[0].departamento) {
        setUserDepartamento(cols[0].departamento);
      }
    }).catch(() => {});
  }, []);

  const pageLabel =
    navItems.find(n => n.page === currentPageName)?.label ||
    navItems.flatMap(n => n.children || []).find(n => n.page === currentPageName)?.label ||
    currentPageName;

  return (
    <div className="min-h-screen flex bg-[#F0F2F5]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .sidebar-bg { background-color: #1A4731; }
        .sidebar-active { background-color: rgba(255,255,255,0.12); border-left: 3px solid #F47920; }
        .sidebar-hover:hover { background-color: rgba(255,255,255,0.07); }
        .topbar-bg { background: #ffffff; border-bottom: 1px solid #E5E7EB; }
        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ─── SIDEBAR DESKTOP ─── */}
      <aside className={`sidebar-bg hidden md:flex flex-col fixed h-full z-30 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
          <img src={LOGO_URL} alt="APSIS" className="w-9 h-9 object-contain flex-shrink-0 rounded" />
          {!collapsed && (
            <div>
              <p className="text-white text-[13px] font-bold leading-tight tracking-wide">Portal APSIS</p>
              {userDepartamento
                ? <p className="text-white/40 text-[10px] font-medium tracking-widest uppercase truncate max-w-[140px]">{userDepartamento}</p>
                : <p className="text-white/40 text-[10px] font-medium tracking-widest">TAX & ACCOUNTING</p>
              }
            </div>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-14 w-6 h-6 rounded-full bg-[#F47920] flex items-center justify-center shadow-md z-10"
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3 text-white" />
            : <ChevronLeft className="w-3 h-3 text-white" />
          }
        </button>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 pt-5 pb-2">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded tracking-widest uppercase ${isAdmin ? 'bg-white/10 text-white/70' : 'bg-emerald-500/20 text-emerald-300'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-white/60' : 'bg-emerald-400'}`} />
              {isAdmin ? 'Equipe' : 'Cliente'}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className={`flex-1 py-3 ${collapsed ? 'px-2' : 'px-3'} space-y-0.5`}>
          {navItems.map(({ label, page, icon: Icon, children: subItems }) => {
            const isActive = currentPageName === page;
            const hasChildren = subItems && subItems.length > 0;
            const isGroupActive = hasChildren && subItems.some(s => s.page === currentPageName);
            const submenuOpen = openSubmenus[label] ?? isGroupActive;

            if (hasChildren) {
              return (
                <div key={label}>
                  <button
                    onClick={() => !collapsed && toggleSubmenu(label)}
                    title={collapsed ? label : undefined}
                    className={`sidebar-hover w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${isGroupActive ? 'sidebar-active text-white' : 'text-white/60'}`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isGroupActive ? 'text-[#F47920]' : 'text-white/50'}`} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{label}</span>
                        <ChevronRight className={`w-3 h-3 text-white/30 transition-transform ${submenuOpen ? 'rotate-90' : ''}`} />
                      </>
                    )}
                  </button>
                  {!collapsed && submenuOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                      {subItems.map(({ label: subLabel, page: subPage, icon: SubIcon }) => {
                        const subActive = currentPageName === subPage;
                        return (
                          <Link key={subPage} to={createPageUrl(subPage)}
                            className={`sidebar-hover flex items-center gap-2 px-2 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 ${subActive ? 'sidebar-active text-white' : 'text-white/50'}`}>
                            <SubIcon className={`w-3.5 h-3.5 ${subActive ? 'text-[#F47920]' : 'text-white/40'}`} />
                            {subLabel}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={page}
                to={createPageUrl(page)}
                title={collapsed ? label : undefined}
                className={`sidebar-hover flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${isActive ? 'sidebar-active text-white' : 'text-white/60'}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#F47920]' : 'text-white/50'}`} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-3">
          {user && (
            <div className={`flex items-center gap-2.5 p-2 rounded-lg sidebar-hover group cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-[#F47920] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[11px] font-bold">{user.full_name?.[0] || user.email?.[0] || 'U'}</span>
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-white/90 truncate">{user.full_name || 'Usuário'}</p>
                    <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                  </div>
                  <button onClick={() => base44.auth.logout()} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <LogOut className="w-3.5 h-3.5 text-white/40 hover:text-red-400 transition-colors" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ─── MOBILE HEADER ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#1A4731] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={LOGO_URL} alt="APSIS" className="w-8 h-8 object-contain rounded" />
          <span className="font-bold text-[14px] text-white">Portal APSIS</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-lg bg-white/10 text-white">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-14 left-0 w-64 h-full bg-[#1A4731] p-4" onClick={e => e.stopPropagation()}>
            <nav className="space-y-1 mt-4">
              {navItems.map(({ label, page, icon: Icon, children: subItems }) => {
                const isActive = currentPageName === page;
                const hasChildren = subItems && subItems.length > 0;
                const isGroupActive = hasChildren && subItems.some(s => s.page === currentPageName);
                const submenuOpen = openSubmenus[label] ?? isGroupActive;

                if (hasChildren) {
                  return (
                    <div key={label}>
                      <button onClick={() => toggleSubmenu(label)}
                        className={`sidebar-hover w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium ${isGroupActive ? 'sidebar-active text-white' : 'text-white/60'}`}>
                        <Icon className={`w-4 h-4 ${isGroupActive ? 'text-[#F47920]' : 'text-white/50'}`} />
                        <span className="flex-1 text-left">{label}</span>
                        <ChevronRight className={`w-3 h-3 text-white/30 transition-transform ${submenuOpen ? 'rotate-90' : ''}`} />
                      </button>
                      {submenuOpen && (
                        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                          {subItems.map(({ label: subLabel, page: subPage, icon: SubIcon }) => {
                            const subActive = currentPageName === subPage;
                            return (
                              <Link key={subPage} to={createPageUrl(subPage)} onClick={() => setMobileOpen(false)}
                                className={`sidebar-hover flex items-center gap-2 px-2 py-2 rounded-lg text-[13px] font-medium ${subActive ? 'sidebar-active text-white' : 'text-white/50'}`}>
                                <SubIcon className={`w-3.5 h-3.5 ${subActive ? 'text-[#F47920]' : 'text-white/40'}`} />
                                {subLabel}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link key={page} to={createPageUrl(page)} onClick={() => setMobileOpen(false)}
                    className={`sidebar-hover flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium ${isActive ? 'sidebar-active text-white' : 'text-white/60'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F47920]' : 'text-white/50'}`} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ─── MAIN ─── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'md:ml-16' : 'md:ml-60'} pt-14 md:pt-0`}>

        {/* Top bar */}
        <header className="topbar-bg hidden md:flex items-center justify-between px-8 py-4 flex-shrink-0">
          <div>
            <h1 className="text-[18px] font-bold text-gray-900">{pageLabel}</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">Portal APSIS · Tax &amp; Accounting Advisory</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F47920] rounded-full" />
            </button>
            {user && (
              <div className="w-9 h-9 rounded-full bg-[#1A4731] flex items-center justify-center">
                <span className="text-white text-[13px] font-bold">{user.full_name?.[0] || user.email?.[0] || 'U'}</span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-8 py-6 fade-in">
          {children}
        </main>
      </div>

      {/* Assistente APSIS — widget flutuante global */}
      <AssistantWidget currentPageName={currentPageName} />
    </div>
  );
}