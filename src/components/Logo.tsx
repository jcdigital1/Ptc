import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-3xl', sub: 'text-sm' },
  };

  const { icon: iconSize, text: textSize, sub: subSize } = sizeMap[size];

  // Original Icon: A modern shopping bag fused with a location pin and dynamic "V" mark
  const IconSymbol = (
    <div
      className="relative flex-shrink-0 flex items-center justify-center"
      style={{ width: iconSize, height: iconSize }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform hover:scale-105 duration-200"
      >
        <defs>
          <linearGradient id="vendiOrangeGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#F95700" />
          </linearGradient>
          <linearGradient id="vendiBagFolds" x1="30" y1="35" x2="70" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="vendiAccentGrad" x1="25" y1="40" x2="75" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF1E8" />
          </linearGradient>
        </defs>

        {/* Location Pin Head + Bag Silhouette Combined */}
        <path
          d="M50 8C33.4 8 20 21.4 20 38C20 48.5 25.5 58 34 63.5L30 84C29.6 86.2 31.4 88 33.6 88H66.4C68.6 88 70.4 86.2 70 84L66 63.5C74.5 58 80 48.5 80 38C80 21.4 66.6 8 50 8Z"
          fill="url(#vendiOrangeGrad)"
        />

        {/* Bag Handle Loop (Upper Pin Hole styling) */}
        <path
          d="M41 24C41 19 45 15 50 15C55 15 59 19 59 24C59 27.5 57 30 50 34C43 30 41 27.5 41 24Z"
          fill="#FFFFFF"
        />

        {/* Pin Center Dot / Handle Opening */}
        <circle cx="50" cy="24" r="4" fill="#F95700" />

        {/* Dynamic Stylized "V" inside bag body */}
        <path
          d="M36 44L48.2 68.4C49 70 51 70 51.8 68.4L64 44C65.2 41.6 63.2 39 60.5 39C59.2 39 58 39.8 57.4 41L50 56.5L42.6 41C42 39.8 40.8 39 39.5 39C36.8 39 34.8 41.6 36 44Z"
          fill="url(#vendiAccentGrad)"
        />

        {/* Small location pulse ring on bag bottom */}
        <rect x="42" y="80" width="16" height="3" rx="1.5" fill="#FFFFFF" opacity="0.8" />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center cursor-pointer select-none ${className}`}
        title="Vendi Patrocínio"
      >
        {IconSymbol}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
      title="Vendi Patrocínio - Marketplace Local"
    >
      {IconSymbol}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span className={`font-extrabold tracking-tight text-gray-900 ${textSize} group-hover:text-orange-600 transition-colors`}>
            Vendi
          </span>
          <span className={`font-black tracking-tight text-[#F95700] ${textSize}`}>
            Patrocínio
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 font-semibold tracking-wider uppercase mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className={`${subSize} text-gray-500`}>Compre e venda local • MG</span>
        </div>
      </div>
    </div>
  );
};
