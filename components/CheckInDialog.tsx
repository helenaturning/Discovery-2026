import { useState, useRef, useEffect } from 'react';
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
import { Upload, MessageSquare, CheckCircle2, QrCode, Scan } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

// Predefined security questions
const SECURITY_QUESTIONS = [
  { value: 'pet', label: { fr: 'Quel est le nom de votre premier animal ?', en: 'What is your first pet\'s name?' } },
  { value: 'city', label: { fr: 'Dans quelle ville êtes-vous né(e) ?', en: 'In which city were you born?' } },
  { value: 'school', label: { fr: 'Quel était le nom de votre école primaire ?', en: 'What was the name of your elementary school?' } },
  { value: 'friend', label: { fr: 'Quel est le prénom de votre meilleur(e) ami(e) d\'enfance ?', en: 'What is your childhood best friend\'s first name?' } },
  { value: 'food', label: { fr: 'Quel est votre plat préféré ?', en: 'What is your favorite dish?' } },
  { value: 'book', label: { fr: 'Quel est le titre de votre livre préféré ?', en: 'What is your favorite book title?' } },
];

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  securityQuestion: string;
  securityAnswer: string;
}

export function CheckInDialog({ open, onOpenChange, securityQuestion, securityAnswer }: CheckInDialogProps) {
  const { t, language } = useLanguage();
  const { addCheckIn, currentSession, sites } = useAuth();
  const [step, setStep] = useState<'facial' | 'question' | 'qr' | 'success'>('facial');
  const [answer, setAnswer] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [facialVerified, setFacialVerified] = useState(false);
  const [questionVerified, setQuestionVerified] = useState(false);
  const [qrVerified, setQRVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      // Convert to base64 for display and verification
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;
        setPhotoData(imageData);
        
        // Automatically proceed with verification
        await handleFacialRecognition(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFacialRecognition = async (imageData: string) => {
    setVerifying(true);
    
    // Use AI service for verification
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
    
    // Simulate verification delay
    setTimeout(() => {
      const success = answer.toLowerCase().trim() === securityAnswer.toLowerCase().trim();
      
      if (success) {
        setQuestionVerified(true);
        setVerifying(false);
        toast.success('Question personnelle vérifiée !');
        
        // Passer à la vérification QR code
        setTimeout(() => {
          setStep('qr');
        }, 1500);
      } else {
        setVerifying(false);
        toast.error('Réponse incorrecte');
      }
    }, 1000);
  };
  
  const handleQRVerification = () => {
    setVerifying(true);
    
    // Simulate QR scan
    setTimeout(() => {
      setQRVerified(true);
      setVerifying(false);
      toast.success('Binôme vérifié !');
      
      // SIMULATED geolocation (not accessing real location)
      const simulatedPosition = {
        latitude: 45.5017 + (Math.random() - 0.5) * 0.01,
        longitude: -73.5673 + (Math.random() - 0.5) * 0.01,
      };
      
      addCheckIn({
        employeeId: currentSession?.employeeId || '',
        siteId: currentSession?.siteId || '',
        timestamp: new Date(),
        type: 'periodic',
        verificationMethod: 'facial', // combiné facial + question + QR
        latitude: simulatedPosition.latitude,
        longitude: simulatedPosition.longitude,
        status: 'verified',
        aiConfidenceScore: 95,
        pairPresent: true,
        distanceToPair: Math.random() * 50,
      });
      
      setTimeout(() => {
        setStep('success');
      }, 1500);
    }, 2000);
  };

  const resetDialog = () => {
    setStep('facial');
    setAnswer('');
    setVerifying(false);
    setFacialVerified(false);
    setQuestionVerified(false);
    setQRVerified(false);
    setPhotoData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Auto-close dialog after success
  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        onOpenChange(false);
        resetDialog();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('employee.checkin.title')}</DialogTitle>
          <DialogDescription>{t('employee.checkin.desc')}</DialogDescription>
        </DialogHeader>
        
        {/* Step 1: Facial Recognition */}
        {step === 'facial' && (
          <div className="space-y-4 py-4">
            <h3 className="font-medium mb-3">Étape 1/3 : Reconnaissance Faciale</h3>
            
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
        
        {/* Step 2: Personal Question */}
        {step === 'question' && (
          <div className="space-y-4 py-4">
            {facialVerified && (
              <div className="flex items-center gap-2 p-3 bg-[#10b981]/10 rounded-lg mb-2">
                <CheckCircle2 className="size-5 text-[#10b981]" />
                <p className="text-sm font-medium text-[#10b981]">✓ Reconnaissance faciale</p>
              </div>
            )}
            
            <h3 className="font-medium mb-3">Étape {facialVerified ? '2' : '1'}/3 : Question Personnelle</h3>
            
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
        
        {/* Step 3: QR Code Verification */}
        {step === 'qr' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-[#10b981]/10 rounded-lg">
                <CheckCircle2 className="size-5 text-[#10b981]" />
                <p className="text-sm font-medium text-[#10b981]">✓ Reconnaissance faciale</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#10b981]/10 rounded-lg">
                <CheckCircle2 className="size-5 text-[#10b981]" />
                <p className="text-sm font-medium text-[#10b981]">✓ Question personnelle</p>
              </div>
            </div>
            
            <h3 className="font-medium mb-3">Étape 3/3 : Vérification Binôme</h3>
            
            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-[#f59e0b]">
              <div className="aspect-square bg-gradient-to-br from-[#f59e0b]/10 to-[#f59e0b]/5 rounded-lg flex flex-col items-center justify-center gap-4">
                <Scan className="size-20 text-[#f59e0b] animate-pulse" />
                <p className="text-sm text-center text-muted-foreground px-4">
                  Scannez le QR code de votre binôme
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleQRVerification}
              className="w-full bg-[#f59e0b] hover:bg-[#d97706]"
              disabled={verifying}
            >
              {verifying ? (
                <>
                  <Scan className="size-4 mr-2 animate-spin" />
                  Vérification en cours...
                </>
              ) : (
                <>
                  <Scan className="size-4 mr-2" />
                  Simuler scan QR code
                </>
              )}
            </Button>
          </div>
        )}
        
        {/* Success */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="size-8 text-[#10b981]" />
            </motion.div>
            <h3 className="font-medium mb-2">Check-in Complet !</h3>
            <p className="text-sm text-muted-foreground text-center">Toutes les vérifications effectuées</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}