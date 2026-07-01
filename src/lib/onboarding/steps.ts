export type OnboardingStepIcon =
  | "articles"
  | "like"
  | "profile"
  | "ai"
  | "random"
  | "notifications"
  | "write";

export type OnboardingStep = {
  id: string;
  target: string;
  title: string;
  description: string;
  icon: OnboardingStepIcon;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "articles",
    target: "homepage-article",
    title: "Maqola kartochkalari",
    description:
      "Bu yerda eng yangi va qiziqarli maqolalar joylashgan. Har bir kartochkani bosib, to'liq o'qishingiz mumkin.",
    icon: "articles",
    placement: "bottom",
  },
  {
    id: "like",
    target: "article-like",
    title: "Yoqtirish",
    description:
      "Maqolani yoqtirish uchun yurak belgisidan foydalanasiz. Maqolani ochgach, yurak tugmasini bosing — yoqtirganingiz saqlanadi!",
    icon: "like",
    placement: "top",
  },
  {
    id: "profile",
    target: "profile-menu",
    title: "Profil",
    description:
      "Bu sizning profilingiz. Kirish, sozlamalar, yozgan maqolalaringiz va boshqa imkoniyatlar shu yerda.",
    icon: "profile",
    placement: "bottom",
  },
  {
    id: "ai",
    target: "ai-assistant",
    title: "AI yordamchisi",
    description:
      "AI yordamchisi sizga tez va sifatli maqola yozishda yordam beradi. Faqat mavzuni yozing — qolganini AI bajaradi!",
    icon: "ai",
    placement: "top",
  },
  {
    id: "random",
    target: "random-article",
    title: "Random maqola",
    description:
      "Random tugmasi orqali tasodifiy mashhur maqolani topishingiz mumkin. Qiziq narsa kutib turing!",
    icon: "random",
    placement: "top",
  },
  {
    id: "notifications",
    target: "notifications",
    title: "Bildirishnomalar",
    description:
      "Yangi izohlar, yoqtirishlar va boshqa voqealar shu yerda ko'rinadi. Hech narsani o'tkazib yubormang!",
    icon: "notifications",
    placement: "top",
  },
  {
    id: "write",
    target: "write-button",
    title: "Yozish",
    description:
      "Yangi maqola yozish uchun shu tugmani bosing. Matn, rasm va formatlash vositalari bilan o'z fikringizni ulashing!",
    icon: "write",
    placement: "top",
  },
];
