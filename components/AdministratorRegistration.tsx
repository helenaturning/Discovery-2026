import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ShieldCheck, Crown } from 'lucide-react';
import { BackgroundDesign } from './BackgroundDesign';
import { toast } from 'sonner@2.0.3';

export function AdministratorRegistration() {
  const { t } = useLanguage();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    company: '',
    email: '',
    password: '',
    adminCode: '',
    organizationId: '',
  });
  
  const [consents, setConsents] = useState({
    privacy: false,
    systemAccess: false,
    dataManagement: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consents.privacy || !consents.systemAccess || !consents.dataManagement) {
      toast.error('Please accept all required consents');
      return;
    }
    
    try {
      await register({
        ...formData,
        role: 'admin',
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
        <Card className="shadow-lg border-2 border-[#ef4444]/20 bg-white/95 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-br from-[#ef4444]/5 to-transparent">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ef4444] to-[#dc2626] flex items-center justify-center mb-4 shadow-lg">
              <Crown className="size-7 text-white" />
            </div>
            <CardTitle className="text-2xl">{t('register.title')}</CardTitle>
            <CardDescription className="text-base">{t('auth.admin')}</CardDescription>
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

              {/* Administrative Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Informations Administratives
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
                  <Label htmlFor="organizationId">ID Organisation</Label>
                  <Input
                    id="organizationId"
                    value={formData.organizationId}
                    onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                    placeholder="Ex: ORG-12345"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminCode">Code Administrateur</Label>
                  <Input
                    id="adminCode"
                    value={formData.adminCode}
                    onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                    placeholder="Code d'accès administrateur"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Ce code est fourni uniquement aux administrateurs autorisés de l'organisation.
                  </p>
                </div>
              </div>

              {/* Consents */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Consentements Requis
                  </p>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <Card className="bg-[#10b981]/5 border-2 border-[#10b981]/20">
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
                        id="systemAccess"
                        checked={consents.systemAccess}
                        onCheckedChange={(checked) => 
                          setConsents({ ...consents, systemAccess: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <label htmlFor="systemAccess" className="text-sm cursor-pointer">
                          <span className="font-semibold">Accès système complet</span>
                          <p className="text-muted-foreground mt-1">
                            Je comprends que j'aurai un accès complet à tous les modules du système et aux données de l'organisation.
                          </p>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="dataManagement"
                        checked={consents.dataManagement}
                        onCheckedChange={(checked) => 
                          setConsents({ ...consents, dataManagement: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <label htmlFor="dataManagement" className="text-sm cursor-pointer">
                          <span className="font-semibold">Responsabilité de gestion des données</span>
                          <p className="text-muted-foreground mt-1">
                            Je m'engage à gérer les données de l'organisation de manière responsable et conforme aux réglementations en vigueur (RGPD, etc.).
                          </p>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#f59e0b]/5 border-2 border-[#f59e0b]/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="size-5 text-[#f59e0b] mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-[#f59e0b] mb-1">Important</p>
                        <p className="text-muted-foreground">
                          En tant qu'administrateur, vous aurez la responsabilité de gérer l'ensemble des utilisateurs, sites et paramètres du système. Assurez-vous de bien comprendre vos responsabilités avant de continuer.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857]"
                  size="lg"
                >
                  <Crown className="size-5 mr-2" />
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