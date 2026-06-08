import type { LegalSection } from "@/components/legal/legal-page-shell";

const UPDATED_AT = "8 iyun 2026";

export const aboutPageContent = {
  title: "Dastur haqida",
  description:
    "Maqolas — o‘zbek tilida sifatli maqolalar yozish, o‘qish va muhokama qilish uchun yaratilgan zamonaviy platforma.",
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: "Maqolas nima?",
      paragraphs: [
        "Maqolas foydalanuvchilarga bilim va tajribalarini maqola shaklida ulashish, yangi mavzularni kashf etish hamda muloqot qilish imkonini beradi.",
        "Platforma mualliflar, o‘quvchilar va moderatorlar uchun qulay muhit yaratishga qaratilgan.",
      ],
    },
    {
      title: "Asosiy imkoniyatlar",
      bullets: [
        "Maqola yozish va tahrirlash uchun qulay editor",
        "Mavzular bo‘yicha maqolalarni o‘qish va saqlash",
        "Izohlar, yoqtirishlar va obunalar orqali muloqot",
        "Mavzu takliflari va jamoaviy qiziqish statistikasi",
        "Admin moderatsiyasi orqali sifat nazorati",
      ],
      paragraphs: [],
    },
    {
      title: "Kimlar uchun?",
      paragraphs: [
        "Dastur dasturchilar, yozuvchilar, talabalar, mutaxassislar va o‘z fikrini bo‘lishishni xohlaydigan har bir kishi uchun mos.",
      ],
    },
  ] satisfies LegalSection[],
};

export const termsPageContent = {
  title: "Foydalanish shartlari",
  description:
    "Maqolas xizmatidan foydalanish qoidalari. Platformadan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz.",
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: "Umumiy qoidalar",
      paragraphs: [
        "Foydalanuvchi ro‘yxatdan o‘tgach yoki saytdan foydalanishni davom ettirgach, ushbu shartlarga rozilik bildirgan hisoblanadi.",
        "Platformadan faqat qonuniy va halol maqsadlarda foydalanish talab etiladi.",
      ],
    },
    {
      title: "Kontent talablari",
      bullets: [
        "Maqola va izohlarda haqorat, tuhmat, zo‘ravonlik yoki noqonuniy kontent taqiqlanadi",
        "Boshqa shaxslarning mualliflik huquqini buzish mumkin emas",
        "Spam, reklama yoki chalg‘ituvchi ma’lumot joylash taqiqlanadi",
        "Izohlar moderatsiyadan o‘tgach nashr etiladi",
      ],
      paragraphs: [],
    },
    {
      title: "Hisob va xavfsizlik",
      paragraphs: [
        "Hisobingiz xavfsizligi uchun kirish ma’lumotlarini uchinchi shaxslarga bermang. Shubhali faollik aniqlansa, biz hisobni vaqtincha cheklash huquqini saqlab qolamiz.",
      ],
    },
    {
      title: "Moderatsiya",
      paragraphs: [
        "Adminlar maqola, izoh va mavzu takliflarini ko‘rib chiqish, tasdiqlash yoki rad etish huquqiga ega. Qoidabuzarlik takrorlansa, hisob bloklanishi mumkin.",
      ],
    },
    {
      title: "O‘zgarishlar",
      paragraphs: [
        "Biz ushbu shartlarni vaqt o‘tishi bilan yangilashimiz mumkin. Muhim o‘zgarishlar platformada e’lon qilinadi.",
      ],
    },
  ] satisfies LegalSection[],
};

export const privacyPageContent = {
  title: "Maxfiylik siyosati",
  description:
    "Maqolas foydalanuvchi ma’lumotlarini qanday yig‘ishi, saqlashi va himoya qilishi haqida.",
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: "Qanday ma’lumotlar yig‘iladi",
      bullets: [
        "Google orqali kirishda: ism, email, profil rasmi",
        "Platforma faolligi: maqolalar, izohlar, yoqtirishlar, obunalar",
        "Texnik ma’lumotlar: qurilma turi, sessiya va xavfsizlik loglari",
      ],
      paragraphs: [],
    },
    {
      title: "Ma’lumotlardan foydalanish",
      paragraphs: [
        "Yig‘ilgan ma’lumotlar xizmatni ko‘rsatish, shaxsiylashtirish, xavfsizlikni ta’minlash va platformani yaxshilash uchun ishlatiladi.",
        "Shaxsiy ma’lumotlar uchinchi tomonlarga sotilmaydi.",
      ],
    },
    {
      title: "Uchinchi tomon xizmatlari",
      paragraphs: [
        "Kirish uchun Google OAuth ishlatiladi. Google maxfiylik siyosati ham qo‘llanadi. Hosting va analitika xizmatlari faqat texnik maqsadlarda qo‘llanishi mumkin.",
      ],
    },
    {
      title: "Ma’lumotlarni saqlash",
      paragraphs: [
        "Ma’lumotlar xavfsiz serverlarda saqlanadi. Hisob o‘chirilganda yoki so‘rov bo‘yicha ma’lumotlar qonun talablariga muvofiq qayta ishlanadi.",
      ],
    },
    {
      title: "Foydalanuvchi huquqlari",
      bullets: [
        "Profil ma’lumotlarini ko‘rish va yangilash",
        "Noto‘g‘ri ma’lumotlarni tuzatish so‘rovi yuborish",
        "Hisobni o‘chirish so‘rovini yuborish",
      ],
      paragraphs: [
        "Maxfiylik bo‘yicha savollar uchun platforma orqali murojaat qilishingiz mumkin.",
      ],
    },
  ] satisfies LegalSection[],
};
