export type ClickSparkleStyleId =
  | "sprinkle"
  | "burst"
  | "ring"
  | "stars"
  | "confetti"
  | "spark"
  | "pulse"
  | "fountain"
  | "snow"
  | "bloom";

export type ClickSparkleStyleOption = {
  id: ClickSparkleStyleId;
  label: string;
  description: string;
};

export const CLICK_SPARKLE_STYLES: ClickSparkleStyleOption[] = [
  {
    id: "sprinkle",
    label: "Sepish",
    description: "Shakar/tuz sepilgandek kichik zarrachalar",
  },
  {
    id: "burst",
    label: "Portlash",
    description: "Tez va kuchli radial portlash",
  },
  {
    id: "ring",
    label: "Halqa",
    description: "Kengayib yo'qoladigan halqalar",
  },
  {
    id: "stars",
    label: "Yulduzlar",
    description: "Yulduz shaklidagi chaqnashlar",
  },
  {
    id: "confetti",
    label: "Konfeti",
    description: "Pastga tushadigan rangli konfeti",
  },
  {
    id: "spark",
    label: "Uchqun",
    description: "Nur uchqunlari tarqaladi",
  },
  {
    id: "pulse",
    label: "To'lqin",
    description: "Yumshoq markaziy to'lqin",
  },
  {
    id: "fountain",
    label: "Favvora",
    description: "Yuqoriga chiqqan favvora",
  },
  {
    id: "snow",
    label: "Qor parchalari",
    description: "Sekin suzib tushadigan parchalar",
  },
  {
    id: "bloom",
    label: "Gullash",
    description: "Gul barglari kabi yoyilish",
  },
];

export const DEFAULT_CLICK_SPARKLE_STYLE: ClickSparkleStyleId = "sprinkle";

export const VALID_CLICK_SPARKLE_STYLE_IDS = new Set<ClickSparkleStyleId>(
  CLICK_SPARKLE_STYLES.map((style) => style.id),
);
