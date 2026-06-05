"use client";

import { CameraIcon, Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUploadAvatarMutation } from "@/features/auth/api/auth-api";
import type { AuthUser } from "@/features/auth/types";
import { getUserInitials } from "@/lib/user";
import { cn } from "@/lib/utils";

const MAX_SIZE_MB = 5;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

interface ProfileAvatarUploadProps {
  user: AuthUser;
  className?: string;
}

export function ProfileAvatarUpload({ user, className }: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();

  const initials = getUserInitials(user.displayName);
  const avatarSrc = preview ?? user.avatarUrl;

  async function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Faqat rasm fayli tanlang");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Rasm hajmi ${MAX_SIZE_MB}MB dan oshmasin`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await uploadAvatar(formData).unwrap();
      setPreview(null);
    } catch {
      setError("Rasm yuklanmadi. Qayta urinib ko'ring.");
      setPreview(null);
    } finally {
      URL.revokeObjectURL(objectUrl);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className={cn("relative shrink-0", className)}>
      <Avatar className="size-20 sm:size-24">
        <AvatarImage src={avatarSrc ?? undefined} alt={user.displayName} />
        <AvatarFallback className="bg-muted text-xl font-medium text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        aria-hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <button
        type="button"
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "absolute right-0 bottom-0 inline-flex size-8 items-center justify-center rounded-full",
          "border border-border bg-background text-muted-foreground shadow-sm transition-colors",
          "hover:bg-muted hover:text-foreground disabled:opacity-60",
        )}
        aria-label="Profil rasmini yuklash"
      >
        {isLoading ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <CameraIcon className="size-4" />
        )}
      </button>

      {error ? (
        <p className="absolute -bottom-6 left-0 max-w-48 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
