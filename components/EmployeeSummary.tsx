import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Clock, Users, Award, TrendingUp, CheckCircle2 } from 'lucide-react';

export function EmployeeSummary() {
  const { t } = useLanguage();

  const summaryData = {
    individualTime: 7.5,
    withPairTime: 6.8,
    totalShift: 8,
    reliabilityScore: 94,
    badge: 'Gold',
    verificationsCompleted: 8,
    verificationsTotal: 8,
  };

  const individualPercentage = (summaryData.individualTime / summaryData.totalShift) * 100;
  const withPairPercentage = (summaryData.withPairTime / summaryData.totalShift) * 100;

  return (
    <div className="space-y-4 pb-20 max-w-[390px] mx-auto">
      <div>
        <h2>{t('employee.summary')}</h2>
        <p className="text-sm text-muted-foreground">Rapport de présence d'aujourd'hui</p>
      </div>

      {/* Time Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
                <Clock className="size-4 text-[#f59e0b]" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{summaryData.individualTime}h</div>
            <p className="text-xs text-muted-foreground">Temps individuel</p>
            <Progress value={individualPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                <Users className="size-4 text-[#10b981]" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{summaryData.withPairTime}h</div>
            <p className="text-xs text-muted-foreground">Avec binôme</p>
            <Progress value={withPairPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Reliability Score - Prominent */}
      <Card className="shadow-sm border-2 border-[#10b981]/20 bg-gradient-to-br from-white to-[#10b981]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="size-5 text-[#10b981]" />
            {t('employee.summary.score')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10b981"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - summaryData.reliabilityScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute">
                <div className="text-4xl font-bold text-[#10b981]">{summaryData.reliabilityScore}%</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {summaryData.verificationsCompleted}/{summaryData.verificationsTotal} vérifications complétées
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Badge */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="size-5 text-[#f59e0b]" />
            {t('employee.summary.badge')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center shadow-xl ring-8 ring-[#f59e0b]/20">
                <Award className="size-14 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-[#f59e0b] flex items-center justify-center">
                <span className="text-xs font-bold">★</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white rounded-lg shadow-lg font-bold">
              <Award className="size-4" />
              {summaryData.badge}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Excellente fiabilité de présence !
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Verification History */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Historique de Vérification</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {[
              { time: '08:00', method: 'Faciale', status: 'verified' },
              { time: '09:30', method: 'Faciale', status: 'verified' },
              { time: '11:00', method: 'Question', status: 'verified' },
              { time: '12:30', method: 'Faciale', status: 'verified' },
              { time: '14:00', method: 'Faciale', status: 'verified' },
            ].map((verification, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                    <CheckCircle2 className="size-5 text-[#10b981]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{verification.time}</p>
                    <p className="text-xs text-muted-foreground">{verification.method}</p>
                  </div>
                </div>
                <Badge className="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20 hover:bg-[#10b981]/20">
                  {t('status.verified')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}