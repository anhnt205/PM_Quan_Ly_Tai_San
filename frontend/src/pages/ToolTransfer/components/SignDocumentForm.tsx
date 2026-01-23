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
import { CancelOutlined, Close, PictureAsPdf } from "@mui/icons-material";
import { useState, useEffect, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import DraggableSignature from "./DraggableSignature";
import { useToolTransferMutation } from "../Mutation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import "../../../assets/fonts/times_new_roman-normal";
import { findById, generateSha256 } from "../../../utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ToolSignature, ToolTransferDetail } from "../types";
import dayjs from "dayjs";
import { Check, Pencil } from "lucide-react";
import { showErrorAlert } from "../../../components/Alert";
import { canUserSign } from "../config";
import axios from "axios";
import { ConfirmPin } from "./ConfirmPin";

// Đảm bảo Worker khớp với version của thư viện
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface SignDocumentFormProps {
  selectedIds: string[];
  document?: any;
  onCancel: () => void;
  onSign: (data: ToolSignature[]) => void;
  fullscreen?: boolean;
  showSignerSidebar?: boolean;
  toolTransferDetail?: ToolTransferDetail[];
  allUnits?: any[];
  allCurrentStatus?: any[];
  allToolsByDonVi?: any[];
  staffs?: any[];
  handleSignatureList?: (idTaiLieu: string) => Promise<any>;
}

export default function SignDocumentForm({
  selectedIds,
  document: documentData,
  onCancel,
  onSign,
  fullscreen = true,
  showSignerSidebar = true,
  toolTransferDetail,
  allUnits = [],
  allCurrentStatus = [],
  allToolsByDonVi = [],
  staffs = [],
  handleSignatureList,
}: SignDocumentFormProps) {
  const [signatureType, setSignatureType] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const employee = findById(staffs, user?.taiKhoan?.tenDangNhap);

  const [signatures, setSignatures] = useState<ToolSignature[]>([]);
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [digitalSignatureMap, setDigitalSignatureMap] = useState<
    Record<string, string>
  >({});
  const [openConfirmPin, setOpenConfirmPin] = useState(false);
  const [canvasDisplaySizes, setCanvasDisplaySizes] = useState<
    { width: number; height: number }[]
  >([]);

  const { handlePreview } = useToolTransferMutation();

  // --- 1. HÀM SINH BẢNG KÊ (JS-PDF) ---
  const generateBangKePdf = useCallback(async (): Promise<Uint8Array> => {
    try {
      const doc = new jsPDF();
      // Thử dùng font mặc định nếu font Times New Roman chưa load kịp để tránh crash
      try {
        doc.setFont("times_new_roman", "normal");
      } catch (e) {
        console.warn("Font Times New Roman chưa sẵn sàng");
      }

      doc.setFontSize(13);
      doc.text("BẢNG KÊ CHI TIẾT CCDC - VẬT TƯ", 105, 15, { align: "center" });

      const tableData = (toolTransferDetail || []).map((item, index) => {
        const tool = findById(allToolsByDonVi, item?.idCCDCVatTu);
        return [
          index + 1,
          tool?.tenCCDCVatTu || item?.tenCCDCVatTu || "N/A",
          findById(allUnits, item?.donViTinh)?.tenDonVi || "",
          item.soLuong || 0,
          findById(allCurrentStatus, item?.hienTrang)?.tenHTKT || "",
          item.ghiChu || "",
        ];
      });

      autoTable(doc, {
        startY: 25,
        head: [
          [
            "Stt",
            "Tên CCDC - Vật tư",
            "ĐVT",
            "Số lượng",
            "Tình trạng",
            "Ghi chú",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          font: "times_new_roman",
          halign: "center",
          fillColor: false,
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: { font: "times_new_roman", fontSize: 10, textColor: 0 },
      });

      return new Uint8Array(doc.output("arraybuffer"));
    } catch (err) {
      console.error("Lỗi generateBangKePdf:", err);
      throw err;
    }
  }, [toolTransferDetail, allToolsByDonVi, allUnits, allCurrentStatus]);

  // --- 2. HÀM GHÉP PDF (PDF-LIB) ---
  const mergePdfs = async (
    originalUrl: string | null,
    bkeBytes: Uint8Array,
  ): Promise<Uint8Array> => {
    try {
      const bangKeDoc = await PDFDocument.load(bkeBytes);
      if (!originalUrl) return bkeBytes;

      const originalBytes = await fetch(originalUrl).then((r) =>
        r.arrayBuffer(),
      );
      const originalDoc = await PDFDocument.load(originalBytes);

      const bangKePages = await originalDoc.copyPages(
        bangKeDoc,
        bangKeDoc.getPageIndices(),
      );
      bangKePages.forEach((p) => originalDoc.addPage(p));

      return await originalDoc.save();
    } catch (err) {
      console.warn("Ghép file thất bại, sử dụng Bảng kê làm dự phòng", err);
      return bkeBytes;
    }
  };

  // --- 3. HIỆU ỨNG TẢI TÀI LIỆU ---
  useEffect(() => {
    let isMounted = true;
    let currentBlobUrl: string | null = null; // Chỉ quản lý 1 URL hiển thị hiện tại

    const loadTàiLiệu = async () => {
      try {
        setLoading(true);
        setPdfError(null);
        console.log("Bắt đầu chuẩn bị tài liệu...");

        // A. Sinh bảng kê trước
        const bke = await generateBangKePdf();

        // B. Xác định file gốc
        let fileName: string | null = null;
        if (typeof documentData === "string") fileName = documentData;
        else if (documentData?.tenFile) fileName = documentData.tenFile;

        let finalBytes: Uint8Array;
        if (fileName) {
          try {
            const blob = await handlePreview(fileName);
            const originalUrl = URL.createObjectURL(blob);

            finalBytes = await mergePdfs(originalUrl, bke);

            URL.revokeObjectURL(originalUrl);
          } catch (e) {
            console.warn("Không tải được file gốc, hiện Bảng kê");
            finalBytes = bke;
          }
        } else {
          finalBytes = bke;
        }

        if (isMounted) {
          const finalBlobUrl = URL.createObjectURL(
            new Blob([finalBytes as any], { type: "application/pdf" }),
          );

          currentBlobUrl = finalBlobUrl;
          console.log("Đã tạo URL PDF thành công:", finalBlobUrl);
          setPdfUrl(finalBlobUrl);
        }
      } catch (err: any) {
        if (isMounted) setPdfError("Lỗi khởi tạo PDF: " + err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTàiLiệu();

    return () => {
      isMounted = false;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [documentData, generateBangKePdf]);

  // --- 4. HIỆU ỨNG RENDER PDF SANG CANVAS ---
  useEffect(() => {
    if (!pdfUrl) return;

    const render = async () => {
      try {
        console.log("Đang render PDF sang Canvas...");
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        console.log("PDF đã tải xong. Số trang:", pdf.numPages);

        const canvasList: HTMLCanvasElement[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
          canvasList.push(canvas);
        }
        setPages(canvasList);
      } catch (err: any) {
        console.error("Lỗi render canvas:", err);
        setPdfError("Không thể hiển thị trang PDF: " + err.message);
      }
    };

    render();
  }, [pdfUrl]);

  // Resize Observer để track kích thước thực tế (Dùng cho chữ ký kéo thả)
  useEffect(() => {
    if (pages.length === 0) return;
    const obs = new ResizeObserver(() => {
      setCanvasDisplaySizes(
        pages.map((c) => ({
          width: c.getBoundingClientRect().width || c.width,
          height: c.getBoundingClientRect().height || c.height,
        })),
      );
    });
    pages.forEach((p) => obs.observe(p));
    return () => obs.disconnect();
  }, [pages]);

  // --- LOGIC KÝ VÀ EXPORT (GIỮ NGUYÊN NHƯ CŨ NHƯNG FIX TYPE) ---
  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setSignatures((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x, y } : s)),
    );
  };
  const handleUpdateScale = (id: string, scale: number) => {
    setSignatures((prev) =>
      prev.map((s) => (s.id === id ? { ...s, scale } : s)),
    );
  };
  const handleUpdatePage = (id: string, page: number) => {
    setSignatures((prev) =>
      prev.map((s) => (s.id === id ? { ...s, page } : s)),
    );
  };
  const handleDeleteSignature = (id: string) => {
    setSignatures((prev) => prev.filter((s) => s.id !== id));
  };

  if (!employee && !loading)
    return (
      <Alert severity="warning">
        Không tìm thấy thông tin nhân viên để ký.
      </Alert>
    );

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
      {/* Header */}
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
          <Typography variant="h6" fontWeight="bold">
            Soạn & Ký Tài Liệu CCDC
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Tổng số trang: {pages.length}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              /* handleExport */
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

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar Công cụ ký */}
        {showSignerSidebar && (
          <Paper
            sx={{
              width: 300,
              p: 2,
              overflowY: "auto",
              borderRight: "1px solid #ddd",
              borderRadius: 0,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Công cụ ký
            </Typography>
            {/* Render Radio Group & Buttons ở đây... */}
            <Button
              variant="contained"
              fullWidth
              color="success"
              sx={{ mb: 1, color: "#fff" }}
              startIcon={<Pencil size={18} />}
            >
              Ký văn bản
            </Button>
            <Button
              variant="contained"
              fullWidth
              color="info"
              sx={{ color: "#fff" }}
              startIcon={<Check size={18} />}
            >
              Xác nhận lưu
            </Button>
          </Paper>
        )}

        {/* Vùng hiển thị PDF */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#525659",
            p: 4,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {pdfError && (
            <Alert
              severity="error"
              sx={{ mb: 2, width: "100%", maxWidth: 800 }}
            >
              {pdfError}
            </Alert>
          )}

          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={10}
            >
              <CircularProgress
                size={60}
                thickness={4}
                sx={{ mb: 2, color: "#fff" }}
              />
              <Typography color="#fff">Đang khởi tạo tài liệu...</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                position: "relative",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              {pages.map((canvas, index) => {
                const displaySize = canvasDisplaySizes[index] || {
                  width: 800,
                  height: 1100,
                };
                return (
                  <Box
                    key={index}
                    sx={{ position: "relative", mb: 2, bgcolor: "#fff" }}
                  >
                    {/* Render Canvas thực tế */}
                    <div
                      ref={(el) => {
                        if (el && !el.hasChildNodes()) el.appendChild(canvas);
                      }}
                    />

                    {/* Lớp phủ chứa chữ ký */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "auto",
                      }}
                    >
                      {signatures
                        .filter((s) => (s.page || 1) === index + 1)
                        .map((sig) => (
                          <DraggableSignature
                            key={sig.id}
                            id={sig.id}
                            initialX={sig.x * displaySize.width}
                            initialY={sig.y * displaySize.height}
                            xRatio={sig.x}
                            yRatio={sig.y}
                            width={sig.width}
                            initialScale={sig.scale || 1}
                            imgSrc={
                              sig.loaiKy === 3
                                ? digitalSignatureMap[sig.id]
                                : `${process.env.REACT_APP_URL_UPLOAD}/${sig.chuKyNhay || sig.chuKyThuong}`
                            }
                            onUpdatePosition={handleUpdatePosition}
                            onUpdateScale={handleUpdateScale}
                            onUpdatePage={handleUpdatePage}
                            onDelete={handleDeleteSignature}
                            containerWidth={displaySize.width}
                            containerHeight={displaySize.height}
                            canvasWidth={canvas.width}
                            canvasHeight={canvas.height}
                            currentPage={index + 1}
                            totalPages={pages.length}
                            isLocked={sig.isLocked}
                          />
                        ))}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
      <ConfirmPin
        open={openConfirmPin}
        onClose={() => setOpenConfirmPin(false)}
        onConfirm={() => {}}
      />
    </Box>
  );
}
