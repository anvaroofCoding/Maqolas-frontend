const W = 1080;
const H = 1920;

const BRAND = {
  light: "#6366f1",
  mid: "#4f46e5",
  deep: "#4338ca",
  dark: "#1e1b4b",
  glow: "#818cf8",
  soft: "#a5b4fc",
} as const;

export type StoryTemplateId =
  | "classic"
  | "aurora"
  | "mesh"
  | "geometric"
  | "minimal"
  | "neon"
  | "paper"
  | "waves"
  | "grid"
  | "spotlight";

export type StoryTemplate = {
  id: StoryTemplateId;
  label: string;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
};

function fillBaseGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  angle = 0,
) {
  const rad = (angle * Math.PI) / 180;
  const x1 = width / 2 - (Math.cos(rad) * width) / 2;
  const y1 = height / 2 - (Math.sin(rad) * height) / 2;
  const x2 = width / 2 + (Math.cos(rad) * width) / 2;
  const y2 = height / 2 + (Math.sin(rad) * height) / 2;
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, BRAND.light);
  gradient.addColorStop(0.45, BRAND.mid);
  gradient.addColorStop(1, BRAND.dark);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawSoftOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha = 0.14,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawClassic(ctx: CanvasRenderingContext2D, width: number, height: number) {
  fillBaseGradient(ctx, width, height, 135);
  drawSoftOrb(ctx, width * 0.87, height * 0.09, width * 0.24, "#ffffff", 0.12);
  drawSoftOrb(ctx, width * 0.11, height * 0.88, width * 0.3, "#ffffff", 0.1);
}

function drawAurora(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = BRAND.dark;
  ctx.fillRect(0, 0, width, height);

  const bands = [
    { y: 0.15, c1: "rgba(184, 4, 82, 0.55)", c2: "rgba(184, 4, 82, 0)" },
    { y: 0.35, c1: "rgba(255, 77, 141, 0.35)", c2: "rgba(255, 77, 141, 0)" },
    { y: 0.55, c1: "rgba(79, 70, 229, 0.45)", c2: "rgba(79, 70, 229, 0)" },
    { y: 0.75, c1: "rgba(212, 20, 114, 0.3)", c2: "rgba(212, 20, 114, 0)" },
  ];

  for (const band of bands) {
    const gradient = ctx.createLinearGradient(0, height * band.y, width, height * (band.y + 0.25));
    gradient.addColorStop(0, band.c1);
    gradient.addColorStop(1, band.c2);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, height * band.y);
    ctx.bezierCurveTo(
      width * 0.3,
      height * (band.y - 0.08),
      width * 0.7,
      height * (band.y + 0.12),
      width,
      height * (band.y + 0.05),
    );
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  }

  drawSoftOrb(ctx, width * 0.5, height * 0.2, width * 0.35, BRAND.glow, 0.08);
}

function drawMesh(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "#12040c";
  ctx.fillRect(0, 0, width, height);

  const blobs = [
    { x: 0.2, y: 0.15, r: 0.42, color: BRAND.light },
    { x: 0.85, y: 0.25, r: 0.38, color: BRAND.soft },
    { x: 0.15, y: 0.72, r: 0.45, color: BRAND.mid },
    { x: 0.78, y: 0.82, r: 0.36, color: BRAND.deep },
    { x: 0.5, y: 0.5, r: 0.28, color: BRAND.glow },
  ];

  for (const blob of blobs) {
    const gradient = ctx.createRadialGradient(
      width * blob.x,
      height * blob.y,
      0,
      width * blob.x,
      height * blob.y,
      width * blob.r,
    );
    gradient.addColorStop(0, `${blob.color}99`);
    gradient.addColorStop(1, `${blob.color}00`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawGeometric(ctx: CanvasRenderingContext2D, width: number, height: number) {
  fillBaseGradient(ctx, width, height, 160);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
  ctx.lineWidth = 2;

  const shapes = [
    { x: width * 0.78, y: height * 0.12, size: 140 },
    { x: width * 0.12, y: height * 0.28, size: 100 },
    { x: width * 0.88, y: height * 0.62, size: 180 },
    { x: width * 0.08, y: height * 0.78, size: 120 },
  ];

  for (const shape of shapes) {
    ctx.save();
    ctx.translate(shape.x, shape.y);
    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = Math.cos(angle) * shape.size;
      const py = Math.sin(angle) * shape.size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.moveTo(width * 0.55, 0);
  ctx.lineTo(width, height * 0.35);
  ctx.lineTo(width * 0.65, height);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawMinimal(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = BRAND.dark;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  for (let y = height * 0.18; y < height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  const accent = ctx.createLinearGradient(0, height * 0.12, width * 0.7, height * 0.12);
  accent.addColorStop(0, BRAND.light);
  accent.addColorStop(1, "rgba(184, 4, 82, 0)");
  ctx.fillStyle = accent;
  ctx.fillRect(0, height * 0.12, width * 0.7, 4);

  drawSoftOrb(ctx, width * 0.92, height * 0.08, width * 0.18, BRAND.mid, 0.35);
}

function drawNeon(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "#0a0208";
  ctx.fillRect(0, 0, width, height);

  const glows = [
    { x: 0.5, y: 0.22, rx: 0.42, ry: 0.18, color: BRAND.glow },
    { x: 0.18, y: 0.7, rx: 0.28, ry: 0.22, color: BRAND.light },
    { x: 0.82, y: 0.78, rx: 0.24, ry: 0.2, color: BRAND.soft },
  ];

  for (const glow of glows) {
    ctx.save();
    ctx.translate(width * glow.x, height * glow.y);
    ctx.scale(glow.rx, glow.ry);
    for (let i = 4; i >= 1; i -= 1) {
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = `${glow.color}${Math.round((0.18 / i) * 255)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.lineWidth = i * 6;
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.save();
  ctx.strokeStyle = "rgba(255, 77, 141, 0.35)";
  ctx.lineWidth = 2;
  ctx.setLineDash([18, 24]);
  ctx.strokeRect(width * 0.08, height * 0.06, width * 0.84, height * 0.88);
  ctx.restore();
}

function drawPaper(ctx: CanvasRenderingContext2D, width: number, height: number) {
  fillBaseGradient(ctx, width, height, 180);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 18;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.2,
    width / 2,
    height / 2,
    width * 0.75,
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.45)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawWaves(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = BRAND.deep;
  ctx.fillRect(0, 0, width, height);

  const layers = [
    { y: 0.35, amp: 0.08, color: "rgba(184, 4, 82, 0.55)" },
    { y: 0.5, amp: 0.1, color: "rgba(79, 70, 229, 0.45)" },
    { y: 0.68, amp: 0.12, color: "rgba(92, 2, 48, 0.55)" },
    { y: 0.85, amp: 0.09, color: "rgba(26, 6, 16, 0.85)" },
  ];

  for (const layer of layers) {
    ctx.fillStyle = layer.color;
    ctx.beginPath();
    ctx.moveTo(0, height * layer.y);
    for (let x = 0; x <= width; x += 40) {
      const y =
        height * layer.y +
        Math.sin((x / width) * Math.PI * 3) * height * layer.amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  }

  drawSoftOrb(ctx, width * 0.5, height * 0.15, width * 0.3, "#ffffff", 0.06);
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#2a0418");
  sky.addColorStop(0.55, BRAND.mid);
  sky.addColorStop(1, BRAND.dark);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const horizon = height * 0.58;
  ctx.save();
  ctx.strokeStyle = "rgba(255, 120, 170, 0.35)";
  ctx.lineWidth = 2;

  for (let i = -8; i <= 8; i += 1) {
    ctx.beginPath();
    ctx.moveTo(width / 2 + i * 60, horizon);
    ctx.lineTo(width / 2 + i * 280, height);
    ctx.stroke();
  }

  for (let y = horizon; y < height; y += 36) {
    const progress = (y - horizon) / (height - horizon);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.globalAlpha = 0.15 + progress * 0.45;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  const sun = ctx.createRadialGradient(width / 2, horizon, 0, width / 2, horizon, width * 0.22);
  sun.addColorStop(0, "rgba(255, 120, 170, 0.9)");
  sun.addColorStop(0.4, "rgba(184, 4, 82, 0.35)");
  sun.addColorStop(1, "rgba(184, 4, 82, 0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, width, height);
}

function drawSpotlight(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = BRAND.dark;
  ctx.fillRect(0, 0, width, height);

  const spotlight = ctx.createRadialGradient(
    width * 0.5,
    height * 0.08,
    0,
    width * 0.5,
    height * 0.45,
    width * 0.85,
  );
  spotlight.addColorStop(0, "rgba(255, 120, 170, 0.55)");
  spotlight.addColorStop(0.35, "rgba(184, 4, 82, 0.35)");
  spotlight.addColorStop(1, "rgba(26, 6, 16, 0)");
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 2;
  for (let r = 120; r < 520; r += 80) {
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.08, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  const floor = ctx.createLinearGradient(0, height * 0.7, 0, height);
  floor.addColorStop(0, "rgba(79, 70, 229, 0)");
  floor.addColorStop(1, "rgba(79, 70, 229, 0.35)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, height * 0.7, width, height * 0.3);
}

export const STORY_TEMPLATES: StoryTemplate[] = [
  { id: "classic", label: "Klassik", draw: drawClassic },
  { id: "aurora", label: "Aurora", draw: drawAurora },
  { id: "mesh", label: "Mesh", draw: drawMesh },
  { id: "geometric", label: "Geometrik", draw: drawGeometric },
  { id: "minimal", label: "Minimal", draw: drawMinimal },
  { id: "neon", label: "Neon", draw: drawNeon },
  { id: "paper", label: "Tekstura", draw: drawPaper },
  { id: "waves", label: "To'lqin", draw: drawWaves },
  { id: "grid", label: "Synth", draw: drawGrid },
  { id: "spotlight", label: "Spotlight", draw: drawSpotlight },
];

export const DEFAULT_STORY_TEMPLATE: StoryTemplateId = "classic";

export function getStoryTemplate(id: StoryTemplateId): StoryTemplate {
  return STORY_TEMPLATES.find((template) => template.id === id) ?? STORY_TEMPLATES[0];
}

export function renderStoryTemplateThumbnail(templateId: StoryTemplateId): string {
  const canvas = document.createElement("canvas");
  canvas.width = 108;
  canvas.height = 192;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  getStoryTemplate(templateId).draw(ctx, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

/** Full-size canvas uchun o'lcham konstantalari */
export const STORY_CANVAS = { width: W, height: H } as const;
