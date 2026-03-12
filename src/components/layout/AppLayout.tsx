import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAlertNotifications } from '@/hooks/useAlertNotifications';
import { useAdmin } from '@/hooks/useAdmin';
import { useIsMobile } from '@/hooks/use-mobile';
import AutoPilotIndicator from '@/components/AutoPilotIndicator';
import { GamificationHeader } from '@/components/gamification';
import ThemeToggle from '@/components/common/ThemeToggle';
import EliteSupportChat from '@/components/support/EliteSupportChat';
import { InspiredFooter } from '@/components/layout/InspiredFooter';
import InstallPWAButton from '@/components/pwa/InstallPWAButton';
import {
  LayoutDashboard,
  Radar,
  Bell,
  MessageSquare,
  BookOpen,
  LogOut,
  Zap,
  Crown,
  Globe,
  Shield,
  Menu,
  X,
  User,
  Users,
  Circle,
  Crosshair,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const AppLayout = () => {
  const { user, profile, isPro, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enable real-time alert notifications
  useAlertNotifications();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const toggleLanguage = () => {
    if (language === 'pt') setLanguage('en');
    else if (language === 'en') setLanguage('es');
    else setLanguage('pt');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard') as string },
    { to: '/radar', icon: Radar, label: t('radar') as string },
    { to: '/swing', icon: Zap, label: 'Trade Master' },
    { to: '/sniper', icon: Crosshair, label: 'Sniper Pro' },
    { to: '/alerts', icon: Bell, label: t('alerts') as string },
    { to: '/biblioteca/trade-master-pro', icon: BookOpen, label: 'Trade Master Pro' },
    { to: '/chat', icon: MessageSquare, label: t('chat') as string },
    { to: '/bubbles', icon: Circle, label: 'Bubble Gem' },
    { to: '/gem-hunter', icon: Flame, label: 'Gem Hunter', isBeta: true },
    { to: '/community', icon: Users, label: 'Comunidade' },
    { to: '/library', icon: BookOpen, label: t('library') as string },
    { to: '/autopilot', icon: Zap, label: 'AutoPilot Bot', isBeta: true },
    ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Admin' }] : []),
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-gradient">
          💎 {t('appName')}
        </h1>
        {isPro && (
          <div className="mt-1 flex items-center gap-1 text-accent text-xs">
            <Crown className="w-3 h-3" />
            <span>PRO</span>
          </div>
        )}
      </div>

      {/* Gamification Card - Desktop */}
      <div
        onClick={() => {
          navigate('/profile');
          setMobileMenuOpen(false);
        }}
        className="mx-2 mt-2 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 cursor-pointer hover:border-primary/40 transition-all"
      >
        <GamificationHeader />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm',
                'hover:bg-sidebar-accent text-sidebar-foreground',
                isActive && 'bg-sidebar-accent text-sidebar-primary glow-primary'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="font-medium">{item.label}</span>
            {'isBeta' in item && item.isBeta && (
              <span className="ml-auto text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                BETA
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {!isPro && (
          <Button
            onClick={() => {
              navigate('/upgrade');
              setMobileMenuOpen(false);
            }}
            size="sm"
            className="w-full bg-gradient-to-r from-primary to-info hover:opacity-90 text-xs"
          >
            <Crown className="w-3 h-3 mr-1" />
            {t('upgradeToPro')}
          </Button>
        )}

        <AutoPilotIndicator />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <InstallPWAButton variant="icon" />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
          >
            <Globe className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground uppercase">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2 px-1 py-1.5">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {profile?.email || user?.email}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {isPro ? t('proPlan') : t('freePlan')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border h-12 flex items-center justify-between px-3">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0 bg-sidebar border-sidebar-border">
              <div className="flex flex-col h-full">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-sm font-bold text-gradient">
            💎 {t('appName')}
          </h1>

          <GamificationHeader compact />
        </header>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
          <SidebarContent />
        </aside>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-auto overflow-x-hidden",
        isMobile && "pt-12" // Account for mobile header
      )}>
        <div className={cn(
          isMobile ? "p-3 pb-8" : "p-6 pb-12"
        )}>
          <Outlet />
        </div>
        
        {/* Global Premium Footer */}
        <InspiredFooter />
      </main>

      {/* Elite AI Support Chat Widget */}
      <EliteSupportChat />
    </div>
  );
};

export default AppLayout;
