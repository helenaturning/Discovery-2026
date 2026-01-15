import React from 'react';
import { Users } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: { container: 'w-10 h-10', icon: 16, text: 'text-lg' },
    md: { container: 'w-16 h-16', icon: 24, text: 'text-2xl' },
    lg: { container: 'w-24 h-24', icon: 36, text: 'text-4xl' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      <div className={`${currentSize.container} relative flex items-center justify-center rounded-2xl bg-white shadow-lg overflow-hidden`}>
        {/* Background geometric patterns */}
        <div className="absolute inset-0">
          {/* Red section - top left */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-red-500/20 to-transparent"></div>
          {/* Green section - top right */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-green-500/20 to-transparent"></div>
          {/* Yellow section - bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>
          
          {/* Decorative circles */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-red-400 opacity-60"></div>
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-400 opacity-60"></div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-yellow-400 opacity-60"></div>
          
          {/* Connecting lines pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
            <line x1="25" y1="30" x2="75" y2="30" stroke="#ef4444" strokeWidth="2" />
            <line x1="25" y1="30" x2="50" y2="70" stroke="#f59e0b" strokeWidth="2" />
            <line x1="75" y1="30" x2="50" y2="70" stroke="#10b981" strokeWidth="2" />
          </svg>
        </div>

        {/* Icon */}
        <div className="relative z-10">
          <Users size={currentSize.icon} className="text-gray-800" strokeWidth={2.5} />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`${currentSize.text} font-bold text-gray-900 leading-tight`}>
            Two Workers
          </span>
        </div>
      )}
    </div>
  );
}
