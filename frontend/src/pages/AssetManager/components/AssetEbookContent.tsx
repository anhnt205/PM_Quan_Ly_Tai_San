import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Download, PictureAsPdf, Close, Fullscreen, FullscreenExit } from "@mui/icons-material";
import {
  generateAssetManentancePDF,
  generateAssetPdf,
  generateAssetCoverPDF,
  generateMonthlyActivityReport,
  generateTransferHistoryPDF,
  generateSparePartsPDF,
  generateMaintenanceMonthlyPDF,
  mergePdf,
} from "../config";
import AssetInfo from "./AssetEBook/AssetInfo";
import TransferHistoryPage from "./AssetEBook/TransferHistoryPage";
import {
  useAssetHoursPageQuery,
  useHistoryAssethandoverQuery,
} from "../Mutation";
import HoursAsset from "./AssetEBook/HoursAsset";
import AssetMaintenance from "./AssetEBook/AssetMaintenance";
import AssetEbookCover from "./AssetEBook/AssetEbookCover";
import SparePartsPage from "./AssetEBook/SparePartsPage";
import MaintenanceMonthlyPage from "./AssetEBook/MaintenanceMonthlyPage";
import * as pdfjsLib from "pdfjs-dist";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface AssetEbookContentProps {
  selectedAsset: any;
  readOnly?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onClose: () => void;
  onSave: (values: any) => void;
  allAssetModel: any[];
  allCurrentStatus: any[];
  assetGroups: any[];
  allDepartments: any[];
  allUnits: any[];
  allReasonIncreases: any[];
}

const AssetEbookContent = ({
  selectedAsset,
  readOnly,
  onEdit,
  onCancel,
  onClose,
  onSave,
  allAssetModel,
  allCurrentStatus,
  assetGroups,
  allDepartments,
  allUnits,
  allReasonIncreases,
}: AssetEbookContentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages] = useState(7);
  const [pdfBlob, setPdfBlob] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setPdfDoc(null);
    setPdfBlob(null);
    setCurrentPage(1);
    setError(null);
  }, [selectedAsset?.id]);

  const { data: historyData = { items: [], totalItems: 0 } } =
    useHistoryAssethandoverQuery(
      0,
      999,
      undefined,
      undefined,
      selectedAsset?.id,
    );

  const { data: assetHoursPage = { items: [], totalItems: 0 } } =
    useAssetHoursPageQuery(0, 999, selectedAsset?.id);

  useEffect(() => {
    if (!selectedAsset) return;
    let cancelled = false;
    const buildPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const listPdf = [];

        // Trang 1: Bìa
        const cover = await generateAssetCoverPDF(selectedAsset);
        if (cover) listPdf.push(cover);

        // Trang 2: Thông tin tài sản
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

        // Trang 3: Theo dõi di chuyển lắp đặt máy
        const transfer = await generateTransferHistoryPDF(historyData.items);
        if (transfer) listPdf.push(transfer);

        // Trang 4: Bảng kê các phụ tùng chính của máy
        const spareParts = await generateSparePartsPDF([]);
        if (spareParts) listPdf.push(spareParts);

        // Trang 5: Giờ (km) hoạt động theo năm
        const activity = await generateMonthlyActivityReport(
          assetHoursPage.items,
        );
        if (activity) listPdf.push(activity);

        // Trang 6: Theo dõi tình hình sự cố xảy ra hàng tháng
        const incident = await generateAssetManentancePDF([]);
        if (incident) listPdf.push(incident);

        // Trang 7: Theo dõi sửa chữa máy từng tháng
        const maintenanceMonthly = await generateMaintenanceMonthlyPDF([]);
        if (maintenanceMonthly) listPdf.push(maintenanceMonthly);

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
  }, [selectedAsset, historyData.totalItems, assetHoursPage.totalItems]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onCancel();
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
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: isFullscreen ? "100vh" : "100%",
        width: isFullscreen ? "100vw" : "100%",
        position: isFullscreen ? "fixed" : "relative",
        top: isFullscreen ? 0 : "unset",
        left: isFullscreen ? 0 : "unset",
        zIndex: isFullscreen ? 1300 : 1,
        bgcolor: "white",
        overflow: "hidden",
      }}
    >
      {/* Header bar như cũ */}
      <Box
        sx={{
          p: 2,
          background:
            "linear-gradient(to right, rgb(0, 158, 96, 1) 0%, rgb(2, 110, 66, 1) 100%)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
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
            variant="h6"
            sx={{ fontWeight: 700, color: "#f3f4f6", fontSize: "16px" }}
          >
            Sổ tài sản điện tử
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadPdf}
            disabled={!pdfBlob}
            sx={{
              textTransform: "none",
              bgcolor: "white",
              color: "#026e42",
              fontWeight: 600,
              "&:hover": { bgcolor: "#f3f4f6" },
            }}
          >
            Tải PDF
          </Button>
          <IconButton
            onClick={() => setIsFullscreen(!isFullscreen)}
            sx={{ color: "white" }}
            title={isFullscreen ? "Thu nhỏ" : "Phóng to"}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Pagination */}
      <Box
        sx={{
          zIndex: 10,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(4px)",
          py: 1,
          borderBottom: "1px dashed #009e60",
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          size="small"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          sx={{ color: "#009e60", textTransform: "none" }}
        >
          ← Trước
        </Button>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#026e42",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {currentPage} / {totalPages}
        </Box>
        <Button
          size="small"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          sx={{ color: "#009e60", textTransform: "none" }}
        >
          Sau →
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          bgcolor: "#e8e0d0",
          p: 2,
          backgroundImage:
            "radial-gradient(circle at 25% 50%, rgba(0,0,0,0.02) 1%, transparent 1%)",
          backgroundSize: "20px 20px",
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress size={30} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 4 }}>
            {error}
          </Typography>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: "1000px",
              margin: "0 auto",
              "& > div": { width: "100%" }, // Ensure child pages take full width
            }}
          >
            {currentPage === 1 && (
              <AssetEbookCover
                asset={selectedAsset}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
            {currentPage === 2 && (
              <AssetInfo
                readOnly={readOnly}
                onEdit={onEdit}
                onCancel={onCancel}
                onClose={onClose}
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
            )}
            {currentPage === 3 && (
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
            )}
            {currentPage === 4 && (
              <SparePartsPage
                asset={selectedAsset}
                readOnly={readOnly}
                onEdit={onEdit}
                onCancel={onCancel}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
            {currentPage === 5 && (
              <HoursAsset
                readOnly={readOnly}
                onEdit={onEdit}
                onCancel={onCancel}
                asset={selectedAsset}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                allDepartments={allDepartments}
              />
            )}
            {currentPage === 6 && (
              <AssetMaintenance
                readOnly={readOnly}
                onEdit={onEdit}
                onCancel={onCancel}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
            {currentPage === 7 && (
              <MaintenanceMonthlyPage
                asset={selectedAsset}
                readOnly={readOnly}
                onEdit={onEdit}
                onCancel={onCancel}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AssetEbookContent;
