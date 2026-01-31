import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  NavigateBefore,
  NavigateNext,
  PictureAsPdf,
} from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "../../../assets/fonts/times_new_roman-normal";
import "../../../assets/fonts/times_new_roman-bold";
import { AssetHandoverData } from "../../AssetHandover/types";
import { SignaturesData } from "../types";
import { findById, formatted } from "../../../utils/helpers";
import { useStaffMutation } from "../../Staff/Mutation";
import { useDepartmentMutation } from "../../Department/Mutation";
import { usePositionMutation } from "../../Position/Mutation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useUnitMutation } from "../../Unit/Mutation";
import dayjs from "dayjs";
import { renderDigitalSignatureToImage } from "../../AssetHandover/components/SignDocumentForm";

// Config Worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface BienBanDialogProps {
  open: boolean;
  onClose: () => void;
  assetHandover?: AssetHandoverData | null;
  handleSignatureList?: (idTaiLieu: string) => Promise<any>;
}

export default function BienBanDialog({
  open,
  onClose,
  assetHandover,
  handleSignatureList,
}: BienBanDialogProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref trỏ thẳng vào thẻ canvas
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<SignaturesData[]>([]);
  const [digitalSignatureMap, setDigitalSignatureMap] = useState<
    Record<string, string>
  >({});

  // 1. Cập nhật useEffect lấy danh sách chữ ký từ API
  const fetchSignatures = async () => {
    if (assetHandover && handleSignatureList) {
      try {
        const data = await handleSignatureList(assetHandover.id);
        const initialSigs = data.map((item: any) => ({
          ...item,
          isLocked: true,
        }));
        setSignatures(initialSigs);
      } catch (err) {
        console.error("Lỗi lấy danh sách chữ ký:", err);
      }
    }
  };
  useEffect(() => {
    fetchSignatures();
  }, [assetHandover, handleSignatureList]);

  const staffs = useStaffMutation().allStaff;
  const departments = useDepartmentMutation().allDepartments;
  const positions = usePositionMutation().allPositions;
  const allUnits = useUnitMutation().allUnits;

  const getChucVu = async (idUser: string) => {
    const nhanVien = await findById(staffs, idUser);
    const chucVu = await findById(positions, nhanVien?.chucVuId ?? "");
    return chucVu?.tenChucVu ?? "";
  };
  const getDonVi = async (idUser: string) => {
    const nhanVien = await findById(staffs, idUser);
    const donVi = await findById(departments, nhanVien?.phongBanId ?? "");
    return donVi?.tenPhongBan ?? "";
  };
  const isCheckKho = async (idUser: string) => {
    const nhanVien = await findById(staffs, idUser);
    const phongBan = await findById(departments, nhanVien?.phongBanId ?? "");
    return phongBan?.isKho == true;
  };
  const listSigneInfo = async (item?: AssetHandoverData | null) => {
    if (!item) return [];

    const result: any[] = [];

    // ===== ĐẠI DIỆN BÊN GIAO =====
    const isKhoGiao = await isCheckKho(item.idDaiDienBenGiao ?? "");
    const donViGiao = isKhoGiao
      ? ((await findById(departments, item.idDonViGiao ?? ""))?.tenPhongBan ??
        "")
      : await getDonVi(item.idDaiDienBenGiao ?? "");

    result.push({
      idNhanVien: item.idDaiDienBenGiao ?? "",
      title: "Đại diện đơn vị bên giao",
      hoTen: item.tenDaiDienBenGiao ?? "",
      chucVu: await getChucVu(item.idDaiDienBenGiao ?? ""),
      donVi: donViGiao,
    });

    // ===== ĐẠI DIỆN BÊN NHẬN =====
    const isKhoNhan = await isCheckKho(item.idDaiDienBenNhan ?? "");
    const donViNhan = isKhoNhan
      ? ((await findById(departments, item.idDonViNhan ?? ""))?.tenPhongBan ??
        "")
      : await getDonVi(item.idDaiDienBenNhan ?? "");

    result.push({
      idNhanVien: item.idDaiDienBenNhan ?? "",
      title: "Đại diện đơn vị bên nhận",
      hoTen: item.tenDaiDienBenNhan ?? "",
      chucVu: await getChucVu(item.idDaiDienBenNhan ?? ""),
      donVi: donViNhan,
    });

    // ===== NGƯỜI KÝ BỔ SUNG =====
    if (item.nguoiKyList?.length) {
      for (let i = 0; i < item.nguoiKyList.length; i++) {
        const sign = item.nguoiKyList[i];
        result.push({
          idNhanVien: sign.idNguoiKy ?? "",
          title: `Đại diện ký ${i + 1}`,
          hoTen: sign.tenNguoiKy ?? "",
          chucVu: await getChucVu(sign.idNguoiKy ?? ""),
          donVi: await getDonVi(sign.idNguoiKy ?? ""),
        });
      }
    }

    // ===== GIÁM ĐỐC =====
    result.push({
      idNhanVien: item.idGiamDoc ?? "",
      title: "Giám đốc ký duyệt",
      hoTen: item.tenGiamDoc ?? "",
      chucVu: await getChucVu(item.idGiamDoc ?? ""),
      donVi: await getDonVi(item.idGiamDoc ?? ""),
    });

    return result;
  };

  const generateBienBanPdf = async (): Promise<Uint8Array> => {
    const listSigneInfos: any[] = await listSigneInfo(assetHandover);
    const doc = new jsPDF("p", "mm", "a4");

    // Đảm bảo font times_new_roman đã được add trước đó
    doc.setFont("times_new_roman", "normal");

    // ===== HEADER =====
    doc.setFontSize(11);
    doc.text("TẬP ĐOÀN CÔNG NGHIỆP", 50, 20, { align: "center" });
    doc.text("THAN - KHOÁNG SẢN VIỆT NAM", 50, 26, { align: "center" });

    doc.setFont("times_new_roman", "bold");
    doc.text("CÔNG TY THAN UÔNG BÍ - TKV", 50, 32, { align: "center" });
    doc.line(40, 34, 80, 34); // Đường kẻ dưới tên công ty

    doc.setFont("times_new_roman", "normal");
    doc.setFontSize(10);
    doc.text("Mẫu số 17/BBGN-TS", 190, 20, { align: "right" });

    doc.setFont("times_new_roman", "bold");
    doc.setFontSize(13);
    doc.text("BIÊN BẢN", 140, 30, { align: "center" });
    doc.text("GIAO NHẬN TÀI SẢN", 140, 36, { align: "center" });

    // ===== CĂN CỨ =====
    doc.setFont("times_new_roman", "normal");
    doc.setFontSize(11);

    let y = 50;
    const canCuText = `Căn cứ QĐ số: ${assetHandover?.soQuyetDinh ?? "........."} ${formatted(assetHandover?.ngayQuyetDinh ?? "")} của Giám đốc Công ty V/v điều động tài sản từ PX ${assetHandover?.tenDonViGiao ?? "...................."} đến PX ${assetHandover?.tenDonViNhan ?? "...................."}.`;

    const splitCanCu = doc.splitTextToSize(canCuText, 170);
    doc.text(splitCanCu, 25, y);

    y += splitCanCu.length * 7;
    doc.text(
      `Hôm nay, ${formatted(assetHandover?.ngayBanGiao ?? "")} tại ${assetHandover?.diaDiemQuyetDinh ?? "..........."}.`,
      25,
      y,
    );

    // ===== DANH SÁCH NGƯỜI KÝ =====
    y += 10;
    doc.setFont("times_new_roman", "bold");
    doc.text("Chúng tôi gồm:", 20, y);
    doc.setFont("times_new_roman", "bold");

    y += 7;
    // Giả sử signatures là mảng đối tượng có { hoTen, chucVu, phongBan }
    listSigneInfos?.forEach((s, index) => {
      const nameText = doc.splitTextToSize(
        `${index + 1}. Ông (bà): ${s.hoTen}`,
        55,
      );

      const chucVuText = doc.splitTextToSize(`Chức vụ: ${s.chucVu}`, 45);

      const phongText = doc.splitTextToSize(`Phòng: ${s.donVi}`, 50);

      doc.text(nameText, 25, y);
      doc.text(chucVuText, 85, y);
      doc.text(phongText, 135, y);

      // 👉 Tăng y theo dòng cao nhất
      const maxLines = Math.max(
        nameText.length,
        chucVuText.length,
        phongText.length,
      );
      y += maxLines * 7;
    });

    // ===== MÔ TẢ GIAO NHẬN =====
    y += 5;
    const moTaGiaoNhan = `Tiến hành giao nhận tài sản từ phân xưởng ${assetHandover?.tenDonViGiao ?? "........"} giao cho phân xưởng ${assetHandover?.tenDonViNhan ?? "........"} cụ thể như sau:`;
    doc.text(doc.splitTextToSize(moTaGiaoNhan, 175), 20, y);

    // ===== TABLE =====
    const tableData = (assetHandover?.chiTietBanGiaoTaiSan ?? []).map(
      (item: any, index: number) => [
        index + 1,
        item.tenTaiSan ?? "",
        item.kyHieu ?? "",
        item.moTa ?? "",
        findById(allUnits, item.donViTinh)?.tenDonVi ?? "",
        item.soLuong || 1,
        item.ghiChu ?? "",
      ],
    );

    autoTable(doc, {
      startY: y + 5,
      margin: { left: 20, right: 20 },
      head: [
        [
          "STT",
          "TÊN TÀI SẢN",
          "Mã hiệu, quy cách",
          "Nước sản xuất",
          "Đơn vị tính",
          "Số lượng",
          "Ghi chú",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: false,
        textColor: 0,
        lineWidth: 0.1,
        lineColor: 0,
        font: "times_new_roman",
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        font: "times_new_roman",
        fontSize: 10,
        textColor: 0,
        lineWidth: 0.1,
        lineColor: 0,
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        4: { cellWidth: 20, halign: "center" },
        5: { cellWidth: 15, halign: "center" },
      },
    });

    // ===== KẾT LUẬN & CHỮ KÝ =====
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(
      "Sau khi hai bên kiểm tra kỹ lưỡng tình trạng và thống nhất ký tên vào biên bản.",
      20,
      finalY,
    );

    finalY += 15;

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 40; // Lề trái và lề phải (giống lề của bảng phía trên)
    const printableWidth = pageWidth - 2 * marginX; // Chiều rộng thực tế dùng để chia cột

    const colWidth = 45; // Độ rộng vùng text mỗi chữ ký
    const maxPerRow = 5; // Tối đa 4 chữ ký / hàng
    const rowGap = 70;
    const baseY = finalY;

    listSigneInfos?.forEach((s, index) => {
      const rowIndex = Math.floor(index / maxPerRow);
      const colIndex = index % maxPerRow;

      // Xác định số lượng chữ ký thực tế của hàng này
      const itemsInRow = Math.min(
        maxPerRow,
        listSigneInfos.length - rowIndex * maxPerRow,
      );

      let x;
      if (itemsInRow === 1) {
        // 1 người: Căn giữa trang
        x = pageWidth / 2;
      } else {
        // Từ 2 người trở lên: Chia đều khoảng cách để 2 người ngoài cùng sát lề marginX
        // Công thức: Lề trái + (vị trí cột * (chiều rộng khả dụng / số khoảng trống giữa các cột))
        const gapSize = printableWidth / (itemsInRow - 1);
        x = marginX + colIndex * gapSize;
      }

      const y = baseY + rowIndex * rowGap;

      // 1️⃣ Đơn vị (Phòng ban/Phân xưởng)
      // Dùng fontSize nhỏ hơn một chút nếu cần giống ảnh mẫu
      doc.setFontSize(10);
      const donViLines = doc.splitTextToSize(s?.donVi || "", colWidth);
      doc.text(donViLines, x, y, { align: "center" });

      // 2️⃣ Họ tên người ký
      // Cố định khoảng cách nameY để tạo khoảng trống cho chữ ký tay
      const nameY = y + 35;
      const hoTenLines = doc.splitTextToSize(s?.hoTen || "", colWidth);
      doc.text(hoTenLines, x, nameY, { align: "center" });
    });

    return new Uint8Array(doc.output("arraybuffer"));
  };
  useEffect(() => {
    if (!open || !assetHandover) return;

    const preparePdf = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
          setPdfUrl(null);
        }

        const bytes = await generateBienBanPdf();
        const blob = new Blob([bytes.buffer as ArrayBuffer], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);

        setPdfUrl(url);
      } catch (err) {
        console.error(err);
        setErrorMessage("Không thể khởi tạo tài liệu");
      } finally {
        setLoading(false);
      }
    };

    preparePdf();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [open, assetHandover]);

  // Render PDF
  // --- Render PDF ---
  useEffect(() => {
    const loadPdf = async () => {
      try {
        if (!pdfUrl) return;

        setLoading(true);

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1); // reset page khi load pdf mới
        setErrorMessage("");
      } catch (err: any) {
        console.error("Lỗi load PDF:", err);
        setErrorMessage(`Lỗi đọc PDF: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  useEffect(() => {
    const renderDigitalSignatures = async () => {
      const newMap: Record<string, string> = {};

      for (const sig of signatures) {
        if (sig.loaiKy === 3 && !digitalSignatureMap[sig.id]) {
          const signer = findById(staffs, sig.idNguoiKy);

          const base64 = await renderDigitalSignatureToImage(
            signer?.hoTen,
            dayjs(sig.ngayKy).format("DD/MM/YYYY"),
          );

          newMap[sig.id] = base64;
        }
      }

      if (Object.keys(newMap).length > 0) {
        setDigitalSignatureMap((prev) => ({ ...prev, ...newMap }));
      }
    };

    renderDigitalSignatures();
  }, [signatures, staffs]);

  const [displaySize, setDisplaySize] = useState({
    width: 0,
    height: 0,
  });
  // Render current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d")!;

        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        // Cập nhật kích thước hiển thị thực tế để layer chữ ký khớp theo
        const rect = canvas.getBoundingClientRect();
        setDisplaySize({ width: rect.width, height: rect.height });
      } catch (err) {
        console.error("Lỗi render PDF:", err);
      }
    };

    if (pdfDoc) renderPage();
  }, [currentPage, pdfDoc]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          maxWidth: "950px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          p: 3,
          backgroundColor: "#fed7aa",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "8px",
              bgcolor: "#f87b38ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(234, 88, 12, 0.2)",
            }}
          >
            <PictureAsPdf />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#1f2937",
                letterSpacing: "-0.5px",
              }}
            >
              Danh sách biên bản bàn giao
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              size="small"
              sx={{
                color: "#ff8400ff",
                "&:hover": { bgcolor: "#f3f4f6" },
                "&:disabled": { color: "#ffc13dff" },
              }}
            >
              <NavigateBefore />
            </IconButton>
            <Box
              sx={{
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                minWidth: "80px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#1e40af",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {currentPage}/{totalPages}
              </Typography>
            </Box>
            <IconButton
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              size="small"
              sx={{
                color: "#ff8400ff",
                "&:hover": { bgcolor: "#f3f4f6" },
                "&:disabled": { color: "#ffc13dff" },
              }}
            >
              <NavigateNext />
            </IconButton>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "#6b7280",
              "&:hover": {
                bgcolor: "#f3f4f6",
                color: "#1f2937",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          p: 2,
          overflow: "auto",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : totalPages > 0 ? (
          <Box
            ref={wrapperRef}
            sx={{
              position: "relative", // Làm gốc tọa độ cho chữ ký
              display: "inline-block",
              bgcolor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              lineHeight: 0, // Khử khoảng trắng thừa dưới canvas
            }}
          >
            {/* LAYER 1: PDF CANVAS (Do React quản lý, không bị innerHTML xóa) */}
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />

            {/* LAYER 2: SIGNATURES (Nằm đè lên trên) */}
            {displaySize.width > 0 &&
              signatures.map((sig) => {
                const imgSrc =
                  sig.loaiKy === 3
                    ? digitalSignatureMap[sig.id]
                    : `${process.env.REACT_APP_URL_UPLOAD}/${sig.chuKyNhay || sig.chuKyThuong}`;

                if (!imgSrc) return null;

                return (
                  <Box
                    key={sig.id}
                    sx={{
                      position: "absolute",
                      // ⭐ Dùng % để ổn định tuyệt đối vị trí
                      left: `${sig.x * displaySize.width}px`,
                      top: `${sig.y * displaySize.height}px`,
                      width: `${sig.width * (sig.scale || 1)}px`,
                      pointerEvents: "none",
                      zIndex: 10,
                    }}
                  >
                    <img
                      src={imgSrc}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                      }}
                      alt="signature"
                      onError={(e) => console.error("Lỗi load ảnh:", imgSrc)}
                    />
                  </Box>
                );
              })}
          </Box>
        ) : (
          <Typography color="error">Không thể tải file PDF</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
