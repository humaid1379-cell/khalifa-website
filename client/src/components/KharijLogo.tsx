/*
 * Design: Green Ink Press — Editorial newspaper style
 * KharijLogo: Artistic SVG logo for "خارج النص" podcast
 * Concept: Open book (dark green + light green) + quill/pen
 *   - Pen body:    wood / brown (#8B5E3C → #C49A6C)
 *   - Pen nib:     silver / metallic (#B0B8C1 → #E8ECF0)
 *   - Ink drop:    black (#111111)
 *   - Book pages:  dark green (#0d3b1f) + light green (#7cc89a)
 */

interface KharijLogoProps {
  size?: number;
  variant?: "navbar" | "podcast";
  className?: string;
}

export default function KharijLogo({ size = 40, variant = "navbar", className = "" }: KharijLogoProps) {
  const darkGreen  = "#0d3b1f";
  const lightGreen = "#7cc89a";
  const black      = "#111111";

  // Wood colors
  const woodDark   = "#6B3F1F";
  const woodMid    = "#8B5E3C";
  const woodLight  = "#C49A6C";
  const woodHigh   = "#DDB88A";

  // Silver/metallic colors
  const silverDark = "#7A8490";
  const silverMid  = "#B0B8C1";
  const silverLight= "#E8ECF0";

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
        {/* Book left page: dark green → black */}
        <linearGradient id={`lgL-${variant}`} x1="4" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={darkGreen} />
          <stop offset="100%" stopColor="#020e07" />
        </linearGradient>
        {/* Book right page: slightly lighter dark green → black */}
        <linearGradient id={`lgR-${variant}`} x1="44" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={darkGreen} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#020e07" />
        </linearGradient>

        {/* Pen body: wood grain — warm brown */}
        <linearGradient id={`lgPen-${variant}`} x1="33" y1="7" x2="23" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={woodHigh} />
          <stop offset="30%"  stopColor={woodLight} />
          <stop offset="65%"  stopColor={woodMid} />
          <stop offset="100%" stopColor={woodDark} />
        </linearGradient>
        {/* Pen body highlight (left edge shine) */}
        <linearGradient id={`lgPenHL-${variant}`} x1="32" y1="7" x2="30" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={woodHigh} stopOpacity="0.6" />
          <stop offset="100%" stopColor={woodHigh} stopOpacity="0" />
        </linearGradient>

        {/* Pen shaft: wood */}
        <linearGradient id={`lgShaft-${variant}`} x1="24" y1="30" x2="22" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={woodMid} />
          <stop offset="100%" stopColor={woodDark} />
        </linearGradient>

        {/* Nib: silver metallic */}
        <linearGradient id={`lgNib-${variant}`} x1="20" y1="38" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={silverLight} />
          <stop offset="40%"  stopColor={silverMid} />
          <stop offset="100%" stopColor={silverDark} />
        </linearGradient>

        {/* Subtle glow on pen */}
        <filter id={`glow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
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
      {/* Left corner curl */}
      <path d="M10 12 C9 11 8.5 10 9.5 9.5 C10.5 9 11.5 10 10 12Z" fill={lightGreen} opacity="0.4" />
      {/* Left text lines */}
      <line x1="8"  y1="18" x2="21" y2="17.2" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.50" strokeLinecap="round" />
      <line x1="8"  y1="21" x2="21" y2="20.3" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.38" strokeLinecap="round" />
      <line x1="8"  y1="24" x2="21" y2="23.4" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.28" strokeLinecap="round" />
      <line x1="8"  y1="27" x2="18" y2="26.5" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.18" strokeLinecap="round" />

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
      {/* Right corner curl */}
      <path d="M38 12 C39 11 39.5 10 38.5 9.5 C37.5 9 36.5 10 38 12Z" fill={lightGreen} opacity="0.4" />
      {/* Right text lines */}
      <line x1="27" y1="18" x2="40" y2="17.2" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.50" strokeLinecap="round" />
      <line x1="27" y1="21" x2="40" y2="20.3" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.38" strokeLinecap="round" />
      <line x1="27" y1="24" x2="37" y2="23.4" stroke={lightGreen} strokeWidth="0.7" strokeOpacity="0.28" strokeLinecap="round" />

      {/* ── BOOK SPINE ── */}
      <path
        d="M24 11 C23.2 18 23.5 28 24 37"
        stroke={lightGreen}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
        opacity={bright ? "0.9" : "0.7"}
      />

      {/* ── PEN / QUILL — diagonal, crossing both pages ── */}

      {/* Pen body — wood feather shape */}
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
        fill={`url(#lgPen-${variant})`}
        filter={`url(#glow-${variant})`}
      />
      {/* Wood grain lines on feather */}
      <path
        d="M31.5 8.5 C33 9.5 34.5 11 34 13 C33.5 15 32 16 30.5 17.5"
        stroke={woodHigh}
        strokeWidth="0.5"
        strokeOpacity="0.45"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 9 C31.5 10 33 12 32.5 14 C32 16 30.5 17 29 18.5"
        stroke={woodHigh}
        strokeWidth="0.4"
        strokeOpacity="0.3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Pen body left-edge highlight */}
      <path
        d="M33 7
           C35 8 37 10 36.5 12
           C36 14 34 15 32 17
           C30.5 18.5 29 21 27.5 24"
        stroke={`url(#lgPenHL-${variant})`}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Pen shaft — wood colored stick */}
      <path
        d="M24.5 31 L22 39"
        stroke={`url(#lgShaft-${variant})`}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Ferrule ring — silver band where shaft meets nib */}
      <line
        x1="22.8" y1="38.2"
        x2="21.5" y2="39.5"
        stroke={silverMid}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Nib — silver metallic split tip */}
      <path
        d="M22 39 L20 43.5 L22.2 41.5 L24 43.5 Z"
        fill={`url(#lgNib-${variant})`}
        stroke={silverDark}
        strokeWidth="0.3"
      />
      {/* Nib center split line */}
      <line
        x1="22.1" y1="39.5"
        x2="22.1" y2="43"
        stroke={silverDark}
        strokeWidth="0.35"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Nib highlight */}
      <line
        x1="21.2" y1="39.8"
        x2="20.5" y2="42.5"
        stroke={silverLight}
        strokeWidth="0.4"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Ink drop — black, at nib tip */}
      <ellipse cx="22" cy="44.2" rx="1.1" ry="1.3" fill={black} opacity="0.9" />
      {/* Ink drop highlight */}
      <ellipse cx="21.5" cy="43.7" rx="0.35" ry="0.4" fill={silverLight} opacity="0.4" />

      {/* ── RADIATING IDEA LINES — top right ── */}
      <line x1="37" y1="5"  x2="39.5" y2="3"  stroke={lightGreen} strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
      <line x1="39" y1="8"  x2="42"   y2="7"  stroke={lightGreen} strokeWidth="0.8" strokeLinecap="round" opacity="0.5"  />
      <line x1="40" y1="12" x2="43.5" y2="12" stroke={lightGreen} strokeWidth="0.8" strokeLinecap="round" opacity="0.35" />

      {/* ── DASHED ARC — "beyond the text" motif ── */}
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
