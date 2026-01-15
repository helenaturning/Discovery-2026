import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { QrCode, Scan, CheckCircle2, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PairQRValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pairName: string;
  employeeName: string;
}

export function PairQRValidationDialog({ 
  open, 
  onOpenChange,
  pairName,
  employeeName 
}: PairQRValidationDialogProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<'show' | 'scan' | 'success'>('show');
  const [scanning, setScanning] = useState(false);
  
  // Generate a unique QR code ID for this employee
  const qrCodeId = `PAIR-${employeeName.replace(/\s/g, '-').toUpperCase()}-${Date.now()}`;

  const handleShowQR = () => {
    setStep('show');
  };

  const handleScanQR = () => {
    setStep('scan');
  };

  const handleStartScanning = () => {
    setScanning(true);
    
    // Simulate QR code scanning
    setTimeout(() => {
      setScanning(false);
      setStep('success');
      toast.success(`Présence de ${pairName} validée !`);
      
      setTimeout(() => {
        onOpenChange(false);
        resetDialog();
      }, 2000);
    }, 2000);
  };

  const resetDialog = () => {
    setStep('show');
    setScanning(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="size-5 text-[#10b981]" />
            Validation Mutuelle de Présence
          </DialogTitle>
          <DialogDescription>
            Validez la présence de votre binôme
          </DialogDescription>
        </DialogHeader>
        
        {/* Show QR Code */}
        {step === 'show' && (
          <div className="space-y-4 py-4">
            <Card className="border-2 border-[#10b981]">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-48 h-48 bg-white border-4 border-[#10b981] rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    {/* Simulated QR Code */}
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 p-2 gap-0.5">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={Math.random() > 0.5 ? 'bg-black' : 'bg-white'}
                        />
                      ))}
                    </div>
                    <QrCode className="absolute size-16 text-[#10b981] opacity-30" />
                  </div>
                  
                  <h3 className="mb-2">Votre QR Code</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {employeeName}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Faites scanner ce code par votre binôme
                  </p>
                  
                  <div className="w-full pt-4 border-t">
                    <Button 
                      onClick={handleScanQR} 
                      className="w-full bg-[#10b981] hover:bg-[#059669]"
                    >
                      <Scan className="size-4 mr-2" />
                      Scanner le QR Code de mon binôme
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#10b981]/10 border-[#10b981]/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Users className="size-5 text-[#10b981] mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-[#10b981] mb-1">Binôme assigné</p>
                    <p className="text-foreground">{pairName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Scan QR Code */}
        {step === 'scan' && (
          <div className="space-y-4 py-4">
            <Card className="border-2 border-[#f59e0b]">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {!scanning && (
                    <>
                      <div className="w-48 h-48 bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/10 border-4 border-dashed border-[#f59e0b] rounded-xl mb-4 flex items-center justify-center">
                        <Scan className="size-20 text-[#f59e0b]" />
                      </div>
                      <h3 className="mb-2">Scanner le QR Code</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Scannez le QR code de {pairName}
                      </p>
                      <Button 
                        onClick={handleStartScanning} 
                        className="w-full bg-[#f59e0b] hover:bg-[#d97706]"
                      >
                        <Scan className="size-4 mr-2" />
                        Démarrer le scan
                      </Button>
                    </>
                  )}
                  
                  {scanning && (
                    <>
                      <div className="w-48 h-48 bg-gradient-to-br from-[#f59e0b] to-[#d97706] border-4 border-[#f59e0b] rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                        <Scan className="size-20 text-white animate-pulse" />
                      </div>
                      <h3 className="mb-2">Scan en cours...</h3>
                      <p className="text-sm text-muted-foreground">
                        Vérification de la présence
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {!scanning && (
              <Button 
                onClick={() => setStep('show')} 
                variant="outline"
                className="w-full"
              >
                Retour à mon QR code
              </Button>
            )}
          </div>
        )}
        
        {/* Success */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="size-8 text-green-500" />
            </div>
            <h3 className="font-medium mb-2">Présence Validée !</h3>
            <p className="text-sm text-muted-foreground text-center">
              La présence de {pairName} a été confirmée
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}