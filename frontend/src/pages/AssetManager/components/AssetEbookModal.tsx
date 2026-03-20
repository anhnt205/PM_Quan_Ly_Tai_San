import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Close,
  PictureAsPdf,
  Download,
} from "@mui/icons-material";
import * as pdfjsLib from "pdfjs-dist";
import { AssetType } from "../types";
import { generateAssetPdf } from "../config";
import AssetInfo from "./AssetEBook/AssetInfo";

// Cấu hình worker cho pdf.js (chỉ chạy ở client)
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface AssetEbookModalProps {
  open: boolean;
  onClose: () => void;
  asset: AssetType;
}

const AssetEbookModal = ({
  open,
  onClose,
  onEdit,
  onCancel,
  selectedAsset,
  readOnly,
  onSave,
  allAssetModel,
  allCurrentStatus,
  assetGroups,
  allDepartments,
  allUnits,
  allReasonIncreases,
}: {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
  selectedAsset?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  allAssetModel: any[];
  allCurrentStatus: any[];
  assetGroups: any[];
  allDepartments: any[];
  allUnits: any[];
  allReasonIncreases: any[];
}) => {
  const [currentPage, setCurrentPage] = useState(1); // Bắt đầu từ trang 1
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang PDF
  const [pdfBlob, setPdfBlob] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!open) {
      // Reset state khi đóng modal
      setPdfDoc(null);
      setTotalPages(0);
      setPdfBlob(null);
      setCurrentPage(1);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return; // chỉ chạy khi modal mở
    let cancelled = false;
    const buildPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const bytes = await generateAssetPdf(selectedAsset);
        if (cancelled) return;
        setPdfBlob(bytes);
        const blob = new Blob([bytes.buffer as ArrayBuffer], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        const pdf = await pdfjsLib.getDocument(url).promise;
        if (cancelled) return;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        URL.revokeObjectURL(url);
      } catch (err) {
        if (cancelled) return;
        setError("Không thể tạo file PDF.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    buildPdf();
    return () => {
      cancelled = true;
    };
  }, [open, selectedAsset]); // thêm open để chạy lại mỗi khi mở modal

  // Render trang PDF hiện tại
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let cancelled = false;
    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (cancelled) return;

        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;

        // Tính tỉ lệ để vừa khung chứa
        const container = canvas.parentElement;
        if (!container) return;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          containerWidth / viewport.width,
          containerHeight / viewport.height,
        );
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.width = "100%";
        canvas.style.height = "auto";

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise;
      } catch (error: any) {
        if (cancelled) return;
        console.error("Lỗi render trang PDF:", error);
        setError("Không thể hiển thị trang PDF.");
      }
    };
    renderPage();
    return () => {
      cancelled = true;
    };
  }, [pdfDoc, currentPage]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDownloadPdf = () => {
    if (!pdfBlob) return;
    const blob = new Blob([pdfBlob.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TaiSan_${selectedAsset.soThe}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
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
          p: 3,
          background:
            "linear-gradient(to right, rgb(0, 158, 96, 1) 0%, rgb(2, 110, 66, 1) 100%)",
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
            }}
          >
            <PictureAsPdf />
            <img src="/pdf-icon.png" alt="PDF Icon" width="24" height="24" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#f3f4f6" }}>
            Sổ tài sản điện tử
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadPdf}
            disabled={!pdfBlob}
            sx={{
              bgcolor: "#ff8400ff",
              color: "white",
              "&:hover": { bgcolor: "#e67300" },
            }}
          >
            Tải PDF
          </Button>

          <IconButton
            onClick={handlePrev}
            disabled={currentPage === 1}
            sx={{ color: "white" }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            sx={{ color: "white", minWidth: 80, textAlign: "center" }}
          >
            {currentPage} / {totalPages}
          </Typography>
          <IconButton
            onClick={handleNext}
            disabled={currentPage === totalPages}
            sx={{ color: "white" }}
          >
            <ArrowForward />
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          flex: 1,
          bgcolor: "#f5f5f5",
          p: 2,
          overflow: "hidden",
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
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              overflow: "auto",
            }}
          >
            <AssetInfo
              selectedAsset={selectedAsset}
              onSave={onSave}
              allAssetModel={allAssetModel}
              allCurrentStatus={allCurrentStatus}
              assetGroups={assetGroups}
              allDepartments={allDepartments}
              allUnits={allUnits}
              allReasonIncreases={allReasonIncreases}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssetEbookModal;
