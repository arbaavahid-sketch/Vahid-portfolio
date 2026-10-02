"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X, CheckCircle2, Clock3, CircleAlert } from "lucide-react";
import { makeCopy, type Locale } from "@/lib/i18n";
import { fmtDateShort, fmtNum } from "@/lib/format";

export const money = (value: number, locale: Locale) =>
  locale === "fa"
    ? `${fmtNum(value, locale, value % 1 ? 1 : 0)} میلیون تومان`
    : `${fmtNum(value, locale, value % 1 ? 1 : 0)} M toman`;

export const date = (value: string, locale: Locale) =>
  fmtDateShort(value, locale);

export function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mc-panel">
      <div className="mc-panel-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: ReactNode;
  detail: string;
}) {
  return (
    <div className="mc-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

/**
 * `value` stays the English key so the good/bad styling keeps working off one
 * stable vocabulary; `label` is what the reader sees.
 */
export function Pill({ value, label }: { value: string; label?: string }) {
  const good = ["Done", "Won", "Completed", "Delivered", "Paid"].includes(
    value,
  );
  const bad = ["Blocked", "Overdue", "Late", "High"].includes(value);
  const Icon = good ? CheckCircle2 : bad ? CircleAlert : Clock3;
  return (
    <span
      className={`mc-pill ${good ? "mc-good" : bad ? "mc-bad" : "mc-neutral"}`}
    >
      <Icon size={13} aria-hidden />
      {label ?? value}
    </span>
  );
}

export function Empty({ locale }: { locale: Locale }) {
  const copy = makeCopy(locale);
  return (
    <p className="mc-empty">
      {copy(
        "No records match these filters.",
        "هیچ رکوردی با این فیلترها نمی‌خواند.",
      )}
    </p>
  );
}

export function Table({
  headers,
  children,
  caption,
}: {
  headers: string[];
  children: ReactNode;
  caption: string;
}) {
  return (
    <div
      className="mc-table-wrap"
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className="mc-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Modal({
  title,
  children,
  onClose,
  locale = "en",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  locale?: Locale;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  const copy = makeCopy(locale);
  return (
    <dialog
      ref={ref}
      className="mc-modal"
      aria-label={title}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mc-modal-body">
        <header>
          <h2>{title}</h2>
          <button
            className="mc-icon"
            onClick={onClose}
            aria-label={copy("Close dialog", "بستن پنجره")}
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
