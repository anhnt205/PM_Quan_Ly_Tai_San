import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Close, PictureAsPdf } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import S3Service from "../../../services/S3Service";

// Config Worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface TaiLieuProp {
  open: boolean;
  onClose: () => void;
  filePath: string;
}

export default function ViewTaiLieu({ open, onClose, filePath }: TaiLieuProp) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tải và render PDF
  useEffect(() => {
    if (!open || !filePath) return;

    let cancelled = false;

    const loadAndRenderPdf = async () => {
      try {
        setLoading(true);
        setError("");
        setPages([]);

        // Tải blob từ S3
        const blob = await S3Service.preview(filePath);

        if (cancelled) return;

        // Chuyển blob thành URL
        const url = URL.createObjectURL(blob);

        // Load PDF
        const pdf = await pdfjsLib.getDocument(url).promise;

        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        // Render tất cả các trang
        const canvases: HTMLCanvasElement[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;

          // Tính toán scale phù hợp với container
          const containerWidth = containerRef.current?.clientWidth || 800;
          const viewport = page.getViewport({ scale: 1 });
          const scale = (containerWidth - 40) / viewport.width;
          const scaledViewport = page.getViewport({ scale });

          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.marginBottom = "16px";
          canvas.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
          canvas.style.borderRadius = "4px";

          await page.render({
            canvasContext: context,
            viewport: scaledViewport,
          }).promise;

          canvases.push(canvas);
        }

        setPages(canvases);

        // Giải phóng URL sau khi load xong
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Lỗi tải PDF:", err);
        if (!cancelled) {
          setError("Không thể tải file PDF. Vui lòng thử lại sau.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAndRenderPdf();

    return () => {
      cancelled = true;
    };
  }, [open, filePath]);

  // Cleanup canvases khi đóng modal
  useEffect(() => {
    return () => {
      pages.forEach((canvas) => {
        canvas.remove();
      });
    };
  }, [pages]);

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
          p: 2,
          background:
            "linear-gradient(to right, rgb(0, 158, 96, 1) 0%, rgb(2, 110, 66, 1) 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              bgcolor: "#f87b38ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <PictureAsPdf fontSize="small" />
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#f3f4f6",
              fontSize: "16px",
            }}
          >
            Xem tài liệu
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        ref={containerRef}
        sx={{
          flex: 1,
          bgcolor: "#e8e0d0",
          p: 3,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography color="error" variant="body1" sx={{ mb: 1 }}>
              {error}
            </Typography>
          </Box>
        ) : pages.length === 0 ? (
          <Typography sx={{ color: "#b8956e" }}>
            Không có nội dung để hiển thị
          </Typography>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: "900px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {pages.map((canvas, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el && !el.hasChildNodes()) {
                    el.appendChild(canvas);
                  }
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              />
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
