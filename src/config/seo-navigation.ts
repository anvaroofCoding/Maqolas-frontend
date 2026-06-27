/**
 * Google Sitelinks va ichki SEO uchun asosiy bo'limlar.
 * UI navigatsiyasi (@/config/navigation) bilan mos bo'lishi kerak.
 */
import type { LucideIcon } from "lucide-react";
import {
  ClockIcon,
  ImagesIcon,
  InfoIcon,
  LibraryIcon,
  TagIcon,
  ThumbsUpIcon,
} from "lucide-react";

export type SeoNavLink = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export const primarySeoNavLinks: SeoNavLink[] = [
  {
    label: "Siz uchun",
    href: "/",
    icon: ThumbsUpIcon,
    description:
      "Ommabop va sizga mos tavsiya etilgan o'zbekcha maqolalar — Maqolas bosh sahifasi.",
  },
  {
    label: "Maqolalar",
    href: "/maqolalar",
    icon: LibraryIcon,
    description:
      "Barcha mavzulardagi o'zbekcha maqolalar katalogi. Maqola o'qish va topish uchun.",
  },
  {
    label: "Rasmlar",
    href: "/rasmlar",
    icon: ImagesIcon,
    description:
      "Pinterest uslubidagi vizual galereya — rasmlarni ko'ring, yoqtiring va izoh qoldiring.",
  },
  {
    label: "Yangi maqolalar",
    href: "/yangi",
    icon: ClockIcon,
    description:
      "Eng so'nggi nashr etilgan o'zbekcha maqolalar va yangi kontent.",
  },
  {
    label: "Mavzular",
    href: "/mavzular",
    icon: TagIcon,
    description:
      "Texnologiya, startaplar, AI, marketing va boshqa maqola mavzulari.",
  },
  {
    label: "Dastur haqida",
    href: "/dastur-haqida",
    icon: InfoIcon,
    description:
      "Maqolas — o'zbekcha maqolalar o'qish va yozish platformasi haqida.",
  },
];
