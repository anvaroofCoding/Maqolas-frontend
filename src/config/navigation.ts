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
  MegaphoneIcon,
  MessageCircleIcon,
  NewspaperIcon,
  PaletteIcon,
  ThumbsUpIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export function isMainNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export const mainNavItems: NavItem[] = [
  { label: "Siz uchun", href: "/", icon: ThumbsUpIcon },
  { label: "Yangi", href: "/yangi", icon: ClockIcon },
  { label: "Mening lentalarim", href: "/lenta", icon: NewspaperIcon },
];

export const topicNavItems: NavItem[] = [
  { label: "Texnologiya", href: "/mavzu/texnologiya", icon: CpuIcon },
  { label: "Startaplar", href: "/mavzu/startaplar", icon: LayersIcon },
  { label: "AI", href: "/mavzu/ai", icon: BotIcon },
  { label: "Marketing", href: "/mavzu/marketing", icon: MegaphoneIcon },
  { label: "Mahsulot", href: "/mavzu/mahsulot", icon: PaletteIcon },
  { label: "Tahlil", href: "/mavzu/tahlil", icon: BarChart3Icon },
  { label: "Karyera", href: "/mavzu/karyera", icon: BriefcaseIcon },
  { label: "Fikr", href: "/mavzu/fikr", icon: MessageCircleIcon },
  { label: "Ta'lim", href: "/mavzu/talim", icon: BookOpenIcon },
  { label: "Moliya", href: "/mavzu/moliya", icon: BanknoteIcon },
];
