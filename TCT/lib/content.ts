import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const contentDir = path.join(process.cwd(), "content");

// ── Types ────────────────────────────────────────────────────

export interface Sermon {
  slug: string;
  title: string;
  preacher: string;
  date: string;
  series: string;
  tags: string[];
  excerpt: string;
  audioUrl: string;
  videoUrl: string;
  scripture: string;
  coverImage: string;
}

export interface ChurchEvent {
  slug: string;
  title: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  status: "upcoming" | "past";
  category: string;
  excerpt: string;
  description: string;
  coverImage: string;
}

export interface Ministry {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  lead: string;
  meetingTime: string;
  coverImage: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  author: string;
  excerpt: string;
  coverImage: string;
  content?: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  subTagline: string;
  scripture: string;
  scriptureRef: string;
  mission: string;
  vision: string;
  communityStatement: string;
  address: {
    street: string;
    area: string;
    city: string;
    country: string;
    full: string;
  };
  contact: { phone: string; email: string };
  mapUrl: string;
  mapEmbed: string;
  giving?: {
    mpesa?: { paybill: string; account: string };
    bank?: {
      name: string;
      accountName: string;
      accountNumber: string;
      branch: string;
      swiftCode?: string;
    };
  };
  socials: { facebook: string; twitter: string; instagram: string; youtube: string };
  services: { name: string; day: string; time: string; note: string }[];
  deep: { letter: string; word: string; description: string }[];
  wide: { letter: string; word: string; description: string }[];
  leadership: {
    name: string;
    role: string;
    bio: string;
    image: string;
    socials: Record<string, string>;
  }[];
}

// ── Helpers ──────────────────────────────────────────────────

function readJson<T>(fileName: string): T {
  const raw = fs.readFileSync(path.join(contentDir, fileName), "utf8");
  return JSON.parse(raw) as T;
}

// ── Sermons ──────────────────────────────────────────────────

export function getSermons(): Sermon[] {
  return readJson<Sermon[]>("sermons.json").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getSermonBySlug(slug: string): Sermon | undefined {
  return getSermons().find((s) => s.slug === slug);
}

// ── Events ───────────────────────────────────────────────────

export function getEvents(): ChurchEvent[] {
  return readJson<ChurchEvent[]>("events.json").sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getUpcomingEvents(): ChurchEvent[] {
  return getEvents().filter((e) => e.status === "upcoming");
}

export function getEventBySlug(slug: string): ChurchEvent | undefined {
  return getEvents().find((e) => e.slug === slug);
}

// ── Ministries ───────────────────────────────────────────────

export function getMinistries(): Ministry[] {
  return readJson<Ministry[]>("ministries.json");
}

export function getMinistryBySlug(slug: string): Ministry | undefined {
  return getMinistries().find((m) => m.slug === slug);
}

// ── Blog ─────────────────────────────────────────────────────

function getBlogDir() {
  return path.join(contentDir, "blog");
}

export function getBlogPosts(): BlogPost[] {
  const files = fs.readdirSync(getBlogDir()).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(getBlogDir(), file), "utf8");
      const { data } = matter(raw);
      return { slug, ...(data as Omit<BlogPost, "slug" | "content">) };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const filePath = path.join(getBlogDir(), `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content: mdContent } = matter(raw);
  const processed = await remark().use(remarkHtml).process(mdContent);
  return {
    slug,
    ...(data as Omit<BlogPost, "slug" | "content">),
    content: processed.toString(),
  };
}

// ── Site Config ──────────────────────────────────────────────

export function getSiteConfig(): SiteConfig {
  return readJson<SiteConfig>("site.json");
}
