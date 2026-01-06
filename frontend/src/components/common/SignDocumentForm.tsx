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
import { Close, PictureAsPdf } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import signatureImage from "../../assets/images/sign.png";
import DraggableSignature from "../../pages/AssetTransfer/components/DraggableSignature";

// --- Config Worker ---
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

// --- Types ---
interface SignatureData {
  id: string;
  page: number;
  x: number;
  y: number;
  type: string;
}

interface SignDocumentFormProps {
  selectedIds?: string[];
  documents?: any;
  onCancel: () => void;
  onSign?: () => void;
  onDownload?: (fileName: string) => void;
  fullscreen?: boolean;
  showSignerSidebar?: boolean;
  fileName?: string;
}

export default function SignDocumentForm({
  selectedIds,
  documents,
  onCancel,
  onSign,
  fullscreen = true,
  showSignerSidebar = true,
  fileName,
  onDownload,
}: SignDocumentFormProps) {
  const [signatureType, setSignatureType] = useState("standard");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // State quản lý danh sách chữ ký
  const [signatures, setSignatures] = useState<SignatureData[]>([]);

  // State quản lý Canvas và Loading
  const defaultSampleFile = "/sample.pdf";
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [loading, setLoading] = useState(true);

  // State để tracking kích thước hiển thị thực tế của các canvas pages
  const [canvasDisplaySizes, setCanvasDisplaySizes] = useState<
    { width: number; height: number }[]
  >([]);

  // Ref chứa container để xử lý scroll
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Render PDF ---
  useEffect(() => {
    const renderPDF = async () => {
      try {
        setLoading(true);
        const pdf = await pdfjsLib.getDocument(defaultSampleFile).promise;
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
        setLoading(false);
      } catch (error) {
        console.error("Error rendering PDF:", error);
        setLoading(false);
      }
    };

    renderPDF();
  }, [defaultSampleFile]);

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

  // --- Handlers ---

  // Khi click vào PDF
  const handlePageClick = (e: React.MouseEvent, pageIndex: number) => {
    // Không cần xử lý gì
  };

  // Cập nhật vị trí sau khi kéo thả (nhận tọa độ dưới dạng ratio)
  const handleUpdatePosition = (id: string, newX: number, newY: number) => {
    setSignatures((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, x: newX, y: newY } : sig))
    );
  };

  // Cập nhật trang khi chữ ký được kéo sang trang khác
  const handleUpdatePage = (id: string, newPage: number) => {
    setSignatures((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, page: newPage } : sig))
    );
  };

  // Xóa chữ ký
  const handleDeleteSignature = (id: string) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id));
  };

  // Nút Xác nhận ký -> Thêm chữ ký vào danh sách
  const handleConfirmSign = () => {
    const newSignature: SignatureData = {
      id: Date.now().toString(),
      page: 1,
      x: 0.05, // Vị trí mặc định: 5% từ trái
      y: 0.1, // 10% từ trên
      type: signatureType,
    };
    console.log("Thêm chữ ký:", newSignature);
    setSignatures([...signatures, newSignature]);
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
              onClick={() => {
                if (fileName) {
                  onDownload?.(fileName);
                }
              }}
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
              onChange={(e) => setSignatureType(e.target.value)}
            >
              <FormControlLabel
                value="standard"
                control={<Radio />}
                label="Ký thường"
              />
              <Box sx={{ ml: 4, mb: 2 }}>
                <img
                  src={signatureImage}
                  alt="sample"
                  width={80}
                  style={{ border: "1px solid #eee" }}
                />
              </Box>

              <FormControlLabel
                value="initials"
                control={<Radio />}
                label="Ký nháy"
              />
            </RadioGroup>

            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              fullWidth
              color="success"
              onClick={handleConfirmSign}
              sx={{ mb: 1 }}
            >
              Xác nhận ký
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
          {loading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ position: "relative" }}>
              {/* Render tất cả pages */}
              {pages.map((canvas, index) => {
                const pageNum = index + 1;
                const displaySize = canvasDisplaySizes[index] || {
                  width: canvas.width,
                  height: canvas.height,
                };
                const canvasDisplayWidth = displaySize.width;
                const canvasDisplayHeight = displaySize.height;

                return (
                  <Box key={index}>
                    {/* Divider giữa các trang */}
                    {index > 0 && (
                      <Box
                        sx={{
                          height: "2px",
                          bgcolor: "#1976d2",
                          margin: "16px auto",
                          width: "80%",
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        position: "relative",
                        marginBottom: 3,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        maxWidth: canvas.width,
                        margin: "0 auto",
                      }}
                    >
                      {/* 1. Render Canvas */}
                      <Box
                        ref={(el: HTMLDivElement | null) => {
                          if (el && !el.hasChildNodes()) {
                            el.appendChild(canvas);
                          }
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}

              {/* 2. Render tất cả signatures với absolute positioning (cho phép drag giữa pages) */}
              {signatures.map((sig) => {
                const displaySize = canvasDisplaySizes[sig.page - 1] || {
                  width: pages[sig.page - 1]?.width || 0,
                  height: pages[sig.page - 1]?.height || 0,
                };
                const canvasDisplayWidth = displaySize.width;
                const canvasDisplayHeight = displaySize.height;
                const canvas = pages[sig.page - 1];
                const pageMarginAndGap = 24 + 24; // marginBottom 3 + divider height 2 + margin 16 × 2

                // Tính Y offset dựa trên page index
                const pageOffset =
                  (sig.page - 1) * (canvasDisplayHeight + pageMarginAndGap);

                return (
                  <DraggableSignature
                    key={sig.id}
                    {...sig}
                    initialX={sig.x * canvasDisplayWidth}
                    initialY={pageOffset + sig.y * canvasDisplayHeight}
                    xRatio={sig.x}
                    yRatio={sig.y}
                    imgSrc={signatureImage}
                    containerWidth={canvasDisplayWidth}
                    containerHeight={canvasDisplayHeight}
                    canvasWidth={canvas?.width || 0}
                    canvasHeight={canvas?.height || 0}
                    currentPage={sig.page}
                    totalPages={pages.length}
                    onUpdatePosition={handleUpdatePosition}
                    onUpdatePage={handleUpdatePage}
                    onDelete={handleDeleteSignature}
                  />
                );
              })}
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
