import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
}

export default function PageBanner({ title, subtitle, crumbs }: PageBannerProps) {
  return (
    <div className="bg-[#F4EFE8] pt-32 pb-14 px-6 md:px-10 border-b border-[#EAE2D6]">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-5 font-sans">
          <Link href="/" className="hover:text-[#1C3A2E] transition-colors flex items-center gap-1">
            <Home size={12} />
            Home
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight size={12} className="text-[#C9A845]" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[#1C3A2E] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#1C3A2E] font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-6xl text-[#1C3A2E] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-base text-[#6B7280] font-sans max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
