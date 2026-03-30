/*
 * Design: Green Ink Press — Editorial newspaper style
 * KharijLogo: Artistic SVG logo for "خارج النص" podcast
 * Concept: Open book with wind-swept pages + stylized quill crossing diagonally
 * with ink drop, radiating lines suggesting ideas flowing beyond the text.
 */

interface KharijLogoProps {
  size?: number;
  /** "navbar" = compact, muted greens on dark bg; "podcast" = larger, brighter on dark bg */
  variant?: "navbar" | "podcast";
  className?: string;
}

export default function KharijLogo({ size = 40, variant = "navbar", className = "" }: KharijLogoProps) {
  const bright = variant === "podcast";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Left page gradient — darker green */}
        <linearGradient id={`lgL-${variant}`} x1="4" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={bright ? "#3a9e60" : "#2a6e42"} />
          <stop offset="100%" stopColor={bright ? "#1e6b3a" : "#143d22"} />
        </linearGradient>
        {/* Right page gradient — slightly lighter */}
        <linearGradient id={`lgR-${variant}`} x1="44" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={bright ? "#4db87a" : "#3a7d52"} />
          <stop offset="100%" stopColor={bright ? "#2a8a4e" : "#1e5230"} />
        </linearGradient>
        {/* Quill gradient */}
        <linearGradient id={`lgQ-${variant}`} x1="14" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={bright ? "#d4f5e2" : "#a8e6c0"} />
          <stop offset="60%" stopColor={bright ? "#7cc89a" : "#5aaa78"} />
          <stop offset="100%" stopColor={bright ? "#3a9e60" : "#2e7d4a"} />
        </linearGradient>
        {/* Glow filter for quill */}
        <filter id={`glow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── BOOK BASE SHADOW ── */}
      <ellipse cx="24" cy="38.5" rx="14" ry="2" fill="#000" fillOpacity="0.18" />

      {/* ── LEFT PAGE — curved, slightly lifted at corner ── */}
      <path
        d="M24 12
           C24 12 17 10.5 10 12
           C7 13 5 15 5 17
           L5 36
           C5 36 11 34.5 18 35.5
           C20.5 35.9 22.5 36.5 24 37
           Z"
        fill={`url(#lgL-${variant})`}
        stroke={bright ? "#7cc89a" : "#4a8a62"}
        strokeWidth="0.6"
      />

      {/* Left page — top corner curl */}
      <path
        d="M10 12 C9 11 8.5 10 9.5 9.5 C10.5 9 11.5 10 10 12Z"
        fill={bright ? "#5aaa78" : "#3a6e4e"}
        opacity="0.7"
      />

      {/* Left page text lines */}
      <line x1="8"  y1="18" x2="21" y2="17.2" stroke={bright ? "#a8e6c0" : "#6aaa82"} strokeWidth="0.7" strokeOpacity="0.55" strokeLinecap="round" />
      <line x1="8"  y1="21" x2="21" y2="20.3" stroke={bright ? "#a8e6c0" : "#6aaa82"} strokeWidth="0.7" strokeOpacity="0.45" strokeLinecap="round" />
      <line x1="8"  y1="24" x2="21" y2="23.4" stroke={bright ? "#a8e6c0" : "#6aaa82"} strokeWidth="0.7" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="8"  y1="27" x2="18" y2="26.5" stroke={bright ? "#a8e6c0" : "#6aaa82"} strokeWidth="0.7" strokeOpacity="0.25" strokeLinecap="round" />

      {/* ── RIGHT PAGE — slightly more open/lifted ── */}
      <path
        d="M24 12
           C24 12 31 10.5 38 12
           C41 13 43 15 43 17
           L43 36
           C43 36 37 34.5 30 35.5
           C27.5 35.9 25.5 36.5 24 37
           Z"
        fill={`url(#lgR-${variant})`}
        stroke={bright ? "#7cc89a" : "#4a8a62"}
        strokeWidth="0.6"
      />

      {/* Right page — top corner curl */}
      <path
        d="M38 12 C39 11 39.5 10 38.5 9.5 C37.5 9 36.5 10 38 12Z"
        fill={bright ? "#7cc89a" : "#4a8a62"}
        opacity="0.7"
      />

      {/* Right page text lines — shorter, suggesting "beyond" */}
      <line x1="27" y1="18" x2="40" y2="17.2" stroke={bright ? "#a8e6c0" : "#6aaa82"} strokeWidth="0.7" strokeOpacity="0.55" strokeLinecap="round" />
      <line x1="27" y1="21" x2="40" y2="20.3" stroke={bright ? "#a8e6c0" : "#6aaa82"} strokeWidth="0.7" strokeOpacity="0.45" strokeLinecap="round" />
      <line x1="27" y1="24" x2="37" y2="23.4" stroke={bright ? "#a8e6c0" : "#6aaa82"} strokeWidth="0.7" strokeOpacity="0.35" strokeLinecap="round" />

      {/* ── BOOK SPINE — elegant curved center line ── */}
      <path
        d="M24 11 C23.2 18 23.5 28 24 37"
        stroke={bright ? "#c8f0da" : "#8aba9e"}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── QUILL PEN — diagonal, crossing both pages ── */}
      {/* Feather body */}
      <path
        d="M33 7
           C35 8 37 10 36.5 12
           C36 14 34 15 32 17
           C30 19 28 22 26.5 25
           C25.5 27 25 29 24.5 31
           L23 31.5
           C23.5 29 24 27 25 25
           C26.5 22 28.5 19 30.5 17
           C32.5 15 34 13.5 34 12
           C34 10.5 32 9 30 8
           Z"
        fill={`url(#lgQ-${variant})`}
        filter={`url(#glow-${variant})`}
      />
      {/* Feather inner vane — lighter highlight */}
      <path
        d="M33 8.5
           C34.5 9.5 35.5 11 35 12.5
           C34.5 14 33 15 31.5 16.5
           C30 18 28.5 20.5 27.5 23
           L26.5 25
           C27.5 22.5 29 19.5 30.5 17.5
           C32 15.5 33.5 14 34 12.5
           C34.5 11 33.5 9.5 32 8.5
           Z"
        fill={bright ? "#e8faf0" : "#c8f0da"}
        fillOpacity="0.35"
      />
      {/* Quill shaft */}
      <path
        d="M24.5 31 L22 39"
        stroke={`url(#lgQ-${variant})`}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Nib split */}
      <path
        d="M22 39 L20.5 43 M22 39 L23.5 43"
        stroke={bright ? "#a8e6c0" : "#7acc96"}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* Ink drop at nib tip */}
      <ellipse
        cx="21"
        cy="43.5"
        rx="1.2"
        ry="1.5"
        fill={bright ? "#7cc89a" : "#5aaa78"}
        opacity="0.9"
      />
      <ellipse
        cx="23.5"
        cy="43.5"
        rx="0.8"
        ry="1"
        fill={bright ? "#7cc89a" : "#5aaa78"}
        opacity="0.6"
      />

      {/* ── RADIATING IDEA LINES — top right, suggesting "beyond the text" ── */}
      <line x1="37" y1="5"  x2="39.5" y2="3"   stroke={bright ? "#7cc89a" : "#4a8a62"} strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <line x1="39" y1="8"  x2="42"   y2="7"   stroke={bright ? "#7cc89a" : "#4a8a62"} strokeWidth="0.8" strokeLinecap="round" opacity="0.55" />
      <line x1="40" y1="12" x2="43.5" y2="12"  stroke={bright ? "#7cc89a" : "#4a8a62"} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />

      {/* ── SUBTLE ARC — "beyond" motif above the book ── */}
      <path
        d="M14 10 C19 6 29 6 34 10"
        stroke={bright ? "#7cc89a" : "#4a8a62"}
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
        strokeDasharray="1.5 2"
      />
    </svg>
  );
}
