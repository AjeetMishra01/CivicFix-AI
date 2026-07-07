import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useTheme from '../../hooks/useTheme';
import ThemeToggle from './ThemeToggle';
import { 
  Activity, Menu, X, LogOut, ChevronLeft, ChevronRight,
  LayoutDashboard, ClipboardList, ShieldAlert, BarChart3, 
  User, CheckSquare
} from 'lucide-react';

const DashboardLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' };
      case 'department':
        return { label: 'Dept Officer', color: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800' };
      default:
        return { label: 'Citizen', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' };
    }
  };

  const getNavItems = (role) => {
    switch (role) {
      case 'admin':
        return [
          { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} /> },
          { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} /> }
        ];
      case 'department':
        return [
          { label: 'Workspaces', path: '/department', icon: <CheckSquare size={18} /> }
        ];
      default:
        return [
          { label: 'Dashboard', path: '/citizen', icon: <LayoutDashboard size={18} /> },
          { label: 'My Complaints', path: '/citizen/my-complaints', icon: <ClipboardList size={18} /> }
        ];
    }
  };

  const menuItems = getNavItems(user?.role);
  const badge = getRoleBadge(user?.role);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex">
      
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 relative z-30 ${collapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Logo/Branding */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200/50 dark:border-slate-850 justify-between">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center shadow-md shrink-0">
              <Activity className="text-white" size={18} />
            </div>
            {!collapsed && (
              <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-brand-600 dark:from-white dark:to-brand-400 bg-clip-text text-transparent transition-opacity">
                CivicFix
              </span>
            )}
          </Link>
        </div>

        {/* User profile card */}
        <div className={`p-4 border-b border-slate-200/50 dark:border-slate-850 flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
          <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-850 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold shrink-0">
            {user?.fullName?.charAt(0) || <User size={18} />}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user?.fullName}</p>
              <span className={`inline-block text-[10px] font-extrabold uppercase border px-2 py-0.5 rounded-full mt-1 ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-155 group relative ${
                  active 
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-850'
                }`}
              >
                <span className={`transition-colors duration-150 ${active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-350'}`}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
                
                {/* Tooltip on collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-950 text-white text-2xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shadow-sm z-30"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Sign Out Section */}
        <div className="p-3 border-t border-slate-200/50 dark:border-slate-850">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header & Drawer */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-850 flex items-center justify-between px-4 md:px-8 relative z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile drawer toggle */}
            <button 
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-heading font-bold text-lg md:text-xl text-slate-800 dark:text-white truncate">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            
            {/* Logout shortcut on desktop */}
            <button 
              onClick={logout}
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 hover:text-red-500"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            ></div>

            {/* Menu container */}
            <div className="relative w-full max-w-xs bg-white dark:bg-slate-900 flex flex-col h-full z-10 shadow-2xl p-5 animate-fade-in-up">
              {/* Close Button */}
              <button 
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>

              {/* Brand logo */}
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center">
                  <Activity className="text-white" size={16} />
                </div>
                <span className="font-heading font-extrabold text-lg text-slate-800 dark:text-white">CivicFix</span>
              </div>

              {/* User details */}
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3 mb-6 bg-slate-50 dark:bg-slate-950">
                <div className="h-10 w-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-400 font-bold shrink-0">
                  {user?.fullName?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.fullName}</p>
                  <span className={`inline-block text-[9px] font-extrabold uppercase border px-2 py-0.5 rounded-full mt-1.5 ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Navigation items */}
              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => { setMobileOpen(false); navigate(item.path); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                        active 
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span className={active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Logout button at bottom */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-auto">
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all duration-150"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
