import React from 'react';

export interface MapBackdropProps {
  className?: string;
}

/** Stylised relief map of Kyrgyzstan (1000×600 viewBox) used under map pins. */
export const MapBackdrop: React.FC<MapBackdropProps> = ({ className }) => (
  <svg
    viewBox="0 0 1000 600"
    className={className}
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="mapWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="reliefGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5E0D4" />
        <stop offset="50%" stopColor="#D9D2C2" />
        <stop offset="100%" stopColor="#C9C0AE" />
      </linearGradient>
    </defs>

    {/* Base land */}
    <rect width="1000" height="600" fill="#E8F1EC" />

    {/* Kyrgyzstan Mountain Terrain Poly */}
    <path
      d="M 120 480 Q 200 420 300 400 T 450 320 T 600 300 T 800 240 T 920 280 L 950 420 Q 850 460 750 480 T 550 520 T 350 560 T 150 520 Z"
      fill="url(#reliefGrad)"
      stroke="#B4AB9A"
      strokeWidth="2"
    />

    {/* Issyk-Kul Lake */}
    <ellipse cx="730" cy="270" rx="90" ry="32" fill="url(#mapWaterGrad)" opacity="0.9" />
    <text x="730" y="274" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
      Озеро Ысык-Көл
    </text>

    {/* Son-Kul Lake */}
    <ellipse cx="510" cy="330" rx="36" ry="18" fill="url(#mapWaterGrad)" opacity="0.85" />
    <text x="510" y="334" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
      Сон-Көл
    </text>

    {/* Toktogul */}
    <ellipse cx="360" cy="290" rx="28" ry="14" fill="url(#mapWaterGrad)" opacity="0.8" />

    {/* Country boundary outline */}
    <path
      d="M 120 470 C 140 430, 220 400, 310 400 C 370 340, 420 280, 500 250 C 600 230, 750 200, 880 230 C 950 250, 960 360, 890 420 C 820 470, 700 520, 520 520 C 380 550, 240 550, 140 510 Z"
      fill="none"
      stroke="#165389"
      strokeWidth="2"
      strokeDasharray="6 4"
      opacity="0.4"
    />

    {/* Country name */}
    <text x="490" y="440" fill="#475569" fontSize="28" fontWeight="800" letterSpacing="4" opacity="0.4" textAnchor="middle">
      KYRGYZSTAN
    </text>
  </svg>
);
