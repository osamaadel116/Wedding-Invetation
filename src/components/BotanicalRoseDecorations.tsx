import React from 'react';
import { FloralTheme } from '../types';

interface RoseCornerProps {
  theme: FloralTheme;
  className?: string;
  variant?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Botanical Rose & Frost Botanical Frame Corner with blooming English garden roses,
 * layered petals, frosty winter leaves, golden glitter tendrils, and crystalline sparkles.
 */
export const BotanicalRoseFrameCorner: React.FC<RoseCornerProps> = ({
  theme,
  className = '',
  variant = 'top-left',
}) => {
  let transform = '';
  if (variant === 'top-right') transform = 'scale-x-[-1]';
  if (variant === 'bottom-left') transform = 'scale-y-[-1]';
  if (variant === 'bottom-right') transform = 'scale-[-1]';

  const isWinterTone = ['frostyWinter', 'frostedRose', 'icySlate', 'dustyBlue'].includes(theme.floralTone);

  return (
    <div className={`pointer-events-none select-none overflow-visible ${transform} ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id={`goldTendril-${variant}`} x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DFC186" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F7EAC4" stopOpacity="1" />
            <stop offset="100%" stopColor="#A88242" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id={`winterRoseGrad-${variant}`} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor={isWinterTone ? '#DDE8F0' : '#FCE8EC'} stopOpacity="0.9" />
            <stop offset="85%" stopColor={isWinterTone ? '#8EAEC4' : '#E5A5B5'} stopOpacity="0.8" />
            <stop offset="100%" stopColor={isWinterTone ? '#537894' : '#C27488'} stopOpacity="0.7" />
          </radialGradient>

          <radialGradient id={`miniRoseGrad-${variant}`} cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor={isWinterTone ? '#B8CEE0' : '#F4BDCA'} stopOpacity="0.85" />
            <stop offset="100%" stopColor={isWinterTone ? '#6C90AC' : '#D08498'} stopOpacity="0.75" />
          </radialGradient>

          <radialGradient id={`frostLeafGrad-${variant}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={isWinterTone ? '#9AB3A8' : '#A7BFA8'} stopOpacity="0.85" />
            <stop offset="100%" stopColor={isWinterTone ? '#3B5950' : '#4E6B52'} stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Vintage Filigree Corner Flourish */}
        <path
          d="M 6 6 L 6 70 C 6 45, 20 20, 45 12 C 70 6, 95 6, 120 6"
          stroke={`url(#goldTendril-${variant})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 12 12 L 12 55 C 12 35, 25 22, 45 16 C 65 12, 85 12, 105 12"
          stroke={`url(#goldTendril-${variant})`}
          strokeWidth="0.8"
          strokeDasharray="2 3"
          opacity="0.8"
        />

        {/* Frost Botanical Sprigs & Pine Needles */}
        <g opacity="0.75">
          <path d="M 15 15 Q 50 40 85 55" stroke="#7E9BA8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="30" y1="26" x2="26" y2="18" stroke="#9BB2BE" strokeWidth="1" strokeLinecap="round" />
          <line x1="45" y1="36" x2="43" y2="26" stroke="#9BB2BE" strokeWidth="1" strokeLinecap="round" />
          <line x1="60" y1="44" x2="62" y2="34" stroke="#9BB2BE" strokeWidth="1" strokeLinecap="round" />
          <line x1="75" y1="50" x2="80" y2="40" stroke="#9BB2BE" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Winter/Eucalyptus Leaves */}
        <g>
          <ellipse cx="28" cy="45" rx="10" ry="18" transform="rotate(-30 28 45)" fill={`url(#frostLeafGrad-${variant})`} opacity="0.85" />
          <ellipse cx="48" cy="28" rx="10" ry="18" transform="rotate(35 48 28)" fill={`url(#frostLeafGrad-${variant})`} opacity="0.85" />
          <ellipse cx="65" cy="50" rx="9" ry="15" transform="rotate(55 65 50)" fill={`url(#frostLeafGrad-${variant})`} opacity="0.8" />
          <ellipse cx="50" cy="65" rx="8" ry="14" transform="rotate(-15 50 65)" fill={`url(#frostLeafGrad-${variant})`} opacity="0.75" />
        </g>

        {/* Golden Berries */}
        <circle cx="78" cy="36" r="2.8" fill="#DFC186" stroke="#FFFFFF" strokeWidth="0.5" />
        <circle cx="88" cy="30" r="2.2" fill="#DFC186" stroke="#FFFFFF" strokeWidth="0.5" />
        <circle cx="34" cy="78" r="2.8" fill="#DFC186" stroke="#FFFFFF" strokeWidth="0.5" />
        <circle cx="28" cy="88" r="2.2" fill="#DFC186" stroke="#FFFFFF" strokeWidth="0.5" />

        {/* Secondary Rosebud */}
        <g transform="translate(48, 48) scale(0.65)">
          <circle cx="20" cy="20" r="18" fill={`url(#miniRoseGrad-${variant})`} />
          <path d="M 12 14 C 18 8, 28 8, 30 18 C 30 26, 20 28, 14 22 Z" fill="#FFFFFF" opacity="0.6" />
          <path d="M 15 20 C 18 16, 25 18, 24 24 C 22 28, 16 26, 15 20 Z" fill={isWinterTone ? '#537894' : '#C27488'} opacity="0.65" />
          <circle cx="20" cy="20" r="2" fill="#DFC186" />
        </g>

        {/* Primary English Garden Winter Rose */}
        <g transform="translate(14, 14)">
          {/* Outer Layer of Velvety Petals */}
          <path
            d="M 22 5 C 34 0, 42 12, 40 22 C 38 34, 25 38, 15 32 C 5 26, 8 10, 22 5 Z"
            fill={`url(#winterRoseGrad-${variant})`}
          />
          <path
            d="M 10 18 C 4 28, 14 40, 26 38 C 38 36, 42 22, 34 14 C 24 6, 16 8, 10 18 Z"
            fill={`url(#winterRoseGrad-${variant})`}
            opacity="0.9"
          />
          <path
            d="M 25 10 C 36 12, 38 26, 30 34 C 22 42, 10 35, 12 24 C 14 14, 18 8, 25 10 Z"
            fill={`url(#winterRoseGrad-${variant})`}
            opacity="0.95"
          />

          {/* Intricate Swirling Rose Petal Center */}
          <path
            d="M 18 16 C 24 12, 30 16, 28 22 C 26 28, 18 28, 16 22 C 14 18, 16 14, 18 16 Z"
            fill="#FFFFFF"
            opacity="0.8"
          />
          <path
            d="M 20 18 C 24 15, 27 18, 26 22 C 24 25, 19 25, 18 21 Z"
            fill={isWinterTone ? '#43657D' : '#9E4E63'}
            opacity="0.75"
          />
          <path
            d="M 22 19 C 24 18, 26 20, 25 22 C 24 24, 21 24, 21 21 Z"
            fill="#DFC186"
          />

          {/* Frost Sparkles / Dewdrops */}
          <circle cx="28" cy="12" r="1.5" fill="#FFFFFF" opacity="0.95" />
          <circle cx="12" cy="24" r="1.2" fill="#FFFFFF" opacity="0.95" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Botanical Rose & Vine Header Ornament for Section Titles
 */
export const BotanicalRoseHeaderOrnament: React.FC<{ theme: FloralTheme; className?: string }> = ({
  theme,
  className = '',
}) => {
  const isWinterTone = ['frostyWinter', 'frostedRose', 'icySlate', 'dustyBlue'].includes(theme.floralTone);

  return (
    <div className={`flex items-center justify-center gap-3 my-3 pointer-events-none select-none ${className}`}>
      {/* Left Rose Stem & Leaves */}
      <svg width="60" height="24" viewBox="0 0 60 24" fill="none" className="opacity-85">
        <path d="M 0 12 Q 35 12 55 12" stroke="#DFC186" strokeWidth="1" strokeDasharray="3 2" />
        <ellipse cx="20" cy="8" rx="5" ry="9" transform="rotate(-30 20 8)" fill={isWinterTone ? '#7895A2' : '#A3B18A'} opacity="0.75" />
        <ellipse cx="38" cy="16" rx="4" ry="7" transform="rotate(30 38 16)" fill={isWinterTone ? '#4A6B7A' : '#588157'} opacity="0.7" />
        <circle cx="10" cy="12" r="2" fill="#DFC186" />
      </svg>

      {/* Center Blooming Rose Emblem */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="#FFFFFF" stroke="#DFC186" strokeWidth="1" />
          {/* Layered Rose Petals */}
          <ellipse cx="16" cy="12" rx="7" ry="5" fill={isWinterTone ? '#B8CEE0' : '#E8B4B8'} opacity="0.8" />
          <ellipse cx="12" cy="18" rx="6" ry="6" fill={isWinterTone ? '#8EAEC4' : '#D494A2'} opacity="0.85" />
          <ellipse cx="20" cy="18" rx="6" ry="6" fill={isWinterTone ? '#8EAEC4' : '#D494A2'} opacity="0.85" />
          <circle cx="16" cy="16" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="16" cy="16" r="2.5" fill={isWinterTone ? '#43657D' : '#A35368'} />
          <circle cx="16" cy="16" r="1" fill="#DFC186" />
        </svg>
      </div>

      {/* Right Rose Stem & Leaves */}
      <svg width="60" height="24" viewBox="0 0 60 24" fill="none" className="opacity-85 scale-x-[-1]">
        <path d="M 0 12 Q 35 12 55 12" stroke="#DFC186" strokeWidth="1" strokeDasharray="3 2" />
        <ellipse cx="20" cy="8" rx="5" ry="9" transform="rotate(-30 20 8)" fill={isWinterTone ? '#7895A2' : '#A3B18A'} opacity="0.75" />
        <ellipse cx="38" cy="16" rx="4" ry="7" transform="rotate(30 38 16)" fill={isWinterTone ? '#4A6B7A' : '#588157'} opacity="0.7" />
        <circle cx="10" cy="12" r="2" fill="#DFC186" />
      </svg>
    </div>
  );
};

/**
 * Botanical Rose & Gold Arch Crown
 * Intricate floral crest and baroque scrollwork designed for arched photo frames
 */
export const BotanicalRoseArchCrown: React.FC<{ theme: FloralTheme; className?: string }> = ({
  theme,
  className = '',
}) => {
  const isWinterTone = ['frostyWinter', 'frostedRose', 'icySlate', 'dustyBlue'].includes(theme.floralTone);

  return (
    <div className={`pointer-events-none select-none overflow-visible ${className}`}>
      <svg
        viewBox="0 0 240 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="archCrownGold" x1="0" y1="35" x2="240" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DFC186" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#F5E4BA" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#DFC186" stopOpacity="1" />
            <stop offset="70%" stopColor="#F5E4BA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#DFC186" stopOpacity="0.4" />
          </linearGradient>

          <radialGradient id="archRoseCenterGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor={isWinterTone ? '#D0E1EE' : '#FCE2E6'} />
            <stop offset="80%" stopColor={isWinterTone ? '#7C9DB5' : '#DB8DA0'} />
            <stop offset="100%" stopColor={isWinterTone ? '#43657D' : '#AF576C'} />
          </radialGradient>

          <radialGradient id="archLeafGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={isWinterTone ? '#A8C3B8' : '#B2CDB5'} />
            <stop offset="100%" stopColor={isWinterTone ? '#3E5C53' : '#47684C'} />
          </radialGradient>
        </defs>

        {/* Outer Filigree Arch Ribbons */}
        <path
          d="M 20 62 C 60 20, 100 12, 120 12 C 140 12, 180 20, 220 62"
          stroke="url(#archCrownGold)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M 35 60 C 70 30, 100 22, 120 22 C 140 22, 170 30, 205 60"
          stroke="url(#archCrownGold)"
          strokeWidth="0.75"
          strokeDasharray="2 3"
          opacity="0.8"
        />

        {/* Vintage Scroll Tendrils */}
        <path
          d="M 95 24 C 80 10, 65 14, 55 26 C 45 38, 55 48, 68 44 C 78 40, 78 30, 70 28"
          stroke="url(#archCrownGold)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 145 24 C 160 10, 175 14, 185 26 C 195 38, 185 48, 172 44 C 162 40, 162 30, 170 28"
          stroke="url(#archCrownGold)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Botanical Leaves Left */}
        <g>
          <ellipse cx="88" cy="22" rx="7" ry="14" transform="rotate(-40 88 22)" fill="url(#archLeafGrad)" opacity="0.85" />
          <ellipse cx="70" cy="30" rx="6" ry="12" transform="rotate(-65 70 30)" fill="url(#archLeafGrad)" opacity="0.8" />
          <ellipse cx="102" cy="18" rx="5" ry="10" transform="rotate(-20 102 18)" fill="url(#archLeafGrad)" opacity="0.9" />
        </g>

        {/* Botanical Leaves Right */}
        <g>
          <ellipse cx="152" cy="22" rx="7" ry="14" transform="rotate(40 152 22)" fill="url(#archLeafGrad)" opacity="0.85" />
          <ellipse cx="170" cy="30" rx="6" ry="12" transform="rotate(65 170 30)" fill="url(#archLeafGrad)" opacity="0.8" />
          <ellipse cx="138" cy="18" rx="5" ry="10" transform="rotate(20 138 18)" fill="url(#archLeafGrad)" opacity="0.9" />
        </g>

        {/* Golden Pearls / Dewdrops */}
        <circle cx="120" cy="4" r="3" fill="#DFC186" stroke="#FFFFFF" strokeWidth="0.8" />
        <circle cx="105" cy="8" r="2.2" fill="#DFC186" stroke="#FFFFFF" strokeWidth="0.6" />
        <circle cx="135" cy="8" r="2.2" fill="#DFC186" stroke="#FFFFFF" strokeWidth="0.6" />
        <circle cx="50" cy="46" r="2" fill="#DFC186" stroke="#FFFFFF" strokeWidth="0.5" />
        <circle cx="190" cy="46" r="2" fill="#DFC186" stroke="#FFFFFF" strokeWidth="0.5" />

        {/* Left Mini Blossom */}
        <g transform="translate(78, 16) scale(0.65)">
          <circle cx="14" cy="14" r="12" fill={isWinterTone ? '#8EAEC4' : '#E5A5B5'} opacity="0.9" />
          <circle cx="14" cy="14" r="8" fill="#FFFFFF" opacity="0.75" />
          <circle cx="14" cy="14" r="3" fill="#DFC186" />
        </g>

        {/* Right Mini Blossom */}
        <g transform="translate(142, 16) scale(0.65)">
          <circle cx="14" cy="14" r="12" fill={isWinterTone ? '#8EAEC4' : '#E5A5B5'} opacity="0.9" />
          <circle cx="14" cy="14" r="8" fill="#FFFFFF" opacity="0.75" />
          <circle cx="14" cy="14" r="3" fill="#DFC186" />
        </g>

        {/* Central Crown Jewel Rose */}
        <g transform="translate(100, 4)">
          <circle cx="20" cy="20" r="18" fill="url(#archRoseCenterGrad)" stroke="#FFFFFF" strokeWidth="1" />
          {/* Velvety Swirl Petals */}
          <path
            d="M 12 14 C 16 6, 26 6, 28 14 C 30 22, 22 26, 14 22 C 10 18, 10 16, 12 14 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />
          <path
            d="M 15 18 C 18 14, 25 15, 24 21 C 23 25, 17 25, 15 20 Z"
            fill={isWinterTone ? '#43657D' : '#9E4E63'}
            opacity="0.8"
          />
          <circle cx="20" cy="20" r="3" fill="#DFC186" stroke="#FFFFFF" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Ornate Miniature Rose & Gold Filigree Corner for Gallery & Card Frames
 */
export const OrnateMiniRoseCorner: React.FC<{
  theme: FloralTheme;
  variant?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ theme, variant = 'top-left', className = '' }) => {
  let transform = '';
  if (variant === 'top-right') transform = 'scale-x-[-1]';
  if (variant === 'bottom-left') transform = 'scale-y-[-1]';
  if (variant === 'bottom-right') transform = 'scale-[-1]';

  const isWinterTone = ['frostyWinter', 'frostedRose', 'icySlate', 'dustyBlue'].includes(theme.floralTone);

  return (
    <div className={`pointer-events-none select-none overflow-visible ${transform} ${className}`}>
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id={`miniGoldCorner-${variant}`} x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DFC186" />
            <stop offset="100%" stopColor="#B69A5E" />
          </linearGradient>
        </defs>

        {/* Corner Gilded Filigree L-bracket */}
        <path
          d="M 3 24 L 3 6 C 3 4.3 4.3 3 6 3 L 24 3"
          stroke={`url(#miniGoldCorner-${variant})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 7 18 L 7 8 C 7 7.4 7.4 7 8 7 L 18 7"
          stroke={`url(#miniGoldCorner-${variant})`}
          strokeWidth="0.75"
          strokeDasharray="1.5 2"
        />

        {/* Small Leaf & Bud */}
        <ellipse cx="14" cy="9" rx="3" ry="6" transform="rotate(35 14 9)" fill={isWinterTone ? '#8CAEC7' : '#A3B18A'} opacity="0.8" />
        <ellipse cx="9" cy="14" rx="3" ry="6" transform="rotate(-35 9 14)" fill={isWinterTone ? '#8CAEC7' : '#A3B18A'} opacity="0.8" />

        {/* Mini Blossom Center */}
        <circle cx="6" cy="6" r="4.5" fill={isWinterTone ? '#99BDD6' : '#E8B4B8'} stroke="#FFFFFF" strokeWidth="0.75" />
        <circle cx="6" cy="6" r="2" fill={isWinterTone ? '#43657D' : '#A35368'} />
        <circle cx="6" cy="6" r="0.8" fill="#DFC186" />
      </svg>
    </div>
  );
};

/**
 * Exact Vintage Oval Frame
 * Highly detailed replica of the ornate vintage oval frame with diamond borders
 * and intricate baroque floral corners/crests.
 */
export const ExactVintageOvalFrame: React.FC<{
  className?: string;
  strokeColor?: string;
}> = ({ className = '', strokeColor = '#665b4f' }) => {
  return (
    <div className={`pointer-events-none select-none overflow-visible ${className}`}>
      <svg
        viewBox="0 0 800 1100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        <defs>
          <pattern id="vintage-diamond-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points="10,2 18,10 10,18 2,10" fill={strokeColor} opacity="0.8" />
          </pattern>

          <g id="leaf-cluster">
            <path d="M 0 0 C -15 -10, -5 -30, 0 -35 C 5 -30, 15 -10, 0 0 Z" fill={strokeColor} />
            <path d="M 0 0 C -25 -5, -35 15, -30 25 C -20 20, -10 10, 0 0 Z" fill={strokeColor} />
            <path d="M 0 0 C 25 -5, 35 15, 30 25 C 20 20, 10 10, 0 0 Z" fill={strokeColor} />
          </g>

          <g id="flower-cluster">
            <path d="M 0 -10 C 10 -10, 10 10, 0 10 C -10 10, -10 -10, 0 -10 Z" fill={strokeColor} />
            <circle cx="0" cy="0" r="4" fill="#FAF7F2" />
            <path d="M -10 0 C -15 -12, -6 -18, 0 -12 C 6 -18, 15 -12, 10 0 C 15 12, 6 18, 0 12 C -6 18, -15 12, -10 0 Z" fill="none" stroke={strokeColor} strokeWidth="2" />
          </g>

          <g id="vintage-crest">
            {/* Background block to hide oval lines */}
            <path d="M 0 -35 C -60 -35, -70 40, 0 70 C 70 40, 60 -35, 0 -35 Z" fill="#FAF7F2" />
            
            {/* Center Shield */}
            <path d="M 0 -35 C -50 -35, -60 30, 0 65 C 60 30, 50 -35, 0 -35 Z" fill="none" stroke={strokeColor} strokeWidth="3" />
            <path d="M 0 -20 C -30 -20, -35 20, 0 45 C 35 20, 30 -20, 0 -20 Z" fill={strokeColor} opacity="0.8" />
            <circle cx="0" cy="10" r="6" fill="#FAF7F2" />
            <circle cx="0" cy="10" r="2" fill={strokeColor} />
            
            {/* Hanging bell */}
            <path d="M 0 65 L 0 100" stroke={strokeColor} strokeWidth="2.5" />
            <path d="M -12 100 C -12 120, 12 120, 12 100 Z" fill={strokeColor} />
            
            {/* Left sweeping scrolls (Simplified) */}
            <path d="M -30 15 C -120 -30, -200 40, -150 90 C -120 120, -80 70, -110 30" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            
            {/* Right sweeping scrolls (Simplified) */}
            <g transform="scale(-1, 1)">
              <path d="M -30 15 C -120 -30, -200 40, -150 90 C -120 120, -80 70, -110 30" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            </g>
            
            {/* Leaves & Diamond Details */}
            <path d="M -35 15 C -55 -10, -80 5, -65 30 Z" fill={strokeColor} />
            <path d="M 35 15 C 55 -10, 80 5, 65 30 Z" fill={strokeColor} />
            
            <polygon points="-190,20 -198,30 -190,40 -182,30" fill={strokeColor} />
            <polygon points="190,20 198,30 190,40 182,30" fill={strokeColor} />
          </g>

          <g id="vintage-corner">
            {/* Outward Scrolls (towards top-left) */}
            <path d="M 0 0 C -60 -70, -160 -40, -120 30 C -90 90, -30 70, -50 10 C -60 -20, -90 -10, -80 20" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            <path d="M -20 -20 C -100 -100, -180 0, -130 70" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            
            {/* Trailing Vine DOWN the oval (Simplified) */}
            <path d="M 15 45 C -20 150, -50 250, -30 360" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            <use href="#leaf-cluster" x="-10" y="100" transform="rotate(-30 -10 100)" />
            <use href="#flower-cluster" x="-40" y="200" />
            <use href="#leaf-cluster" x="-35" y="320" transform="rotate(-15 -35 320)" />

            {/* Trailing Vine ACROSS the top (Simplified) */}
            <path d="M 45 15 C 130 -20, 210 -10, 300 30" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            <use href="#leaf-cluster" x="100" y="-5" transform="rotate(70 100 -5)" />
            <use href="#flower-cluster" x="200" y="-10" />
            
            {/* Large foliage cluster at the root */}
            <path d="M -15 -15 C -35 -40, -10 -65, 10 -50 C -5 -35, 0 -20, -15 -15 Z" fill={strokeColor} />
            <path d="M -15 -15 C -45 -30, -65 -10, -50 10 C -35 -5, -20 0, -15 -15 Z" fill={strokeColor} />
          </g>
        </defs>
        
        {/* The Base Ovals */}
        <ellipse cx="400" cy="550" rx="352" ry="482" fill="none" stroke={strokeColor} strokeWidth="3" />
        
        {/* Diamond Pattern Band */}
        <ellipse cx="400" cy="550" rx="335" ry="465" fill="none" stroke="url(#vintage-diamond-pattern)" strokeWidth="12" />
        
        {/* Inner Solid Band */}
        <ellipse cx="400" cy="550" rx="318" ry="448" fill="none" stroke={strokeColor} strokeWidth="1.5" />

        
        {/* Placed Crests (Top and Bottom) */}
        <use href="#vintage-crest" x="400" y="60" />
        <use href="#vintage-crest" transform="rotate(180 400 550) translate(400, 60)" />
        
        {/* Placed Corners */}
        {/* Top-Left */}
        <use href="#vintage-corner" x="146" y="204" />
        {/* Top-Right */}
        <g transform="translate(800, 0) scale(-1, 1)">
          <use href="#vintage-corner" x="146" y="204" />
        </g>
        {/* Bottom-Left */}
        <g transform="translate(0, 1100) scale(1, -1)">
          <use href="#vintage-corner" x="146" y="204" />
        </g>
        {/* Bottom-Right */}
        <g transform="translate(800, 1100) scale(-1, -1)">
          <use href="#vintage-corner" x="146" y="204" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Golden Rococo Oval Frame
 * Highly detailed replica of a golden Rococo-style oval frame
 * with double continuous lines, detailed top/bottom cartouches, and acanthus leaf flourishes.
 */
export const GoldenRococoOvalFrame: React.FC<{
  className?: string;
  strokeColor?: string;
}> = ({ className = '', strokeColor = '#CBA153' }) => {
  return (
    <div className={`pointer-events-none select-none overflow-visible ${className}`}>
      <svg
        viewBox="0 0 800 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Outer/Inner Oval lines */}
        <ellipse cx="400" cy="600" rx="330" ry="490" fill="none" stroke={strokeColor} strokeWidth="3.5" />
        <ellipse cx="400" cy="600" rx="318" ry="478" fill="none" stroke={strokeColor} strokeWidth="1.5" />

        <defs>
          <g id="rococo-top-half" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round">
            {/* Center Acanthus Palmette */}
            <path d="M 400 30 C 405 45, 410 70, 400 90" strokeWidth="2.5" />
            <path d="M 400 85 C 420 80, 440 50, 430 30 C 425 50, 415 70, 400 75" strokeWidth="2" />
            <path d="M 400 85 C 440 85, 465 65, 465 45 C 450 65, 425 75, 405 82" strokeWidth="2" />
            <path d="M 400 85 C 455 90, 485 75, 490 60 C 475 75, 445 80, 410 85" strokeWidth="1.5" />
            
            {/* Tie Band */}
            <rect x="390" y="85" width="20" height="12" strokeWidth="2" />
            <path d="M 390 89 L 410 89" strokeWidth="1.5" />
            <path d="M 390 93 L 410 93" strokeWidth="1.5" />
            
            {/* Primary S-Scroll Volute */}
            <path d="M 420 97 C 460 90, 475 50, 445 35 C 425 25, 410 50, 420 65 C 425 70, 435 65, 430 55" strokeWidth="3" />
            
            {/* Secondary C-Scroll Below */}
            <path d="M 410 100 C 435 110, 465 110, 485 90 C 505 70, 500 45, 485 35 C 475 30, 460 40, 465 50" strokeWidth="2.5" />
            
            {/* Elaborate Drooping Acanthus */}
            <path d="M 480 85 C 500 105, 520 140, 525 180 C 530 220, 520 260, 500 300" strokeWidth="2.5" />
            <path d="M 485 95 C 510 110, 530 145, 535 180 C 540 215, 530 255, 510 290" strokeWidth="1.5" />
            
            {/* Foliage outwards */}
            <path d="M 515 130 C 540 120, 565 135, 575 160 C 560 145, 535 140, 520 145 Z" fill="none" strokeWidth="2" />
            <path d="M 525 170 C 555 160, 585 180, 595 210 C 575 190, 545 185, 528 190 Z" fill="none" strokeWidth="2" />
            <path d="M 520 220 C 550 210, 575 235, 580 265 C 560 245, 535 235, 515 240 Z" fill="none" strokeWidth="2" />
            
            {/* Accents */}
            <path d="M 570 165 C 575 170, 585 165, 580 155" strokeWidth="1.5" />
            <path d="M 590 215 C 595 220, 605 215, 600 205" strokeWidth="1.5" />
            <path d="M 575 270 C 580 275, 590 270, 585 260" strokeWidth="1.5" />
            <circle cx="485" cy="45" r="2.5" fill={strokeColor} stroke="none" />
            <circle cx="435" cy="45" r="2" fill={strokeColor} stroke="none" />
          </g>

          <g id="rococo-bottom-half" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round">
            {/* Center Pendant */}
            <path d="M 400 1170 C 405 1155, 410 1130, 400 1110" strokeWidth="2.5" />
            <path d="M 400 1165 C 420 1170, 440 1195, 430 1215 C 425 1195, 415 1175, 400 1170" strokeWidth="2" />
            <path d="M 400 1165 C 440 1165, 465 1185, 465 1205 C 450 1185, 425 1175, 405 1168" strokeWidth="2" />
            
            {/* Tie Band */}
            <rect x="390" y="1100" width="20" height="12" strokeWidth="2" />
            <path d="M 390 1104 L 410 1104" strokeWidth="1.5" />
            <path d="M 390 1108 L 410 1108" strokeWidth="1.5" />
            
            {/* Cartouche Core Scroll */}
            <path d="M 420 1095 C 460 1100, 480 1140, 450 1160 C 430 1170, 410 1145, 420 1130 C 425 1125, 435 1130, 430 1140" strokeWidth="3" />
            
            {/* Lower sweeping S-Scroll */}
            <path d="M 445 1115 C 475 1100, 500 1070, 515 1030 C 530 990, 535 940, 520 890" strokeWidth="2.5" />
            <path d="M 455 1105 C 485 1090, 510 1060, 525 1025 C 540 985, 545 935, 530 885" strokeWidth="1.5" />
            
            {/* Foliage outwards */}
            <path d="M 505 1060 C 530 1070, 555 1055, 565 1030 C 550 1045, 525 1050, 510 1045 Z" fill="none" strokeWidth="2" />
            <path d="M 520 1010 C 550 1020, 580 1000, 590 970 C 570 990, 540 995, 525 990 Z" fill="none" strokeWidth="2" />
            <path d="M 525 950 C 555 960, 580 940, 585 910 C 565 930, 540 940, 520 935 Z" fill="none" strokeWidth="2" />
            
            {/* Accents */}
            <path d="M 560 1025 C 565 1020, 575 1025, 570 1035" strokeWidth="1.5" />
            <path d="M 585 965 C 590 960, 600 965, 595 975" strokeWidth="1.5" />
            <path d="M 580 905 C 585 900, 595 905, 590 915" strokeWidth="1.5" />
            <circle cx="435" cy="1150" r="2" fill={strokeColor} stroke="none" />
          </g>
        </defs>

        {/* Placements */}
        <use href="#rococo-top-half" />
        <use href="#rococo-top-half" transform="translate(800, 0) scale(-1, 1)" />
        <use href="#rococo-bottom-half" />
        <use href="#rococo-bottom-half" transform="translate(800, 0) scale(-1, 1)" />
      </svg>
    </div>
  );
};

