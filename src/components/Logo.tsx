import React from 'react';
import { Footprints } from 'lucide-react';

interface LogoProps {
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ inverted = false }) => (
  <span className="inline-flex items-center gap-2 select-none">
    <span className="w-9 h-9 rounded-xl bg-lime border-2 border-ink shadow-pop-sm flex items-center justify-center -rotate-6">
      <Footprints className="w-5 h-5 text-ink" strokeWidth={2.5} />
    </span>
    <span className={`font-display text-2xl font-extrabold tracking-tight ${inverted ? 'text-white' : 'text-ink'}`}>
      Tenis<span className="text-grape">Ivan</span>
    </span>
  </span>
);
