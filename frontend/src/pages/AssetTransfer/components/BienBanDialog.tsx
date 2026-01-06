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

// Config Worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface BienBanDialogProps {
  open: boolean;
  onClose: () => void;
  documentData?: any;
}

export default function BienBanDialog({
  open,
  onClose,
  documentData,
}: BienBanDialogProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfFile = "/sample.pdf";

  // Render PDF
  useEffect(() => {
    if (!open) return;

    const renderPDF = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        console.log("Loading PDF from:", pdfFile);

        const pdf = await pdfjsLib.getDocument(pdfFile).promise;
        console.log("PDF loaded successfully, pages:", pdf.numPages);

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Lỗi không xác định";
        console.error("Error rendering PDF:", error);
        setErrorMessage(errorMsg);
        setLoading(false);
      }
    };

    renderPDF();
  }, [open]);

  // Render current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !containerRef.current) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;

        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(canvas);
      } catch (error) {
        console.error("Error rendering page:", error);
      }
    };

    renderPage();
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
      maxWidth="lg"
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
            <Box
              ref={containerRef}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                flexShrink: 0,
              }}
            />
          </Box>
        ) : (
          <Typography color="error">Không thể tải file PDF</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
