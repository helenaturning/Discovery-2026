import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Play, 
  Square, 
  Coffee, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Clock,
  Camera,
  MessageSquare,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { CheckInDialog } from './CheckInDialog';
import { LocationConsentDialog } from './LocationConsentDialog';
import { DaySummaryDialog } from './DaySummaryDialog';

export function EmployeeDashboard() {
  const { t } = useLanguage();
  const { currentUser, currentSession, startPresenceSession, endPresenceSession, updateSessionStatus, sites, pairs, allUsers } = useAuth();
  
  const [showLocationConsent, setShowLocationConsent] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [nextCheckIn, setNextCheckIn] = useState<Date | null>(null);
  const [timeUntilCheckIn, setTimeUntilCheckIn] = useState<string>('');

  // Find employee's pair
  const myPair = pairs.find(p => 
    p.active && (p.employee1Id === currentUser?.id || p.employee2Id === currentUser?.id)
  );
  
  const pairPartnerId = myPair?.employee1Id === currentUser?.id ? myPair?.employee2Id : myPair?.employee1Id;
  const pairPartner = allUsers.find(u => u.id === pairPartnerId);
  const assignedSite = sites.find(s => s.id === myPair?.siteId);

  // Check-in timer (every 90 minutes)
  useEffect(() => {
    if (currentSession?.status === 'present' && nextCheckIn) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = nextCheckIn.getTime() - now.getTime();
        
        if (diff <= 0) {
          setShowCheckIn(true);
          // Schedule next check-in
          const next = new Date();
          next.setMinutes(next.getMinutes() + 90);
          setNextCheckIn(next);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeUntilCheckIn(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [currentSession, nextCheckIn]);

  const handleStartDay = () => {
    if (!assignedSite) {
      toast.error('No site assigned to your pair');
      return;
    }
    setShowLocationConsent(true);
  };

  const handleLocationConsent = async (consented: boolean) => {
    setShowLocationConsent(false);
    
    if (!consented) {
      toast.error('Location consent is required to start your day');
      return;
    }
    
    if (!assignedSite) return;
    
    // Simulate geolocation
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await startPresenceSession(assignedSite.id, true);
          
          // Schedule first check-in in 90 minutes
          const next = new Date();
          next.setMinutes(next.getMinutes() + 90);
          setNextCheckIn(next);
          
          toast.success('Presence started successfully');
        } catch (error) {
          toast.error('Failed to start presence');
        }
      },
      (error) => {
        toast.error('Location access denied');
      }
    );
  };

  const handleEndDay = () => {
    endPresenceSession();
    setNextCheckIn(null);
    setShowSummary(true);
  };

  const handlePause = () => {
    updateSessionStatus('paused');
    setNextCheckIn(null);
    toast.success('Paused');
  };

  const handleEmergency = () => {
    updateSessionStatus('suspended');
    setNextCheckIn(null);
    toast.error('Emergency mode activated');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`employee.status.${status}`);
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('employee.dashboard')}</CardTitle>
              <CardDescription>
                {currentUser?.firstName} {currentUser?.lastName} • {currentUser?.employeeId}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(currentSession?.status || 'notStarted')}>
              {getStatusLabel(currentSession?.status || 'notStarted')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Site and Pair Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="size-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('employee.site')}</p>
                <p className="text-sm text-muted-foreground">
                  {assignedSite?.name || 'No site assigned'}
                </p>
                {assignedSite && (
                  <p className="text-xs text-muted-foreground">{assignedSite.city}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Users className="size-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('employee.pair')}</p>
                <p className="text-sm text-muted-foreground">
                  {pairPartner ? `${pairPartner.firstName} ${pairPartner.lastName}` : 'No pair assigned'}
                </p>
                {pairPartner && currentSession?.status === 'present' && (
                  <Badge variant="outline" className="mt-1">
                    <CheckCircle2 className="size-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Next Check-in Timer */}
          {currentSession?.status === 'present' && nextCheckIn && (
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span className="font-medium">Next Check-in</span>
                </div>
                <span className="text-xl font-mono">{timeUntilCheckIn}</span>
              </div>
              <Progress value={(90 - parseInt(timeUntilCheckIn.split(':')[0])) / 90 * 100} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {(!currentSession || currentSession.status === 'notStarted') && (
              <Button onClick={handleStartDay} size="lg" className="w-full">
                <Play className="size-4 mr-2" />
                {t('employee.startDay')}
              </Button>
            )}
            
            {currentSession?.status === 'present' && (
              <>
                <Button onClick={handleEndDay} size="lg" className="w-full">
                  <Square className="size-4 mr-2" />
                  {t('employee.endDay')}
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handlePause} variant="outline">
                    <Coffee className="size-4 mr-2" />
                    {t('employee.pause')}
                  </Button>
                  <Button onClick={handleEmergency} variant="destructive">
                    <AlertTriangle className="size-4 mr-2" />
                    {t('employee.emergency')}
                  </Button>
                </div>
              </>
            )}
            
            {currentSession?.status === 'paused' && (
              <Button 
                onClick={() => {
                  updateSessionStatus('present');
                  const next = new Date();
                  next.setMinutes(next.getMinutes() + 90);
                  setNextCheckIn(next);
                  toast.success('Resumed');
                }}
                size="lg" 
                className="w-full"
              >
                <Play className="size-4 mr-2" />
                Resume
              </Button>
            )}
          </div>

          {/* Session Stats */}
          {currentSession && currentSession.status !== 'notStarted' && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {Math.floor((new Date().getTime() - currentSession.startTime.getTime()) / 60000)}m
                </p>
                <p className="text-sm text-muted-foreground">{t('employee.summary.individual')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{currentSession.reliabilityScore}%</p>
                <p className="text-sm text-muted-foreground">{t('employee.summary.score')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('privacy.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-green-500" />
            {t('privacy.noDataOutsideHours')}
          </div>
          {currentSession?.status === 'present' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEndDay}
              className="w-full"
            >
              {t('privacy.stopTracking')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <LocationConsentDialog
        open={showLocationConsent}
        onOpenChange={setShowLocationConsent}
        onConsent={handleLocationConsent}
      />
      
      <CheckInDialog
        open={showCheckIn}
        onOpenChange={setShowCheckIn}
        securityQuestion={currentUser?.securityQuestion || ''}
        securityAnswer={currentUser?.securityAnswer || ''}
      />
      
      <DaySummaryDialog
        open={showSummary}
        onOpenChange={setShowSummary}
        session={currentSession}
      />
    </div>
  );
}
