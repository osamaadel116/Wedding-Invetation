import re

with open('src/components/WatercolorFlorals.tsx', 'r') as f:
    content = f.read()

new_corner = """export const WatercolorCorner: React.FC<FloralProps & { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({
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
};"""

new_wreath = """export const WatercolorWreath: React.FC<FloralProps> = ({ className = '' }) => {
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
};"""

new_divider = """export const WatercolorDivider: React.FC<FloralProps> = ({ className = '' }) => {
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
};"""

content = re.sub(r'export const WatercolorCorner: React\.FC<FloralProps & \{ position\?: \'top-left\' \| \'top-right\' \| \'bottom-left\' \| \'bottom-right\' \}> = \(\{.*?^\};', new_corner, content, flags=re.DOTALL | re.MULTILINE)
content = re.sub(r'export const WatercolorWreath: React\.FC<FloralProps> = \(\{.*?^\};', new_wreath, content, flags=re.DOTALL | re.MULTILINE)
content = re.sub(r'export const WatercolorDivider: React\.FC<FloralProps> = \(\{.*?^\};', new_divider, content, flags=re.DOTALL | re.MULTILINE)

with open('src/components/WatercolorFlorals.tsx', 'w') as f:
    f.write(content)
