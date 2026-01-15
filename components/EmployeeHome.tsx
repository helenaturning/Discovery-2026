import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Play, Pause, Square, AlertCircle, MapPin, Users, Clock, Timer, CheckCircle2, Award, QrCode } from 'lucide-react';
import { LocationConsentDialog } from './LocationConsentDialog';
import { InitialCheckInDialog } from './InitialCheckInDialog';
import { CheckInDialog } from './CheckInDialog';
import { PairQRValidationDialog } from './PairQRValidationDialog';
import { BackgroundDesign } from './BackgroundDesign';
import { toast } from 'sonner@2.0.3';

// Helper function to get random interval between 45-120 minutes (in seconds)
const getRandomCheckInInterval = () => {
  const minMinutes = 45;
  const maxMinutes = 120;
  return (minMinutes + Math.random() * (maxMinutes - minMinutes)) * 60;
};

export function EmployeeHome() {
  const { t } = useLanguage();
  const { currentUser, currentSession, startPresenceSession, startSession, pauseSession, endSession, sites } = useAuth();
  const [showLocationConsent, setShowLocationConsent] = useState(false);
  const [showInitialCheckIn, setShowInitialCheckIn] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showPairQRDialog, setShowPairQRDialog] = useState(false);
  const [nextCheckIn, setNextCheckIn] = useState(getRandomCheckInInterval());

  useEffect(() => {
    if (currentSession?.status === 'present') {
      const timer = setInterval(() => {
        setNextCheckIn((prev) => {
          if (prev <= 1) {
            setShowCheckInDialog(true);
            return getRandomCheckInInterval(); // Random interval after each check-in
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentSession?.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartDay = () => {
    setShowLocationConsent(true);
  };

  const handleLocationConsent = async (consented: boolean) => {
    setShowLocationConsent(false);
    if (consented) {
      try {
        // Get first available site (in real app, user would choose)
        const firstSite = sites[0];
        if (firstSite) {
          await startPresenceSession(firstSite.id, consented);
          // Show initial check-in dialog with location and identity verification
          setShowInitialCheckIn(true);
        } else {
          toast.error('No sites available');
        }
      } catch (error) {
        toast.error('Failed to start session');
      }
    }
  };

  const handleInitialCheckInSuccess = () => {
    setShowInitialCheckIn(false);
    toast.success(t('employee.startDay'));
  };

  const handlePause = () => {
    pauseSession();
    toast.success(t('employee.status.paused'));
  };

  const handleEndDay = () => {
    endSession();
    toast.success(t('employee.endDay'));
  };

  const getStatusConfig = () => {
    switch (currentSession?.status) {
      case 'present':
        return { color: 'bg-[#10b981]', text: t('employee.status.present'), ringColor: 'ring-[#10b981]/20' };
      case 'paused':
        return { color: 'bg-[#f59e0b]', text: t('employee.status.paused'), ringColor: 'ring-[#f59e0b]/20' };
      case 'absent':
        return { color: 'bg-[#ef4444]', text: t('employee.status.absent'), ringColor: 'ring-[#ef4444]/20' };
      default:
        return { color: 'bg-[#64748b]', text: t('employee.status.notStarted'), ringColor: 'ring-[#64748b]/20' };
    }
  };

  const statusConfig = getStatusConfig();

  // Calculate session stats
  const sessionStats = {
    totalTime: currentSession ? Math.floor((new Date().getTime() - new Date(currentSession.startTime).getTime()) / 60000) : 0,
    checkInsToday: currentSession?.checkIns?.length || 0,
  };

  return (
    <div className="min-h-screen bg-white max-w-[390px] mx-auto relative overflow-hidden">
      <BackgroundDesign />
      <div className="space-y-4 pb-20 relative z-10 p-4">
        {/* Quick Stats Summary - Only show when session is active */}
        {currentSession && (
          <div className="grid grid-cols-2 gap-2">
            <Card className="shadow-sm border-2 border-[#f59e0b]/20">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <Timer className="size-5 text-[#f59e0b] mb-1" />
                  <div className="font-bold text-lg">{sessionStats.totalTime}</div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">Minutes</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-2 border-[#10b981]/20">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <CheckCircle2 className="size-5 text-[#10b981] mb-1" />
                  <div className="font-bold text-lg">{sessionStats.checkInsToday}</div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">Check-ins</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Status Card - Prominent */}
        <Card className="border-2 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className={`mx-auto mb-4 w-20 h-20 rounded-full ${statusConfig.color} ring-8 ${statusConfig.ringColor} flex items-center justify-center`}>
                {currentSession?.status === 'present' && <Play className="size-10 text-white" fill="white" />}
                {currentSession?.status === 'paused' && <Pause className="size-10 text-white" fill="white" />}
                {!currentSession?.status && <Square className="size-10 text-white" />}
              </div>
              <h2 className="mb-2">{statusConfig.text}</h2>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {(!currentSession || currentSession?.status === 'notStarted') && (
                <Button onClick={handleStartDay} className="w-full h-12 bg-[#10b981] hover:bg-[#059669]" size="lg">
                  <Play className="size-5 mr-2" />
                  {t('employee.startDay')}
                </Button>
              )}

              {currentSession?.status === 'present' && (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handlePause} className="h-12 border-2">
                    <Pause className="size-5 mr-2" />
                    {t('employee.pause')}
                  </Button>
                  <Button variant="outline" onClick={handleEndDay} className="h-12 border-2 border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white">
                    <Square className="size-5 mr-2" />
                    {t('employee.endDay')}
                  </Button>
                </div>
              )}

              {currentSession?.status === 'paused' && (
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => startSession()} className="h-12 bg-[#10b981] hover:bg-[#059669]">
                    <Play className="size-5 mr-2" />
                    Reprendre
                  </Button>
                  <Button variant="outline" onClick={handleEndDay} className="h-12 border-2 border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white">
                    <Square className="size-5 mr-2" />
                    {t('employee.endDay')}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Site Information */}
        {currentSession && (
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0">
                  <MapPin className="size-6 text-[#10b981]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('employee.site')}</p>
                  </div>
                  <h3 className="mb-1">{currentSession.siteName}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentSession.siteAddress}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#10b981]/10 text-[#10b981] rounded text-xs font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    Dans le périmètre
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pair Information */}
        {currentSession && (
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
                  <Users className="size-6 text-[#f59e0b]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('employee.pair')}</p>
                  </div>
                  <h3 className="mb-2">{currentSession.pairName}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge 
                      className={`${
                        currentSession.pairStatus === 'present' 
                          ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20' 
                          : 'bg-[#64748b]/10 text-[#64748b] border-[#64748b]/20'
                      } border`}
                    >
                      {t(`employee.status.${currentSession.pairStatus}`)}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {currentSession.distanceToPair}m
                    </span>
                  </div>
                  <Button 
                    onClick={() => setShowPairQRDialog(true)}
                    variant="outline"
                    size="sm"
                    className="w-full border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/10"
                  >
                    <QrCode className="size-4 mr-2" />
                    Valider la présence
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Présence Section - Show when session is active */}
        {currentSession && (
          <>
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-[#10b981]" />
                  Présence
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Time Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
                        <Clock className="size-3 text-[#f59e0b]" />
                      </div>
                    </div>
                    <div className="text-xl font-bold mb-1">7.5h</div>
                    <p className="text-xs text-muted-foreground">Temps individuel</p>
                    <Progress value={93.75} className="mt-2 h-1.5" />
                  </div>

                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                        <Users className="size-3 text-[#10b981]" />
                      </div>
                    </div>
                    <div className="text-xl font-bold mb-1">6.8h</div>
                    <p className="text-xs text-muted-foreground">Avec binôme</p>
                    <Progress value={85} className="mt-2 h-1.5" />
                  </div>
                </div>

                {/* Badge */}
                <div className="text-center p-4 bg-gradient-to-br from-[#f59e0b]/10 to-[#d97706]/5 rounded-lg border border-[#f59e0b]/20">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center shadow-lg">
                      <Award className="size-7 text-white" />
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white rounded-lg shadow-md font-bold text-sm">
                    <Award className="size-3.5" />
                    Gold
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Excellente fiabilité de présence !
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Présence de binômes Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="size-5 text-[#f59e0b]" />
                  Historique de vérification
                </CardTitle>
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
          </>
        )}

        {/* Emergency Button */}
        <Button 
          variant="outline" 
          className="w-full h-12 border-2 border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white font-semibold"
        >
          <AlertCircle className="size-5 mr-2" />
          {t('employee.emergency')}
        </Button>

        <LocationConsentDialog
          open={showLocationConsent}
          onOpenChange={setShowLocationConsent}
          onConsent={handleLocationConsent}
        />

        <InitialCheckInDialog
          open={showInitialCheckIn}
          onOpenChange={setShowInitialCheckIn}
          securityQuestion={currentUser?.securityQuestion || "What is your favorite color?"}
          securityAnswer={currentUser?.securityAnswer || "blue"}
          onSuccess={handleInitialCheckInSuccess}
        />

        <CheckInDialog
          open={showCheckInDialog}
          onOpenChange={setShowCheckInDialog}
          securityQuestion={currentUser?.securityQuestion || "What is your favorite color?"}
          securityAnswer={currentUser?.securityAnswer || "blue"}
        />

        <PairQRValidationDialog
          open={showPairQRDialog}
          onOpenChange={setShowPairQRDialog}
          pairName={currentSession?.pairName || 'Binôme'}
          employeeName={`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`}
        />
      </div>
    </div>
  );
}