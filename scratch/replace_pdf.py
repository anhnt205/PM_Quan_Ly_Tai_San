import re
import os

file_path = r"e:\Workspace\PM_Quan_Ly_Tai_San\frontend\src\pages\Maintenance\config\index.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define the start and end tokens
start_token = "export const generateNghiemThuPdf = async ("
end_token = "export const generateDanhGiaVatTuPdf = async ("

# Find the indices
start_idx = content.find(start_token)
end_idx = content.find(end_token, start_idx)

if start_idx != -1 and end_idx != -1:
    new_func = """export const generateNghiemThuPdf = async (
  data: any,
  staffs: any[],
  departments: any[],
  positions: any[],
): Promise<{
  pdf: Uint8Array;
  coordinates: Record<string, { xRatio: number; yRatio: number; page?: number }>;
}> => {
  const listSigneInfos: any[] = listSigneInfo(data, staffs, departments, positions);
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFont("times_new_roman", "bold");
  doc.setFontSize(11);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;
  const leftColCenter = pageWidth * 0.3;
  const rightColCenter = pageWidth * 0.75;

  // Header Left
  doc.setFontSize(11);
  doc.setFont("times_new_roman", "normal");
  doc.text("TẬP ĐOÀN CN THAN", leftColCenter, 20, { align: "center" });
  doc.text("KHOÁNG SẢN - VIỆT NAM", leftColCenter, 25, { align: "center" });
  doc.setFont("times_new_roman", "bold");
  doc.text(`${currentBrandConfig.company}`, leftColCenter, 30, { align: "center" });

  // Header Right
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", rightColCenter, 20, { align: "center" });
  doc.text("Độc lập – Tự do – Hạnh phúc", rightColCenter, 25, { align: "center" });

  // Title
  doc.setFont("times_new_roman", "bold");
  doc.setFontSize(14);
  doc.text("BIÊN BẢN", centerX, 45, { align: "center" });
  doc.text("NGHIỆM THU CHẠY THỬ VÀ BÀN GIAO THIẾT BỊ", centerX, 52, { align: "center" });
  doc.text("SAU SỬA CHỮA/BẢO DƯỠNG", centerX, 59, { align: "center" });

  let y = 70;
  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(12);

  const donViInfo = departments.find((d) => d.id === data?.donViQuanLy);
  const tenDonVi = donViInfo?.tenPhongBan || data?.donViQuanLy || "...................................................";

  const dateObj = new Date(data?.ngayTao || new Date());
  const hour = dateObj.getHours().toString().padStart(2, "0");
  const minute = dateObj.getMinutes().toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();

  doc.text(`Hôm nay, ngày ${day} tháng ${month} năm ${year}. Tại ${tenDonVi}.`, 20, y);
  y += 7;

  doc.text("Chúng tôi gồm:", 20, y);
  y += 7;

  // Render signers
  listSigneInfos.forEach((s, index) => {
    let chucVu = s.chucVu || s.title || s.donVi || "................";
    let hoTen = s.hoTen || "........................";
    doc.text(`${index + 1}. Ông: ${hoTen}`, 25, y);
    doc.text(`Chức vụ: ${chucVu}`, 100, y);
    y += 7;
  });

  y += 3;
  const dsTaiSan = data?.danhSachTaiSan || [];
  const danhSachThietBi = dsTaiSan.map((ts: any) => ts.tenTaiSan).join(", ");
  
  const introText = `Cùng thực hiện nghiệm thu kỹ thuật thiết bị: ${danhSachThietBi} sau khi vào sửa chữa và bàn giao cho ${tenDonVi} quản lý vận hành với các nội dung sau.`;
  const introLines = doc.splitTextToSize(introText, pageWidth - 40);
  doc.text(introLines, 20, y);
  y += introLines.length * 7;

  doc.setFont("times_new_roman", "bold");
  doc.text("1. Nội dung sửa chữa", 20, y);
  y += 7;
  doc.setFont("times_new_roman", "normal");
  const ndLines = doc.splitTextToSize(data?.noiDungSuaChua || "...................................................", pageWidth - 45);
  doc.text(ndLines, 25, y);
  y += ndLines.length * 7;

  doc.setFont("times_new_roman", "bold");
  doc.text("2. Kết quả kiểm tra, chạy thử", 20, y);
  y += 7;
  doc.setFont("times_new_roman", "normal");
  const kqLines = doc.splitTextToSize(data?.ketQua || "...................................................", pageWidth - 45);
  doc.text(kqLines, 25, y);
  y += kqLines.length * 7;

  doc.setFont("times_new_roman", "bold");
  doc.text("3. Các nội dung được sửa chữa được nghiệm thu:", 20, y);
  y += 7;
  doc.setFont("times_new_roman", "normal");
  doc.text("3.1. Khối lượng vật tư được nghiệm thu:", 20, y);
  y += 5;

  const dsVatTu = data?.danhSachVatTu || [];
  const vatTuTableData = dsVatTu.map((row: any, index: number) => [
    index + 1,
    row.tenVatTu || "................",
    row.kyHieu || "................",
    row.donViTinh || "Cái",
    row.soLuongThayThe ?? 0,
    row.soLuongThuHoi ?? 0,
    row.ghiChu || ""
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: 20, right: 20 },
    head: [
      [
        { content: "STT", rowSpan: 2 },
        { content: "Vật tư thay thế", rowSpan: 2 },
        { content: "Chủng loại, quy cách", rowSpan: 2 },
        { content: "ĐVT", rowSpan: 2 },
        { content: "Số lượng", colSpan: 2 },
        { content: "Ghi chú", rowSpan: 2 }
      ],
      ["Thay thế", "Thu hồi"]
    ],
    body: vatTuTableData,
    theme: "grid",
    styles: { font: "times_new_roman", fontSize: 10, textColor: 0, lineColor: 0, lineWidth: 0.1 },
    headStyles: { fillColor: false, fontStyle: "bold", halign: "center" },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      3: { cellWidth: 15, halign: "center" },
      4: { cellWidth: 15, halign: "center" },
      5: { cellWidth: 15, halign: "center" },
    }
  });

  y = (doc as any).lastAutoTable.finalY + 7;
  doc.text("3.2. Khối lượng công việc được nghiệm thu:", 20, y);
  y += 5;

  const cvTableData = dsTaiSan.map((row: any, index: number) => [
    index + 1,
    row.maCongViec || "",
    row.noiDung || "",
    row.soLuong ?? 1,
    row.ghiChu || ""
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: 20, right: 20 },
    head: [["STT", "Mã công việc", "Nội dung công việc", "Số lượng", "Ghi chú"]],
    body: cvTableData,
    theme: "grid",
    styles: { font: "times_new_roman", fontSize: 10, textColor: 0, lineColor: 0, lineWidth: 0.1 },
    headStyles: { fillColor: false, fontStyle: "bold", halign: "center" },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 35, halign: "center" },
      3: { cellWidth: 20, halign: "center" },
    }
  });

  y = (doc as any).lastAutoTable.finalY + 10;
  
  const endText = `Biên bản được lập xong lúc ${hour} giờ ${minute} phút cùng ngày, đã được các thành viên nhất trí thông qua.`;
  const endLines = doc.splitTextToSize(endText, pageWidth - 40);
  doc.text(endLines, 20, y);
  y += endLines.length * 7;

  if (y > pageHeight - 60) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("times_new_roman", "bold");
  doc.text("CÁC THÀNH PHẦN THAM GIA", 20, y);
  y += 10;

  doc.setFont("times_new_roman", "normal");
  
  const coordinates: Record<string, { xRatio: number; yRatio: number; page?: number }> = {};
  
  listSigneInfos.forEach((s, index) => {
    let chucVu = s.chucVu || s.title || s.donVi || "................";
    let hoTen = s.hoTen || "........................";
    
    // Draw signature line logic (simplified for PDF: we just put titles and names)
    // Similar to "Các thành phần tham gia" list in preview
    doc.text(`${chucVu}:`, 25, y);
    // Draw dots
    doc.text("................................................................................", 70, y);
    doc.text(hoTen, 150, y);
    
    // Calculate coordinates for digital signature (we place it roughly around the dotted line)
    coordinates[s.idNhanVien] = {
      xRatio: 120 / pageWidth, // around x=120
      yRatio: Math.max(0, Math.min((y - 10) / pageHeight, 1)),
      page: (doc as any).internal.getNumberOfPages()
    };
    
    y += 15;
    if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
    }
  });

  return {
    pdf: new Uint8Array(doc.output("arraybuffer")),
    coordinates,
  };
};

"""
    
    new_content = content[:start_idx] + new_func + content[end_idx:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully replaced generateNghiemThuPdf")
else:
    print("Could not find start or end token")
