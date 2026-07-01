import type { ClickSparkleStyleId } from "@/lib/effects/click-sparkle-styles";

const SKIP_SELECTOR =
  'input, textarea, select, button[role="combobox"], [data-slot="select-trigger"], [data-slot="select-content"], [data-slot="select-item"], [contenteditable="true"], [role="slider"], [data-no-click-sparkles], .maqolas-phrase-selectable';

type ParticleStyles = Record<string, string>;

type ParticleOptions = {
  x: number;
  y: number;
  className: string;
  styles?: ParticleStyles;
  durationMs?: number;
};

function getParticleColors() {
  const style = getComputedStyle(document.documentElement);
  const candidates = [
    style.getPropertyValue("--nav-active").trim(),
    style.getPropertyValue("--primary").trim(),
    style.getPropertyValue("--ring").trim(),
    style.getPropertyValue("--sidebar-primary").trim(),
  ];

  const unique = [...new Set(candidates.filter(Boolean))];
  return unique.length ? unique : ["#4f46e5", "#7c3aed", "#6366f1"];
}

function appendParticle({
  x,
  y,
  className,
  styles = {},
  durationMs,
}: ParticleOptions) {
  const particle = document.createElement("span");
  particle.setAttribute("aria-hidden", "true");
  particle.className = className;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;

  for (const [key, value] of Object.entries(styles)) {
    if (key.startsWith("--")) {
      particle.style.setProperty(key, value);
    } else {
      Reflect.set(particle.style, key, value);
    }
  }

  if (durationMs) {
    particle.style.animationDuration = `${durationMs}ms`;
  }

  document.body.appendChild(particle);
  particle.addEventListener("animationend", () => particle.remove(), {
    once: true,
  });
}

function spawnSprinkle(x: number, y: number, colors: string[]) {
  const count = 16;
  for (let index = 0; index < count; index += 1) {
    const isSquare = Math.random() > 0.4;
    const size = 4 + Math.random() * 5;
    const angle =
      (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.75;
    const distance = 24 + Math.random() * 52;

    appendParticle({
      x,
      y,
      className: "maqolas-click-fx maqolas-click-fx--sprinkle",
      durationMs: 460 + Math.random() * 260,
      styles: {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: colors[index % colors.length],
        borderRadius: isSquare ? "2px" : "9999px",
        "--sparkle-tx": `${Math.cos(angle) * distance}px`,
        "--sparkle-ty": `${Math.sin(angle) * distance - 10}px`,
        "--sparkle-rot": `${Math.random() * 540 - 270}deg`,
      },
    });
  }
}

function spawnBurst(x: number, y: number, colors: string[]) {
  const count = 22;
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count;
    const distance = 36 + Math.random() * 64;
    const size = 3 + Math.random() * 4;

    appendParticle({
      x,
      y,
      className: "maqolas-click-fx maqolas-click-fx--burst",
      durationMs: 320 + Math.random() * 180,
      styles: {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: colors[index % colors.length],
        borderRadius: "9999px",
        "--sparkle-tx": `${Math.cos(angle) * distance}px`,
        "--sparkle-ty": `${Math.sin(angle) * distance}px`,
      },
    });
  }
}

function spawnRing(x: number, y: number, colors: string[]) {
  for (let index = 0; index < 3; index += 1) {
    appendParticle({
      x,
      y,
      className: "maqolas-click-fx maqolas-click-fx--ring",
      durationMs: 520 + index * 90,
      styles: {
        width: "12px",
        height: "12px",
        border: `2px solid ${colors[index % colors.length]}`,
        backgroundColor: "transparent",
        borderRadius: "9999px",
        animationDelay: `${index * 70}ms`,
      },
    });
  }
}

function spawnStars(x: number, y: number, colors: string[]) {
  const count = 10;
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count;
    const distance = 28 + Math.random() * 36;

    appendParticle({
      x,
      y,
      className: "maqolas-click-fx maqolas-click-fx--stars",
      durationMs: 520 + Math.random() * 200,
      styles: {
        width: "10px",
        height: "10px",
        color: colors[index % colors.length],
        "--sparkle-tx": `${Math.cos(angle) * distance}px`,
        "--sparkle-ty": `${Math.sin(angle) * distance}px`,
        "--sparkle-rot": `${Math.random() * 180}deg`,
      },
    });
  }
}

function spawnConfetti(x: number, y: number, colors: string[]) {
  const count = 18;
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const distance = 20 + Math.random() * 50;

    appendParticle({
      x,
      y,
      className: "maqolas-click-fx maqolas-click-fx--confetti",
      durationMs: 700 + Math.random() * 350,
      styles: {
        width: `${4 + Math.random() * 4}px`,
        height: `${8 + Math.random() * 6}px`,
        backgroundColor: colors[index % colors.length],
        borderRadius: "1px",
        "--sparkle-tx": `${Math.cos(angle) * distance}px`,
        "--sparkle-ty": `${Math.sin(angle) * distance + 40}px`,
        "--sparkle-rot": `${Math.random() * 720 - 360}deg`,
      },
    });
  }
}

function spawnSpark(x: number, y: number, colors: string[]) {
  const count = 8;
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count;

    appendParticle({
      x,
      y,
      className: "maqolas-click-fx maqolas-click-fx--spark",
      durationMs: 380 + Math.random() * 120,
      styles: {
        width: "2px",
        height: "14px",
        backgroundColor: colors[index % colors.length],
        borderRadius: "9999px",
        "--sparkle-rot": `${(angle * 180) / Math.PI}deg`,
        "--sparkle-scale": `${1.4 + Math.random() * 0.8}`,
      },
    });
  }
}

function spawnPulse(x: number, y: number, colors: string[]) {
  appendParticle({
    x,
    y,
    className: "maqolas-click-fx maqolas-click-fx--pulse",
    durationMs: 560,
    styles: {
      width: "16px",
      height: "16px",
      backgroundColor: colors[0],
      borderRadius: "9999px",
    },
  });
}

function spawnFountain(x: number, y: number, colors: string[]) {
  const count = 14;
  for (let index = 0; index < count; index += 1) {
    const spread = (index / (count - 1) - 0.5) * 1.2;
    const distanceX = spread * 55;
    const distanceY = -(40 + Math.random() * 55);

    appendParticle({
      x,
      y,
      className: "maqolas-click-fx maqolas-click-fx--fountain",
      durationMs: 520 + Math.random() * 220,
      styles: {
        width: `${4 + Math.random() * 3}px`,
        height: `${4 + Math.random() * 3}px`,
        backgroundColor: colors[index % colors.length],
        borderRadius: "9999px",
        "--sparkle-tx": `${distanceX}px`,
        "--sparkle-ty": `${distanceY}px`,
      },
    });
  }
}

function spawnSnow(x: number, y: number, colors: string[]) {
  const count = 12;
  for (let index = 0; index < count; index += 1) {
    const offsetX = (Math.random() - 0.5) * 70;

    appendParticle({
      x,
      y,
      className: "maqolas-click-fx maqolas-click-fx--snow",
      durationMs: 900 + Math.random() * 500,
      styles: {
        width: `${3 + Math.random() * 3}px`,
        height: `${3 + Math.random() * 3}px`,
        backgroundColor: colors[index % colors.length],
        borderRadius: "9999px",
        opacity: "0.85",
        "--sparkle-tx": `${offsetX}px`,
        "--sparkle-ty": `${30 + Math.random() * 55}px`,
      },
    });
  }
}

function spawnBloom(x: number, y: number, colors: string[]) {
  const count = 8;
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count;
    const distance = 18 + Math.random() * 28;

    appendParticle({
      x,
      y,
      className: "maqolas-click-fx maqolas-click-fx--bloom",
      durationMs: 620 + Math.random() * 180,
      styles: {
        width: "8px",
        height: "12px",
        backgroundColor: colors[index % colors.length],
        borderRadius: "9999px 9999px 2px 9999px",
        "--sparkle-tx": `${Math.cos(angle) * distance}px`,
        "--sparkle-ty": `${Math.sin(angle) * distance}px`,
        "--sparkle-rot": `${(angle * 180) / Math.PI + 90}deg`,
      },
    });
  }
}

export function spawnClickSparkles(
  x: number,
  y: number,
  style: ClickSparkleStyleId,
) {
  const colors = getParticleColors();

  switch (style) {
    case "burst":
      spawnBurst(x, y, colors);
      break;
    case "ring":
      spawnRing(x, y, colors);
      break;
    case "stars":
      spawnStars(x, y, colors);
      break;
    case "confetti":
      spawnConfetti(x, y, colors);
      break;
    case "spark":
      spawnSpark(x, y, colors);
      break;
    case "pulse":
      spawnPulse(x, y, colors);
      break;
    case "fountain":
      spawnFountain(x, y, colors);
      break;
    case "snow":
      spawnSnow(x, y, colors);
      break;
    case "bloom":
      spawnBloom(x, y, colors);
      break;
    case "sprinkle":
    default:
      spawnSprinkle(x, y, colors);
      break;
  }
}

export function shouldSkipClickSparkles(target: EventTarget | null) {
  if (!(target instanceof Element)) return true;
  return Boolean(target.closest(SKIP_SELECTOR));
}
