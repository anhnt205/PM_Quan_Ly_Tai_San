import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  AppBar,
  Toolbar,
  Paper,
} from "@mui/material";
import { Close, PictureAsPdf } from "@mui/icons-material";
import * as pdfjsLib from "pdfjs-dist";
import api from "../../../../config/api.config";

// --- Config Worker cho PDF.js ---
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface SignDocumentFormProps {
  documents: any; // Chứa dữ liệu hàng từ bảng (có trường tenFile)
  onCancel: () => void;
  onSign: () => void;
  fullscreen?: boolean;
}

export default function SignDocumentForm({
  documents,
  onCancel,
  onSign,
  fullscreen = true,
}: SignDocumentFormProps) {
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // 1. Lấy File PDF từ API dưới dạng Blob để vượt qua vấn đề Auth/CORS
  useEffect(() => {
    const fetchPDF = async () => {
      if (!documents?.tenFile) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Gọi API download file của bạn
        const response = await api.get(
          `/api/upload/download/${documents.tenFile}`,
          {
            responseType: "blob",
          }
        );
        const url = URL.createObjectURL(response.data);
        setPdfUrl(url);
      } catch (error) {
        console.error("Lỗi khi tải file PDF:", error);
        setLoading(false);
      }
    };
    fetchPDF();

    // Cleanup URL khi unmount
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [documents?.tenFile]);

  // 2. Render PDF ra Canvas
  useEffect(() => {
    const renderPDF = async () => {
      if (!pdfUrl) return;

      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const canvases: HTMLCanvasElement[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;

          // Tăng scale để chữ nét hơn giống ảnh mẫu
          const scale = 2;
          const viewport = page.getViewport({ scale });

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          canvases.push(canvas);
        }

        setPages(canvases);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi render PDF:", error);
        setLoading(false);
      }
    };

    if (pdfUrl) renderPDF();
  }, [pdfUrl]);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        bgcolor: "#525659", // Màu nền tối giống các trình xem PDF chuyên nghiệp
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* --- Header: Soạn & Ký Tài Liệu --- */}
      <AppBar
        position="static"
        sx={{ bgcolor: "#ffffff", color: "#333", boxShadow: 1 }}
      >
        <Toolbar
          sx={{ justifyContent: "space-between", minHeight: "56px !important" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PictureAsPdf sx={{ color: "#e53935" }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Soạn & Ký Tài Liệu
            </Typography>
            <Typography variant="body2" sx={{ ml: 2, color: "#666" }}>
              {pages.length} trang
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              startIcon={<PictureAsPdf />}
              variant="text"
              size="small"
              color="primary"
              sx={{ textTransform: "none", fontWeight: "bold" }}
              onClick={onSign}
            >
              Xuất PDF
            </Button>
            <IconButton onClick={onCancel} size="small">
              <Close />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- Nội dung PDF --- */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {loading ? (
          <Box sx={{ mt: 10, textAlign: "center", color: "#fff" }}>
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }}>Đang tải tài liệu...</Typography>
          </Box>
        ) : !pdfUrl ? (
          <Paper sx={{ p: 5, mt: 5 }}>
            <Typography color="error">
              Không tìm thấy tài liệu đính kèm.
            </Typography>
          </Paper>
        ) : (
          pages.map((canvas, index) => (
            <Paper
              key={index}
              elevation={8}
              sx={{
                lineHeight: 0,
                boxShadow: "0 0 15px rgba(0,0,0,0.5)",
                maxWidth: "1000px", // Giới hạn chiều rộng để giống ảnh mẫu
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Box
                ref={(el: HTMLDivElement | null) => {
                  if (el && !el.hasChildNodes()) {
                    // Set style cho canvas để nó co giãn theo Paper
                    canvas.style.width = "100%";
                    canvas.style.height = "auto";
                    el.appendChild(canvas);
                  }
                }}
              />
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
}
