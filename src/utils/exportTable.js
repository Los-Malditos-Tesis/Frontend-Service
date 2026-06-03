import * as XLSX from "xlsx";

const normalizeFileName = (fileName, extension) => {
  const baseName = String(fileName || "export")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "export"}.${extension}`;
};

const triggerDownload = (blob, fileName) => {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = href;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
};

export const exportRowsToExcel = ({ rows = [], fileName = "export", sheetName = "Sheet1" }) => {
  if (!rows.length) {
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, normalizeFileName(fileName, "xlsx"));
};

export const exportRowsToCsv = ({ rows = [], fileName = "export" }) => {
  if (!rows.length) {
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });

  triggerDownload(blob, normalizeFileName(fileName, "csv"));
};