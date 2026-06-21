export type HomepageIntroColumn = {
  title: string;
  text: string;
};

export type HomepageIntroCopy = {
  headingAccent: string;
  headingSuffix: string;
  lead: string;
  columns: HomepageIntroColumn[];
};

export const HOMEPAGE_INTRO_COPY = {
  home: {
    headingAccent: "Maqolalar",
    headingSuffix: "— o'zbekcha maqolalar",
    lead: "Maqolas — o'zbekcha maqolalar o'qish, yozish va ulashish uchun zamonaviy platforma. Ommabop maqolalarni o'qing yoki o'z maqolangizni bepul nashr eting.",
    columns: [
      {
        title: "Maqola o'qish",
        text: "Texnologiya, startap, sun'iy intellekt, marketing va boshqa mavzularda minglab o'zbekcha maqolalar. Har kuni yangi maqolalar qo'shiladi.",
      },
      {
        title: "Maqola yozish",
        text: "O'z bilimingiz va tajribangizni maqola shaklida yozing. O'quvchilar bilan fikr almashing, izohlar va layklar orqali jamiyatga qo'shiling.",
      },
      {
        title: "Maqolas platformasi",
        text: "O'zbekiston uchun yaratilgan maqola platformasi. Tez, qulay va bepul. Maqolalar qidiruv tizimlarida ham ko'rinadi — SEO uchun optimallashtirilgan.",
      },
    ],
  },
  maqolalar: {
    headingAccent: "Maqolalar",
    headingSuffix: "— barcha mavzular",
    lead: "Barcha o'zbekcha maqolalar bir joyda. Mavzu bo'yicha filtrlang, ommabop maqolalarni o'qing yoki yangi maqola yozishni boshlang.",
    columns: [
      {
        title: "Mavzu bo'yicha",
        text: "Har bir mavzuda alohida maqolalar to'plami: texnologiya maqolalari, startap maqolalari, AI va boshqalar.",
      },
      {
        title: "Ommabop maqolalar",
        text: "Eng ko'p o'qilgan va yoqtirilgan maqolalar ro'yxati. Dolzarb mavzular va sifatli kontent bir joyda.",
      },
      {
        title: "Yangi maqolalar",
        text: "Platformaga qo'shilgan so'nggi maqolalar. O'zbek tilida yangi fikrlar, tahlillar va bilimlar bilan tanishing.",
      },
    ],
  },
} as const satisfies Record<string, HomepageIntroCopy>;

/** Intro va skeleton uchun bir xil layout klasslari */
export const homepageSeoIntroShellClassName =
  "border-b border-border/40 px-1 pb-5 md:px-2 md:pb-6";

export const homepageSeoIntroGridClassName =
  "grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5";

export const homepageSeoIntroCardClassName =
  "rounded-xl border border-border/50 bg-muted/10 p-3.5 sm:p-4";
