/*
 * Design: Kharij Al Nass — Brand logo component (Final 2026 branding)
 * Uses the official typewriter-style logo with خارج النص calligraphy
 * Three color variants: blue (#87b0b6), beige (#f1efd6), red (#bf4240)
 *
 * Variants:
 *   "navbar"  → compact logo for navigation bar
 *   "podcast" → larger logo for podcast section
 *   "hero"    → medium logo for hero/footer sections
 *
 * Color:
 *   "blue"  → teal logo for light backgrounds (default)
 *   "beige" → beige logo for dark backgrounds (hero, footer, podcast)
 *   "red"   → red accent logo
 */

const LOGO_URLS = {
  blue: "/media/logo-blue_092e7b72.png",
  beige: "/media/logo-beige_856df9a8.png",
  red: "/media/logo-red_c0b78c3b.png",
};

interface KharijLogoProps {
  variant?: "navbar" | "podcast" | "hero";
  color?: "blue" | "beige" | "red";
  className?: string;
}

export default function KharijLogo({ variant = "navbar", color = "blue", className = "" }: KharijLogoProps) {
  const sizeMap = {
    navbar: "w-12 h-12",
    hero: "w-24 h-24 md:w-32 md:h-32",
    podcast: "w-36 h-36 md:w-44 md:h-44",
  };

  const size = sizeMap[variant];

  return (
    <img
      src={LOGO_URLS[color]}
      alt="خارج النص"
      className={`${size} object-contain ${className}`}
      loading={variant === "navbar" ? "eager" : "lazy"}
      width={1300}
      height={1000}
      decoding="async"
    />
  );
}
