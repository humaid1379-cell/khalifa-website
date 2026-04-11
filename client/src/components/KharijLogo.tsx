/*
 * Design: Kharij Al Nass — Brand logo component
 * Uses the actual brand logo image (Arabic calligraphy with horizontal lines)
 * Teal color on cream background
 *
 * Variants:
 *   "navbar"  → compact logo
 *   "podcast" → larger logo
 */

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7EAJf9X3KvFUwHgCUasNkN/kharij-logo-v2_eb0c6410.jpeg";

interface KharijLogoProps {
  variant?: "navbar" | "podcast";
  className?: string;
}

export default function KharijLogo({ variant = "navbar", className = "" }: KharijLogoProps) {
  const size = variant === "podcast" ? "w-32 h-32 md:w-40 md:h-40" : "w-10 h-10";

  return (
    <img
      src={LOGO_URL}
      alt="خارج النص"
      className={`${size} object-contain ${className}`}
      loading={variant === "navbar" ? "eager" : "lazy"}
    />
  );
}
