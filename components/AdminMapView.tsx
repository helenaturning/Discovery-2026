import { MapPin } from 'lucide-react';

export function AdminMapView() {
  return (
    <div className="aspect-video bg-gradient-to-br from-[#e0f2fe] to-[#dbeafe] relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full">
          {[...Array(96)].map((_, i) => (
            <div key={i} className="border border-[#10b981]" />
          ))}
        </div>
      </div>

      {/* Google Maps badge */}
      <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-lg border z-20">
        <p className="text-xs font-bold">Google Maps</p>
      </div>

      {/* Company-wide badge */}
      <div className="absolute top-3 left-3 z-20">
        <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border">
          <p className="text-xs font-bold text-[#10b981]">Vue Globale</p>
        </div>
      </div>

      {/* Site markers - scattered across the map */}
      {[
        { top: '20%', left: '25%', color: '#10b981', count: 8 },
        { top: '35%', left: '60%', color: '#f59e0b', count: 12 },
        { top: '55%', left: '40%', color: '#10b981', count: 6 },
        { top: '70%', left: '70%', color: '#ef4444', count: 10 },
        { top: '45%', left: '15%', color: '#10b981', count: 15 },
        { top: '25%', left: '80%', color: '#f59e0b', count: 9 },
      ].map((site, i) => (
        <div
          key={i}
          className="absolute z-10"
          style={{ top: site.top, left: site.left }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-4 border-white shadow-xl flex items-center justify-center" style={{ backgroundColor: site.color }}>
              <MapPin className="size-5 text-white" fill="white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center shadow" style={{ borderColor: site.color }}>
              <span className="text-[10px] font-bold" style={{ color: site.color }}>{site.count}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Stats overlay */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg border">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="text-base font-bold text-[#10b981]">24</div>
            <div className="text-muted-foreground font-semibold">Sites Actifs</div>
          </div>
          <div>
            <div className="text-base font-bold text-[#f59e0b]">156</div>
            <div className="text-muted-foreground font-semibold">Employés</div>
          </div>
          <div>
            <div className="text-base font-bold text-[#ef4444]">78</div>
            <div className="text-muted-foreground font-semibold">Binômes</div>
          </div>
        </div>
      </div>
    </div>
  );
}