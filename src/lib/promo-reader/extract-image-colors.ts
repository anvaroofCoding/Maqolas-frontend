const FALLBACK_COLORS = ["#4f46e5", "#7c3aed", "#2563eb"];

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => Math.max(0, Math.min(255, channel)).toString(16).padStart(2, "0"))
    .join("")}`;
}

function colorDistance(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
) {
  return (
    (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2
  );
}

export async function extractImageColors(
  imageUrl: string,
  count = 3,
): Promise<string[]> {
  if (typeof window === "undefined" || !imageUrl) {
    return FALLBACK_COLORS;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    const finish = (colors: string[]) => resolve(colors);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 48;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          finish(FALLBACK_COLORS);
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        const buckets: { r: number; g: number; b: number; weight: number }[] =
          [];

        for (let i = 0; i < data.length; i += 16) {
          const r = data[i] ?? 0;
          const g = data[i + 1] ?? 0;
          const b = data[i + 2] ?? 0;
          const a = data[i + 3] ?? 255;
          if (a < 128) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          if (saturation < 0.12 && max > 210) continue;
          if (max < 30) continue;

          const weight = saturation * 2 + max / 255;
          buckets.push({ r, g, b, weight });
        }

        if (buckets.length === 0) {
          finish(FALLBACK_COLORS);
          return;
        }

        buckets.sort((a, b) => b.weight - a.weight);

        const picked: { r: number; g: number; b: number }[] = [];
        for (const bucket of buckets) {
          if (
            picked.every(
              (color) => colorDistance(color, bucket) > 2800,
            )
          ) {
            picked.push(bucket);
          }
          if (picked.length >= count) break;
        }

        if (picked.length === 0) {
          finish(FALLBACK_COLORS);
          return;
        }

        finish(picked.map((color) => rgbToHex(color.r, color.g, color.b)));
      } catch {
        finish(FALLBACK_COLORS);
      }
    };

    img.onerror = () => finish(FALLBACK_COLORS);
    img.src = imageUrl;
  });
}
