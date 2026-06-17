import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, FileText, Users, Building2,
  Settings, LogOut, Bell, Search, Menu, X, Home
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', to: '/home' },
  { icon: FileText, label: 'Fichas', to: '/fichas' },
  { icon: Building2, label: 'UBS/Agendas', to: '/ubs' },
  { icon: Users, label: 'Perfil', to: '/profile' },
  { icon: Settings, label: 'Configurações', to: '/change-password' },
];

export function AppShell({ title, subtitle, actions, children, eyebrow = 'Painel' }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user?.nome_completo) return 'U';
    return user.nome_completo
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          {/* Logo e Menu Mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg border md:hidden hover:bg-secondary"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/home" className="font-bold text-xl hidden sm:block" style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              UniFicha
            </Link>
          </div>

          {/* Search Desktop */}
          <div className="hidden md:flex flex-1 items-center gap-2 rounded-full border bg-secondary px-4 py-2 text-sm text-muted-foreground">
            <Search className="w-4 h-4" />
            <input
              placeholder="Buscar fichas, agendas..."
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground/80"
            />
          </div>

          {/* Right Actions */}
          <div className="flex-1 md:flex-none" />
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full border hover:bg-secondary relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border hover:bg-secondary cursor-pointer" onClick={() => navigate('/profile')}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white text-center"
                style={{ background: 'var(--gradient-brand)' }}
                title={user?.nome_completo}
              >
                {getInitials()}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{user?.nome_completo?.split(' ')[0]}</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full border hover:bg-secondary text-muted-foreground hover:text-foreground"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl grid gap-6 px-4 sm:px-6 py-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block sticky top-20 h-fit rounded-2xl border bg-card p-3 shadow-[var(--shadow-card)]`}>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0">
          {/* Page Header */}
          <div className="mb-6">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                {eyebrow}
              </p>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div className="flex gap-2">{actions}</div>}
            </div>
          </div>

          {/* Page Content */}
          <div className="space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
