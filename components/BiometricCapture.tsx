import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, CheckCircle2, Loader2, Scan, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface BiometricCaptureProps {
  onCapture: () => void;
  onRetake?: () => void;
}

export function BiometricCapture({ onCapture, onRetake }: BiometricCaptureProps) {
  const [status, setStatus] = useState<'idle' | 'capturing' | 'analyzing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  const handleCapture = () => {
    setStatus('capturing');
    
    // Simulate capture
    setTimeout(() => {
      setStatus('analyzing');
      setProgress(0);
      
      // Simulate analysis with progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setStatus('success');
              onCapture();
            }, 300);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }, 800);
  };

  const handleRetake = () => {
    setStatus('idle');
    setProgress(0);
    onRetake?.();
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square bg-gradient-to-br from-slate-900 to-slate-800">
            <AnimatePresence mode="wait">
              {/* Idle State - Camera Frame */}
              {status === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-48 h-48">
                    {/* Face outline guide */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                      <ellipse
                        cx="100"
                        cy="100"
                        rx="80"
                        ry="95"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="8 4"
                        opacity="0.5"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User className="size-20 text-white/30" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Capturing State - Flash Effect */}
              {status === 'capturing' && (
                <motion.div
                  key="capturing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-white"
                />
              )}

              {/* Analyzing State - Scanning Animation */}
              {status === 'analyzing' && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0"
                >
                  {/* Simulated face detected */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      {/* Face recognition grid */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                        <ellipse
                          cx="100"
                          cy="100"
                          rx="80"
                          ry="95"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                        />
                        {/* Corner markers */}
                        {[[30, 30], [170, 30], [30, 170], [170, 170]].map(([x, y], i) => (
                          <rect
                            key={i}
                            x={x - 5}
                            y={y - 5}
                            width="10"
                            height="10"
                            fill="#10b981"
                          />
                        ))}
                        {/* Detection points */}
                        {Array.from({ length: 15 }).map((_, i) => (
                          <motion.circle
                            key={i}
                            cx={50 + (i % 5) * 25}
                            cy={50 + Math.floor(i / 5) * 30}
                            r="2"
                            fill="#10b981"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                          />
                        ))}
                      </svg>
                      
                      {/* Scanning line */}
                      <motion.div
                        className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#10b981] to-transparent"
                        animate={{ y: [0, 190, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </div>
                  
                  {/* Analysis UI */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Scan className="size-4 text-[#10b981] animate-pulse" />
                        <span>Analyse biométrique...</span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#10b981] to-[#059669]"
                          initial={{ width: '0%' }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                      <div className="text-xs text-white/70">
                        Détection des points faciaux • Vérification de la vivacité
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Success State */}
              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-br from-[#10b981]/20 to-[#059669]/20 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 rounded-full bg-[#10b981] flex items-center justify-center"
                  >
                    <CheckCircle2 className="size-12 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary/50" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary/50" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary/50" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary/50" />
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-center space-y-2">
        {status === 'idle' && (
          <>
            <p className="text-sm text-muted-foreground">
              Positionnez votre visage dans le cadre
            </p>
            <Button onClick={handleCapture} className="w-full h-12" size="lg">
              <Camera className="size-5 mr-2" />
              Capturer la photo
            </Button>
          </>
        )}
        
        {status === 'capturing' && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span>Capture en cours...</span>
          </div>
        )}
        
        {status === 'analyzing' && (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#10b981]">
            <Loader2 className="size-4 animate-spin" />
            <span>Analyse IA en cours... {progress}%</span>
          </div>
        )}
        
        {status === 'success' && (
          <>
            <p className="text-sm font-medium text-[#10b981]">
              ✓ Biométrie enregistrée avec succès
            </p>
            <Button onClick={handleRetake} variant="outline" className="w-full">
              Reprendre la photo
            </Button>
          </>
        )}
      </div>
    </div>
  );
}