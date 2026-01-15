import { useLanguage } from '../contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { PresenceSession } from '../types';
import { Clock, Users, Award, TrendingUp } from 'lucide-react';

interface DaySummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: PresenceSession | null;
}

export function DaySummaryDialog({ open, onOpenChange, session }: DaySummaryDialogProps) {
  const { t } = useLanguage();

  if (!session) return null;

  const duration = session.endTime 
    ? Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 60000)
    : 0;

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('employee.summary')}</DialogTitle>
          <DialogDescription>
            {session.startTime.toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Clock className="size-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{hours}h {minutes}m</p>
                  <p className="text-sm text-muted-foreground">{t('employee.summary.individual')}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Users className="size-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{hours}h {Math.max(0, minutes - 10)}m</p>
                  <p className="text-sm text-muted-foreground">{t('employee.summary.withPair')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t('employee.summary.score')}</p>
                    <p className="text-2xl font-bold">{session.reliabilityScore}%</p>
                  </div>
                </div>
                {session.reliabilityScore >= 90 && (
                  <Badge className="bg-green-500">
                    <Award className="size-3 mr-1" />
                    Excellent
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="size-12 text-yellow-500 mx-auto mb-2" />
                <p className="font-medium">{t('employee.summary.badge')}</p>
                <Badge variant="outline" className="mt-2">
                  {t('status.verified')}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              {t('privacy.noDataOutsideHours')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
