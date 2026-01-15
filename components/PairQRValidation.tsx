import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { QrCode, Scan, CheckCircle2, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface PairQRValidationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function PairQRValidation({ open, onOpenChange, onComplete }: PairQRValidationProps) {
  const { t } = useLanguage();
  const { currentUser, currentSession } = useAuth();
  const [mode, setMode] = useState<'choice' | 'generate' | 'scan' | 'confirm' | 'completed'>('choice');
  const [qrCode, setQrCode] = useState<string>('');
  const [scanned, setScanned] = useState(false);
  const [scanCode, setScanCode] = useState('');

  // Generate a unique QR code when user chooses to generate
  const generateQRCode = () => {
    const code = `PAIR-${currentUser?.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setQrCode(code);
    setMode('generate');
    
    // Auto-expire after 2 minutes
    setTimeout(() => {
      if (mode === 'generate' && !scanned) {
        toast.error(t('pair.qr.expired'));
        setMode('choice');
        setQrCode('');
      }
    }, 120000);
  };

  // Simulate QR code scanning
  const handleScan = () => {
    setMode('scan');
  };

  // Simulate successful scan
  const simulateScan = () => {
    // In real app, this would use device camera
    // For demo, we'll simulate a successful scan
    const mockScannedCode = `PAIR-${Math.random().toString(36).substr(2, 9)}`;
    setScanCode(mockScannedCode);
    setMode('confirm');
  };

  // Confirm presence
  const confirmPresence = () => {
    setMode('completed');
    toast.success(t('pair.qr.validated'));
    
    setTimeout(() => {
      onComplete();
      onOpenChange(false);
      resetDialog();
    }, 2000);
  };

  const resetDialog = () => {
    setMode('choice');
    setQrCode('');
    setScanned(false);
    setScanCode('');
  };

  // Prevent screenshots - add visual watermark
  useEffect(() => {
    if (mode === 'generate' && qrCode) {
      // Add screenshot detection (simplified for demo)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          toast.warning(t('pair.qr.noScreenshot'));
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [mode, qrCode, t]);

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('pair.qr.title')}</DialogTitle>
          <DialogDescription>{t('pair.qr.desc')}</DialogDescription>
        </DialogHeader>

        {/* Choice Screen */}
        {mode === 'choice' && (
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="size-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">{t('pair.qr.bothRequired')}</p>
            </div>

            <Card 
              className="cursor-pointer hover:bg-accent transition-colors border-2"
              onClick={generateQRCode}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <QrCode className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t('pair.qr.generate')}</p>
                  <p className="text-sm text-muted-foreground">{t('pair.qr.generateDesc')}</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-accent transition-colors border-2"
              onClick={handleScan}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Scan className="size-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t('pair.qr.scan')}</p>
                  <p className="text-sm text-muted-foreground">{t('pair.qr.scanDesc')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Generate QR Code Screen */}
        {mode === 'generate' && (
          <div className="space-y-4 py-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="size-5 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800">{t('pair.qr.noScreenshotWarning')}</p>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              {/* QR Code Display */}
              <div className="bg-white p-6 rounded-lg border-4 border-primary relative">
                {/* Watermark overlay to prevent screenshots */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-2 right-2 text-xs text-gray-400 opacity-50">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-gray-400 opacity-50">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {/* Simulated QR Code */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <QrCode className="size-32 text-gray-600" />
                  
                  {/* Animated scan line */}
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-primary/50"
                    animate={{ y: [0, 200, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                <p className="text-center mt-4 text-sm font-mono text-muted-foreground break-all">
                  {qrCode.slice(0, 20)}...
                </p>
              </div>

              {/* Expiration Timer */}
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">{t('pair.qr.waitingScan')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('pair.qr.expires2min')}</p>
              </div>
            </motion.div>

            <Button variant="outline" onClick={() => setMode('choice')} className="w-full">
              {t('cancel')}
            </Button>
          </div>
        )}

        {/* Scan QR Code Screen */}
        {mode === 'scan' && (
          <div className="space-y-4 py-4">
            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-primary">
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex flex-col items-center justify-center gap-4">
                <Scan className="size-20 text-primary animate-pulse" />
                <p className="text-sm text-center text-muted-foreground px-4">
                  {t('pair.qr.scanInstruction')}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={simulateScan} className="w-full h-12">
                <Scan className="size-5 mr-2" />
                {t('pair.qr.simulateScan')}
              </Button>
              <Button variant="outline" onClick={() => setMode('choice')} className="w-full">
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}

        {/* Confirm Presence Screen */}
        {mode === 'confirm' && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="size-8 text-green-600" />
              </div>
              <p className="font-medium text-lg mb-2">{t('pair.qr.scanSuccess')}</p>
              <p className="text-sm text-muted-foreground text-center">
                {t('pair.qr.confirmInstruction')}
              </p>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('pair.qr.pairDetected')}</p>
                    <p className="text-xs text-muted-foreground">{t('pair.qr.bothPresent')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button onClick={confirmPresence} className="w-full h-12 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="size-5 mr-2" />
                {t('pair.qr.confirmPresent')}
              </Button>
              <Button variant="outline" onClick={() => setMode('choice')} className="w-full">
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}

        {/* Completed Screen */}
        {mode === 'completed' && (
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="size-10 text-white" />
            </motion.div>
            <p className="font-medium text-lg mb-2">{t('pair.qr.validated')}</p>
            <p className="text-sm text-muted-foreground text-center">{t('pair.qr.bothVerified')}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
