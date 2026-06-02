export const hasDraftData = (draft?: Record<string, any>) => {
  if (!draft) return false;
  return Object.values(draft).some((v) => {
    if (typeof v === "boolean") return false;
    if (typeof v === "string") return v.trim() !== "";
    return v !== null && v !== undefined;
  });
};