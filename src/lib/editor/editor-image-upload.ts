import {
  EDITOR_IMAGE_ACCEPT,
  MAX_EDITOR_IMAGE_MB,
} from "@/lib/editor/image-constants";
import { toast } from "@/lib/toast";

export function validateEditorImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Faqat rasm fayli tanlang";
  }

  if (file.size > MAX_EDITOR_IMAGE_MB * 1024 * 1024) {
    return `Rasm hajmi ${MAX_EDITOR_IMAGE_MB}MB dan oshmasin`;
  }

  return null;
}

export async function uploadEditorImageFiles(
  files: File[],
  upload: (formData: FormData) => Promise<{ url: string }>,
): Promise<string[]> {
  const validFiles = files.filter((file) => {
    const error = validateEditorImageFile(file);
    if (error) {
      toast.error(error);
      return false;
    }
    return true;
  });

  if (validFiles.length === 0) return [];

  const urls: string[] = [];

  for (const file of validFiles) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await upload(formData);
      urls.push(result.url);
    } catch {
      toast.error(`"${file.name}" yuklanmadi`);
    }
  }

  return urls;
}

export { EDITOR_IMAGE_ACCEPT, MAX_EDITOR_IMAGE_MB };
