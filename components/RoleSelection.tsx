import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Users, UserCog, Building2 } from 'lucide-react';
import { BackgroundDesign } from './BackgroundDesign';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const { t } = useLanguage();

  const roles: { role: UserRole; icon: typeof Users; label: string; color: string; bgColor: string }[] = [
    { role: 'employee', icon: Users, label: t('auth.employee'), color: 'text-[#10b981]', bgColor: 'bg-[#10b981]' },
    { role: 'supervisor', icon: UserCog, label: t('auth.supervisor'), color: 'text-[#f59e0b]', bgColor: 'bg-[#f59e0b]' },
    { role: 'admin', icon: Building2, label: t('auth.admin'), color: 'text-[#ef4444]', bgColor: 'bg-[#ef4444]' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white max-w-[390px] mx-auto relative overflow-hidden">
      <BackgroundDesign />
      
      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="mb-2">Two Workers</h1>
          <p className="text-muted-foreground">{t('auth.selectRole')}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {roles.map(({ role, icon: Icon, label, color, bgColor }) => (
            <Card
              key={role}
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm border-2"
              onClick={() => onSelectRole(role)}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 w-16 h-16 rounded-full ${bgColor}/10 flex items-center justify-center`}>
                  <Icon className={`size-8 ${color}`} />
                </div>
                <CardTitle>{label}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button className={`w-full ${bgColor} hover:opacity-90`}>{t('auth.register')}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}