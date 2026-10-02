"use client";
import { useState, type FormEvent } from "react";
import { Download } from "lucide-react";
import { downloadText } from "@/lib/download";
import type { Locale } from "@/lib/i18n";

export function ProjectBrief({ locale }: { locale: Locale }) {
  const fa = locale === "fa";
  const [downloaded, setDownloaded] = useState(false);
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    downloadText(
      "dashboard-project-brief.txt",
      [
        "Dashboard project brief",
        `Company: ${String(form.get("company")).trim()}`,
        `Focus: ${form.get("focus")}`,
        `Current data: ${form.get("source")}`,
        `Decision or workflow to improve: ${String(form.get("need")).trim()}`,
        "",
        "Contact: Vahid Arbaa | arbaavahid@gmail.com | +98 935 224 4130",
      ].join("\n"),
    );
    setDownloaded(true);
  }
  const input =
    "mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink";
  return (
    <form
      onSubmit={save}
      onChange={() => setDownloaded(false)}
      className="rounded-2xl border border-line bg-surface-2 p-6"
    >
      <h3 className="text-lg font-semibold">
        {fa ? "نیاز پروژه را مشخص کنید" : "Outline your project"}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-3">
        {fa
          ? "این فرم یک فایل متنی آماده می‌کند که می‌توانید ایمیل کنید. اطلاعات خودکار ارسال یا ذخیره نمی‌شوند."
          : "Create a short text brief to attach to your email. This form does not send or store your information."}
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-medium sm:col-span-2">
          {fa ? "نام شرکت" : "Company name"}
          <input
            className={input}
            name="company"
            required
            maxLength={120}
            autoComplete="organization"
          />
        </label>
        <label className="text-xs font-medium">
          {fa ? "موضوع داشبورد" : "Dashboard focus"}
          <select name="focus" className={input}>
            <option value="Laboratory">
              {fa ? "آزمایشگاه" : "Laboratory"}
            </option>
            <option value="Sales">{fa ? "فروش" : "Sales"}</option>
            <option value="Inventory & production">
              {fa ? "موجودی و تولید" : "Inventory & production"}
            </option>
            <option value="Other workflow">
              {fa ? "فرایند دیگر" : "Other workflow"}
            </option>
          </select>
        </label>
        <label className="text-xs font-medium">
          {fa ? "منبع فعلی داده" : "Current data source"}
          <select name="source" className={input}>
            <option>Excel / Google Sheets</option>
            <option>{fa ? "ERP / پایگاه داده" : "ERP / Database"}</option>
            <option>{fa ? "چند منبع مختلف" : "Multiple sources"}</option>
            <option>{fa ? "هنوز مشخص نیست" : "To be defined"}</option>
          </select>
        </label>
        <label className="text-xs font-medium sm:col-span-2">
          {fa
            ? "چه تصمیم یا فرایندی باید ساده‌تر شود؟"
            : "Which decision or workflow should be easier?"}
          <textarea
            className={`${input} min-h-28 resize-y`}
            name="need"
            required
            minLength={10}
            maxLength={3000}
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-medium text-white hover:bg-navy-deep"
      >
        <Download size={16} />
        {fa ? "دریافت فایل شرح پروژه" : "Download project brief"}
      </button>
      <p role="status" className="mt-3 text-xs text-ink-3">
        {downloaded
          ? fa
            ? "فایل آماده شد؛ آن را همراه ایمیل خود ارسال کنید."
            : "Your file is ready. Attach it to your email when you are ready to discuss it."
          : fa
            ? "فقط شرح کلی بنویسید؛ دادهٔ محرمانه لازم نیست."
            : "A general description is enough. No confidential data needed."}
      </p>
    </form>
  );
}
