import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

export default function AnimatedSection({ children, className = "", delay = 0, direction = "up" }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Content remains readable if observation is unavailable. Animate only once in view.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.dataset.revealed = "true";
        observer.unobserve(element);
      }
    }, { threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`editorial-reveal ${className}`} data-direction={direction} style={{ "--reveal-delay": `${Math.min(delay, 150)}ms` } as CSSProperties}>{children}</div>;
}

export function AnimatedItem({ children, className = "", delay = 0 }: Omit<AnimatedSectionProps, "direction">) {
  return <AnimatedSection className={className} delay={delay}>{children}</AnimatedSection>;
}
