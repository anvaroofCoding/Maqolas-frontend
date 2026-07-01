import type { ShortcutDefinition } from "@/lib/keyboard-shortcuts/types";

export const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
  {
    id: "search",
    label: "Qidiruv",
    description: "Maqolalarni qidirish oynasini ochadi",
    defaultBinding: { ctrl: true, key: "k" },
    allowInInput: true,
  },
  {
    id: "write",
    label: "Yozish",
    description: "Yangi maqola yozish sahifasiga o'tadi",
    defaultBinding: { alt: true, key: "w" },
  },
  {
    id: "home",
    label: "Bosh sahifa",
    description: "Asosiy lenta sahifasiga qaytadi",
    defaultBinding: { alt: true, key: "h" },
  },
  {
    id: "maqolalar",
    label: "Maqolalar",
    description: "Barcha maqolalar ro'yxatini ochadi",
    defaultBinding: { alt: true, key: "m" },
  },
  {
    id: "rasmlar",
    label: "Rasmlar",
    description: "Pinterest uslubidagi galereyaga o'tadi",
    defaultBinding: { alt: true, key: "r" },
  },
  {
    id: "yangi",
    label: "Yangi maqolalar",
    description: "Eng yangi maqolalar bo'limini ochadi",
    defaultBinding: { alt: true, key: "n" },
  },
  {
    id: "mavzular",
    label: "Mavzular",
    description: "Mavzular bo'limini ochadi",
    defaultBinding: { alt: true, shift: true, key: "t" },
  },
  {
    id: "lenta",
    label: "Mening maqolam",
    description: "Saqlangan maqolalar lentasini ochadi",
    defaultBinding: { alt: true, key: "l" },
  },
  {
    id: "notifications",
    label: "Bildirishnomalar",
    description: "Bildirishnomalar panelini ochadi",
    defaultBinding: { alt: true, key: "b" },
  },
  {
    id: "settings",
    label: "Sozlamalar",
    description: "Sozlamalar oynasini ochadi",
    defaultBinding: { ctrl: true, key: "," },
  },
  {
    id: "theme-toggle",
    label: "Mavzu",
    description: "Yorug' va qorong'i rejim o'rtasida almashtiradi",
    defaultBinding: { ctrl: true, shift: true, key: "l" },
  },
  {
    id: "random-article",
    label: "Random maqola",
    description: "Tasodifiy mashhur maqolani ochadi",
    defaultBinding: { alt: true, shift: true, key: "r" },
  },
  {
    id: "ai-assistant",
    label: "AI yordamchisi",
    description: "AI maqola yordamchisini ochadi",
    defaultBinding: { ctrl: true, shift: true, key: "a" },
  },
  {
    id: "saved-phrases",
    label: "Saqlangan so'zlar",
    description: "Saqlangan iboralar ro'yxatini ochadi",
    defaultBinding: { alt: true, key: "s" },
  },
  {
    id: "profile",
    label: "Profil",
    description: "Shaxsiy profil sahifasiga o'tadi",
    defaultBinding: { alt: true, key: "p" },
  },
  {
    id: "onboarding",
    label: "O'rgatish",
    description: "Dastur bo'yicha qisqa tanishuvni qayta boshlaydi",
    defaultBinding: { alt: true, key: "o" },
  },
];

export const SHORTCUT_DEFINITION_MAP = Object.fromEntries(
  SHORTCUT_DEFINITIONS.map((item) => [item.id, item]),
) as Record<ShortcutDefinition["id"], ShortcutDefinition>;
