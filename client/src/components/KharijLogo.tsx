/*
 * Design: Green Ink Press — Editorial newspaper style
 * KharijLogo: Unified brand mark SVG — text + icon as one composition
 *
 * Layout:
 *   - "خارج النص" in Amiri calligraphic style sits ABOVE the book/pen illustration
 *   - A fine double-rule line separates text from icon (newspaper motif)
 *   - Book pages: dark green (#0d3b1f) + light green (#7cc89a)
 *   - Pen body: wood brown (#6B3F1F → #DDB88A)
 *   - Pen nib: silver (#B0B8C1 → #E8ECF0)
 *   - Ink drop: black (#111111)
 *
 * Variants:
 *   "navbar"  → compact horizontal: icon left + text right, fits 160×44
 *   "podcast" → stacked vertical: text top + icon below, fits 180×140
 */

interface KharijLogoProps {
  variant?: "navbar" | "podcast";
  className?: string;
}

export default function KharijLogo({ variant = "navbar", className = "" }: KharijLogoProps) {
  if (variant === "podcast") {
    return <PodcastMark className={className} />;
  }
  return <NavbarMark className={className} />;
}

/* ─────────────────────────────────────────────
   NAVBAR MARK  — horizontal, compact 160 × 44
   Icon on the right (RTL), text on the left
───────────────────────────────────────────── */
function NavbarMark({ className = "" }: { className?: string }) {
  return (
    <svg
      width="160"
      height="44"
      viewBox="0 0 160 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="خارج النص"
    >
      <defs>
        {/* Book gradients */}
        <linearGradient id="nb-lgL" x1="110" y1="6" x2="124" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#0d3b1f" />
          <stop offset="100%" stopColor="#020e07" />
        </linearGradient>
        <linearGradient id="nb-lgR" x1="148" y1="6" x2="124" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#0d3b1f" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#020e07" />
        </linearGradient>
        {/* Pen wood */}
        <linearGradient id="nb-lgPen" x1="138" y1="4" x2="124" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#DDB88A" />
          <stop offset="35%"  stopColor="#C49A6C" />
          <stop offset="70%"  stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#6B3F1F" />
        </linearGradient>
        {/* Pen nib */}
        <linearGradient id="nb-lgNib" x1="120" y1="34" x2="124" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#E8ECF0" />
          <stop offset="50%"  stopColor="#B0B8C1" />
          <stop offset="100%" stopColor="#7A8490" />
        </linearGradient>
        {/* Shaft wood */}
        <linearGradient id="nb-lgShaft" x1="124" y1="28" x2="122" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#6B3F1F" />
        </linearGradient>
        {/* Text gold shimmer */}
        <linearGradient id="nb-lgText" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#C49A3C" />
          <stop offset="30%"  stopColor="#E8D08A" />
          <stop offset="60%"  stopColor="#7cc89a" />
          <stop offset="100%" stopColor="#D4AF6A" />
        </linearGradient>
        <filter id="nb-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nb-textGlow" x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── TEXT "خارج النص" ── */}
      {/* Decorative rule above text */}
      <line x1="4" y1="5" x2="96" y2="5" stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="4" y1="7" x2="96" y2="7" stroke="#C49A3C" strokeWidth="0.3" strokeOpacity="0.4" />

      <text
        x="50"
        y="22"
        textAnchor="middle"
        fontFamily="'Scheherazade New', 'Amiri', serif"
        fontSize="18"
        fontWeight="700"
        fill="url(#nb-lgText)"
        filter="url(#nb-textGlow)"
        letterSpacing="1"
      >
        خارج النص
      </text>

      {/* Decorative rule below text */}
      <line x1="4" y1="27" x2="96" y2="27" stroke="#C49A3C" strokeWidth="0.3" strokeOpacity="0.4" />
      <line x1="4" y1="29" x2="96" y2="29" stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.5" />

      {/* ── BOOK (right side, icon zone 104–160) ── */}
      {/* Shadow */}
      <ellipse cx="131" cy="40" rx="12" ry="1.6" fill="#111" fillOpacity="0.22" />

      {/* Left page */}
      <path
        d="M124 10 C124 10 118 9 112 10 C110 11 108 13 108 14.5 L108 37
           C108 37 113 36 119 36.8 C121 37.1 122.5 37.5 124 38 Z"
        fill="url(#nb-lgL)"
        stroke="#7cc89a" strokeWidth="0.5" strokeOpacity="0.55"
      />
      {/* Left text lines */}
      <line x1="110" y1="17" x2="122" y2="16.5" stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.45" strokeLinecap="round" />
      <line x1="110" y1="20" x2="122" y2="19.5" stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="110" y1="23" x2="122" y2="22.5" stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="110" y1="26" x2="120" y2="25.6" stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.15" strokeLinecap="round" />

      {/* Right page */}
      <path
        d="M124 10 C124 10 130 9 136 10 C138 11 140 13 140 14.5 L140 37
           C140 37 135 36 129 36.8 C127 37.1 125.5 37.5 124 38 Z"
        fill="url(#nb-lgR)"
        stroke="#7cc89a" strokeWidth="0.5" strokeOpacity="0.55"
      />
      {/* Right text lines */}
      <line x1="126" y1="17" x2="138" y2="16.5" stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.45" strokeLinecap="round" />
      <line x1="126" y1="20" x2="138" y2="19.5" stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="126" y1="23" x2="136" y2="22.5" stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.25" strokeLinecap="round" />

      {/* Spine */}
      <path d="M124 9.5 C123.4 17 123.6 28 124 38" stroke="#7cc89a" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.75" />

      {/* ── PEN — diagonal ── */}
      {/* Feather body */}
      <path
        d="M136 5 C137.5 6 139 7.5 138.5 9 C138 10.5 136.5 11.5 135 13
           C133.5 14.5 132 17 131 19.5 C130.3 21 130 22.5 129.7 24
           L128.5 24.3
           C128.8 22.8 129.2 21.3 130 19.5
           C131 17 132.5 14.5 134 13
           C135.5 11.5 137 10.2 137 9
           C137 7.8 135.5 6.5 134 5.5 Z"
        fill="url(#nb-lgPen)"
        filter="url(#nb-glow)"
      />
      {/* Wood grain */}
      <path d="M135.5 6 C136.8 7 137.8 8.5 137.3 10 C136.8 11.5 135.5 12.5 134.2 13.8"
        stroke="#DDB88A" strokeWidth="0.4" strokeOpacity="0.4" strokeLinecap="round" fill="none" />
      {/* Shaft */}
      <path d="M129.7 24 L128 31" stroke="url(#nb-lgShaft)" strokeWidth="1.1" strokeLinecap="round" />
      {/* Ferrule */}
      <line x1="128.5" y1="30.5" x2="127.5" y2="31.5" stroke="#B0B8C1" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      {/* Nib */}
      <path d="M128 31 L126.2 35.5 L128.1 33.8 L130 35.5 Z"
        fill="url(#nb-lgNib)" stroke="#7A8490" strokeWidth="0.25" />
      <line x1="128.05" y1="31.5" x2="128.05" y2="35" stroke="#7A8490" strokeWidth="0.3" strokeLinecap="round" opacity="0.55" />
      {/* Ink drop */}
      <ellipse cx="128" cy="36.2" rx="0.9" ry="1.1" fill="#111111" opacity="0.9" />

      {/* Radiating lines */}
      <line x1="139" y1="3.5" x2="141" y2="2"   stroke="#7cc89a" strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
      <line x1="140.5" y1="6" x2="143" y2="5"   stroke="#7cc89a" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
      <line x1="141" y1="9" x2="144" y2="9"     stroke="#7cc89a" strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />

      {/* Dashed arc above book */}
      <path d="M115 9.5 C119 6.5 129 6.5 133 9.5"
        stroke="#7cc89a" strokeWidth="0.6" strokeLinecap="round" fill="none"
        opacity="0.45" strokeDasharray="1.2 1.8" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   PODCAST MARK  — stacked vertical 180 × 140
   Text arched above, large icon below
───────────────────────────────────────────── */
function PodcastMark({ className = "" }: { className?: string }) {
  return (
    <svg
      width="180"
      height="140"
      viewBox="0 0 180 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="خارج النص"
    >
      <defs>
        <linearGradient id="pm-lgL" x1="60" y1="42" x2="90" y2="118" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#0d3b1f" />
          <stop offset="100%" stopColor="#020e07" />
        </linearGradient>
        <linearGradient id="pm-lgR" x1="120" y1="42" x2="90" y2="118" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#0d3b1f" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#020e07" />
        </linearGradient>
        <linearGradient id="pm-lgPen" x1="118" y1="28" x2="90" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#DDB88A" />
          <stop offset="35%"  stopColor="#C49A6C" />
          <stop offset="70%"  stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#6B3F1F" />
        </linearGradient>
        <linearGradient id="pm-lgNib" x1="86" y1="108" x2="90" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#E8ECF0" />
          <stop offset="50%"  stopColor="#B0B8C1" />
          <stop offset="100%" stopColor="#7A8490" />
        </linearGradient>
        <linearGradient id="pm-lgShaft" x1="90" y1="98" x2="88" y2="112" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#6B3F1F" />
        </linearGradient>
        <linearGradient id="pm-lgText" x1="10" y1="0" x2="170" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#C49A3C" />
          <stop offset="25%"  stopColor="#E8D08A" />
          <stop offset="55%"  stopColor="#7cc89a" />
          <stop offset="80%"  stopColor="#E8D08A" />
          <stop offset="100%" stopColor="#D4AF6A" />
        </linearGradient>
        <filter id="pm-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="pm-textGlow" x="-5%" y="-30%" width="110%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Outer decorative border ── */}
      <rect x="4" y="4" width="172" height="132" rx="8"
        stroke="#7cc89a" strokeWidth="0.6" strokeOpacity="0.3" fill="none" strokeDasharray="3 4" />

      {/* ── TEXT "خارج النص" ── */}
      {/* Double rule above */}
      <line x1="20" y1="14" x2="160" y2="14" stroke="#C49A3C" strokeWidth="0.4" strokeOpacity="0.5" />
      <line x1="20" y1="16.5" x2="160" y2="16.5" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.6" />

      <text
        x="90"
        y="35"
        textAnchor="middle"
        fontFamily="'Scheherazade New', 'Amiri', serif"
        fontSize="28"
        fontWeight="700"
        fill="url(#pm-lgText)"
        filter="url(#pm-textGlow)"
        letterSpacing="2"
      >
        خارج النص
      </text>

      {/* Double rule below text */}
      <line x1="20" y1="40" x2="160" y2="40" stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.6" />
      <line x1="20" y1="42.5" x2="160" y2="42.5" stroke="#C49A3C" strokeWidth="0.4" strokeOpacity="0.5" />

      {/* ── BOOK ── */}
      {/* Shadow */}
      <ellipse cx="90" cy="122" rx="34" ry="4" fill="#111" fillOpacity="0.28" />

      {/* Left page */}
      <path
        d="M90 50 C90 50 72 47 58 50 C53 52 49 56 49 60 L49 112
           C49 112 61 109 74 111 C79 111.8 84 113 90 114.5 Z"
        fill="url(#pm-lgL)"
        stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.6"
      />
      {/* Left corner curl */}
      <path d="M58 50 C56 48 55 46 57 45 C59 44 61 46 58 50Z" fill="#7cc89a" opacity="0.35" />
      {/* Left text lines */}
      <line x1="54" y1="64" x2="86" y2="63"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" />
      <line x1="54" y1="71" x2="86" y2="70"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="54" y1="78" x2="86" y2="77"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="54" y1="85" x2="80" y2="84.2" stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.18" strokeLinecap="round" />
      <line x1="54" y1="92" x2="76" y2="91.4" stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.12" strokeLinecap="round" />

      {/* Right page */}
      <path
        d="M90 50 C90 50 108 47 122 50 C127 52 131 56 131 60 L131 112
           C131 112 119 109 106 111 C101 111.8 96 113 90 114.5 Z"
        fill="url(#pm-lgR)"
        stroke="#7cc89a" strokeWidth="0.7" strokeOpacity="0.6"
      />
      {/* Right corner curl */}
      <path d="M122 50 C124 48 125 46 123 45 C121 44 119 46 122 50Z" fill="#7cc89a" opacity="0.35" />
      {/* Right text lines */}
      <line x1="94" y1="64" x2="126" y2="63"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" />
      <line x1="94" y1="71" x2="126" y2="70"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="94" y1="78" x2="122" y2="77"   stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="94" y1="85" x2="118" y2="84.2" stroke="#7cc89a" strokeWidth="0.9" strokeOpacity="0.18" strokeLinecap="round" />

      {/* Spine */}
      <path d="M90 49 C88.5 66 89 90 90 114.5"
        stroke="#7cc89a" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.8" />

      {/* ── PEN ── */}
      {/* Feather body */}
      <path
        d="M116 28 C119 30 122 33.5 121 37 C120 40.5 117 42.5 114 45.5
           C111 48.5 108 53 106 58 C104.5 62 104 66 103.2 70
           L101 70.5
           C101.8 66.5 102.5 62.5 104 58
           C106 53 109 48.5 112 45.5
           C115 42.5 118 40 118 37
           C118 34 115.5 31 113 29.5 Z"
        fill="url(#pm-lgPen)"
        filter="url(#pm-glow)"
      />
      {/* Wood grain */}
      <path d="M115 29.5 C117.5 31.5 119.5 34 119 37 C118.5 40 116.5 42 114.5 44"
        stroke="#DDB88A" strokeWidth="0.6" strokeOpacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M113.5 30 C116 32 117.5 35 117 38 C116.5 41 114.5 43 112.5 45"
        stroke="#DDB88A" strokeWidth="0.4" strokeOpacity="0.25" strokeLinecap="round" fill="none" />
      {/* Shaft */}
      <path d="M103.2 70 L100 84" stroke="url(#pm-lgShaft)" strokeWidth="1.6" strokeLinecap="round" />
      {/* Ferrule */}
      <line x1="100.8" y1="83" x2="99.5" y2="84.5" stroke="#B0B8C1" strokeWidth="1.4" strokeLinecap="round" opacity="0.88" />
      {/* Nib */}
      <path d="M100 84 L97.2 92 L100.1 89.2 L103 92 Z"
        fill="url(#pm-lgNib)" stroke="#7A8490" strokeWidth="0.35" />
      <line x1="100.05" y1="84.5" x2="100.05" y2="91" stroke="#7A8490" strokeWidth="0.4" strokeLinecap="round" opacity="0.55" />
      {/* Ink drop */}
      <ellipse cx="100" cy="93.5" rx="1.5" ry="1.8" fill="#111111" opacity="0.9" />
      <ellipse cx="99.4" cy="92.8" rx="0.45" ry="0.5" fill="#E8ECF0" opacity="0.35" />

      {/* Radiating idea lines */}
      <line x1="122" y1="25" x2="125" y2="22" stroke="#7cc89a" strokeWidth="1"   strokeLinecap="round" opacity="0.65" />
      <line x1="124" y1="30" x2="128" y2="28" stroke="#7cc89a" strokeWidth="1"   strokeLinecap="round" opacity="0.5"  />
      <line x1="125" y1="36" x2="130" y2="36" stroke="#7cc89a" strokeWidth="1"   strokeLinecap="round" opacity="0.35" />

      {/* Dashed arc above book */}
      <path d="M65 49 C74 42 106 42 115 49"
        stroke="#7cc89a" strokeWidth="0.8" strokeLinecap="round" fill="none"
        opacity="0.45" strokeDasharray="2 3" />

      {/* Corner ornaments */}
      <path d="M12 12 L12 20 M12 12 L20 12" stroke="#C49A3C" strokeWidth="0.8" strokeLinecap="round" opacity="0.45" />
      <path d="M168 12 L168 20 M168 12 L160 12" stroke="#C49A3C" strokeWidth="0.8" strokeLinecap="round" opacity="0.45" />
      <path d="M12 128 L12 120 M12 128 L20 128" stroke="#C49A3C" strokeWidth="0.8" strokeLinecap="round" opacity="0.45" />
      <path d="M168 128 L168 120 M168 128 L160 128" stroke="#C49A3C" strokeWidth="0.8" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}
