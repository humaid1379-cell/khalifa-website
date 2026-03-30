/*
 * Design: Green Ink Press — Editorial newspaper style
 * KharijLogo: Artistic SVG logo for "خارج النص" podcast
 * Concept: Open book with wind-swept pages + stylized quill crossing diagonally
 * Colors: ONLY dark green (#0d3b1f), light green (#7cc89a), and black (#000000)
 */

interface KharijLogoProps {
  size?: number;
  /** "navbar" = compact on dark bg; "podcast" = larger on dark bg */
  variant?: "navbar" | "podcast";
  className?: string;
}

export default function KharijLogo({ size = 40, variant = "navbar", className = "" }: KharijLogoProps) {
  // Three colors only: dark green, light green, black
  const darkGreen  = "#0d3b1f";
  const lightGreen = "#7cc89a";
  const black      = "#000000";

  // Podcast variant uses slightly more opaque/vivid fills; navbar is more subtle
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
        {/* Left page: dark green → black gradient */}
        <linearGradient id={`lgL-${variant}`} x1="4" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={darkGreen} />
          <stop offset="100%" stopColor={black} />
        </linearGradient>
        {/* Right page: slightly lighter dark green → black */}
        <linearGradient id={`lgR-${variant}`} x1="44" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={darkGreen} stopOpacity="0.85" />
          <stop offset="100%" stopColor={black} />
        </linearGradient>
        {/* Quill: light green → dark green */}
        <linearGradient id={`lgQ-${variant}`} x1="14" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={lightGreen} />
          <stop offset="100%" stopColor={darkGreen} />
        </linearGradient>
        {/* Subtle glow on quill */}
        <filter id={`glow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── BOOK BASE SHADOW ── */}
      <ellipse cx="24" cy="38.5" rx="14" ry="2" fill={black} fillOpacity={bright ? "0.35" : "0.25"} />

      {/* ── LEFT PAGE ── */}
      <path
        d="M24 12
           C24 12 17 10.5 10 12
           C7 13 5 15 5 17
           L5 36
           C5 36 11 34.5 18 35.5
           C20.5 35.9 22.5 36.5 24 37
           Z"
        fill={`url(#lgL-${variant})`}
        stroke={lightGreen}
        strokeWidth="0.6"
        strokeOpacity={bright ? "0.7" : "0.5"}
      />

      {/* Left page — top corner curl */}
      <path
        d="M10 12 C9 11 8.5 10 9.5 9.5 C10.5 9 11.5 10 10 12Z"
        fill={lightGreen}
        opacity="0.4"
      />

      {/* Left page text lines */}
      <line x1="8"  y1="18" x2="21" y2="17.2" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.5"  strokeLinecap="round" />
      <line x1="8"  y1="21" x2="21" y2="20.3" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.4"  strokeLinecap="round" />
      <line x1="8"  y1="24" x2="21" y2="23.4" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.3"  strokeLinecap="round" />
      <line x1="8"  y1="27" x2="18" y2="26.5" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.2"  strokeLinecap="round" />

      {/* ── RIGHT PAGE ── */}
      <path
        d="M24 12
           C24 12 31 10.5 38 12
           C41 13 43 15 43 17
           L43 36
           C43 36 37 34.5 30 35.5
           C27.5 35.9 25.5 36.5 24 37
           Z"
        fill={`url(#lgR-${variant})`}
        stroke={lightGreen}
        strokeWidth="0.6"
        strokeOpacity={bright ? "0.7" : "0.5"}
      />

      {/* Right page — top corner curl */}
      <path
        d="M38 12 C39 11 39.5 10 38.5 9.5 C37.5 9 36.5 10 38 12Z"
        fill={lightGreen}
        opacity="0.4"
      />

      {/* Right page text lines */}
      <line x1="27" y1="18" x2="40" y2="17.2" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.5"  strokeLinecap="round" />
      <line x1="27" y1="21" x2="40" y2="20.3" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.4"  strokeLinecap="round" />
      <line x1="27" y1="24" x2="37" y2="23.4" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.3"  strokeLinecap="round" />

      {/* ── BOOK SPINE ── */}
      <path
        d="M24 11 C23.2 18 23.5 28 24 37"
        stroke={lightGreen}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
        opacity={bright ? "0.9" : "0.7"}
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
      {/* Feather inner vane highlight */}
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
        fill={lightGreen}
        fillOpacity="0.25"
      />
      {/* Quill shaft */}
      <path
        d="M24.5 31 L22 39"
        stroke={lightGreen}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Nib split */}
      <path
        d="M22 39 L20.5 43 M22 39 L23.5 43"
        stroke={lightGreen}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* Ink drop at nib — black */}
      <ellipse cx="21"   cy="43.5" rx="1.2" ry="1.5" fill={black}      opacity="0.85" />
      <ellipse cx="23.5" cy="43.5" rx="0.8" ry="1"   fill={darkGreen}  opacity="0.7"  />

      {/* ── RADIATING IDEA LINES ── */}
      <line x1="37" y1="5"  x2="39.5" y2="3"  stroke={lightGreen} strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
      <line x1="39" y1="8"  x2="42"   y2="7"  stroke={lightGreen} strokeWidth="0.8" strokeLinecap="round" opacity="0.5"  />
      <line x1="40" y1="12" x2="43.5" y2="12" stroke={lightGreen} strokeWidth="0.8" strokeLinecap="round" opacity="0.35" />

      {/* ── DASHED ARC — "beyond" motif ── */}
      <path
        d="M14 10 C19 6 29 6 34 10"
        stroke={lightGreen}
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
        strokeDasharray="1.5 2"
      />
    </svg>
  );
}
