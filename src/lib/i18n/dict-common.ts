import type { Dict } from "./index";

/** Shell, chrome and anything shared by more than one demo. */
export const common = {
  // ---------------------------------------------------------------- site
  siteOwner: { fa: "وحید اربع", en: "Vahid Arbaa" },
  siteTitle: {
    fa: "داشبورد مدیریتی برای آزمایشگاه و صنایع شیمیایی",
    en: "Management dashboards for laboratories and chemical industry",
  },
  siteDescription: {
    fa: "داشبورد تحت وب با لاگین، ساخته‌شده روی همان داده‌ای که شرکت از قبل دارد. دموهای زیر روی دادهٔ ساختگی کار می‌کنند، پس می‌شود آن‌ها را به هر کسی نشان داد.",
    en: "Web dashboards with a login, built on the data a company already has. The demos below run on invented data, so they can be shown to anyone.",
  },
  siteKicker: { fa: "نمونه‌کارها", en: "Demonstration builds" },
  openDemo: { fa: "باز کردن دمو", en: "Open the demo" },
  inProgress: { fa: "در دست ساخت", en: "In progress" },
  allDemos: { fa: "همهٔ دموها", en: "All demos" },

  // ---------------------------------------------------------------- demos
  labTitle: { fa: "داشبورد آزمایشگاه", en: "Laboratory Dashboard" },
  labBlurb: {
    fa: "رهگیری نمونه، وضعیت و کالیبراسیون دستگاه‌ها، زمان پاسخ در برابر تعهد قرارداد، و کنترل کیفیت با قواعد وستگارد.",
    en: "Sample tracking, instrument status and calibration, turnaround against contractual targets, and Westgard-ruled quality control.",
  },
  salesTitle: { fa: "داشبورد فروش", en: "Sales Dashboard" },
  salesBlurb: {
    fa: "فروش در برابر هدف، قیف فروش و پیش‌فاکتورها، تمرکز مشتری، حاشیهٔ سود و مطالبات معوق برای یک شرکت بازرگانی.",
    en: "Revenue against target, pipeline and quotations, customer concentration, margin and overdue receivables for a trading company.",
  },
  inventoryTitle: {
    fa: "داشبورد موجودی و تولید",
    en: "Inventory & Production Dashboard",
  },
  inventoryBlurb: {
    fa: "برنامهٔ بچ‌ها، بازده جرمی، موجودی قابل مصرف، پوشش مواد و توقف خط برای یک شرکت تولیدی.",
    en: "Batch schedules, mass yield, available inventory, material cover and line downtime for a manufacturer.",
  },

  // ---------------------------------------------------------------- chrome
  skipToContent: { fa: "رفتن به محتوا", en: "Skip to content" },
  themeToLight: { fa: "تم روشن", en: "Switch to light theme" },
  themeToDark: { fa: "تم تاریک", en: "Switch to dark theme" },
  tableView: { fa: "نمایش جدول", en: "Table view" },
  demoBannerLead: { fa: "دمو.", en: "Demonstration." },
  demoBannerBody: {
    fa: "هر شرکت، فرد، رکورد و عددی که در این صفحه‌ها می‌بینید ساختگی است. هیچ‌چیز به سیستم زنده، گوگل‌شیت یا API وصل نیست — اعداد در خود کد ثابت‌اند تا دمو هر بار یکسان خوانده شود.",
    en: "Every company, person, record and figure on these pages is invented. Nothing is connected to a live system, a spreadsheet or an API — the figures are fixed in the source so the demo reads the same every time.",
  },
  demoFooter: {
    fa: "نمونهٔ نمایشی ساختهٔ وحید اربع. همهٔ داده‌ها ساختگی‌اند.",
    en: "A demonstration build by Vahid Arbaa. All data is fictional.",
  },
  language: { fa: "زبان", en: "Language" },

  // ------------------------------------------------------------- generic
  target: { fa: "هدف", en: "Target" },
  overTarget: { fa: "فراتر از هدف", en: "Over target" },
  median: { fa: "میانه", en: "Median" },
  share: { fa: "سهم", en: "Share" },
  total: { fa: "جمع", en: "Total" },
  all: { fa: "همه", en: "All" },
  search: { fa: "جست‌وجو", en: "Search" },
  status: { fa: "وضعیت", en: "Status" },
  department: { fa: "دپارتمان", en: "Department" },
  noMatch: {
    fa: "هیچ رکوردی با این فیلتر نیست.",
    en: "No record matches this filter.",
  },
  needsAttention: { fa: "نیاز به رسیدگی", en: "Needs attention" },
  needsAttentionSub: {
    fa: "مرتب‌شده بر اساس هزینه‌ای که رها کردنش دارد",
    en: "Ranked by what it costs if it is left alone",
  },
  sevCritical: { fa: "بحرانی", en: "Critical" },
  sevSerious: { fa: "نیاز به اقدام", en: "Needs action" },
  sevWarning: { fa: "تحت نظر", en: "Watch" },
  recordsOf: { fa: "از", en: "of" },
  records: { fa: "رکورد", en: "records" },
} satisfies Dict;
