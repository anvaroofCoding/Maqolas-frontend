"use client";

import { CircleHelpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const MAX_ARTICLE_WORDS = 5000;

const GUIDE_SECTIONS = [
  {
    title: "AI qanday ishlaydi?",
    items: [
      "Siz bergan talab asosida to'g'ridan-to'g'ri tayyor maqola yozadi — nashr qilishga tayyor matn",
      "Mavzu yoki so'rov haqida umumiy sharh emas, balki o'zi maqola bo'ladi",
      "Bir nechta paragraf yoki band bersangiz ham, barchasini qamrab oladi",
      `Professional darajada, ${MAX_ARTICLE_WORDS.toLocaleString()} so'zgacha yozishi mumkin`,
    ],
  },
  {
    title: "Senior darajadagi prompt tuzilmasi",
    items: [
      "1-qator: mavzu sarlavhasi — aniq, tor va professional",
      "2-blok: maqsad — maqola nima berishi kerak?",
      "3-blok: auditoriya — kim o'qiydi va qanday bilimga ega?",
      "4-blok: hajm — aniq so'z soni (masalan: 2000 so'z)",
      "5-blok: qamrov — qaysi bo'limlar, misollar, tahlillar bo'lsin?",
      "6-blok: uslub va format — rasmiy, amaliy, jadval, ro'yxat va hokazo",
    ],
  },
  {
    title: "Kuchli prompt uchun qoidalar",
    items: [
      "«Mavzu haqida yoz» emas — «quyidagi mavzuda professional maqola yoz» deb aniqlang",
      "Umumiy gaplardan qoching: «yaxshi maqola», «batafsil» — o'rniga aniq talab bering",
      "Har bir bandni raqamli yoki bullet bilan ajrating — AI tartib bilan yozadi",
      "Hajm ko'rsatmasangiz, AI o'rtacha hajmda yozadi; uzun maqola kerak bo'lsa, so'z sonini yozing",
      "Nimalardan qochish kerakligini ham ayting (reklama, umumiy gaplar, mavzudan chetlanish)",
    ],
  },
  {
    title: "Tavsiya etilgan format",
    items: [
      "Mavzu sarlavhasi birinchi qatorda",
      "Keyin bo'sh qator va «Maqsad:», «Auditoriya:», «Hajm:» bloklari",
      "«Qamrab olsin:» ostida raqamli ro'yxat",
      "Oxirida «Uslub:» va «Formatlash:» qo'shing",
    ],
  },
  {
    title: "Tez-tez qilinadigan xatolar",
    items: [
      "Juda qisqa prompt: «Python haqida yoz» — natija ham umumiy bo'ladi",
      "Hajm ko'rsatmaslik — maqola kutilganidan qisqa chiqishi mumkin",
      "Bir nechta mavzuni aralashtirish — bitta maqola, bitta yo'nalish yaxshiroq",
      "Faqat savol berish — AI ga topshiriq bering, savol emas",
    ],
  },
] as const;

const EXAMPLE_PROMPT = `Sun'iy intellekt zamonaviy ta'limdagi o'rni va amaliy qo'llanilishi

Maqsad: o'qituvchilarga AI vositalarini dars jarayoniga joriy etish bo'yicha amaliy qo'llanma berish.
Auditoriya: IT bilimi o'rta darajadagi maktab va universitet o'qituvchilari.
Hajm: taxminan 2500 so'z.

Qamrab olsin:
1) AI ta'limdagi afzalliklari va cheklovlari (obektiv tahlil)
2) Darsda qo'llashning 3 ta amaliy ssenariysi (har biri qadam-baqadam)
3) Ma'lumot xavfsizligi va akademik halollik masalalari
4) 2025–2026 yillardagi asosiy tendensiyalar

Uslub: professional, aniq, har bo'limda real misollar.
Formatlash: kirish, 4 ta h2 bo'lim, xulosa; ro'yxatlar, 1 ta jadval, maslahat callout va 1 ta rasm.

Qochish kerak: umumiy motivatsion gaplar, reklama ohangi, mavzudan chetlanish.`;

type AiPromptGuideDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AiPromptGuideDialog({
  open,
  onOpenChange,
}: AiPromptGuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,640px)] gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="space-y-2 border-b px-5 py-4 text-left">
          <DialogTitle className="text-base">
            Promptni professional yozish qo&apos;llanmasi
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            AI siz yozgan talab asosida to&apos;g&apos;ridan-to&apos;g&apos;ri
            tayyor maqola yozadi. Quyidagi tuzilma va qoidalarga amal qilsangiz,
            natija senior darajada chiqadi.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(70vh,520px)] space-y-4 overflow-y-auto px-5 py-4">
          {GUIDE_SECTIONS.map((section) => (
            <section key={section.title} className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <Separator />

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Tayyor namuna — shu formatda yozing
            </h3>
            <p className="text-xs text-muted-foreground">
              Promptingizni quyidagi namunaga o&apos;xshatishingiz mumkin.
              Nusxa ko&apos;chirib, o&apos;z mavzuingizga moslashtiring:
            </p>
            <pre className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-xs leading-relaxed text-foreground">
              {EXAMPLE_PROMPT}
            </pre>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type AiPromptGuideButtonProps = {
  onClick: () => void;
};

export function AiPromptGuideButton({ onClick }: AiPromptGuideButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      className="h-6 gap-1 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
      onClick={onClick}
    >
      <CircleHelpIcon className="size-3.5" />
      Qanday yozish kerak?
    </Button>
  );
}
