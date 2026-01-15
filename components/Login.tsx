import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Logo } from './Logo';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const { t } = useLanguage();
  const { login, allUsers } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'credentials' | 'security'>('credentials');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [tempUser, setTempUser] = useState<any>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find user by email to check security question
    const user = allUsers.find(u => u.email === email);
    
    if (!user) {
      toast.error(t('error'));
      return;
    }
    
    // Check password (in real app, this would be server-side)
    if (password !== 'password' && password !== user.employeeId) {
      toast.error(t('error'));
      return;
    }
    
    // If user has a security question, go to security step
    if (user.securityQuestion && user.securityAnswer) {
      setTempUser(user);
      setStep('security');
    } else {
      // No security question, login directly
      try {
        await login(email, password);
        toast.success(t('success'));
      } catch (error) {
        toast.error(t('error'));
      }
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tempUser) {
      toast.error(t('error'));
      return;
    }
    
    // Verify security answer
    if (securityAnswer.toLowerCase().trim() === tempUser.securityAnswer.toLowerCase().trim()) {
      try {
        await login(email, password);
        toast.success(t('success'));
      } catch (error) {
        toast.error(t('error'));
      }
    } else {
      toast.error('Réponse incorrecte');
      setSecurityAnswer('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white max-w-[390px] mx-auto relative overflow-hidden">
      {/* Abstract background design - Working together theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left - Red circles representing workers */}
        <div className="absolute top-8 left-4 w-20 h-20 rounded-full bg-gradient-to-br from-[#ef4444]/10 to-[#ef4444]/5 blur-sm"></div>
        <div className="absolute top-12 left-12 w-16 h-16 rounded-full bg-[#ef4444]/5"></div>
        
        {/* Top right - Green circles representing workers */}
        <div className="absolute top-16 right-8 w-24 h-24 rounded-full bg-gradient-to-bl from-[#10b981]/10 to-[#10b981]/5 blur-sm"></div>
        <div className="absolute top-20 right-16 w-16 h-16 rounded-full bg-[#10b981]/5"></div>
        
        {/* Bottom left - Yellow connecting elements */}
        <div className="absolute bottom-20 left-8 w-28 h-28 rounded-full bg-gradient-to-tr from-[#f59e0b]/10 to-[#f59e0b]/5 blur-md"></div>
        <div className="absolute bottom-32 left-16 w-20 h-20 rounded-full bg-[#f59e0b]/5"></div>
        
        {/* Bottom right - Mixed collaborative shapes */}
        <div className="absolute bottom-16 right-12 w-24 h-24 rounded-full bg-gradient-to-tl from-[#10b981]/8 to-transparent blur-sm"></div>
        <div className="absolute bottom-40 right-4 w-20 h-20 rounded-full bg-gradient-to-bl from-[#ef4444]/8 to-transparent blur-sm"></div>
        
        {/* Connecting lines suggesting collaboration */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 390 844" preserveAspectRatio="none">
          {/* Lines connecting workers - collaboration theme */}
          <line x1="50" y1="100" x2="340" y2="120" stroke="#ef4444" strokeWidth="2" />
          <line x1="50" y1="100" x2="100" y2="700" stroke="#f59e0b" strokeWidth="2" />
          <line x1="340" y1="120" x2="100" y2="700" stroke="#10b981" strokeWidth="2" />
          <line x1="340" y1="120" x2="320" y2="650" stroke="#10b981" strokeWidth="1.5" />
          <line x1="100" y1="700" x2="320" y2="650" stroke="#f59e0b" strokeWidth="1.5" />
          
          {/* Additional network pattern */}
          <circle cx="50" cy="100" r="4" fill="#ef4444" opacity="0.4" />
          <circle cx="340" cy="120" r="4" fill="#10b981" opacity="0.4" />
          <circle cx="100" cy="700" r="4" fill="#f59e0b" opacity="0.4" />
          <circle cx="320" cy="650" r="4" fill="#10b981" opacity="0.4" />
        </svg>
        
        {/* Subtle geometric patterns */}
        <div className="absolute top-1/3 left-6 w-12 h-12 border-2 border-[#ef4444]/10 rotate-45 rounded-lg"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 border-2 border-[#10b981]/10 -rotate-12 rounded-lg"></div>
        <div className="absolute bottom-1/3 left-1/2 w-14 h-14 border-2 border-[#f59e0b]/10 rotate-12 rounded-lg"></div>
      </div>
      
      <Card className="w-full shadow-lg border-2 relative z-10 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          {/* Logo Section */}
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={false} />
          </div>
          
          {/* App Name */}
          <CardTitle className="text-3xl font-bold mb-2">Two Workers</CardTitle>
          <CardDescription className="text-sm">{t('auth.login')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === 'credentials' ? handleCredentialsSubmit : handleSecuritySubmit} className="space-y-4">
            {step === 'credentials' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('register.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('register.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
              </>
            )}

            {step === 'security' && (
              <>
                <div className="p-3 bg-[#10b981]/10 rounded-lg border border-[#10b981]/20 mb-4">
                  <p className="text-sm text-[#10b981] font-medium text-center">
                    ✓ Identifiants vérifiés
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="securityAnswer" className="font-medium">{tempUser?.securityQuestion}</Label>
                  <Input
                    id="securityAnswer"
                    type="text"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Votre réponse"
                    className="h-11"
                    required
                    autoFocus
                  />
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep('credentials');
                    setSecurityAnswer('');
                    setTempUser(null);
                  }}
                  className="text-sm text-muted-foreground"
                >
                  ← Retour
                </Button>
              </>
            )}

            <Button type="submit" className="w-full h-11 bg-[#10b981] hover:bg-[#059669]">
              {step === 'security' ? 'Vérifier' : t('auth.login')}
            </Button>
            
            {step === 'credentials' && (
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-2"
                onClick={onSwitchToRegister}
              >
                {t('auth.register')}
              </Button>
            )}
          </form>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Comptes de démo:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Employé:</strong> jean.dupont@company.com</p>
              <p><strong>Superviseur:</strong> pierre.bernard@company.com</p>
              <p><strong>Admin:</strong> admin@company.com</p>
              <p className="text-muted-foreground italic mt-2">Mot de passe: password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}