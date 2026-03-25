import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { getSiteConfig } from "@/lib/content";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/sermons", label: "Sermons" },
  { href: "/ministries", label: "Ministries" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/give", label: "Give" },
  { href: "/contact", label: "Contact" },
];

// Inline brand SVG icons (lucide-react v1.6.0 doesn't export social icons)
function IconFacebook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconTwitterX() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconYoutube() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

export default function Footer() {
  const site = getSiteConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1C3A2E] text-white/80">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <div className="mb-5">
            <p className="font-serif text-2xl text-white font-semibold">Trinity Chapel</p>
            <p className="text-[#C9A845] text-xs tracking-[0.2em] uppercase mt-0.5">Thika</p>
          </div>
          <p className="text-sm leading-relaxed mb-6 text-white/65 max-w-xs">
            {site.communityStatement}
          </p>
          {/* Social links */}
          <div className="flex items-center gap-3">
            {site.socials.facebook && (
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-colors"
              >
                <IconFacebook />
              </a>
            )}
            {site.socials.twitter && (
              <a
                href={site.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-colors"
              >
                <IconTwitterX />
              </a>
            )}
            {site.socials.instagram && (
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-colors"
              >
                <IconInstagram />
              </a>
            )}
            {site.socials.youtube && (
              <a
                href={site.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-colors"
              >
                <IconYoutube />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-white text-lg mb-5">Quick Links</h4>
          <ul className="flex flex-col gap-2.5">
            {quickLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-white/65 hover:text-[#C9A845] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif text-white text-lg mb-5">Contact Us</h4>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <MapPin size={16} className="text-[#C9A845] mt-0.5 shrink-0" />
              <p className="text-sm text-white/65 leading-relaxed">{site.address.full}</p>
            </div>
            <div className="flex gap-3 items-center">
              <Phone size={16} className="text-[#C9A845] shrink-0" />
              <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="text-sm text-white/65 hover:text-white transition-colors">
                {site.contact.phone}
              </a>
            </div>
            <div className="flex gap-3 items-center">
              <Mail size={16} className="text-[#C9A845] shrink-0" />
              <a href={`mailto:${site.contact.email}`} className="text-sm text-white/65 hover:text-white transition-colors">
                {site.contact.email}
              </a>
            </div>
          </div>

          {/* Service Times */}
          <div className="mt-7">
            <h5 className="text-xs uppercase tracking-widest text-[#C9A845] mb-3">Service Times</h5>
            <div className="flex flex-col gap-2">
              {site.services.map((s) => (
                <div key={s.name}>
                  <p className="text-sm text-white font-medium">{s.name}</p>
                  <p className="text-xs text-white/50">{s.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {year} Trinity Chapel Thika. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/sermons" className="hover:text-white/70 transition-colors">Sermons</Link>
            <Link href="/contact" className="hover:text-white/70 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
