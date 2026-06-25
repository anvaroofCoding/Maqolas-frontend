import type { LucideIcon } from "lucide-react";
import {
  BanknoteIcon,
  BarChart3Icon,
  BookOpenIcon,
  BotIcon,
  BriefcaseIcon,
  ClockIcon,
  CpuIcon,
  LayersIcon,
  LibraryIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  NewspaperIcon,
  PaletteIcon,
  TagIcon,
  ThumbsUpIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type TopicSource = {
  name: string;
  slug: string;
};

export function isMainNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export const mainNavItems: NavItem[] = [
  { label: "Siz uchun", href: "/", icon: ThumbsUpIcon },
  { label: "Maqolalar", href: "/maqolalar", icon: LibraryIcon },
  { label: "Yangi", href: "/yangi", icon: ClockIcon },
  { label: "Mavzular", href: "/mavzular", icon: TagIcon },
  { label: "Mening maqolam", href: "/lenta", icon: NewspaperIcon },
];

const topicIconBySlug: Record<string, LucideIcon> = {
  texnologiya: CpuIcon,
  startaplar: LayersIcon,
  ai: BotIcon,
  marketing: MegaphoneIcon,
  mahsulot: PaletteIcon,
  tahlil: BarChart3Icon,
  karyera: BriefcaseIcon,
  fikr: MessageCircleIcon,
  talim: BookOpenIcon,
  moliya: BanknoteIcon,
};

export function getTopicIcon(slug: string): LucideIcon {
  return topicIconBySlug[slug.toLowerCase()] ?? TagIcon;
}

export function sortTopicsAlphabetically<T extends { name: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) =>
    a.name.localeCompare(b.name, "uz", { sensitivity: "base" }),
  );
}

export function categoriesToNavItems(categories: TopicSource[]): NavItem[] {
  return sortTopicsAlphabetically(categories).map((category) => ({
    label: category.name,
    href: `/mavzu/${category.slug}`,
    icon: getTopicIcon(category.slug),
  }));
}
