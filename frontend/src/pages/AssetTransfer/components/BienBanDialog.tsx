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
import { SignaturesData } from "../types";
import BoxSignatureImg from "../../../components/SignDocument/BoxSignatureImg";
import S3Service from "../../../services/S3Service";
import { AssetHandoverData } from "../../AssetHandover/types";

// Config Worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface BienBanDialogProps {
  open: boolean;
  onClose: () => void;
  assetHandover: AssetHandoverData[];
  handleSignatureList?: (idTaiLieu: string) => Promise<any>;
}

export default function BienBanDialog({
  open,
  onClose,
  assetHandover,
  handleSignatureList,
}: BienBanDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalPages = assetHandover.length;
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [signatures, setSignatures] = useState<SignaturesData[]>([]);
  const [digitalSignatureMap, setDigitalSignatureMap] = useState<
    Record<string, string>
  >({});
  const [displaySize, setDisplaySize] = useState<
    {
      width: number;
      height: number;
    }[]
  >([]);
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);

  // Lấy PDF từ backend
  useEffect(() => {
    const preparePdf = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        // Quan trọng: Xóa URL cũ trước khi tạo cái mới để tránh render đè
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
          setPdfUrl("");
        }

        // 👉 TRƯỜNG HỢP 2: KHÔNG CÓ DOCUMENT HOẶC previewDocument = false → DÙNG BẢNG KÊ
        const newBlob = await S3Service.preview(
          assetHandover[currentIndex].taiLieuBangKe,
        );

        const newUrl = URL.createObjectURL(newBlob);
        setPdfUrl(newUrl);
      } catch (err) {
        console.error(err);
        setErrorMessage("Không thể khởi tạo tài liệu");
      } finally {
        setLoading(false);
      }
    };
    if (assetHandover.length > 0) preparePdf();

    // Cleanup function để tránh rò rỉ bộ nhớ
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [currentIndex, assetHandover]);
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
          canvas.dataset.scale = scale.toString();

          // Lưu số trang
          canvas.dataset.page = pageNum.toString();

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          canvases.push(canvas);
        }

        setPages(canvases);
        setErrorMessage("");
        setLoading(false);
      } catch (error: any) {
        console.error("Lỗi render PDF:", error);
        setErrorMessage(`Lỗi đọc PDF: ${error.message}`);
        setLoading(false);
      }
    };

    renderPDF();
  }, [pdfUrl]);

  // Theo dõi kích thước hiển thị của các canvas pages
  useEffect(() => {
    if (pages.length === 0) return;

    const observer = new ResizeObserver((entries) => {
      // Cập nhật lại toàn bộ mảng size của các trang
      const newSizes = entries.map((entry) => ({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }));
      setDisplaySize(newSizes);
    });

    pages.forEach((canvas) => observer.observe(canvas));
    return () => observer.disconnect();
  }, [pages]);

  const handlePrevPage = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNextPage = () => {
    if (currentIndex < totalPages - 1) setCurrentIndex((i) => i + 1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
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
          background:
            "linear-gradient(to right,rgb(0, 158, 96, 1) 0%,rgb(2, 110, 66, 1) 100%)",
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
                color: "#f3f4f6",
                letterSpacing: "-0.5px",
              }}
            >
              Danh sách biên bản bàn giao
            </Typography>
            {/*<Typography
              variant="caption"
              sx={{
                color: "#6b7280",
                mt: 0.5,
                display: "block",
              }}
            >
              Tài liệu giao nhận tài sản
            </Typography>*/}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={handlePrevPage}
              disabled={currentIndex === 0}
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
                {currentIndex + 1}/{totalPages}
              </Typography>
            </Box>
            <IconButton
              onClick={handleNextPage}
              disabled={currentIndex === totalPages - 1}
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
              color: "#f3f4f6",
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          p: 2,
          overflow: "auto",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : errorMessage ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography color="error" variant="body1" sx={{ mb: 1 }}>
              Không thể tải file PDF
            </Typography>
            <Typography color="textSecondary" variant="caption">
              Lỗi: {errorMessage}
            </Typography>
          </Box>
        ) : totalPages > 0 ? (
          <Box
            sx={{
              bgcolor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "4px",
              p: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              overflow: "auto",
            }}
          >
            {pages.map((canvas, index) => (
              <Box key={index} sx={{ position: "relative", mb: 3 }}>
                {/* Render Canvas */}
                <div
                  ref={(el) => {
                    if (el && !el.hasChildNodes()) el.appendChild(canvas);
                  }}
                />

                {/* LAYER 2: SIGNATURES (Nằm đè lên trên) */}
                {signatures
                  .filter((sig) => (sig.page || 1) === index + 1)
                  .map((sig) => {
                    const currentCanvas = pages[index];
                    const currentDisplay = displaySize[index];
                    if (!currentCanvas || !currentDisplay) return null;
                    const scale = currentDisplay.width / currentCanvas.width;
                    return (
                      <BoxSignatureImg
                        key={sig.id}
                        scale={scale}
                        digitalSignatureMap={digitalSignatureMap}
                        sig={sig}
                        currentDisplay={currentDisplay}
                      />
                    );
                  })}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography color="error">Không thể tải file PDF</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
