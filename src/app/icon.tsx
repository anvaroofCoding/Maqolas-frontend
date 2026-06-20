import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/seo/brand-mark";

export const runtime = "edge";
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandMark size={48} />, { ...size });
}
