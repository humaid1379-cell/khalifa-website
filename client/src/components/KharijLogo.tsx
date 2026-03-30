/*
 * Design: Green Ink Press — Editorial newspaper style
 * KharijLogo: Book-and-pen icon ONLY — no embedded text
 *
 * Colors:
 *   - Book pages: dark green (#0d3b1f) + light green (#7cc89a)
 *   - Pen body: wood brown (#6B3F1F → #DDB88A)
 *   - Pen nib: silver (#B0B8C1 → #E8ECF0)
 *   - Ink drop: black (#111111)
 *
 * Variants:
 *   "navbar"  → compact 44×44 icon
 *   "podcast" → larger 100×100 icon
 */

interface KharijLogoProps {
  variant?: "navbar" | "podcast";
  className?: string;
}

export default function KharijLogo({ variant = "navbar", className = "" }: KharijLogoProps) {
  if (variant === "podcast") {
    return <PodcastIcon className={className} />;
  }
  return <NavbarIcon className={className} />;
}

/* ─────────────────────────────────────────────
   NAVBAR ICON — compact 44 × 44
───────────────────────────────────────────── */
function NavbarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="خارج النص"
    >
      <defs>
        <linearGradient id="nb-lgL" x1="10" y1="6" x2="22" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#0d3b1f" />
          <stop offset="100%" stopColor="#020e07" />
        </linearGradient>
        <linearGradient id="nb-lgR" x1="34" y1="6" x2="22" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#0d3b1f" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#020e07" />
        </linearGradient>
        <linearGradient id="nb-lgPen" x1="36" y1="3" x2="22" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#DDB88A" />
          <stop offset="35%"  stopColor="#C49A6C" />
          <stop offset="70%"  stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#6B3F1F" />
        </linearGradient>
        <linearGradient id="nb-lgNib" x1="18" y1="32" x2="20" y2="41" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#E8ECF0" />
          <stop offset="50%"  stopColor="#B0B8C1" />
          <stop offset="100%" stopColor="#7A8490" />
        </linearGradient>
        <linearGradient id="nb-lgShaft" x1="22" y1="26" x2="20" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#6B3F1F" />
        </linearGradient>
        <filter id="nb-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Shadow */}
      <ellipse cx="22" cy="40" rx="12" ry="1.5" fill="#111" fillOpacity="0.2" />

      {/* Left page */}
      <path
        d="M22 8 C22 8 16 7 10 8 C8 9 6 11 6 12.5 L6 36
           C6 36 11 35 17 35.8 C19 36.1 20.5 36.5 22 37 Z"
        fill="url(#nb-lgL)"
        stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.6"
      />
      {/* Left text lines */}
      <line x1="8"  y1="15" x2="20" y2="14.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.45" strokeLinecap="round" />
      <line x1="8"  y1="18" x2="20" y2="17.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="8"  y1="21" x2="20" y2="20.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="8"  y1="24" x2="18" y2="23.6" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.15" strokeLinecap="round" />

      {/* Right page */}
      <path
        d="M22 8 C22 8 28 7 34 8 C36 9 38 11 38 12.5 L38 36
           C38 36 33 35 27 35.8 C25 36.1 23.5 36.5 22 37 Z"
        fill="url(#nb-lgR)"
        stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.6"
      />
      {/* Right text lines */}
      <line x1="24" y1="15" x2="36" y2="14.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.45" strokeLinecap="round" />
      <line x1="24" y1="18" x2="36" y2="17.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="24" y1="21" x2="34" y2="20.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.25" strokeLinecap="round" />

      {/* Spine */}
      <path d="M22 7.5 C21.4 16 21.6 27 22 37" stroke="#7cc89a" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.8" />

      {/* Pen — feather body */}
      <path
        d="M34 3 C35.5 4 37 5.5 36.5 7 C36 8.5 34.5 9.5 33 11
           C31.5 12.5 30 15 29 17.5 C28.3 19 28 20.5 27.7 22
           L26.5 22.3
           C26.8 20.8 27.2 19.3 28 17.5
           C29 15 30.5 12.5 32 11
           C33.5 9.5 35 8.2 35 7
           C35 5.8 33.5 4.5 32 3.5 Z"
        fill="url(#nb-lgPen)"
        filter="url(#nb-glow)"
      />
      {/* Wood grain */}
      <path d="M33.5 4 C34.8 5 35.8 6.5 35.3 8 C34.8 9.5 33.5 10.5 32.2 11.8"
        stroke="#DDB88A" strokeWidth="0.4" strokeOpacity="0.4" strokeLinecap="round" fill="none" />
      {/* Shaft */}
      <path d="M27.7 22 L26 29" stroke="url(#nb-lgShaft)" strokeWidth="1.1" strokeLinecap="round" />
      {/* Ferrule */}
      <line x1="26.5" y1="28.5" x2="25.5" y2="29.5" stroke="#B0B8C1" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      {/* Nib */}
      <path d="M26 29 L24.2 33.5 L26.1 31.8 L28 33.5 Z"
        fill="url(#nb-lgNib)" stroke="#7A8490" strokeWidth="0.25" />
      <line x1="26.05" y1="29.5" x2="26.05" y2="33" stroke="#7A8490" strokeWidth="0.3" strokeLinecap="round" opacity="0.55" />
      {/* Ink drop */}
      <ellipse cx="26" cy="34.2" rx="0.9" ry="1.1" fill="#111111" opacity="0.9" />

      {/* Radiating lines */}
      <line x1="37" y1="1.5" x2="39" y2="0"   stroke="#7cc89a" strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
      <line x1="38.5" y1="4" x2="41" y2="3"   stroke="#7cc89a" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
      <line x1="39" y1="7" x2="42" y2="7"     stroke="#7cc89a" strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />

      {/* Dashed arc above book */}
      <path d="M13 7.5 C17 4.5 27 4.5 31 7.5"
        stroke="#7cc89a" strokeWidth="0.6" strokeLinecap="round" fill="none"
        opacity="0.45" strokeDasharray="1.2 1.8" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   PODCAST ICON — larger 100 × 100
───────────────────────────────────────────── */
function PodcastIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="خارج النص"
    >
      <defs>
        <linearGradient id="pm-lgL" x1="14" y1="14" x2="50" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#0d3b1f" />
          <stop offset="100%" stopColor="#020e07" />
        </linearGradient>
        <linearGradient id="pm-lgR" x1="86" y1="14" x2="50" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#0d3b1f" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#020e07" />
        </linearGradient>
        <linearGradient id="pm-lgPen" x1="80" y1="6" x2="50" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#DDB88A" />
          <stop offset="35%"  stopColor="#C49A6C" />
          <stop offset="70%"  stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#6B3F1F" />
        </linearGradient>
        <linearGradient id="pm-lgNib" x1="44" y1="72" x2="48" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#E8ECF0" />
          <stop offset="50%"  stopColor="#B0B8C1" />
          <stop offset="100%" stopColor="#7A8490" />
        </linearGradient>
        <linearGradient id="pm-lgShaft" x1="50" y1="62" x2="47" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#6B3F1F" />
        </linearGradient>
        <filter id="pm-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="92" rx="26" ry="3" fill="#111" fillOpacity="0.25" />

      {/* Left page */}
      <path
        d="M50 16 C50 16 38 14 26 16 C22 17.5 18 21 18 24 L18 82
           C18 82 27 80 38 81.5 C42 82.2 46 83.5 50 85 Z"
        fill="url(#pm-lgL)"
        stroke="#7cc89a" strokeWidth="0.8" strokeOpacity="0.6"
      />
      {/* Left corner curl */}
      <path d="M26 16 C24 14 23 12 25 11 C27 10 29 12 26 16Z" fill="#7cc89a" opacity="0.3" />
      {/* Left text lines */}
      <line x1="22" y1="30" x2="47" y2="29"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" />
      <line x1="22" y1="37" x2="47" y2="36"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="22" y1="44" x2="47" y2="43"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="22" y1="51" x2="43" y2="50.3" stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.18" strokeLinecap="round" />
      <line x1="22" y1="58" x2="39" y2="57.5" stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.12" strokeLinecap="round" />

      {/* Right page */}
      <path
        d="M50 16 C50 16 62 14 74 16 C78 17.5 82 21 82 24 L82 82
           C82 82 73 80 62 81.5 C58 82.2 54 83.5 50 85 Z"
        fill="url(#pm-lgR)"
        stroke="#7cc89a" strokeWidth="0.8" strokeOpacity="0.6"
      />
      {/* Right corner curl */}
      <path d="M74 16 C76 14 77 12 75 11 C73 10 71 12 74 16Z" fill="#7cc89a" opacity="0.3" />
      {/* Right text lines */}
      <line x1="53" y1="30" x2="78" y2="29"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" />
      <line x1="53" y1="37" x2="78" y2="36"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="53" y1="44" x2="76" y2="43"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="53" y1="51" x2="72" y2="50.3" stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.18" strokeLinecap="round" />

      {/* Spine */}
      <path d="M50 15 C48.5 34 49 62 50 85"
        stroke="#7cc89a" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.8" />

      {/* Pen — feather body */}
      <path
        d="M76 6 C79 8 82 11.5 81 15 C80 18.5 77 20.5 74 23.5
           C71 26.5 68 31 66 36 C64.5 40 64 44 63.2 48
           L61 48.5
           C61.8 44.5 62.5 40.5 64 36
           C66 31 69 26.5 72 23.5
           C75 20.5 78 18 78 15
           C78 12 75.5 9 73 7.5 Z"
        fill="url(#pm-lgPen)"
        filter="url(#pm-glow)"
      />
      {/* Wood grain */}
      <path d="M75 7.5 C77.5 9.5 79.5 12 79 15 C78.5 18 76.5 20 74.5 22"
        stroke="#DDB88A" strokeWidth="0.6" strokeOpacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M73.5 8 C76 10 77.5 13 77 16 C76.5 19 74.5 21 72.5 23"
        stroke="#DDB88A" strokeWidth="0.4" strokeOpacity="0.25" strokeLinecap="round" fill="none" />
      {/* Shaft */}
      <path d="M63.2 48 L60 62" stroke="url(#pm-lgShaft)" strokeWidth="1.6" strokeLinecap="round" />
      {/* Ferrule */}
      <line x1="60.8" y1="61" x2="59.5" y2="62.5" stroke="#B0B8C1" strokeWidth="1.4" strokeLinecap="round" opacity="0.88" />
      {/* Nib */}
      <path d="M60 62 L57.2 70 L60.1 67.2 L63 70 Z"
        fill="url(#pm-lgNib)" stroke="#7A8490" strokeWidth="0.35" />
      <line x1="60.05" y1="62.5" x2="60.05" y2="69" stroke="#7A8490" strokeWidth="0.4" strokeLinecap="round" opacity="0.55" />
      {/* Ink drop */}
      <ellipse cx="60" cy="71.5" rx="1.5" ry="1.8" fill="#111111" opacity="0.9" />
      <ellipse cx="59.4" cy="70.8" rx="0.45" ry="0.5" fill="#E8ECF0" opacity="0.35" />

      {/* Radiating idea lines */}
      <line x1="83" y1="3"  x2="86" y2="0"  stroke="#7cc89a" strokeWidth="1"   strokeLinecap="round" opacity="0.65" />
      <line x1="85" y1="8"  x2="89" y2="6"  stroke="#7cc89a" strokeWidth="1"   strokeLinecap="round" opacity="0.5"  />
      <line x1="86" y1="14" x2="91" y2="14" stroke="#7cc89a" strokeWidth="1"   strokeLinecap="round" opacity="0.35" />

      {/* Dashed arc above book */}
      <path d="M30 15 C38 9 62 9 70 15"
        stroke="#7cc89a" strokeWidth="0.8" strokeLinecap="round" fill="none"
        opacity="0.45" strokeDasharray="2 3" />
    </svg>
  );
}
