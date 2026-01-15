import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Home, Map, BarChart3, User, MapPin, Users, AlertCircle, Settings, Building2 } from 'lucide-react';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function MobileNav({ currentView, onNavigate }: MobileNavProps) {
  const { t } = useLanguage();
  const { currentUser } = useAuth();

  const employeeNav = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'map', icon: Map, label: t('nav.map') },
    { id: 'profile', icon: User, label: t('nav.profile') },
  ];

  const supervisorNav = [
    { id: 'dashboard', icon: Home, label: t('nav.dashboard') },
    { id: 'sites', icon: MapPin, label: t('nav.sites') },
    { id: 'pairs', icon: Users, label: t('nav.pairs') },
    { id: 'alerts', icon: AlertCircle, label: t('nav.alerts') },
    { id: 'profile', icon: User, label: t('nav.profile') },
  ];

  const adminNav = [
    { id: 'dashboard', icon: Home, label: t('nav.dashboard') },
    { id: 'users', icon: Users, label: t('nav.users') },
    { id: 'sites', icon: MapPin, label: t('nav.sites') },
    { id: 'pairs', icon: Building2, label: t('nav.pairs') },
    { id: 'settings', icon: Settings, label: t('nav.settings') },
    { id: 'profile', icon: User, label: t('nav.profile') },
  ];

  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'employee':
        return employeeNav;
      case 'supervisor':
        return supervisorNav;
      case 'admin':
        return adminNav;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50 shadow-lg max-w-[390px] mx-auto">
      <div className={`grid ${
        navItems.length === 3 ? 'grid-cols-3' :
        navItems.length === 4 ? 'grid-cols-4' :
        navItems.length === 5 ? 'grid-cols-5' :
        'grid-cols-6'
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center gap-1 h-16 rounded-none border-t-2 transition-all ${
                isActive 
                  ? 'text-[#10b981] border-t-[#10b981] bg-[#10b981]/5' 
                  : 'text-muted-foreground border-t-transparent hover:text-foreground hover:bg-muted/50'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className={`size-5 ${isActive ? 'fill-[#10b981]/20' : ''}`} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}