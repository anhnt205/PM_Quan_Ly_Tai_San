import { sha256 } from "js-sha256";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const findById = (array: any[], id: any) => {
  return array.find((item) => item.id?.toString() === id?.toString());
};
export const generateCode = (prefix: string) => {
  const now = new Date();

  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const random = Math.random().toString(36).substring(2, 4).toUpperCase();

  return `${prefix}${yyyy}${MM}${dd}-${HH}${mm}${ss}-${random}`;
};

export const s = (v: any, fallback: string = ""): string => {
  const str = v?.toString().trim();
  return str || fallback;
};

export const b = (v: any, fallback: boolean = false): boolean => {
  if (v === null || v === undefined) return fallback;

  if (typeof v === "boolean") return v;

  if (typeof v === "number") return v !== 0;

  const str = v.toString().trim().toLowerCase();
  if (str.length === 0) return fallback;

  return str === "true" || str === "1" || str === "yes" || str === "y";
};

export const formatDateTime = (v: any) => {
  const dateStr = v ? v.toString() : new Date().toISOString();
  return dateStr.replace("T", " ").replace("Z", "").split(".")[0];
};
export const generateSha256 = (value: string) => {
  return sha256(value);
};
export function formatted(date?: string | null): string {
  if (!date || date.trim() === "") {
    console.debug("formatted", "Empty date string");
    return "";
  }

  // Định dạng mới
  let d = dayjs(date, "YYYY-MM-DD HH:mm:ss", true);
  if (d.isValid()) {
    return d.format("[ngày] DD [tháng] MM [năm] YYYY");
  }

  // Fallback định dạng cũ
  d = dayjs(date, "YYYY-MM-DDTHH:mm:ss.SSSZ", true);
  if (d.isValid()) {
    return d.format("[ngày] DD [tháng] MM [năm] YYYY");
  }

  console.debug("formatted", `Failed to parse date: ${date}`);
  return "";
}
