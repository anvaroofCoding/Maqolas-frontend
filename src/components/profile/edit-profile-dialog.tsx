"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfileMutation } from "@/features/auth/api/auth-api";
import type { AuthUser } from "@/features/auth/types";

interface EditProfileDialogProps {
  user: AuthUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio ?? "");
  const [website, setWebsite] = useState(user.social?.website ?? "");
  const [linkedin, setLinkedin] = useState(user.social?.linkedin ?? "");
  const [telegram, setTelegram] = useState(user.social?.telegram ?? "");
  const [instagram, setInstagram] = useState(user.social?.instagram ?? "");

  useEffect(() => {
    if (open) {
      setDisplayName(user.displayName);
      setBio(user.bio ?? "");
      setWebsite(user.social?.website ?? "");
      setLinkedin(user.social?.linkedin ?? "");
      setTelegram(user.social?.telegram ?? "");
      setInstagram(user.social?.instagram ?? "");
    }
  }, [open, user]);

  async function handleSave() {
    try {
      await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        social: {
          website: website.trim() || undefined,
          linkedin: linkedin.trim() || undefined,
          telegram: telegram.trim() || undefined,
          instagram: instagram.trim() || undefined,
        },
      }).unwrap();
      onOpenChange(false);
    } catch {
      /* toast keyin */
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Profilni tahrirlash</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="displayName">Ism</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ismingiz"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="O'zingiz haqingizda qisqacha..."
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Veb-sayt</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="telegram">Telegram</Label>
            <Input
              id="telegram"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@username yoki havola"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@username yoki havola"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="profil havolasi"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Bekor qilish
          </Button>
          <Button type="button" disabled={isLoading} onClick={() => void handleSave()}>
            {isLoading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
