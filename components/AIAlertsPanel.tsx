import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Users, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { AIAlert } from '../types';

interface AIAlertsPanelProps {
  searchQuery: string;
}

export function AIAlertsPanel({ searchQuery }: AIAlertsPanelProps) {
  const { t } = useLanguage();
  const { alerts, allUsers } = useAuth();

  const filteredAlerts = alerts.filter(alert => {
    const employee = allUsers.find(u => u.id === alert.employeeId);
    const searchLower = searchQuery.toLowerCase();
    return (
      employee?.firstName.toLowerCase().includes(searchLower) ||
      employee?.lastName.toLowerCase().includes(searchLower) ||
      alert.type.toLowerCase().includes(searchLower)
    );
  });

  const getAlertIcon = (type: AIAlert['type']) => {
    switch (type) {
      case 'gpsStable': return <MapPin className="size-5" />;
      case 'identicalSelfies': return <Camera className="size-5" />;
      case 'noPair': return <Users className="size-5" />;
      case 'unrealisticMovement': return <TrendingUp className="size-5" />;
      case 'lateAuth': return <Clock className="size-5" />;
    }
  };

  const getSeverityColor = (severity: AIAlert['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
    }
  };

  const getSeverityBorder = (severity: AIAlert['severity']) => {
    switch (severity) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-orange-500';
      case 'low': return 'border-l-4 border-yellow-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3>{t('supervisor.monitoring.alerts')}</h3>
          <p className="text-sm text-muted-foreground">
            {filteredAlerts.length} active alerts
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const employee = allUsers.find(u => u.id === alert.employeeId);
          
          return (
            <Card key={alert.id} className={getSeverityBorder(alert.severity)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full ${getSeverityColor(alert.severity)}/10 flex items-center justify-center flex-shrink-0`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {t(`ai.alert.${alert.type}`)}
                        </p>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {employee && (
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {employee.firstName[0]}{employee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground">
                          {employee.firstName} {employee.lastName} ({employee.employeeId})
                        </p>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.details}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">{t('ai.score')}:</span>
                        <span className="font-medium">{alert.confidenceScore}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Detection:</span>
                        <span className="font-medium">{t('ai.anomalyDetection')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No alerts found' : 'No active alerts'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              AI anomaly detection is monitoring all employee activity
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
