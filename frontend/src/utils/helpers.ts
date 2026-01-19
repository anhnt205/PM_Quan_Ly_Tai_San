export const findById = (array: any[], id: any) => {
  return array.find((item) => item.id === id);
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
