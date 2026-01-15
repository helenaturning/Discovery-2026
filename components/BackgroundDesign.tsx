export function BackgroundDesign() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top left - Red circles representing workers */}
      <div className="absolute top-8 left-4 w-20 h-20 rounded-full bg-gradient-to-br from-[#ef4444]/10 to-[#ef4444]/5 blur-sm"></div>
      <div className="absolute top-12 left-12 w-16 h-16 rounded-full bg-[#ef4444]/5"></div>
      
      {/* Top right - Green circles representing workers */}
      <div className="absolute top-16 right-8 w-24 h-24 rounded-full bg-gradient-to-bl from-[#10b981]/10 to-[#10b981]/5 blur-sm"></div>
      <div className="absolute top-20 right-16 w-16 h-16 rounded-full bg-[#10b981]/5"></div>
      
      {/* Bottom left - Yellow connecting elements */}
      <div className="absolute bottom-20 left-8 w-28 h-28 rounded-full bg-gradient-to-tr from-[#f59e0b]/10 to-[#f59e0b]/5 blur-md"></div>
      <div className="absolute bottom-32 left-16 w-20 h-20 rounded-full bg-[#f59e0b]/5"></div>
      
      {/* Bottom right - Mixed collaborative shapes */}
      <div className="absolute bottom-16 right-12 w-24 h-24 rounded-full bg-gradient-to-tl from-[#10b981]/8 to-transparent blur-sm"></div>
      <div className="absolute bottom-40 right-4 w-20 h-20 rounded-full bg-gradient-to-bl from-[#ef4444]/8 to-transparent blur-sm"></div>
      
      {/* Connecting lines suggesting collaboration */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 390 844" preserveAspectRatio="none">
        {/* Lines connecting workers - collaboration theme */}
        <line x1="50" y1="100" x2="340" y2="120" stroke="#ef4444" strokeWidth="2" />
        <line x1="50" y1="100" x2="100" y2="700" stroke="#f59e0b" strokeWidth="2" />
        <line x1="340" y1="120" x2="100" y2="700" stroke="#10b981" strokeWidth="2" />
        <line x1="340" y1="120" x2="320" y2="650" stroke="#10b981" strokeWidth="1.5" />
        <line x1="100" y1="700" x2="320" y2="650" stroke="#f59e0b" strokeWidth="1.5" />
        
        {/* Additional network pattern */}
        <circle cx="50" cy="100" r="4" fill="#ef4444" opacity="0.4" />
        <circle cx="340" cy="120" r="4" fill="#10b981" opacity="0.4" />
        <circle cx="100" cy="700" r="4" fill="#f59e0b" opacity="0.4" />
        <circle cx="320" cy="650" r="4" fill="#10b981" opacity="0.4" />
      </svg>
      
      {/* Subtle geometric patterns */}
      <div className="absolute top-1/3 left-6 w-12 h-12 border-2 border-[#ef4444]/10 rotate-45 rounded-lg"></div>
      <div className="absolute top-1/2 right-10 w-16 h-16 border-2 border-[#10b981]/10 -rotate-12 rounded-lg"></div>
      <div className="absolute bottom-1/3 left-1/2 w-14 h-14 border-2 border-[#f59e0b]/10 rotate-12 rounded-lg"></div>
    </div>
  );
}
