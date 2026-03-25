import React, { useState, useEffect, useRef } from "react";
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
import { Close, PictureAsPdf, Download } from "@mui/icons-material";
import * as pdfjsLib from "pdfjs-dist";
import {
  generateAssetManentancePDF,
  generateAssetPdf,
  generateMonthlyActivityReport,
  generateTransferHistoryPDF,
  mergePdf,
} from "../config";
import AssetInfo from "./AssetEBook/AssetInfo";
import TransferHistoryPage from "./AssetEBook/TransferHistoryPage";
import {
  useAssetHoursByGroupPageQuery,
  useHistoryAssethandoverQuery,
} from "../Mutation";
import HoursAsset from "./AssetEBook/HoursAsset";
import AssetMaintenance from "./AssetEBook/AssetMaintenance";
import AssetEbookCover from "./AssetEBook/AssetEbookCover";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages] = useState(5);
  const [pdfBlob, setPdfBlob] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPdfDoc(null);
      setPdfBlob(null);
      setCurrentPage(1);
      setError(null);
    }
  }, [open]);

  const { data: historyData = { items: [], totalItems: 0 } } =
    useHistoryAssethandoverQuery(
      0,
      999,
      undefined,
      undefined,
      selectedAsset?.id,
    );

  const { data: assetHoursByYear = [] } = useAssetHoursByGroupPageQuery(
    selectedAsset?.id,
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const buildPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const listPdf = [];
        const info = await generateAssetPdf(
          selectedAsset,
          allAssetModel,
          allCurrentStatus,
          assetGroups,
          allDepartments,
          allUnits,
          allReasonIncreases,
        );
        if (info) listPdf.push(info);
        const transfer = await generateTransferHistoryPDF(historyData.items);
        if (transfer) listPdf.push(transfer);
        const activity = await generateMonthlyActivityReport(assetHoursByYear);
        if (activity) listPdf.push(activity);
        const maintenance = await generateAssetManentancePDF([]);
        if (maintenance) listPdf.push(maintenance);

        const merge = await mergePdf(listPdf);
        if (cancelled) return;
        if (!merge) {
          setError("Không thể tạo file PDF.");
          return;
        }
        setPdfBlob(merge);
        const blob = new Blob([merge.buffer as ArrayBuffer], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        const pdf = await pdfjsLib.getDocument(url).promise;
        if (cancelled) return;
        setPdfDoc(pdf);
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
  }, [open, selectedAsset, historyData.totalItems, assetHoursByYear.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      fullScreen
      PaperProps={{
        sx: {
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#e8e0d0",
        },
      }}
    >
      {/* Header chỉ có tiêu đề và nút tải PDF */}
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
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#f3f4f6" }}>
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
              textTransform: "none",
            }}
          >
            Tải PDF
          </Button>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          flex: 1,
          p: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          backgroundImage:
            "radial-gradient(circle at 25% 50%, rgba(0,0,0,0.02) 1%, transparent 1%)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Pagination Cố định & Căn giữa */}
        <Box 
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            bgcolor: "rgba(255, 255, 255, 0.95)", // Tệp màu nền sáng
            backdropFilter: "blur(4px)",
            py: 1.5,
            borderBottom: "1px dashed #009e60",
            display: "flex",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 158, 96, 0.1)",
            gap: 3,
          }}
        >
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            sx={{
              color: "#009e60",
              "&:hover": { bgcolor: "#e8f5e9" },
              "&.Mui-disabled": { color: "#66bb6a" },
              textTransform: "none",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            ← Trang trước
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', color: "#026e42", fontWeight: "bold", fontSize: "16px" }}>
             Trang {currentPage} / {totalPages}
          </Box>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            sx={{
              color: "#009e60",
              "&:hover": { bgcolor: "#e8f5e9" },
              "&.Mui-disabled": { color: "#66bb6a" },
              textTransform: "none",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            Trang sau →
          </Button>
        </Box>
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
              flex: 1,
              py: 4, // Padding top & bottom cho nội dung trang
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start", // Để trang giấy dính top nếu ngắm dài
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "1200px",
                transition: "all 0.3s ease",
                animation: "fadeIn 0.4s ease",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0, transform: "translateY(10px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {currentPage === 1 ? (
                <AssetEbookCover 
                  asset={selectedAsset}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              ) : currentPage === 2 ? (
                <AssetInfo
                  readOnly={readOnly}
                  onEdit={onEdit}
                  onCancel={onCancel}
                  selectedAsset={selectedAsset}
                  onSave={onSave}
                  allAssetModel={allAssetModel}
                  allCurrentStatus={allCurrentStatus}
                  assetGroups={assetGroups}
                  allDepartments={allDepartments}
                  allUnits={allUnits}
                  allReasonIncreases={allReasonIncreases}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              ) : currentPage === 3 ? (
                <TransferHistoryPage
                  readOnly={readOnly}
                  onEdit={onEdit}
                  onCancel={onCancel}
                  asset={selectedAsset}
                  allDepartments={allDepartments}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              ) : currentPage === 4 ? (
                <HoursAsset
                  readOnly={readOnly}
                  onEdit={onEdit}
                  onCancel={onCancel}
                  asset={selectedAsset}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              ) : (
                <AssetMaintenance
                  readOnly={readOnly}
                  onEdit={onEdit}
                  onCancel={onCancel}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssetEbookModal;
