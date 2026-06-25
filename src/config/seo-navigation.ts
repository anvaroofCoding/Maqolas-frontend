/**
 * Google Sitelinks va ichki SEO uchun asosiy bo'limlar.
 * UI navigatsiyasi (@/config/navigation) bilan mos bo'lishi kerak.
 */
export type SeoNavLink = {
  label: string;
  href: string;
  description: string;
};

export const primarySeoNavLinks: SeoNavLink[] = [
  {
    label: "Siz uchun",
    href: "/",
    description:
      "Ommabop va sizga mos tavsiya etilgan o'zbekcha maqolalar — Maqolas bosh sahifasi.",
  },
  {
    label: "Maqolalar",
    href: "/maqolalar",
    description:
      "Barcha mavzulardagi o'zbekcha maqolalar katalogi. Maqola o'qish va topish uchun.",
  },
  {
    label: "Yangi maqolalar",
    href: "/yangi",
    description:
      "Eng so'nggi nashr etilgan o'zbekcha maqolalar va yangi kontent.",
  },
  {
    label: "Mavzular",
    href: "/mavzular",
    description:
      "Texnologiya, startaplar, AI, marketing va boshqa maqola mavzulari.",
  },
  {
    label: "Dastur haqida",
    href: "/dastur-haqida",
    description:
      "Maqolas — o'zbekcha maqolalar o'qish va yozish platformasi haqida.",
  },
];
