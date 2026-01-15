import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BiometricCapture } from './BiometricCapture';
import { BackgroundDesign } from './BackgroundDesign';
import { toast } from 'sonner@2.0.3';

// Predefined security questions
const SECURITY_QUESTIONS = [
  { value: 'pet', label: { fr: 'Quel est le nom de votre premier animal ?', en: 'What is your first pet\'s name?' } },
  { value: 'city', label: { fr: 'Dans quelle ville êtes-vous né(e) ?', en: 'In which city were you born?' } },
  { value: 'school', label: { fr: 'Quel était le nom de votre école primaire ?', en: 'What was the name of your elementary school?' } },
  { value: 'friend', label: { fr: 'Quel est le prénom de votre meilleur(e) ami(e) d\'enfance ?', en: 'What is your childhood best friend\'s first name?' } },
  { value: 'food', label: { fr: 'Quel est votre plat préféré ?', en: 'What is your favorite dish?' } },
  { value: 'book', label: { fr: 'Quel est le titre de votre livre préféré ?', en: 'What is your favorite book title?' } },
];

export function EmployeeRegistration() {
  const { t, language } = useLanguage();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    company: '',
    email: '',
    password: '',
    securityQuestion: '',
    securityAnswer: '',
  });
  
  const [consents, setConsents] = useState({
    geolocation: false,
    biometric: false,
    privacy: false,
  });
  
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const handleBiometricCapture = () => {
    setPhotoCaptured(true);
    toast.success(t('register.photoSuccess'));
  };

  const handleBiometricRetake = () => {
    setPhotoCaptured(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photoCaptured) {
      toast.error('Please capture your biometric photo');
      return;
    }
    
    if (!consents.geolocation || !consents.biometric || !consents.privacy) {
      toast.error('Please accept all required consents');
      return;
    }
    
    // Find the full question text based on the selected value
    const selectedQuestionObj = SECURITY_QUESTIONS.find(q => q.value === formData.securityQuestion);
    const fullQuestionText = selectedQuestionObj ? selectedQuestionObj.label[language] : formData.securityQuestion;
    
    try {
      await register({
        ...formData,
        securityQuestion: fullQuestionText, // Store the full question text
        role: 'employee',
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
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t('register.title')}</CardTitle>
            <CardDescription>{t('auth.employee')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Biometric Enrollment */}
              <div className="space-y-4 border-t pt-6">
                <div>
                  <h3>{t('register.biometric')}</h3>
                  <p className="text-muted-foreground">{t('register.biometric.desc')}</p>
                </div>
                
                <BiometricCapture 
                  onCapture={handleBiometricCapture}
                  onRetake={handleBiometricRetake}
                />
              </div>

              {/* Personal Security Question */}
              <div className="space-y-4 border-t pt-6">
                <div>
                  <h3>{t('register.personalQuestion')}</h3>
                  <p className="text-muted-foreground">{t('register.personalQuestion.desc')}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question">{t('register.question')}</Label>
                  <Select
                    value={formData.securityQuestion}
                    onValueChange={(value) => setFormData({ ...formData, securityQuestion: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('register.selectQuestion')}>
                        {formData.securityQuestion && 
                          SECURITY_QUESTIONS.find(q => q.value === formData.securityQuestion)?.label[language]
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {SECURITY_QUESTIONS.map((question) => (
                        <SelectItem key={question.value} value={question.value}>
                          {question.label[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="answer">{t('register.answer')}</Label>
                  <Input
                    id="answer"
                    value={formData.securityAnswer}
                    onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Consents */}
              <div className="space-y-4 border-t pt-6">
                <h3>{t('register.consent.title')}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consent-geo"
                      checked={consents.geolocation}
                      onCheckedChange={(checked) =>
                        setConsents({ ...consents, geolocation: checked as boolean })
                      }
                    />
                    <label htmlFor="consent-geo" className="cursor-pointer">
                      {t('register.consent.geo')}
                    </label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consent-bio"
                      checked={consents.biometric}
                      onCheckedChange={(checked) =>
                        setConsents({ ...consents, biometric: checked as boolean })
                      }
                    />
                    <label htmlFor="consent-bio" className="cursor-pointer">
                      {t('register.consent.biometric')}
                    </label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consent-privacy"
                      checked={consents.privacy}
                      onCheckedChange={(checked) =>
                        setConsents({ ...consents, privacy: checked as boolean })
                      }
                    />
                    <label htmlFor="consent-privacy" className="cursor-pointer">
                      {t('register.consent.privacy')}
                    </label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {t('register.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}