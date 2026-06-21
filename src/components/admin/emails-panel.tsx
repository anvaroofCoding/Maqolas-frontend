"use client";

import { Loader2, Mail, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useListUsersQuery,
  useSendAdminEmailMutation,
} from "@/features/admin/api/admin-api";
import type { AdminEmailRecipientMode, AdminUserItem } from "@/features/admin/types";
import { toast } from "@/lib/toast";

function UserEmailRow({
  user,
  selected,
  disabled,
  onToggle,
}: {
  user: AdminUserItem;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const name = user.displayName ?? user.username ?? "Foydalanuvchi";

  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40">
      <input
        type="checkbox"
        className="mt-1 size-4 shrink-0 accent-primary"
        checked={selected}
        disabled={disabled}
        onChange={onToggle}
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-medium leading-snug">{name}</p>
        <p className="text-sm text-muted-foreground">
          @{user.username ?? "-"} · {user.email ?? "-"}
        </p>
      </div>
    </label>
  );
}

export function EmailsPanel() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientMode, setRecipientMode] =
    useState<AdminEmailRecipientMode>("selected");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useListUsersQuery({
    page,
    search: search.trim() || undefined,
  });
  const [sendEmail, { isLoading: sending }] = useSendAdminEmailMutation();

  const users = data?.users ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const selectedCount =
    recipientMode === "all" ? total : selectedIds.length;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page, data?.users]);

  function toggleSelected(userId: string) {
    setSelectedIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    );
  }

  function toggleSelectAllOnPage() {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(users.map((user) => user.id));
  }

  function openConfirm() {
    if (!subject.trim()) {
      toast.error("Mavzu kiriting");
      return;
    }
    if (!message.trim()) {
      toast.error("Xabar matnini kiriting");
      return;
    }
    if (recipientMode === "selected" && selectedIds.length === 0) {
      toast.error("Kamida bitta foydalanuvchini tanlang");
      return;
    }
    setConfirmOpen(true);
  }

  async function handleSend() {
    try {
      const result = await sendEmail({
        subject: subject.trim(),
        message: message.trim(),
        recipientMode,
        userIds: recipientMode === "selected" ? selectedIds : undefined,
      }).unwrap();

      if (result.sent === 0) {
        toast.error("Hech kimga yuborilmadi. SMTP sozlamalarini tekshiring.");
      } else if (result.failed > 0) {
        toast.info(
          `${result.sent} ta yuborildi, ${result.failed} ta xato (${result.total} ta)`,
        );
      } else {
        toast.success(`${result.sent} ta foydalanuvchiga yuborildi`);
      }

      setConfirmOpen(false);
      if (recipientMode === "selected") {
        setSelectedIds([]);
      }
    } catch {
      toast.error("Email yuborishda xatolik");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="size-4" />
              Email xabari
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Mavzu</Label>
              <Input
                id="email-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Masalan: Yangiliklar va e'lonlar"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-message">Xabar matni</Label>
              <Textarea
                id="email-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Foydalanuvchiga yuboriladigan xabar..."
                rows={12}
                maxLength={10000}
                className="min-h-[220px] resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Yangi qatorlar emailda alohida abzats sifatida ko&apos;rinadi.
              </p>
            </div>

            <div className="space-y-3 rounded-lg border p-3">
              <p className="text-sm font-medium">Kimga yuborilsin?</p>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="recipient-mode"
                  className="accent-primary"
                  checked={recipientMode === "selected"}
                  onChange={() => setRecipientMode("selected")}
                />
                Tanlangan foydalanuvchilar
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="recipient-mode"
                  className="accent-primary"
                  checked={recipientMode === "all"}
                  onChange={() => setRecipientMode("all")}
                />
                Barcha ro&apos;yxatdan o&apos;tgan foydalanuvchilar ({total} ta)
              </label>
            </div>

            <Button
              type="button"
              className="w-full"
              disabled={sending}
              onClick={openConfirm}
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Email yuborish ({selectedCount} ta)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Foydalanuvchilar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ism, username yoki email..."
                className="min-w-[220px] flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                Qidirish
              </Button>
            </div>

            {recipientMode === "selected" ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={toggleSelectAllOnPage}
                  disabled={users.length === 0}
                >
                  {selectedIds.length === users.length && users.length > 0
                    ? "Sahifadagi tanlovni bekor qilish"
                    : "Sahifadagilarni tanlash"}
                </Button>
                <Badge variant="secondary">
                  Tanlangan: {selectedIds.length} ta
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Barcha foydalanuvchilar rejimida ro&apos;yxatdan tanlash shart
                emas.
              </p>
            )}

            <div className="space-y-2">
              {users.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Foydalanuvchi topilmadi.
                </p>
              ) : (
                users.map((user) => (
                  <UserEmailRow
                    key={user.id}
                    user={user}
                    selected={selectedIds.includes(user.id)}
                    disabled={recipientMode === "all" || sending}
                    onToggle={() => toggleSelected(user.id)}
                  />
                ))
              )}
            </div>

            {totalPages > 1 ? (
              <div className="flex items-center justify-between gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Oldingi
                </Button>
                <span className="text-sm text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages || isFetching}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                >
                  Keyingi
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email yuborilsinmi?</DialogTitle>
            <DialogDescription>
              {recipientMode === "all"
                ? `Barcha ${total} ta foydalanuvchiga "${subject.trim()}" mavzusi bilan xabar yuboriladi.`
                : `${selectedIds.length} ta tanlangan foydalanuvchiga "${subject.trim()}" mavzusi bilan xabar yuboriladi.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={sending}
              onClick={() => setConfirmOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button
              type="button"
              disabled={sending}
              onClick={() => void handleSend()}
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Yuborish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
