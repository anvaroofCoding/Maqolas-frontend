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

const GUIDE_SECTIONS = [
  {
    title: "Mavzu va maqsad",
    items: [
      "Qaysi mavzu haqida yozmoqchisiz? (aniq va tor qiling)",
      "Maqolaning maqsadi nima? (o'rgatish, tushuntirish, maslahat berish, tahlil qilish)",
      "O'quvchi nima bilishi yoki qilishi kerak? (natija)",
    ],
  },
  {
    title: "Auditoriya",
    items: [
      "Kim o'qiydi? (boshlovchi, o'rta, professional)",
      "Qaysi til va uslub mos? (oddiy, rasmiy, do'stona)",
      "O'quvchining oldindan bilimi qanday?",
    ],
  },
  {
    title: "Tuzilma va hajm",
    items: [
      "Taxminiy so'z soni yoki hajm (masalan: 600–1000 so'z)",
      "Bo'limlar kerakmi? (kirish, asosiy qism, xulosa)",
      "Ro'yxatlar, jadval, callout, rasm yoki kod bloki kerakmi?",
    ],
  },
  {
    title: "Kontent talablari",
    items: [
      "Amaliy maslahatlar yoki qadam-baqadam ko'rsatma kerakmi?",
      "Haqiqiy misollar, statistika yoki manbalar bo'lsinmi?",
      "Nimalardan qochish kerak? (umumiy gaplar, reklama, mavzudan chetlanish)",
    ],
  },
  {
    title: "So'rov yuborishdan oldin tekshiring",
    items: [
      "Mavzu aniq va bitta yo'nalishga qaratilganmi?",
      "Auditoriya va maqsad yozilganmi?",
      "Hajm yoki tuzilma ko'rsatilganmi?",
      "Kerakli misollar yoki uslub belgilanganmi?",
    ],
  },
] as const;

const EXAMPLE_PROMPT = `Python dasturlashni boshlovchilar uchun maqola yoz.

Maqsad: o'qishni boshlashni xohlayotganlar uchun amaliy yo'riqnoma.
Auditoriya: dasturlashni bilmaydigan yoshlar va talabalar.
Hajm: taxminan 800 so'z.
Tuzilma: kirish, 5 ta asosiy qadam, xulosa.
Uslub: oddiy va tushunarli, har bo'limda qisqa misol bo'lsin.
Formatlash: kod bloklari, vazifa ro'yxati, jadval, maslahat callout va rasm bo'lsin.`;

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
            Professional maqola so&apos;rovi qanday yoziladi?
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            AI siz yozgan talab asosida maqola tayyorlaydi. Qanchalik aniq va
            to&apos;liq yozsangiz, natija shunchalik professional bo&apos;ladi.
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
              Namuna so&apos;rov
            </h3>
            <p className="text-xs text-muted-foreground">
              Quyidagicha yozishingiz mumkin:
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
