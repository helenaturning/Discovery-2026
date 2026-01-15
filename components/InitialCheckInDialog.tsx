import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { AIService } from '../utils/aiService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Upload, MessageSquare, CheckCircle2, MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InitialCheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  securityQuestion: string;
  securityAnswer: string;
  onSuccess: () => void;
}

export function InitialCheckInDialog({ 
  open, 
  onOpenChange, 
  securityQuestion, 
  securityAnswer,
  onSuccess 
}: InitialCheckInDialogProps) {
  const { t } = useLanguage();
  const { addCheckIn, currentSession } = useAuth();
  const [step, setStep] = useState<'location' | 'facial' | 'question' | 'success'>('location');
  const [answer, setAnswer] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [facialVerified, setFacialVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);

  const handleLocationVerification = () => {
    setVerifying(true);
    
    // *** SIMULATION - Pas d'accès réel à la géolocalisation ***
    // Simuler une vérification de position géographique
    setTimeout(() => {
      // Simulated location check - always successful in simulation
      const isWithinRadius = true; // Simulation: toujours dans le périmètre
      
      setVerifying(false);
      if (isWithinRadius) {
        setLocationVerified(true);
        toast.success('Position géographique vérifiée ! (Simulation)');
        setStep('facial');
      } else {
        toast.error('Vous n\'êtes pas dans le périmètre autorisé');
      }
    }, 1500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;
        setPhotoData(imageData);
        await handleFacialRecognition(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFacialRecognition = async (imageData: string) => {
    setVerifying(true);
    
    const result = await AIService.verifyFace(imageData, 'bio-001');
    
    setVerifying(false);
    if (result.verified) {
      setFacialVerified(true);
      toast.success(`Reconnaissance faciale réussie (${result.confidenceScore}% ${t('ai.score')})`);
      // Passer à la question personnelle
      setTimeout(() => {
        setStep('question');
      }, 1500);
    } else {
      toast.error(`Échec de vérification (${result.confidenceScore}% ${t('ai.score')})`);
    }
  };

  const handleQuestionVerification = () => {
    setVerifying(true);
    
    setTimeout(() => {
      const success = answer.toLowerCase().trim() === securityAnswer.toLowerCase().trim();
      
      if (success) {
        setIdentityVerified(true);
        setVerifying(false);
        toast.success('Identité vérifiée !');
        setStep('success');
        
        // Simulated geolocation (not accessing real location)
        const simulatedPosition = {
          latitude: 45.5017 + (Math.random() - 0.5) * 0.01,
          longitude: -73.5673 + (Math.random() - 0.5) * 0.01,
        };
        
        addCheckIn({
          employeeId: currentSession?.employeeId || '',
          siteId: currentSession?.siteId || '',
          timestamp: new Date(),
          type: 'start',
          verificationMethod: 'question',
          latitude: simulatedPosition.latitude,
          longitude: simulatedPosition.longitude,
          status: 'verified',
          aiConfidenceScore: 100,
          pairPresent: true,
          distanceToPair: Math.random() * 50,
        });
        
        setTimeout(() => {
          onSuccess();
          resetDialog();
        }, 2000);
      } else {
        setVerifying(false);
        toast.error('Réponse incorrecte');
      }
    }, 1000);
  };

  const resetDialog = () => {
    setStep('location');
    setAnswer('');
    setVerifying(false);
    setLocationVerified(false);
    setIdentityVerified(false);
    setFacialVerified(false);
    setPhotoData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Check-in Initial</DialogTitle>
          <DialogDescription>
            Vérification de position et d'identité requise
          </DialogDescription>
        </DialogHeader>
        
        {/* Step 1: Location Verification */}
        {step === 'location' && (
          <div className="space-y-4 py-4">
            <Card className="border-2 border-[#10b981]">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4">
                    <MapPin className="size-8 text-[#10b981]" />
                  </div>
                  <h3 className="mb-2">Vérification de Position</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nous devons vérifier que vous êtes dans le périmètre autorisé du site
                  </p>
                  <Button 
                    onClick={handleLocationVerification} 
                    disabled={verifying}
                    className="w-full bg-[#10b981] hover:bg-[#059669]"
                  >
                    {verifying ? (
                      <>
                        <Navigation className="size-4 mr-2 animate-spin" />
                        Vérification en cours...
                      </>
                    ) : (
                      <>
                        <MapPin className="size-4 mr-2" />
                        Vérifier ma position
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Facial Recognition */}
        {step === 'facial' && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4 p-3 bg-[#10b981]/10 rounded-lg">
              <CheckCircle2 className="size-5 text-[#10b981]" />
              <p className="text-sm font-medium text-[#10b981]">Position vérifiée</p>
            </div>
            
            <h3 className="font-medium mb-3">Reconnaissance Faciale</h3>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            
            {!photoData && !verifying && (
              <div className="text-center space-y-3 py-4">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#10b981] hover:bg-[#059669]"
                >
                  <Upload className="size-4 mr-2" />
                  Capturer une photo
                </Button>
                
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('question')}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Ma caméra ne fonctionne pas
                </Button>
              </div>
            )}
            
            {photoData && (
              <div className="space-y-4">
                <img src={photoData} alt="Verification" className="w-full rounded-lg" />
                {verifying && (
                  <p className="text-center text-sm text-muted-foreground">Vérification en cours...</p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Step 3: Personal Question */}
        {step === 'question' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {facialVerified && (
                <div className="flex items-center gap-2 p-3 bg-[#10b981]/10 rounded-lg">
                  <CheckCircle2 className="size-5 text-[#10b981]" />
                  <p className="text-sm font-medium text-[#10b981]">Reconnaissance faciale vérifiée</p>
                </div>
              )}
              
              {!facialVerified && (
                <div className="flex items-center gap-2 p-3 bg-[#10b981]/10 rounded-lg">
                  <CheckCircle2 className="size-5 text-[#10b981]" />
                  <p className="text-sm font-medium text-[#10b981]">Position vérifiée</p>
                </div>
              )}
            </div>
            
            <h3 className="font-medium mb-3">Question Personnelle</h3>
            
            <div className="space-y-2">
              <Label>{securityQuestion}</Label>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Votre réponse"
                disabled={verifying}
              />
            </div>
            <Button 
              onClick={handleQuestionVerification} 
              className="w-full"
              disabled={verifying || !answer}
            >
              {verifying ? 'Vérification...' : 'Vérifier'}
            </Button>
          </div>
        )}
        
        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="size-8 text-green-500" />
            </div>
            <h3 className="font-medium mb-2">Check-in Réussi !</h3>
            <p className="text-sm text-muted-foreground">Position et identité vérifiées</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}