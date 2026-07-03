const renderDigitalSignatureToImage = async (
  name?: string | null,
  date?: string,
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const width = 500;
  const height = 120;
  const scale = 2;

  canvas.width = width * scale;
  canvas.height = height * scale;

  // Fix blur
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.scale(scale, scale);

  ctx.textBaseline = "top";
  ctx.fillStyle = "#2b40b5";

  const fontStyle = "Arial";

  ctx.font = `600 28px ${fontStyle}`;
  ctx.fillText("Chữ ký số / Digitally signed", 10, 10);

  ctx.font = `600 26px ${fontStyle}`;
  ctx.fillText(`Ký bởi / Signed by: ${name || ""}`, 30, 40);

  ctx.font = `600 26px ${fontStyle}`;
  ctx.fillText(`Ngày ký / Sign date: ${date || ""}`, 30, 70);

  return canvas.toDataURL("image/png");
};

export default renderDigitalSignatureToImage;
