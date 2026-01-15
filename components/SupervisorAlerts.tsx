import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, AlertTriangle, Info, MapPin, Brain } from 'lucide-react';

interface Alert {
  id: string;
  employee: string;
  site: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  timestamp: string;
  description: string;
}

export function SupervisorAlerts() {
  const { t } = useLanguage();

  const alerts: Alert[] = [
    {
      id: '1',
      employee: 'Jean Dupont',
      site: 'Site Alpha',
      type: 'GPS trop stable',
      severity: 'high',
      confidence: 85,
      timestamp: '14:32',
      description: 'Position GPS identique pendant 45 minutes',
    },
    {
      id: '2',
      employee: 'Pierre Bernard',
      site: 'Site Beta',
      type: 'Présence sans binôme',
      severity: 'medium',
      confidence: 72,
      timestamp: '13:15',
      description: 'Binôme absent depuis plus de 2 heures',
    },
    {
      id: '3',
      employee: 'Marie Martin',
      site: 'Site Alpha',
      type: 'Authentification tardive',
      severity: 'low',
      confidence: 65,
      timestamp: '12:05',
      description: 'Vérification complétée avec 5 min de retard',
    },
    {
      id: '4',
      employee: 'Thomas Petit',
      site: 'Site Beta',
      type: 'Selfies identiques',
      severity: 'high',
      confidence: 92,
      timestamp: '11:30',
      description: 'Similarité > 95% entre 3 vérifications',
    },
  ];

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          icon: <AlertCircle className="size-6 text-[#ef4444]" />,
          bgColor: 'bg-[#ef4444]/10',
          textColor: 'text-[#ef4444]',
          borderColor: 'border-[#ef4444]/20',
          badgeClass: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30',
          label: 'ÉLEVÉE',
        };
      case 'medium':
        return {
          icon: <AlertTriangle className="size-6 text-[#f59e0b]" />,
          bgColor: 'bg-[#f59e0b]/10',
          textColor: 'text-[#f59e0b]',
          borderColor: 'border-[#f59e0b]/20',
          badgeClass: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30',
          label: 'MOYENNE',
        };
      default:
        return {
          icon: <Info className="size-6 text-[#10b981]" />,
          bgColor: 'bg-[#10b981]/10',
          textColor: 'text-[#10b981]',
          borderColor: 'border-[#10b981]/20',
          badgeClass: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30',
          label: 'FAIBLE',
        };
    }
  };

  const highAlerts = alerts.filter(a => a.severity === 'high').length;
  const mediumAlerts = alerts.filter(a => a.severity === 'medium').length;

  return (
    <div className="space-y-4 pb-20">
      <div>
        <h2>{t('supervisor.monitoring.alerts')}</h2>
        <p className="text-sm text-muted-foreground">{alerts.length} alertes actives</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-sm border-2 border-[#ef4444]/20">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-[#ef4444]">{highAlerts}</div>
            <p className="text-xs text-muted-foreground font-semibold">Élevées</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-2 border-[#f59e0b]/20">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-[#f59e0b]">{mediumAlerts}</div>
            <p className="text-xs text-muted-foreground font-semibold">Moyennes</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-2 border-[#10b981]/20">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-[#10b981]">{alerts.length - highAlerts - mediumAlerts}</div>
            <p className="text-xs text-muted-foreground font-semibold">Faibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = getSeverityConfig(alert.severity);
          
          return (
            <Card key={alert.id} className={`shadow-sm border-2 ${config.borderColor}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-bold">{alert.employee}</h4>
                      <Badge className={`${config.badgeClass} border font-bold text-xs`}>
                        {config.label}
                      </Badge>
                    </div>
                    
                    <p className={`text-sm font-semibold mb-2 ${config.textColor}`}>
                      {alert.type}
                    </p>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center gap-3 flex-wrap text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{alert.site}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="size-3 text-muted-foreground" />
                        <span className="font-semibold">{alert.confidence}% {t('ai.score')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Il y a {alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}