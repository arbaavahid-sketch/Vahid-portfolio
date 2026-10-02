/** Quote every field and neutralise spreadsheet formulas in exported text. */
export function makeCsv(rows: (string | number)[][]): string {
  const csv = rows
    .map((row) =>
      row
        .map((value) => {
          let text = String(value);
          if (typeof value === "string" && /^[=+\-@\t\r]/.test(text))
            text = `'${text}`;
          return `"${text.replaceAll('"', '""')}"`;
        })
        .join(","),
    )
    .join("\r\n");
  return `\uFEFF${csv}`;
}
export function downloadCsv(name: string, rows: (string | number)[][]) {
  downloadText(name, makeCsv(rows), "text/csv;charset=utf-8");
}
export function downloadText(
  name: string,
  text: string,
  type = "text/plain;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
