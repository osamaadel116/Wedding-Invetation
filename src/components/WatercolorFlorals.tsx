import React from 'react';

interface FloralProps {
  tone?: 'blush' | 'sage' | 'dustyBlue' | 'emerald' | 'burgundy' | 'champagne' | 'frostyWinter' | 'frostedRose' | 'icySlate';
  className?: string;
}

const colorMaps = {
  frostyWinter: {
    petal1: '#8FA8BE',
    petal2: '#C9D9E5',
    petal3: '#4F728C',
    roseInner: '#EBF3F8',
    roseOuter: '#7594AB',
    center: '#F7FAFC',
    leaf1: '#5A756C',
    leaf2: '#354E46',
    gold: '#B69A5E',
    silver: '#D3DFE8',
    frost: '#FFFFFF',
  },
  frostedRose: {
    petal1: '#C48D9E',
    petal2: '#E8BCC8',
    petal3: '#874D60',
    roseInner: '#FAEDF1',
    roseOuter: '#B57488',
    center: '#FFF5F8',
    leaf1: '#6E857C',
    leaf2: '#415951',
    gold: '#C5A059',
    silver: '#E2D9DF',
    frost: '#FFFFFF',
  },
  icySlate: {
    petal1: '#708E9B',
    petal2: '#B4CAD2',
    petal3: '#3A5B69',
    roseInner: '#E9F1F4',
    roseOuter: '#567988',
    center: '#F2F8FA',
    leaf1: '#4A635B',
    leaf2: '#273F38',
    gold: '#A5926B',
    silver: '#C8D9E2',
    frost: '#FFFFFF',
  },
  blush: {
    petal1: '#E8A598',
    petal2: '#F4C2C2',
    petal3: '#D87093',
    roseInner: '#FFF0F5',
    roseOuter: '#E8A598',
    center: '#FFF0F5',
    leaf1: '#8A9A86',
    leaf2: '#5F7161',
    gold: '#D4AF37',
    silver: '#E8DFD8',
    frost: '#FFFFFF',
  },
  sage: {
    petal1: '#C9D5B5',
    petal2: '#E3EAD2',
    petal3: '#99A88C',
    roseInner: '#F7FAEE',
    roseOuter: '#BAC9A3',
    center: '#F7FAEE',
    leaf1: '#588157',
    leaf2: '#3A5A40',
    gold: '#C5A059',
    silver: '#DDE2D6',
    frost: '#FFFFFF',
  },
  dustyBlue: {
    petal1: '#8EA8C3',
    petal2: '#B8CBD0',
    petal3: '#5C7D99',
    roseInner: '#F0F5F9',
    roseOuter: '#7D9AB6',
    center: '#F0F5F9',
    leaf1: '#778899',
    leaf2: '#4A6B82',
    gold: '#C0A060',
    silver: '#CBD8E2',
    frost: '#FFFFFF',
  },
  emerald: {
    petal1: '#84A98C',
    petal2: '#CAD2C5',
    petal3: '#52796F',
    roseInner: '#F1F8F5',
    roseOuter: '#6A9482',
    center: '#F1F8F5',
    leaf1: '#2D6A4F',
    leaf2: '#1B4332',
    gold: '#D4AF37',
    silver: '#D2DDD7',
    frost: '#FFFFFF',
  },
  burgundy: {
    petal1: '#A84351',
    petal2: '#D68C96',
    petal3: '#6B1E28',
    roseInner: '#FDECEF',
    roseOuter: '#943340',
    center: '#FDECEF',
    leaf1: '#5D675B',
    leaf2: '#3E473D',
    gold: '#DFC186',
    silver: '#E5D6D8',
    frost: '#FFFFFF',
  },
  champagne: {
    petal1: '#DFC186',
    petal2: '#F3E5AB',
    petal3: '#C5A059',
    roseInner: '#FFFDF9',
    roseOuter: '#D2B270',
    center: '#FFFDF9',
    leaf1: '#A39F87',
    leaf2: '#736F5A',
    gold: '#B8860B',
    silver: '#EAE5D9',
    frost: '#FFFFFF',
  },
};

/**
 * Top-left or Top-right watercolor corner floral bouquet
 */
export const WatercolorCorner: React.FC<FloralProps & { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({
  position = 'top-left',
  className = '',
}) => {
  let transformClass = '';
  if (position === 'top-right') transformClass = 'scale-x-[-1]';
  if (position === 'bottom-left') transformClass = 'scale-y-[-1]';
  if (position === 'bottom-right') transformClass = 'scale-[-1]';

  return (
    <div className={`pointer-events-none select-none overflow-hidden ${transformClass} ${className}`}>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
      >
        <defs>
          <filter id={`watercolor-splash-${position}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="15" result="blur" />
          </filter>

          <filter id={`watercolor-details-${position}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="1" />
          </filter>

          <radialGradient id={`mainFlowerGrad-${position}`} cx="45%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#431418" />
            <stop offset="25%" stopColor="#8A3843" />
            <stop offset="55%" stopColor="#C8727B" />
            <stop offset="85%" stopColor="#E09FA6" />
            <stop offset="100%" stopColor="#F5D6D8" />
          </radialGradient>

          <radialGradient id={`smallFlowerGrad-${position}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4A1E1E" />
            <stop offset="30%" stopColor="#B36054" />
            <stop offset="70%" stopColor="#E19D88" />
            <stop offset="100%" stopColor="#F4D3C9" />
          </radialGradient>
        </defs>

        {/* Large Sage Watercolor Splash */}
        <path d="M 0 0 L 250 0 C 300 50, 250 150, 150 250 C 50 300, 0 250, 0 0 Z" fill="#B4C5AB" opacity="0.4" filter={`url(#watercolor-splash-${position})`} />

        <g filter={`url(#watercolor-details-${position})`}>
          {/* Delicate Stems & Foliage */}
          {/* Brown stems extending right */}
          <path d="M 50 50 Q 150 80 280 40" stroke="#7D5F54" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 120 70 Q 220 120 320 100" stroke="#7D5F54" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 220 120 Q 280 150 340 160" stroke="#7D5F54" strokeWidth="1" fill="none" strokeLinecap="round" />
          
          {/* Stems extending down */}
          <path d="M 50 50 Q 80 150 40 280" stroke="#7D5F54" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 70 120 Q 120 220 100 320" stroke="#7D5F54" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 120 220 Q 150 280 160 340" stroke="#7D5F54" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Dark Green Leaves */}
          {/* Right extending */}
          <path d="M 160 50 C 180 30, 210 40, 220 60 C 200 70, 170 70, 160 50 Z" fill="#4B6051" opacity="0.9" />
          <path d="M 220 80 C 250 60, 270 70, 280 90 C 250 100, 230 100, 220 80 Z" fill="#4B6051" opacity="0.9" />
          <path d="M 190 150 C 210 130, 230 140, 240 160 C 220 170, 200 170, 190 150 Z" fill="#4B6051" opacity="0.8" />
          
          {/* Down extending */}
          <path d="M 50 160 C 30 180, 40 210, 60 220 C 70 200, 70 170, 50 160 Z" fill="#4B6051" opacity="0.9" />
          <path d="M 80 220 C 60 250, 70 270, 90 280 C 100 250, 100 230, 80 220 Z" fill="#4B6051" opacity="0.9" />
          <path d="M 150 190 C 130 210, 140 230, 160 240 C 170 220, 170 200, 150 190 Z" fill="#4B6051" opacity="0.8" />

          {/* Light Sage Leaves */}
          <path d="M 110 20 C 140 0, 170 10, 180 30 C 150 40, 120 40, 110 20 Z" fill="#88A291" opacity="0.85" />
          <path d="M 200 110 C 220 90, 250 100, 260 120 C 230 140, 210 130, 200 110 Z" fill="#88A291" opacity="0.85" />
          <path d="M 20 110 C 0 140, 10 170, 30 180 C 40 150, 40 120, 20 110 Z" fill="#88A291" opacity="0.85" />
          <path d="M 110 200 C 90 220, 100 250, 120 260 C 140 230, 130 210, 110 200 Z" fill="#88A291" opacity="0.85" />

          {/* Peach / Tiny Leaves (Adding subtle warm tones) */}
          <path d="M 250 40 C 260 30, 270 35, 275 45 C 265 50, 255 50, 250 40 Z" fill="#D98A90" />
          <path d="M 280 50 C 290 40, 300 45, 305 55 C 295 60, 285 60, 280 50 Z" fill="#E19D88" />
          <path d="M 310 90 C 320 80, 330 85, 335 95 C 325 100, 315 100, 310 90 Z" fill="#D98A90" />
          <path d="M 40 250 C 30 260, 35 270, 45 275 C 50 265, 50 255, 40 250 Z" fill="#D98A90" />
          <path d="M 50 280 C 40 290, 45 300, 55 305 C 60 295, 60 285, 50 280 Z" fill="#E19D88" />
          <path d="M 90 310 C 80 320, 85 330, 95 335 C 100 325, 100 315, 90 310 Z" fill="#D98A90" />

          {/* Small Flower (Top Right) */}
          <g transform="translate(190, 130)">
            <path d="M 0 0 C 20 -30, 40 -10, 30 10 C 10 20, 0 10, 0 0 Z" fill={`url(#smallFlowerGrad-${position})`} />
            <path d="M 0 0 C 30 -10, 30 20, 10 30 C -10 20, -10 0, 0 0 Z" fill={`url(#smallFlowerGrad-${position})`} />
            <path d="M 0 0 C 10 30, -20 30, -30 10 C -20 -10, -10 -10, 0 0 Z" fill={`url(#smallFlowerGrad-${position})`} />
            <path d="M 0 0 C -30 10, -30 -20, -10 -30 C 10 -20, 10 0, 0 0 Z" fill={`url(#smallFlowerGrad-${position})`} />
            <path d="M 0 0 C -10 -30, 20 -30, 10 -10 C 0 -10, 0 0, 0 0 Z" fill={`url(#smallFlowerGrad-${position})`} opacity="0.8" />
            <circle cx="0" cy="0" r="5" fill="#3E1A1A" />
            <circle cx="-2" cy="-2" r="1.5" fill="#E8B071" />
            <circle cx="2" cy="1" r="1.5" fill="#E8B071" />
            <circle cx="0" cy="3" r="1.5" fill="#E8B071" />
          </g>

          {/* Small Flower (Bottom) */}
          <g transform="translate(130, 190) scale(0.9)">
            <path d="M 0 0 C 20 -30, 40 -10, 30 10 C 10 20, 0 10, 0 0 Z" fill={`url(#smallFlowerGrad-${position})`} />
            <path d="M 0 0 C 30 -10, 30 20, 10 30 C -10 20, -10 0, 0 0 Z" fill={`url(#smallFlowerGrad-${position})`} />
            <path d="M 0 0 C 10 30, -20 30, -30 10 C -20 -10, -10 -10, 0 0 Z" fill={`url(#smallFlowerGrad-${position})`} />
            <path d="M 0 0 C -30 10, -30 -20, -10 -30 C 10 -20, 10 0, 0 0 Z" fill={`url(#smallFlowerGrad-${position})`} />
            <path d="M 0 0 C -10 30, -30 10, -10 0 C 0 0, 0 0, 0 0 Z" fill={`url(#smallFlowerGrad-${position})`} opacity="0.8" />
            <circle cx="0" cy="0" r="5.5" fill="#3E1A1A" />
            <circle cx="-2" cy="2" r="1.5" fill="#E8B071" />
            <circle cx="3" cy="-1" r="1.5" fill="#E8B071" />
            <circle cx="-1" cy="-3" r="1.5" fill="#E8B071" />
          </g>

          {/* MAIN LARGE DUSTY ROSE/BURGUNDY FLOWER */}
          <g transform="translate(90, 90)">
            {/* Outer wide flowing petals */}
            <path d="M 0 0 C 80 -80, 130 0, 60 50 Z" fill={`url(#mainFlowerGrad-${position})`} />
            <path d="M 0 0 C 60 100, -20 120, -60 60 Z" fill={`url(#mainFlowerGrad-${position})`} />
            <path d="M 0 0 C -90 60, -110 -20, -40 -70 Z" fill={`url(#mainFlowerGrad-${position})`} />
            <path d="M 0 0 C -50 -110, 40 -110, 50 -50 Z" fill={`url(#mainFlowerGrad-${position})`} />
            
            {/* Mid layer petals */}
            <path d="M -10 -10 C 60 -50, 90 10, 40 50 C 20 60, 0 40, -10 -10 Z" fill="#CA7882" opacity="0.85" />
            <path d="M 10 10 C 40 70, -30 80, -50 40 C -60 20, -20 0, 10 10 Z" fill="#BA5F6B" opacity="0.85" />
            <path d="M -10 10 C -60 50, -80 -20, -40 -40 C -20 -50, 10 -30, -10 10 Z" fill="#D9949C" opacity="0.9" />

            {/* Inner ruffled layer */}
            <path d="M 0 0 C 30 -30, 40 10, 10 20 Z" fill="#A54552" opacity="0.9" />
            <path d="M 0 0 C -30 -20, -20 30, 10 20 Z" fill="#8C3541" opacity="0.9" />

            {/* Deep burgundy center cone/ruffle */}
            <path d="M -5 -5 C 20 -25, 35 15, 10 25 C -15 35, -35 0, -5 -5 Z" fill="#6A2229" />
            <path d="M 0 0 C 15 -10, 20 5, 5 15 C -5 20, -20 0, 0 0 Z" fill="#391014" />
            
            {/* Golden Stamen dots */}
            <circle cx="6" cy="0" r="2" fill="#E6C289" />
            <circle cx="9" cy="6" r="2" fill="#E6C289" />
            <circle cx="4" cy="11" r="1.5" fill="#E6C289" />
            <circle cx="-3" cy="9" r="2" fill="#E6C289" />
            <circle cx="-8" cy="3" r="1.5" fill="#E6C289" />
            <circle cx="-4" cy="-5" r="2" fill="#E6C289" />
            <circle cx="1" cy="-7" r="1.5" fill="#E6C289" />
          </g>
        </g>
      </svg>
    </div>
  );
};

/**
 * Elegant Center Floral Arch / Wreath for Headers & Hero
 */
export const WatercolorWreath: React.FC<FloralProps> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none select-none flex justify-center items-center ${className}`}>
      <svg
        viewBox="0 0 400 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-md h-auto drop-shadow-sm opacity-95"
      >
        <defs>
          <filter id="wreath-details">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>
        
        {/* Curved Golden Garland Line (Changed to brown/dusty red to match image) */}
        <path
          d="M 40 80 Q 200 20 360 80"
          stroke="#7D5F54"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.65"
        />

        <g filter="url(#wreath-details)">
          {/* Left Side Foliage */}
          <g transform="translate(60, 45) scale(0.65)">
            <ellipse cx="40" cy="20" rx="14" ry="24" transform="rotate(-40 40 20)" fill="#88A291" opacity="0.85" />
            <ellipse cx="65" cy="15" rx="12" ry="18" transform="rotate(-20 65 15)" fill="#4B6051" opacity="0.9" />
            <ellipse cx="90" cy="15" rx="10" ry="16" transform="rotate(10 90 15)" fill="#88A291" opacity="0.85" />
            <circle cx="30" cy="10" r="3" fill="#D98A90" opacity="0.9" />
            <circle cx="50" cy="5" r="2.5" fill="#E19D88" />
          </g>

          {/* Right Side Foliage */}
          <g transform="translate(240, 45) scale(0.65) scale(-1, 1)">
            <ellipse cx="-40" cy="20" rx="14" ry="24" transform="rotate(-40 -40 20)" fill="#88A291" opacity="0.85" />
            <ellipse cx="-65" cy="15" rx="12" ry="18" transform="rotate(-20 -65 15)" fill="#4B6051" opacity="0.9" />
            <ellipse cx="-90" cy="15" rx="10" ry="16" transform="rotate(10 -90 15)" fill="#88A291" opacity="0.85" />
            <circle cx="-30" cy="10" r="3" fill="#D98A90" opacity="0.9" />
            <circle cx="-50" cy="5" r="2.5" fill="#E19D88" />
          </g>

          {/* Center Clustered Watercolor Blossom (Matching Burgundy / Dusty Rose) */}
          <g transform="translate(200, 45)">
            {/* Outer Petals */}
            <path d="M 0 0 C -30 -30, -40 10, -20 20 Z" fill="#F5D6D8" />
            <path d="M 0 0 C 30 -30, 40 10, 20 20 Z" fill="#F5D6D8" />
            <path d="M 0 0 C 20 30, -20 30, 0 10 Z" fill="#F5D6D8" />
            
            {/* Inner */}
            <ellipse cx="-10" cy="-5" rx="12" ry="14" fill="#C8727B" transform="rotate(-20 -10 -5)" opacity="0.9" />
            <ellipse cx="10" cy="-5" rx="12" ry="14" fill="#C8727B" transform="rotate(20 10 -5)" opacity="0.9" />
            <ellipse cx="0" cy="5" rx="14" ry="12" fill="#E09FA6" opacity="0.9" />
            
            {/* Center */}
            <circle cx="0" cy="0" r="10" fill="#6A2229" />
            <circle cx="0" cy="0" r="5" fill="#391014" />
            <circle cx="0" cy="0" r="2.5" fill="#E6C289" />
            <circle cx="-4" cy="-2" r="1.5" fill="#E6C289" />
            <circle cx="3" cy="-1" r="1.5" fill="#E6C289" />
          </g>
        </g>
      </svg>
    </div>
  );
};

/**
 * Delicate horizontal watercolor divider between sections
 */
export const WatercolorDivider: React.FC<FloralProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center my-6 gap-3 ${className}`}>
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#88A291] to-transparent opacity-60" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-90">
        <path
          d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
          fill="#4B6051"
        />
        <circle cx="12" cy="10" r="2.5" fill="#C8727B" opacity="0.9" />
      </svg>
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#88A291] to-transparent opacity-60" />
    </div>
  );
};

/**
 * Romantic Falling Flower Petals Canvas Simulation
 */
export const FallingPetals: React.FC<{
  tone?:
    | 'blush'
    | 'sage'
    | 'dustyBlue'
    | 'emerald'
    | 'burgundy'
    | 'champagne'
    | 'frostyWinter'
    | 'frostedRose'
    | 'icySlate';
}> = ({
  tone = 'blush',
}) => {
  const c = colorMaps[tone] || colorMaps.blush;

  // 30 subtle falling petals staggered with CSS animations
  const petals = [
    { id: 1, left: '8%', delay: '0s', duration: '14s', size: 14, rot: 45, anim: 'float-petal' },
    { id: 2, left: '22%', delay: '3s', duration: '18s', size: 18, rot: 90, anim: 'float-petal-alt' },
    { id: 3, left: '38%', delay: '7s', duration: '15s', size: 12, rot: 135, anim: 'float-petal' },
    { id: 4, left: '55%', delay: '1.5s', duration: '20s', size: 16, rot: 30, anim: 'float-petal-alt' },
    { id: 5, left: '72%', delay: '5s', duration: '16s', size: 20, rot: 75, anim: 'float-petal' },
    { id: 6, left: '88%', delay: '9s', duration: '17s', size: 13, rot: 160, anim: 'float-petal-alt' },
    { id: 7, left: '15%', delay: '11s', duration: '19s', size: 15, rot: 210, anim: 'float-petal' },
    { id: 8, left: '48%', delay: '13s', duration: '13s', size: 17, rot: 280, anim: 'float-petal-alt' },
    { id: 9, left: '82%', delay: '4s', duration: '15s', size: 14, rot: 310, anim: 'float-petal' },
    { id: 10, left: '5%', delay: '2s', duration: '16s', size: 15, rot: 15, anim: 'float-petal-alt' },
    { id: 11, left: '28%', delay: '8s', duration: '22s', size: 12, rot: 65, anim: 'float-petal' },
    { id: 12, left: '42%', delay: '1.2s', duration: '14s', size: 19, rot: 115, anim: 'float-petal-alt' },
    { id: 13, left: '60%', delay: '6.5s', duration: '18s', size: 14, rot: 190, anim: 'float-petal' },
    { id: 14, left: '78%', delay: '12s', duration: '21s', size: 16, rot: 250, anim: 'float-petal-alt' },
    { id: 15, left: '95%', delay: '3.5s', duration: '15s', size: 18, rot: 325, anim: 'float-petal' },
    { id: 16, left: '12%', delay: '10s', duration: '17s', size: 13, rot: 80, anim: 'float-petal-alt' },
    { id: 17, left: '33%', delay: '5.5s', duration: '19s', size: 21, rot: 140, anim: 'float-petal' },
    { id: 18, left: '51%', delay: '9.5s', duration: '16s', size: 15, rot: 200, anim: 'float-petal-alt' },
    { id: 19, left: '68%', delay: '0.5s', duration: '14s', size: 17, rot: 260, anim: 'float-petal' },
    { id: 20, left: '85%', delay: '7.5s', duration: '20s', size: 12, rot: 340, anim: 'float-petal-alt' },
    { id: 21, left: '18%', delay: '1.8s', duration: '15s', size: 16, rot: 25, anim: 'float-petal' },
    { id: 22, left: '39%', delay: '11.5s', duration: '18s', size: 14, rot: 105, anim: 'float-petal-alt' },
    { id: 23, left: '64%', delay: '4.5s', duration: '17s', size: 19, rot: 175, anim: 'float-petal' },
    { id: 24, left: '92%', delay: '8.5s', duration: '21s', size: 13, rot: 235, anim: 'float-petal-alt' },
    { id: 25, left: '10%', delay: '6.2s', duration: '16s', size: 18, rot: 55, anim: 'float-petal' },
    { id: 26, left: '25%', delay: '14s', duration: '19s', size: 15, rot: 125, anim: 'float-petal-alt' },
    { id: 27, left: '45%', delay: '2.5s', duration: '15s', size: 20, rot: 185, anim: 'float-petal' },
    { id: 28, left: '75%', delay: '10.5s', duration: '22s', size: 14, rot: 295, anim: 'float-petal-alt' },
    { id: 29, left: '80%', delay: '1.1s', duration: '14s', size: 16, rot: 155, anim: 'float-petal' },
    { id: 30, left: '90%', delay: '13.5s', duration: '18s', size: 17, rot: 315, anim: 'float-petal-alt' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal-floating"
          style={{
            left: p.left,
            animationName: p.anim,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.3}
            viewBox="0 0 30 40"
            fill="none"
            style={{ transform: `rotate(${p.rot}deg)` }}
            className="opacity-70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
          >
            <path
              d="M 15 0 C 28 8, 30 25, 15 40 C 0 25, 2 8, 15 0 Z"
              fill={c.petal2}
              opacity="0.8"
            />
            <path
              d="M 15 5 C 22 12, 24 24, 15 35 C 6 24, 8 12, 15 5 Z"
              fill={c.petal1}
              opacity="0.4"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
