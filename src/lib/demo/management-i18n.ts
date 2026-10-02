/**
 * Persian display layer for the management demo.
 *
 * The seed records in `management.ts` are left exactly as they are: their
 * English strings are the keys that filters, the digest, the persisted
 * localStorage state and the tests all run on. Translating in place would
 * change the stored shape and break a visitor's saved session. So every record
 * keeps its English value and this module maps it to the reader's script at
 * render time.
 */

import type { I18nText, Locale } from "../i18n";

/**
 * Seed text is translated; text the visitor typed themselves is their own, so
 * it comes back unchanged in both languages.
 */
export function displayText(
  current: string,
  seed: I18nText | undefined,
  locale: Locale,
): string {
  if (!seed) return current;
  return current === seed.en ? seed[locale] : current;
}

/** Looks a value up by its English form and falls back to it when unmapped. */
export function lookup(
  map: Record<string, I18nText>,
  value: string,
  locale: Locale,
): string {
  return map[value]?.[locale] ?? value;
}

// ------------------------------------------------------------------- people

export const PERSON_NAMES: Record<string, I18nText> = {
  "Alex Morgan": { en: "Alex Morgan", fa: "الکس مورگان" },
  "Sam Taylor": { en: "Sam Taylor", fa: "سم تیلور" },
  "Robin Ellis": { en: "Robin Ellis", fa: "رابین الیس" },
  "Jamie Chen": { en: "Jamie Chen", fa: "جیمی چن" },
  "Casey Reed": { en: "Casey Reed", fa: "کیسی رید" },
  "Jordan Lee": { en: "Jordan Lee", fa: "جردن لی" },
};

// ------------------------------------------------------------------ parties

export const CLIENT_NAMES: Record<string, I18nText> = {
  "Horizon Labs": { en: "Horizon Labs", fa: "آزمایشگاه هورایزن" },
  "Cedar Research": { en: "Cedar Research", fa: "پژوهش سدر" },
  "Meridian Process": { en: "Meridian Process", fa: "فرایند مریدین" },
  "Orion Materials": { en: "Orion Materials", fa: "مواد اوریون" },
  "Northstar Testing": { en: "Northstar Testing", fa: "آزمون نورث‌استار" },
};

export const VENDOR_NAMES: Record<string, I18nText> = {
  "Aster Instruments": { en: "Aster Instruments", fa: "ابزار دقیق آستر" },
  "Summit Process": { en: "Summit Process", fa: "فرایند سامیت" },
  "Pine Chemicals": { en: "Pine Chemicals", fa: "شیمی پاین" },
};

export const PROJECT_NAMES: Record<string, I18nText> = {
  "Horizon lab expansion": {
    en: "Horizon lab expansion",
    fa: "توسعهٔ آزمایشگاه هورایزن",
  },
  "Pilot reactor upgrade": {
    en: "Pilot reactor upgrade",
    fa: "ارتقای راکتور پایلوت",
  },
  "Consumables framework": {
    en: "Consumables framework",
    fa: "قرارداد چارچوبی مواد مصرفی",
  },
  "Service renewal": { en: "Service renewal", fa: "تمدید قرارداد سرویس" },
};

// -------------------------------------------------------------------- teams

export const TEAM_NAMES: Record<string, I18nText> = {
  a: { en: "Group A", fa: "گروه الف" },
  b: { en: "Group B", fa: "گروه ب" },
  c: { en: "Group C", fa: "گروه ج" },
};

export const TEAM_FOCUS: Record<string, I18nText> = {
  a: { en: "Analytical instruments", fa: "ابزار دقیق تحلیلی" },
  b: { en: "Process equipment", fa: "تجهیزات فرایندی" },
  c: { en: "Laboratory supplies", fa: "ملزومات آزمایشگاهی" },
};

export const ALL_TEAMS: I18nText = { en: "All teams", fa: "همهٔ گروه‌ها" };

export function teamLabel(id: string, locale: Locale): string {
  return TEAM_NAMES[id]?.[locale] ?? ALL_TEAMS[locale];
}

// ----------------------------------------------------------- enumerations

export const ACTION_STATUS: Record<string, I18nText> = {
  "Not started": { en: "Not started", fa: "شروع‌نشده" },
  "In progress": { en: "In progress", fa: "در حال انجام" },
  Blocked: { en: "Blocked", fa: "متوقف" },
  Done: { en: "Done", fa: "انجام‌شده" },
};

export const PRIORITY: Record<string, I18nText> = {
  High: { en: "High", fa: "بالا" },
  Normal: { en: "Normal", fa: "عادی" },
};

export const DEAL_STAGE: Record<string, I18nText> = {
  Proposal: { en: "Proposal", fa: "پیشنهاد" },
  Technical: { en: "Technical", fa: "فنی" },
  Supply: { en: "Supply", fa: "تأمین" },
  Won: { en: "Won", fa: "برنده" },
};

export const JOB_STATUS: Record<string, I18nText> = {
  "Approval queue": { en: "Approval queue", fa: "صف تأیید" },
  "Waiting installation": { en: "Waiting installation", fa: "در انتظار نصب" },
  "Under repair": { en: "Under repair", fa: "در حال تعمیر" },
  Completed: { en: "Completed", fa: "تکمیل‌شده" },
};

export const JOB_TYPE: Record<string, I18nText> = {
  Installation: { en: "Installation", fa: "نصب" },
  "Technical review": { en: "Technical review", fa: "بررسی فنی" },
  Service: { en: "Service", fa: "سرویس" },
};

export const SHIPMENT_STATUS: Record<string, I18nText> = {
  "Not ordered": { en: "Not ordered", fa: "سفارش‌نشده" },
  Ordered: { en: "Ordered", fa: "سفارش‌شده" },
  "In transit": { en: "In transit", fa: "در حمل" },
  Delivered: { en: "Delivered", fa: "تحویل‌شده" },
};

// ------------------------------------------------------ free text, by record

export const TASK_TITLES: Record<string, I18nText> = {
  "AC-101": {
    en: "Confirm installation window for GC system",
    fa: "تأیید بازهٔ زمانی نصب سیستم GC",
  },
  "AC-102": {
    en: "Close the reactor technical clarification",
    fa: "بستن ابهام فنی راکتور",
  },
  "AC-103": {
    en: "Review consumables reorder quantities",
    fa: "بازبینی مقادیر سفارش مجدد مواد مصرفی",
  },
  "AC-104": {
    en: "Approve GC site readiness checklist",
    fa: "تأیید چک‌لیست آمادگی سایت GC",
  },
  "AC-105": {
    en: "Book shipment for process skid",
    fa: "رزرو حمل اسکید فرایندی",
  },
  "AC-106": {
    en: "Collect balance on reagent framework",
    fa: "وصول ماندهٔ قرارداد چارچوبی معرف‌ها",
  },
  "AC-107": {
    en: "Issue revised maintenance proposal",
    fa: "صدور پیشنهاد اصلاح‌شدهٔ نگهداری",
  },
  "AC-108": {
    en: "Complete pump acceptance report",
    fa: "تکمیل گزارش تحویل پمپ",
  },
  "AC-109": {
    en: "Verify tender compliance matrix",
    fa: "بررسی ماتریس انطباق مناقصه",
  },
  "AC-110": {
    en: "Confirm service spare availability",
    fa: "تأیید موجودی قطعات یدکی سرویس",
  },
};

export const TASK_COMMENTS: Record<string, I18nText> = {
  "AC-101": {
    en: "Customer asked for a two-day installation window. Coordinate with Jamie.",
    fa: "مشتری بازهٔ نصب دو روزه خواسته است. با جیمی هماهنگ شود.",
  },
  "AC-102": {
    en: "Waiting for the vendor's revised utility drawing.",
    fa: "در انتظار نقشهٔ اصلاح‌شدهٔ یوتیلیتی از فروشنده.",
  },
  "AC-103": {
    en: "Compare the forecast with the last three sample orders.",
    fa: "پیش‌بینی با سه سفارش نمونهٔ اخیر مقایسه شود.",
  },
  "AC-104": {
    en: "Gas connections confirmed. Electrical check remains open.",
    fa: "اتصالات گاز تأیید شد. بررسی برق هنوز باز است.",
  },
  "AC-105": {
    en: "Freight quote received; confirm packing dimensions.",
    fa: "نرخ حمل دریافت شد؛ ابعاد بسته‌بندی تأیید شود.",
  },
  "AC-106": {
    en: "Customer finance team requested a statement of account.",
    fa: "واحد مالی مشتری صورت‌حساب خواسته است.",
  },
  "AC-107": {
    en: "Include two preventive maintenance visits.",
    fa: "دو بازدید نگهداری پیشگیرانه لحاظ شود.",
  },
  "AC-108": {
    en: "Acceptance report reviewed and filed in the demo record.",
    fa: "گزارش تحویل بازبینی و در سوابق دمو بایگانی شد.",
  },
  "AC-109": {
    en: "Check packaging and shelf-life requirements.",
    fa: "الزامات بسته‌بندی و ماندگاری بررسی شود.",
  },
  "AC-110": {
    en: "Request availability before finalising the service date.",
    fa: "پیش از قطعی‌کردن تاریخ سرویس، موجودی استعلام شود.",
  },
};

export const DEAL_TITLES: Record<string, I18nText> = {
  "DL-201": { en: "GC analysis system", fa: "سیستم آنالیز GC" },
  "DL-202": { en: "Spectrometer package", fa: "بستهٔ طیف‌سنج" },
  "DL-203": { en: "Pilot reactor skid", fa: "اسکید راکتور پایلوت" },
  "DL-204": { en: "Metering pump set", fa: "ست پمپ دوزینگ" },
  "DL-205": {
    en: "Annual reagent framework",
    fa: "قرارداد سالانهٔ معرف‌ها",
  },
  "DL-206": { en: "Maintenance renewal", fa: "تمدید نگهداری" },
  "DL-207": { en: "Reference standards", fa: "استانداردهای مرجع" },
  "DL-208": { en: "Reactor instrumentation", fa: "ابزار دقیق راکتور" },
};

export const JOB_EQUIPMENT: Record<string, I18nText> = {
  "TC-301": { en: "GC analysis system", fa: "سیستم آنالیز GC" },
  "TC-302": { en: "Spectrometer package", fa: "بستهٔ طیف‌سنج" },
  "TC-303": { en: "Metering pump set", fa: "ست پمپ دوزینگ" },
  "TC-304": { en: "Autosampler module", fa: "ماژول اتوسمپلر" },
  "TC-305": { en: "Reactor instrumentation", fa: "ابزار دقیق راکتور" },
};

export const JOB_NOTES: Record<string, I18nText> = {
  "TC-301": {
    en: "Site readiness review in progress.",
    fa: "بررسی آمادگی سایت در جریان است.",
  },
  "TC-302": {
    en: "Review detector configuration against tender specification.",
    fa: "پیکربندی دتکتور با مشخصات مناقصه بررسی شود.",
  },
  "TC-303": { en: "Acceptance test complete.", fa: "آزمون تحویل کامل شد." },
  "TC-304": {
    en: "Replace worn drive belt and perform repeatability test.",
    fa: "تسمهٔ فرسوده تعویض و آزمون تکرارپذیری انجام شود.",
  },
  "TC-305": {
    en: "Confirm pressure transmitter ranges.",
    fa: "بازهٔ ترانسمیترهای فشار تأیید شود.",
  },
};

export const SHIPMENT_ITEMS: Record<string, I18nText> = {
  "PO-401": { en: "GC installation kit", fa: "کیت نصب GC" },
  "PO-402": { en: "Process skid", fa: "اسکید فرایندی" },
  "PO-403": { en: "Reagent packs", fa: "بسته‌های معرف" },
  "PO-404": { en: "Service spare set", fa: "ست قطعات یدکی سرویس" },
  "PO-405": { en: "Pressure transmitters", fa: "ترانسمیترهای فشار" },
};

export const MESSAGE_TITLES: Record<string, I18nText> = {
  "MSG-501": { en: "October priorities", fa: "اولویت‌های مهر و آبان" },
};

export const MESSAGE_BODIES: Record<string, I18nText> = {
  "MSG-501": {
    en: "Please close carried-over actions before starting new commitments. Confirm site readiness for the Horizon installation and follow up on overdue balances. Record blockers against the relevant action so they appear in the daily digest.",
    fa: "لطفاً پیش از شروع تعهدهای جدید، کارهای منتقل‌شده از ماه قبل را ببندید. آمادگی سایت برای نصب هورایزن را تأیید کنید و مانده‌های معوق را پیگیری کنید. موانع را روی همان کار مربوطه ثبت کنید تا در گزارش روزانه دیده شوند.",
  },
};

export const AUDIENCES: Record<string, I18nText> = {
  "All teams": ALL_TEAMS,
};
