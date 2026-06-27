"use client";

import { ImagePlusIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePinMutation } from "@/features/pins/api/pins-api";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function readImageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Rasm o'lchamini o'qib bo'lmadi"));
    };

    image.src = url;
  });
}

export function PinUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [createPin, { isLoading }] = useCreatePinMutation();

  const handleFile = useCallback(
    (nextFile: File | null) => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setFile(nextFile);
      setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : null);
      setPreviewSize(null);

      if (nextFile) {
        void readImageDimensions(nextFile)
          .then(setPreviewSize)
          .catch(() => setPreviewSize(null));

        if (!title.trim()) {
          const baseName = nextFile.name
            .replace(/\.[^.]+$/, "")
            .replace(/[-_]+/g, " ");
          if (baseName.trim()) {
            setTitle(baseName.trim().slice(0, 200));
          }
        }
      }
    },
    [previewUrl, title],
  );

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped?.type.startsWith("image/")) {
      handleFile(dropped);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      toast.error("Avval rasm tanlang");
      return;
    }

    try {
      const dimensions = await readImageDimensions(file);
      const result = await createPin({
        image: file,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        width: dimensions.width,
        height: dimensions.height,
      }).unwrap();

      toast.success("Rasm muvaffaqiyatli yuklandi");
      router.push(`/rasm/${result.pin.slug}`);
    } catch {
      toast.error("Rasm yuklanmadi. Qayta urinib ko'ring.");
    }
  };

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-6">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative overflow-hidden rounded-3xl border-2 border-dashed bg-muted/20 p-6 transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-border/70",
        )}
      >
        {previewUrl ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-2xl bg-muted/40 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Tanlangan rasm"
              width={previewSize?.width ?? 800}
              height={previewSize?.height ?? 1000}
              className="h-auto max-h-[min(70vh,480px)] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ImagePlusIcon className="size-8" aria-hidden />
            </div>
            <p className="mt-4 text-base font-medium text-foreground">
              Rasmni shu yerga torting
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              JPEG, PNG, WebP yoki GIF — maksimal 12 MB
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button type="button" variant="outline" className="rounded-full" asChild>
            <label htmlFor="pin-image-input" className="cursor-pointer">
              <UploadIcon className="size-4" aria-hidden />
              Rasm tanlash
            </label>
          </Button>
          {file ? (
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={() => handleFile(null)}
            >
              Tozalash
            </Button>
          ) : null}
        </div>

        <input
          id="pin-image-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
        />
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pin-title">Sarlavha</Label>
          <Input
            id="pin-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Rasm sarlavhasi (SEO uchun muhim)"
            maxLength={200}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="pin-description">Tavsif</Label>
          <Textarea
            id="pin-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Rasm haqida qisqa tavsif..."
            rows={4}
            maxLength={2000}
            className="resize-none rounded-2xl"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full rounded-full sm:w-auto"
        disabled={isLoading || !file}
      >
        {isLoading ? (
          <>
            <Loader2Icon className="size-4 animate-spin" aria-hidden />
            Yuklanmoqda...
          </>
        ) : (
          <>
            <UploadIcon className="size-4" aria-hidden />
            Rasmni joylash
          </>
        )}
      </Button>
    </form>
  );
}
