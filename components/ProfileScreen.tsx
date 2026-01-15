import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, Mail, Building2, Shield, Languages, LogOut } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export function ProfileScreen() {
  const { t, language } = useLanguage();
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="space-y-6 pb-20 max-w-[390px] mx-auto">
      <div>
        <h2>{t('nav.profile')}</h2>
        <p className="text-muted-foreground">Your account information</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="size-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3>{currentUser.firstName} {currentUser.lastName}</h3>
              <p className="text-sm text-muted-foreground">{currentUser.employeeId}</p>
              <Badge className="mt-2" variant="outline">
                {t(`auth.${currentUser.role}`)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 py-2">
            <Mail className="size-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t('register.email')}</p>
              <p className="font-medium">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <Building2 className="size-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t('register.company')}</p>
              <p className="font-medium">{currentUser.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <Shield className="size-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t('admin.users.role')}</p>
              <p className="font-medium">{t(`auth.${currentUser.role}`)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="size-5" />
            {t('language')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Français' : 'English'}
            </p>
            <LanguageSwitcher />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      {currentUser.role === 'employee' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('privacy.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('privacy.noDataOutsideHours')}
            </p>
            <Button variant="outline" className="w-full">
              {t('privacy.viewHistory')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Logout */}
      <Button 
        variant="outline" 
        className="w-full border-destructive text-destructive hover:bg-destructive/10"
        onClick={logout}
      >
        <LogOut className="size-4 mr-2" />
        {t('auth.logout')}
      </Button>
    </div>
  );
}