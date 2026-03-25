import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  bg?: "white" | "cream" | "forest" | "none";
}

export function Section({ children, className, id, bg = "none" }: SectionProps) {
  const bgMap = {
    white: "bg-white",
    cream: "bg-[#F4EFE8]",
    forest: "bg-[#1C3A2E]",
    none: "",
  };

  return (
    <section id={id} className={cn("py-20 md:py-28 px-6 md:px-10", bgMap[bg], className)}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  heading: string;
  sub?: string;
  center?: boolean;
  light?: boolean;
}

export function SectionHeader({
  eyebrow,
  heading,
  sub,
  center = false,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 md:mb-16", center && "text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "text-xs uppercase tracking-[0.2em] font-sans mb-3",
            light ? "text-[#C9A845]" : "text-[#C9A845]"
          )}
        >
          {eyebrow}
        </p>
      )}
      <div className={cn("flex items-center gap-4", center && "justify-center")}>
        {!center && <div className="gold-rule shrink-0" />}
        <h2
          className={cn(
            "font-serif text-4xl md:text-5xl leading-tight",
            light ? "text-white" : "text-[#1C3A2E]"
          )}
        >
          {heading}
        </h2>
      </div>
      {sub && (
        <p
          className={cn(
            "mt-5 text-base md:text-lg max-w-2xl leading-relaxed",
            center && "mx-auto",
            light ? "text-white/70" : "text-[#6B7280]"
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
