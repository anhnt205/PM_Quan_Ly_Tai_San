const renderDigitalSignatureToImage = async (
  name?: string | null,
  date?: string,
): Promise<string> => {
  // 1. Tạo một canvas ngầm
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 2. Thiết lập kích thước (tỉ lệ 2x để nét)
  const width = 260;
  const height = 90;
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);

  // 3. Vẽ nền trắng và khung viền đỏ
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#d32f2f";
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, width - 10, height - 10);

  // 4. Vẽ Text
  ctx.textBaseline = "top";

  // Dòng 1: Tiêu đề
  ctx.fillStyle = "#d32f2f";
  ctx.font = "bold 20px Arial";
  ctx.fillText("Chữ ký số", 15, 15);

  // Dòng 2: Người ký
  ctx.font = "bold 20px Arial";
  ctx.fillText(`Ký bởi: ${name || ""}`, 15, 40);

  // Dòng 3: Ngày ký
  ctx.font = "bold 20px Arial";
  ctx.fillText(`Ký ngày: ${date || ""}`, 15, 65);

  // 5. Xuất ra Base64
  return canvas.toDataURL("image/png");
};

export default renderDigitalSignatureToImage;