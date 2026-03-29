import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  NavigateBefore,
  NavigateNext,
  PictureAsPdf,
  Close,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { SignaturesData } from "../types";
import BoxSignatureImg from "../../../components/SignDocument/BoxSignatureImg";
import S3Service from "../../../services/S3Service";
import { AssetHandoverData } from "../../AssetHandover/types";

// Config Worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface BienBanTabContentProps {
  assetHandover: AssetHandoverData[];
  handleSignatureList?: (idTaiLieu: string) => Promise<any>;
  onClose?: () => void;
}

export default function BienBanTabContent({
  assetHandover,
  handleSignatureList,
  onClose,
}: BienBanTabContentProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
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

        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
          setPdfUrl("");
        }

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
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const canvases: HTMLCanvasElement[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;

          const scale = 1.3; // Chỉnh scale nhỏ lại cho Sidebar
          const viewport = page.getViewport({ scale });

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";

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

  // ResizeObserver logic
  useEffect(() => {
    if (pages.length === 0) return;

    const observer = new ResizeObserver((entries) => {
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      {/* Header Styled like original Dialog */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          px: 2,
          py: 1.5,
          background:
            "linear-gradient(to right,rgb(0, 158, 96, 1) 0%,rgb(2, 110, 66, 1) 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "6px",
              bgcolor: "#f87b38ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <PictureAsPdf sx={{ fontSize: 18 }} />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "#f3f4f6",
              fontSize: "0.95rem",
              lineHeight: 1.2,
            }}
          >
            Biên bản bàn giao
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              px: 1,
            }}
          >
            <IconButton
              onClick={handlePrevPage}
              disabled={currentIndex === 0}
              size="small"
              sx={{ color: "white", "&:disabled": { color: "rgba(255,255,255,0.3)" } }}
            >
              <NavigateBefore fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 40, textAlign: "center" }}>
              {currentIndex + 1} / {totalPages}
            </Typography>
            <IconButton
              onClick={handleNextPage}
              disabled={currentIndex === totalPages - 1}
              size="small"
              sx={{ color: "white", "&:disabled": { color: "rgba(255,255,255,0.3)" } }}
            >
              <NavigateNext fontSize="small" />
            </IconButton>
          </Box>
          {onClose && (
            <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Main Content with Scrollbar */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          gap: 2,
        }}
      >
        {loading ? (
          <CircularProgress sx={{ mt: 5 }} />
        ) : errorMessage ? (
          <Typography color="error" sx={{ mt: 5 }}>
            {errorMessage}
          </Typography>
        ) : totalPages > 0 ? (
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {pages.map((canvas, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  mb: 3,
                  bgcolor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                  lineHeight: 0,
                }}
              >
                <div
                  ref={(el) => {
                    if (el && !el.hasChildNodes()) el.appendChild(canvas);
                  }}
                />
                {signatures.map((sig) => {
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
          <Typography sx={{ mt: 5, color: "text.secondary" }}>
            Không có dữ liệu biên bản
          </Typography>
        )}
      </Box>
    </Box>
  );
}
