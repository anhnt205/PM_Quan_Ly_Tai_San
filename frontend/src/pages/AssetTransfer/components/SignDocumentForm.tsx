import {
  Box,
  Button,
  Paper,
  Radio,
  FormControlLabel,
  RadioGroup,
  Typography,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Cancel,
  CancelOutlined,
  Close,
  PictureAsPdf,
} from "@mui/icons-material";
import React, { useState, useEffect, useRef, useMemo } from "react";
import * as pdfjsLib from "pdfjs-dist";
import DraggableSignature from "./DraggableSignature";
import { useAssetTranferMutation } from "../Mutation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import "../../../assets/fonts/times_new_roman-normal";
import { findById } from "../../../utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { SignaturesData } from "../types";
import dayjs from "dayjs";
import { Check, Pencil, TicketCheck } from "lucide-react";
import { showErrorAlert } from "../../../components/Alert";
import { canUserSign } from "../config";

// --- Config Worker ---
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface SignDocumentFormProps {
  selectedIds: string[];
  document?: File | string | any;
  onCancel: () => void;
  onSign: (data: SignaturesData[]) => void;
  fullscreen?: boolean;
  showSignerSidebar?: boolean;
  assetTransferDetail?: any[];
  allUnits?: any[];
  allCurrentStatus?: any[];
  allAssetsByDonVi?: any[];
  staffs?: any[];
  handleSignatureList?: (idTaiLieu: string) => Promise<any>;
}

export default function SignDocumentForm({
  selectedIds,
  document: documentUrl,
  onCancel,
  onSign,
  fullscreen = true,
  showSignerSidebar = true,
  assetTransferDetail,
  allUnits = [],
  allCurrentStatus = [],
  allAssetsByDonVi = [],
  staffs = [],
  handleSignatureList,
}: SignDocumentFormProps) {
  const [signatureType, setSignatureType] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const employee = findById(staffs, user?.taiKhoan?.tenDangNhap);
  // State quản lý danh sách chữ ký
  const [signatures, setSignatures] = useState<SignaturesData[]>([]);
  const [bangKeBytes, setBangKeBytes] = useState<Uint8Array | null>(null);

  // State quản lý Canvas và Loading
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // 1. Cập nhật useEffect lấy danh sách chữ ký từ API
  const fetchSignatures = async () => {
    if (selectedIds[0] && handleSignatureList) {
      try {
        const data = await handleSignatureList(selectedIds[0]);
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
  }, [selectedIds, handleSignatureList]);

  const generateBangKePdf = async (): Promise<Uint8Array> => {
    const doc = new jsPDF();

    doc.setFont("times_new_roman", "normal");
    doc.setFontSize(13);
    doc.text("BẢNG KÊ CHI TIẾT", 105, 15, { align: "center" });
    const tableData = (
      Array.isArray(assetTransferDetail) ? assetTransferDetail : []
    ).map((item: any, index: number) => {
      // Kiểm tra an toàn: Chỉ gọi findById khi mảng là hợp lệ
      const asset = Array.isArray(allAssetsByDonVi)
        ? findById(allAssetsByDonVi, item?.idTaiSan)
        : null;
      const unit = Array.isArray(allUnits)
        ? findById(allUnits, item?.donViTinh)
        : null;
      const status = Array.isArray(allCurrentStatus)
        ? findById(allCurrentStatus, item?.hienTrang)
        : null;

      return [
        index + 1,
        asset?.tenTaiSan || "",
        unit?.tenDonVi || "",
        item.soLuong || 0,
        status?.tenHTKT || "",
        item.moTa || "",
      ];
    });

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Stt",
          "Tên tài sản",
          "Đơn vị tính",
          "Số lượng",
          "Tình trạng kĩ thuật",
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
        fontStyle: "normal",
        halign: "center",
      },
      bodyStyles: {
        font: "times_new_roman",
        fontSize: 10,
        textColor: 0,
        lineWidth: 0.1,
        lineColor: 0,
      },
    });

    return new Uint8Array(doc.output("arraybuffer"));
  };

  useEffect(() => {
    const rebuildBangKe = async () => {
      try {
        const bytes = await generateBangKePdf();
        setBangKeBytes(bytes);
      } catch (err) {
        console.error("Lỗi build lại Bảng kê:", err);
      }
    };
    rebuildBangKe();
  }, [assetTransferDetail, allAssetsByDonVi, allUnits, allCurrentStatus]);

  const mergeBangKeWithOriginalPdf = async (
    originalPdfUrl?: string | null,
  ): Promise<Uint8Array> => {
    if (!bangKeBytes) {
      throw new Error("BangKe chưa được khởi tạo");
    }
    const bangKeDoc = await PDFDocument.load(bangKeBytes);

    if (!originalPdfUrl) {
      return bangKeBytes;
    }

    const originalBytes = await fetch(originalPdfUrl).then((r) =>
      r.arrayBuffer(),
    );
    const originalDoc = await PDFDocument.load(originalBytes);

    // 👉 Ghép BẢNG KÊ LÊN ĐẦU (chuẩn hành chính)
    const bangKePages = await originalDoc.copyPages(
      bangKeDoc,
      bangKeDoc.getPageIndices(),
    );

    bangKePages.forEach((p) => originalDoc.addPage(p));

    return await originalDoc.save();
  };

  // State để tracking kích thước hiển thị thực tế của các canvas pages
  const [canvasDisplaySizes, setCanvasDisplaySizes] = useState<
    { width: number; height: number }[]
  >([]);

  // Ref chứa container để xử lý scroll
  const containerRef = useRef<HTMLDivElement>(null);

  const { handlePreview } = useAssetTranferMutation();

  // 2. Sửa hàm handleConfirmSign để tính Y chuẩn hóa
  const handleSign = () => {
    if (!employee) return;
    if (!employee.chuKyNhay && !employee.chuKyThuong && !employee.chuKySo) {
      return showErrorAlert("Không tìm thấy chữ ký");
    }
    if (signatureType === 0) {
      return showErrorAlert("Chưa chọn chữ ký");
    }
    const hasDigitalSignature = signatures.some(
      (img) => img.loaiKy === 3 || img.loaiKy === 4 || img.loaiKy === 5,
    );

    // Kiểm tra quyền ký
    if (!canUserSign(signatureType, signatures)) {
      let errorMessage;
      if (
        hasDigitalSignature &&
        signatureType !== 3 &&
        signatureType !== 4 &&
        signatureType !== 5
      ) {
        errorMessage =
          "Tài liệu đã có chữ ký số, bạn chỉ có thể ký bằng chữ ký số!";
      } else {
        errorMessage = "Bạn đã ký tài liệu này rồi, không thể ký thêm!";
      }

      showErrorAlert(errorMessage);
      return;
    }
    const newSignature: SignaturesData = {
      stt: signatures.length + 1,
      id: `temp-${Date.now()}`,
      idTaiLieu: selectedIds[0],
      idNguoiKy: user?.taiKhoan?.tenDangNhap,
      loaiKy: signatureType,
      ngayKy: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      x: 0.5, // Giữa trang theo chiều ngang
      y: 0.2, // Vị trí dọc chuẩn hóa
      chuKyNhay: signatureType === 1 && employee.chuKyNhay,
      chuKyThuong: signatureType === 2 && employee.chuKyThuong,
      width: 120,
      scale: 1,
      chuKySo: "",
      isLocked: false,
    };

    setSignatures([...signatures, newSignature]);
  };

  // 3. Cập nhật hàm xử lý vị trí (Nhận ratio thay vì pixel)
  const handleUpdatePosition = (
    id: string,
    newXRatio: number,
    newYRatio: number,
  ) => {
    console.log("Updated Position (Normalized):", newXRatio, newYRatio);
    setSignatures((prev) =>
      prev.map((sig) =>
        sig.id === id ? { ...sig, x: newXRatio, y: newYRatio } : sig,
      ),
    );
  };
  const handleUpdateScale = (id: string, newScale: number) => {
    console.log("scale", newScale);
    setSignatures((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, scale: newScale } : sig)),
    );
  };

  const handleConfirmSign = async () => {
    const data = signatures.filter((i) => !i.isLocked);
    if (data.length === 0) {
      return showErrorAlert("Chưa có chữ ký nào để lưu");
    }
    await onSign(data);
    fetchSignatures();
  };

  // Lấy PDF từ backend
  useEffect(() => {
    let activeUrl: string | null = null;

    const fetchAndPrepare = async () => {
      try {
        setPdfError(null);
        setLoading(true);

        if (!documentUrl) {
          // 👉 CHỈ PREVIEW BẢNG KÊ
          const bangKeBytes = await generateBangKePdf();
          const blob = new Blob([bangKeBytes.buffer as ArrayBuffer], {
            type: "application/pdf",
          });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setLoading(false);
          return;
        }

        // TRƯỜNG HỢP 1: Document là File Object (Vừa upload xong)
        // Tương đương với việc có "path" trong Flutter
        if (documentUrl instanceof File || documentUrl instanceof Blob) {
          const url = URL.createObjectURL(documentUrl);
          activeUrl = url;

          const mergedBytes = await mergeBangKeWithOriginalPdf(url);

          const mergedBlob = new Blob([mergedBytes.buffer as ArrayBuffer], {
            type: "application/pdf",
          });

          const previewUrl = URL.createObjectURL(mergedBlob);
          setPdfUrl(previewUrl);
          return;
        }

        // TRƯỜNG HỢP 2: Document là string (Tên file từ Server)
        let fileName: string | null = null;
        if (typeof documentUrl === "string") {
          fileName = documentUrl;
        } else if (typeof documentUrl === "object") {
          fileName =
            documentUrl.tenFile || documentUrl.fileName || documentUrl.filePDF;
        }
        if (fileName) {
          console.log("Đang tải file từ server:", fileName);
          let originalUrl: string | null = null;

          // 1. CÔ LẬP LỖI TẢI FILE GỐC
          try {
            const blob = await handlePreview(fileName);

            // Kiểm tra xem có phải nội dung lỗi (HTML) không
            const text = await blob.slice(0, 100).text();
            if (text.includes("<!DOCTYPE") || text.includes("<html")) {
              throw new Error(
                "File trên server không tồn tại (404) hoặc sai định dạng.",
              );
            }

            originalUrl = URL.createObjectURL(blob);
          } catch (err) {
            // Nếu lỗi ở đây, ta chỉ log cảnh báo, KHÔNG nhảy xuống catch tổng
            console.warn(
              "⚠️ Không lấy được file gốc, chuyển sang chế độ chỉ hiện Bảng kê:",
              err,
            );
            originalUrl = null;
          }

          // 2. TIẾP TỤC GHÉP FILE (Dù có file gốc hay không)
          try {
            // Luôn gọi hàm này, truyền originalUrl (có thể là null)
            const mergedBytes = await mergeBangKeWithOriginalPdf(originalUrl);

            const mergedBlob = new Blob([mergedBytes.buffer as ArrayBuffer], {
              type: "application/pdf",
            });

            const previewUrl = URL.createObjectURL(mergedBlob);
            setPdfUrl(previewUrl);
            setPdfError(null); // Xóa lỗi nếu trước đó có
          } catch (mergeError: any) {
            // Chỉ báo lỗi nếu ngay cả việc tạo Bảng kê cũng thất bại
            console.error("❌ Lỗi nghiêm trọng khi tạo PDF:", mergeError);
            setPdfError("Không thể khởi tạo tài liệu xem trước.");
            setPdfUrl(null);
          } finally {
            setLoading(false);
          }
        }
      } catch (error: any) {
        console.error("Lỗi chuẩn bị PDF:", error);
        setPdfUrl(null);
        setPdfError(error.message);
        setLoading(false);
      }
    };

    fetchAndPrepare();

    // Cleanup: Quan trọng để tránh tràn bộ nhớ
    return () => {
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, [documentUrl, bangKeBytes]);

  // --- Render PDF ---
  useEffect(() => {
    const renderPDF = async () => {
      try {
        setLoading(true);
        if (!pdfUrl) {
          setLoading(false);
          return;
        }
        console.log("Đang tải PDF từ URL:", pdfUrl);
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        console.log("PDF tải thành công, số trang:", pdf.numPages);
        const canvases: HTMLCanvasElement[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;

          // Scale 1.5
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // CSS width/height hiển thị
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";

          // Lưu số trang
          canvas.dataset.page = pageNum.toString();

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          canvases.push(canvas);
        }

        setPages(canvases);
        setPdfError(null);
        setLoading(false);
      } catch (error: any) {
        console.error("Lỗi render PDF:", error);
        setPdfError(`Lỗi đọc PDF: ${error.message}`);
        setLoading(false);
      }
    };

    renderPDF();
  }, [pdfUrl, bangKeBytes]);

  // Theo dõi kích thước hiển thị của các canvas pages
  useEffect(() => {
    if (pages.length === 0) return;

    const observer = new ResizeObserver(() => {
      const sizes = pages.map((canvas) => ({
        width: canvas.getBoundingClientRect().width || canvas.width,
        height: canvas.getBoundingClientRect().height || canvas.height,
      }));
      setCanvasDisplaySizes(sizes);
    });

    // Observe mỗi canvas
    pages.forEach((canvas) => {
      observer.observe(canvas);
    });

    return () => {
      observer.disconnect();
    };
  }, [pages]);

  // Xóa chữ ký
  const handleDeleteSignature = (id: string) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id));
  };

  const handleExportPDF = async () => {
    try {
      setLoading(true);

      // 1. Ghép PDF ban đầu
      const mergedBytes = await mergeBangKeWithOriginalPdf(pdfUrl);
      const pdfDoc = await PDFDocument.load(mergedBytes);

      // 2. Lấy trang đầu
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width: pageWidth, height: pageHeight } = firstPage.getSize();

      // 3. Chiều rộng hiển thị thực tế
      const displayWidth = canvasDisplaySizes[0]?.width || 800;

      // 4. Vẽ chữ ký
      for (const sig of signatures) {
        const imgPath = sig.loaiKy === 1 ? sig.chuKyNhay : sig.chuKyThuong;
        if (!imgPath) continue;

        const imageUrl = `${process.env.REACT_APP_URL_UPLOAD}/${imgPath}`;

        try {
          const imageBytes = await fetch(imageUrl).then((res) =>
            res.arrayBuffer(),
          );

          const pdfImage = imgPath.toLowerCase().endsWith(".png")
            ? await pdfDoc.embedPng(imageBytes)
            : await pdfDoc.embedJpg(imageBytes);

          // --- TÍNH KÍCH THƯỚC ---
          const widthRatio = (sig.width * (sig.scale || 1)) / displayWidth;

          const pdfImageWidth = widthRatio * pageWidth;
          const pdfImageHeight =
            (pdfImage.height / pdfImage.width) * pdfImageWidth;

          // --- TÍNH VỊ TRÍ ---
          const x = sig.x * pageWidth;
          const y = pageHeight - sig.y * pageHeight - pdfImageHeight;

          firstPage.drawImage(pdfImage, {
            x,
            y,
            width: pdfImageWidth,
            height: pdfImageHeight,
          });
        } catch (err) {
          console.error(`Không thể chèn chữ ký ${sig.id}:`, err);
        }
      }

      // 5. Save & download DUY NHẤT 1 LẦN
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `BangKe_ChiTiet_${Date.now()}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      setPdfError("Không thể ghép file PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        ...(fullscreen && { position: "fixed", inset: 0, zIndex: 9999 }),
      }}
    >
      {/* --- Header (Giữ nguyên) --- */}
      {fullscreen && (
        <Box
          sx={{
            bgcolor: "white",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6">Soạn & Ký Tài Liệu</Typography>
            <Typography variant="body2" color="textSecondary">
              Tổng số trang: {pages.length}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleExportPDF}
              sx={{
                textTransform: "none",
                fontSize: "0.875rem",
                color: "#8b5cf6",
                borderColor: "#c4b5fd",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#a78bfa",
                  backgroundColor: "rgba(139, 92, 246, 0.04)",
                },
              }}
              startIcon={<PictureAsPdf />}
            >
              Xuất PDF
            </Button>
            <IconButton onClick={onCancel}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* --- Body --- */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* --- Left Sidebar (Công cụ) --- */}
        {showSignerSidebar && (
          <Paper
            sx={{
              width: 320,
              p: 2,
              overflowY: "auto",
              borderRight: "1px solid #ddd",
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Công cụ ký
            </Typography>

            <RadioGroup
              value={signatureType}
              onChange={(e) => setSignatureType(Number(e.target.value))}
            >
              {employee.kyNhay && (
                <>
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Ký nháy"
                  />
                  <Box sx={{ ml: 4, mb: 2 }}>
                    <img
                      src={`${process.env.REACT_APP_URL_UPLOAD}/${employee.chuKyNhay}`}
                      alt="sample"
                      width={80}
                      style={{ border: "1px solid #eee" }}
                    />
                  </Box>
                </>
              )}
              {employee.kyThuong && (
                <>
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label="Ký thường"
                  />
                  <Box sx={{ ml: 4, mb: 2 }}>
                    <img
                      src={`${process.env.REACT_APP_URL_UPLOAD}/${employee.chuKyThuong}`}
                      alt="sample"
                      width={80}
                      style={{ border: "1px solid #eee" }}
                    />
                  </Box>
                </>
              )}
            </RadioGroup>
            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              fullWidth
              color="success"
              onClick={handleSign}
              sx={{ mb: 1, color: "white" }}
              startIcon={<Pencil size={16} />}
            >
              Ký
            </Button>
            <Button
              variant="contained"
              fullWidth
              color="info"
              onClick={handleConfirmSign}
              sx={{ mb: 1, color: "white" }}
              startIcon={<Check size={16} />}
            >
              Xác nhận
            </Button>
            <Button
              variant="outlined"
              fullWidth
              color="error"
              onClick={handleConfirmSign}
              sx={{ mb: 1, color: "red" }}
              startIcon={<CancelOutlined sx={{ fontSize: 16 }} />}
            >
              Hủy
            </Button>
          </Paper>
        )}

        {/* --- Right Content (PDF Viewer) --- */}
        <Box
          ref={containerRef}
          sx={{
            flex: 1,
            bgcolor: "#e0e0e0",
            p: 4,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {pdfError && (
            <Alert severity="error" sx={{ mb: 2, maxWidth: "600px" }}>
              {pdfError}
            </Alert>
          )}
          {loading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ position: "relative" }}>
              {pages.map((canvas, index) => (
                <Box key={index} sx={{ position: "relative", mb: 3 }}>
                  {/* Render Canvas */}
                  <div
                    ref={(el) => {
                      if (el && !el.hasChildNodes()) el.appendChild(canvas);
                    }}
                  />

                  {/* 👉 QUAN TRỌNG: Chỉ render chữ ký nếu đây là trang đầu tiên (index === 0) */}
                  {index === 0 && signatures.length > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0, // Phủ kín trang 1
                        pointerEvents: "none", // Để vẫn scroll/thao tác được PDF bên dưới
                      }}
                    >
                      {signatures.map((sig) => {
                        const displaySize = canvasDisplaySizes[0] ?? {
                          width: 800,
                          height: 800 * (297 / 210),
                        };

                        // GUARD CLAUSE: Nếu PDF chưa render xong width = 0, thì không render chữ ký để tránh NaN
                        if (displaySize.width === 0 || displaySize.height === 0)
                          return null;

                        return (
                          <DraggableSignature
                            key={sig.id}
                            id={sig.id}
                            // Tính toán tọa độ pixel
                            initialX={sig.x * displaySize.width}
                            initialY={sig.y * displaySize.height}
                            width={sig.width}
                            initialScale={sig.scale || 1}
                            imgSrc={`${process.env.REACT_APP_URL_UPLOAD}/${sig.chuKyNhay || sig.chuKyThuong}`}
                            containerWidth={displaySize.width}
                            containerHeight={displaySize.height}
                            onUpdatePosition={handleUpdatePosition}
                            onUpdateScale={handleUpdateScale}
                            onDelete={handleDeleteSignature}
                            isLocked={sig.isLocked}
                          />
                        );
                      })}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Đã xuất PDF thành công</Alert>
      </Snackbar>
    </Box>
  );
}
