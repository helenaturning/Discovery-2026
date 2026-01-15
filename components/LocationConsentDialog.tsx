import { useLanguage } from '../contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { MapPin, Shield } from 'lucide-react';

interface LocationConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConsent: (consented: boolean) => void;
}

export function LocationConsentDialog({ open, onOpenChange, onConsent }: LocationConsentDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            {t('employee.location.consent')}
          </DialogTitle>
          <DialogDescription>
            {t('employee.location.request')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">{t('employee.location.required')}</p>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg">
            <Shield className="size-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">{t('privacy.title')}</p>
              <p className="text-muted-foreground">{t('privacy.noDataOutsideHours')}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onConsent(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={() => onConsent(true)}>
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
