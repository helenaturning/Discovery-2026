import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Circle, Navigation } from 'lucide-react';

export function EmployeeMap() {
  const { t } = useLanguage();
  const { currentSession } = useAuth();

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center h-96 pb-20">
        <div className="text-center">
          <MapPin className="size-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">{t('employee.startDay')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 max-w-[390px] mx-auto">
      {/* Map Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="size-5 text-[#10b981]" />
            {t('nav.map')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-[#e0f2fe] to-[#dbeafe] relative overflow-hidden">
            {/* Grid pattern for map feel */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 grid-rows-8 h-full">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className="border border-[#10b981]" />
                ))}
              </div>
            </div>
            
            {/* Site marker (center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                {/* Authorized radius circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-[#10b981] border-dashed opacity-30" />
                
                {/* Site marker */}
                <div className="relative w-14 h-14 rounded-full bg-[#10b981] border-4 border-white shadow-xl flex items-center justify-center">
                  <MapPin className="size-7 text-white" fill="white" />
                </div>
              </div>
            </div>

            {/* Employee position (you) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-12 translate-y-16 z-20">
              <div className="relative">
                <div className="absolute inset-0 w-10 h-10 rounded-full bg-[#10b981] opacity-30 animate-ping" />
                <div className="relative w-10 h-10 rounded-full bg-[#10b981] border-4 border-white shadow-lg flex items-center justify-center">
                  <Navigation className="size-5 text-white" fill="white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-white px-2 py-1 rounded shadow-lg border-2 border-[#10b981]">
                    <p className="text-xs font-bold text-[#10b981]">Vous</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pair position */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -translate-x-16 translate-y-12 z-20">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#f59e0b] border-4 border-white shadow-lg flex items-center justify-center">
                  <Navigation className="size-5 text-white" fill="white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-white px-2 py-1 rounded shadow-lg border-2 border-[#f59e0b]">
                    <p className="text-xs font-bold text-[#f59e0b]">Binôme</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps badge */}
            <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-lg border">
              <p className="text-xs font-bold text-foreground">Google Maps</p>
            </div>
          </div>

          {/* Site Info */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0">
                <MapPin className="size-5 text-[#10b981]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="mb-1">{currentSession.siteName}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {currentSession.siteAddress}
                </p>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#10b981]/10 text-[#10b981] rounded text-xs font-semibold">
                    <Circle className="size-3" fill="currentColor" />
                    Rayon: 100m
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#f59e0b]/10 text-[#f59e0b] rounded text-xs font-semibold">
                    Distance: 12m
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Légende</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#10b981] border-3 border-white shadow-md flex items-center justify-center">
                <MapPin className="size-5 text-white" />
              </div>
              <p className="text-xs font-semibold text-foreground">Site</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#10b981] border-3 border-white shadow-md flex items-center justify-center">
                <Navigation className="size-5 text-white" />
              </div>
              <p className="text-xs font-semibold text-foreground">Vous</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#f59e0b] border-3 border-white shadow-md flex items-center justify-center">
                <Navigation className="size-5 text-white" />
              </div>
              <p className="text-xs font-semibold text-foreground">Binôme</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}