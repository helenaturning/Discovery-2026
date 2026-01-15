import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Shield, Building2 } from 'lucide-react';
import { BackgroundDesign } from './BackgroundDesign';
import { toast } from 'sonner@2.0.3';

export function SupervisorRegistration() {
  const { t } = useLanguage();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    company: '',
    email: '',
    password: '',
    department: '',
    supervisorCode: '',
  });
  
  const [consents, setConsents] = useState({
    privacy: false,
    responsibility: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consents.privacy || !consents.responsibility) {
      toast.error('Please accept all required consents');
      return;
    }
    
    try {
      await register({
        ...formData,
        role: 'supervisor',
        consents,
      });
      toast.success(t('success'));
    } catch (error) {
      toast.error(t('error'));
    }
  };

  return (
    <div className="min-h-screen p-4 bg-white max-w-[390px] mx-auto relative overflow-hidden">
      <BackgroundDesign />
      <div className="max-w-2xl mx-auto py-8 relative z-10">
        <Card className="shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-br from-[#f59e0b]/5 to-transparent">
            <div className="w-14 h-14 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mb-4">
              <Shield className="size-7 text-[#f59e0b]" />
            </div>
            <CardTitle className="text-2xl">{t('register.title')}</CardTitle>
            <CardDescription className="text-base">{t('auth.supervisor')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Informations Personnelles
                  </p>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('register.firstName')}</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('register.lastName')}</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('register.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('register.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Informations Professionnelles
                  </p>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">{t('register.employeeId')}</Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">{t('register.company')}</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Ex: Operations, Sécurité..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisorCode">Code Superviseur</Label>
                  <Input
                    id="supervisorCode"
                    value={formData.supervisorCode}
                    onChange={(e) => setFormData({ ...formData, supervisorCode: e.target.value })}
                    placeholder="Code fourni par l'administrateur"
                    required
                  />
                </div>
              </div>

              {/* Consents */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Consentements
                  </p>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <Card className="bg-muted/50 border-2">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="privacy"
                        checked={consents.privacy}
                        onCheckedChange={(checked) => 
                          setConsents({ ...consents, privacy: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <label htmlFor="privacy" className="text-sm cursor-pointer">
                          <span className="font-semibold">Politique de confidentialité</span>
                          <p className="text-muted-foreground mt-1">
                            J'accepte la politique de confidentialité et le traitement de mes données personnelles.
                          </p>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="responsibility"
                        checked={consents.responsibility}
                        onCheckedChange={(checked) => 
                          setConsents({ ...consents, responsibility: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <label htmlFor="responsibility" className="text-sm cursor-pointer">
                          <span className="font-semibold">Responsabilité de supervision</span>
                          <p className="text-muted-foreground mt-1">
                            Je comprends mes responsabilités en tant que superviseur pour la gestion et le monitoring des employés.
                          </p>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#f59e0b] hover:bg-[#d97706]"
                  size="lg"
                >
                  <Shield className="size-5 mr-2" />
                  {t('register.submit')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}