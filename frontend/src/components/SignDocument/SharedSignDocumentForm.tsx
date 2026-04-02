// ============================================================
// THAY ĐỔI 1: Trong handleSign và handleConfirmPinDialog
// Thêm widthRatio khi tạo newSignature
// ============================================================

// Trong handleSign — thay dòng width: 120 bằng:
//
//   const displayWidth = canvasDisplaySizes[0]?.width || 800;
//   widthRatio: 120 / displayWidth,   // lưu tỉ lệ, không lưu px tuyệt đối
//   width: 120,                        // giữ lại để tương thích export PDF
//
// Tương tự trong handleConfirmPinDialog.

// ============================================================
// THAY ĐỔI 2: Pass setCanvasDisplaySizes xuống PdfViewer
// ============================================================
//
// <PdfViewer
//   pages={pages}
//   signatures={signatures}
//   canvasDisplaySizes={canvasDisplaySizes}
//   setCanvasDisplaySizes={setCanvasDisplaySizes}   // ← THÊM DÒNG NÀY
//   digitalSignatureMap={digitalSignatureMap}
//   handleUpdatePosition={handleUpdatePosition}
//   handleUpdateScale={handleUpdateScale}
//   handleDeleteSignature={handleDeleteSignature}
// />

// ============================================================
// THAY ĐỔI 3: Xóa useEffect ResizeObserver cũ trong SharedSignDocumentForm
// (vì PdfViewer tự quản lý việc observe canvas của nó)
// ============================================================
//
// XÓA đoạn này:
//
// useEffect(() => {
//   if (pages.length === 0) return;
//   const observer = new ResizeObserver(() => {
//     const sizes = pages.map((canvas) => ({
//       width: canvas.getBoundingClientRect().width || canvas.width,
//       height: canvas.getBoundingClientRect().height || canvas.height,
//     }));
//     setCanvasDisplaySizes(sizes);
//   });
//   pages.forEach((canvas) => observer.observe(canvas));
//   return () => observer.disconnect();
// }, [pages]);

// ============================================================
// File đầy đủ với tất cả thay đổi đã áp dụng:
// ============================================================

import {
  Box,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import "../../assets/fonts/times_new_roman-normal";
import { findById, generateSha256 } from "../../utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { SignaturesData } from "./types";
import dayjs from "dayjs";
import { showErrorAlert } from "../Alert";
import axios from "axios";
import { ConfirmPin } from "./ConfirmPin";
import { SignHeader } from "./SignHeader";
import CollapsibleSidebar from "./CollapsibleSidebar";
import SidebarContent from "./SidebarContent";
import { PdfViewer } from "./PdfViewer";
import renderDigitalSignatureToImage from "./DigitalSignatureToImage";
import S3Service from "../../services/S3Service";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface SharedSignDocumentFormProps {
  idTaiLieu: string;
  pdfUrl: string | null;
  initialSignatures?: SignaturesData[];
  onSign: (data: SignaturesData[], pdfBlob: Blob) => Promise<void>;
  onCancel: () => void;
  title?: string;
  staffs: any[];
  canUserSign: (type: number, currentSignatures: SignaturesData[]) => boolean;
  fullscreen?: boolean;
  showSignerSidebar?: boolean;
  sourcePdfBytes?: Uint8Array | null;
}

export default function SharedSignDocumentForm({
  idTaiLieu,
  pdfUrl,
  initialSignatures = [],
  onSign,
  onCancel,
  title,
  staffs,
  canUserSign: canUserSignFunc,
  fullscreen = true,
  showSignerSidebar = true,
  sourcePdfBytes: externalSourcePdfBytes,
}: SharedSignDocumentFormProps) {
  const [signatureType, setSignatureType] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const employee = findById(staffs, user?.taiKhoan?.tenDangNhap);
  const hasAutoSigned = useRef(false);

  const [signatures, setSignatures] =
    useState<SignaturesData[]>(initialSignatures);
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [digitalSignatureMap, setDigitalSignatureMap] = useState<
    Record<string, string>
  >({});
  const [openConfirmPin, setOpenConfirmPin] = useState(false);
  const [canvasDisplaySizes, setCanvasDisplaySizes] = useState<
    { width: number; height: number }[]
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (initialSignatures.length > 0) {
      setSignatures(initialSignatures);
    }
  }, [initialSignatures]);

  const handleLogin = async () => {
    const url = "https://rms.efy.com.vn/clients/login";
    const payload = {
      username: "rp_test",
      password: "rp_test",
      rpCode: "RP_TEST",
    };
    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data.token;
    } catch (error) {
      console.log("Đăng nhập thất bại!", error);
      return null;
    }
  };

  const handleSigning = async (idNguoiKy: string, idTaiLieu: string) => {
    const value = idNguoiKy + idTaiLieu;
    const hash = generateSha256(value);
    const token = await handleLogin();
    if (!token) {
      showErrorAlert("Đăng nhập thất bại!. Không thể ký");
      return null;
    }
    const url = "https://rms.efy.com.vn/signing/hash";
    const payload = {
      agreementUUID: "02e80096-912a-4b30-a38e-334ddc110a1e",
      authMode: "EXPLICIT/PIN",
      authorizeCode: "efyvn@123",
      encryption: "RSA",
      hash: hash,
      hashAlgorithm: "SHA-256",
      mimeType: "application/sha256-binary",
    };
    try {
      const result = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return result.data.signatureValue;
    } catch (error) {
      showErrorAlert("Ký không thành công!");
      return null;
    }
  };

  const handleConfirmPinDialog = async (pin: string) => {
    if (employee?.pin !== pin) {
      showErrorAlert("Mã pin không chính xác!");
      return;
    }

    setOpenConfirmPin(false);
    const result = await handleSigning(
      user?.taiKhoan?.tenDangNhap,
      "document-id",
    );

    if (!result) return;

    // [FIX] Lưu widthRatio thay vì px tuyệt đối
    const displayWidth = canvasDisplaySizes[0]?.width || 800;
    const baseWidthPx = 120;

    const newSignature: SignaturesData = {
      stt: signatures.length + 1,
      id: `temp-${Date.now()}`,
      idTaiLieu: idTaiLieu,
      idNguoiKy: user?.taiKhoan?.tenDangNhap,
      loaiKy: signatureType,
      ngayKy: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      x: 0.2,
      y: 0.8,
      chuKyNhay:
        (signatureType === 1 || signatureType === 5) && employee.chuKyNhay,
      chuKyThuong:
        (signatureType === 2 || signatureType === 4) && employee.chuKyThuong,
      width: baseWidthPx,
      widthRatio: baseWidthPx / displayWidth, // [FIX] tỉ lệ không đổi khi resize
      scale: 1,
      chuKySo: result,
      isLocked: false,
    };

    setSignatures((prev) => [...prev, newSignature]);
  };

  const handleSign = async () => {
    if (!employee) return;
    if (!employee.chuKyNhay && !employee.chuKyThuong && !employee.chuKySo) {
      return showErrorAlert("Không tìm thấy chữ ký");
    }
    if (signatureType === 0) {
      return showErrorAlert("Chưa chọn chữ ký");
    }

    if (!canUserSignFunc(signatureType, signatures)) {
      const hasDigitalSignature = signatures.some((img) =>
        [3, 4, 5].includes(img.loaiKy),
      );
      const errorMessage =
        hasDigitalSignature && ![3, 4, 5].includes(signatureType)
          ? "Tài liệu đã có chữ ký số, bạn chỉ có thể ký bằng chữ ký số!"
          : "Bạn đã ký tài liệu này rồi, không thể ký thêm!";
      showErrorAlert(errorMessage);
      return;
    }

    let key = "";
    if ([3, 4, 5].includes(signatureType)) {
      if (!employee.savePin) {
        setOpenConfirmPin(true);
        return;
      }
      const result = await handleSigning(
        user?.taiKhoan?.tenDangNhap,
        "document-id",
      );
      if (!result) return;
      key = result;
    }

    // [FIX] Lưu widthRatio thay vì px tuyệt đối
    const displayWidth = canvasDisplaySizes[0]?.width || 800;
    const baseWidthPx = 120;

    const newSignature: SignaturesData = {
      stt: signatures.length + 1,
      id: `temp-${Date.now()}`,
      idTaiLieu: idTaiLieu,
      idNguoiKy: user?.taiKhoan?.tenDangNhap,
      loaiKy: signatureType,
      ngayKy: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      x: 0.2,
      y: 0.8,
      chuKyNhay:
        (signatureType === 1 || signatureType === 5) && employee.chuKyNhay,
      chuKyThuong:
        (signatureType === 2 || signatureType === 4) && employee.chuKyThuong,
      width: baseWidthPx,
      widthRatio: baseWidthPx / displayWidth, // [FIX]
      scale: signatureType === 2 || signatureType === 4 ? 2 : 1,
      chuKySo: key,
      isLocked: false,
    };

    setSignatures([...signatures, newSignature]);
  };

  useEffect(() => {
    if (employee && !hasAutoSigned.current && signatures.length === 0) {
      if (employee.kySo) {
        if (employee.kyThuong) setSignatureType(4);
        else if (employee.kyNhay) setSignatureType(5);
        else setSignatureType(3);
      } else {
        if (employee.kyThuong) setSignatureType(2);
        else if (employee.kyNhay) setSignatureType(1);
      }
    }
  }, [employee, signatures.length]);

  useEffect(() => {
    const renderDigitalSignatures = async () => {
      const newMap: Record<string, string> = {};
      for (const sig of signatures) {
        if (sig.loaiKy === 3 && !digitalSignatureMap[sig.id]) {
          const signer = findById(staffs, sig.idNguoiKy);
          const base64 = await renderDigitalSignatureToImage(
            signer?.hoTen,
            dayjs(sig.ngayKy).format("DD/MM/YYYY"),
          );
          newMap[sig.id] = base64;
        }
      }
      if (Object.keys(newMap).length > 0) {
        setDigitalSignatureMap((prev) => ({ ...prev, ...newMap }));
      }
    };
    renderDigitalSignatures();
  }, [signatures, staffs]);

  const handleUpdatePosition = (
    id: string,
    newXRatio: number,
    newYRatio: number,
  ) => {
    setSignatures((prev) =>
      prev.map((sig) =>
        sig.id === id ? { ...sig, x: newXRatio, y: newYRatio } : sig,
      ),
    );
  };

  const handleUpdateScale = (id: string, newScale: number) => {
    setSignatures((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, scale: newScale } : sig)),
    );
  };

  const handleDeleteSignature = (id: string) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id));
  };

  const handleConfirmSign = async () => {
    const newSignatures = signatures.filter((i) => !i.isLocked);
    if (newSignatures.length === 0) {
      return showErrorAlert("Chưa có chữ ký nào để lưu");
    }

    setLoading(true);
    try {
      if (!pdfUrl) throw new Error("Không có dữ liệu PDF để xử lý");
      const existingPdfBytes = await fetch(pdfUrl).then((res) =>
        res.arrayBuffer(),
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width: pageWidth, height: pageHeight } = firstPage.getSize();

      for (const sig of signatures) {
        let imageBytes: ArrayBuffer | undefined;
        if (sig.loaiKy === 3) {
          const base64Data = digitalSignatureMap[sig.id];
          if (!base64Data) continue;
          const base64Content = base64Data.split(",")[1];
          const binaryString = window.atob(base64Content);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          imageBytes = bytes.buffer;
        } else {
          const imgPath = sig.chuKyNhay || sig.chuKyThuong;
          if (!imgPath) continue;
          const s3Url = await S3Service.presignedGetUrl(imgPath);
          if (!s3Url) continue;
          const response = await fetch(s3Url);
          if (!response.ok) continue;
          imageBytes = await response.arrayBuffer();
        }

        if (imageBytes) {
          const pdfImage = await pdfDoc.embedPng(imageBytes);

          // [FIX] Dùng widthRatio để tính kích thước trong PDF — không phụ thuộc displayWidth
          const effectiveWidthRatio =
            sig.widthRatio ??
            (sig.width * (sig.scale || 1)) /
              (canvasDisplaySizes[0]?.width || 800);
          const pdfImageWidth =
            effectiveWidthRatio * (sig.scale || 1) * pageWidth;
          const pdfImageHeight =
            (pdfImage.height / pdfImage.width) * pdfImageWidth;
          const x = sig.x * pageWidth;
          const y = pageHeight - sig.y * pageHeight - pdfImageHeight;

          firstPage.drawImage(pdfImage, {
            x,
            y,
            width: pdfImageWidth,
            height: pdfImageHeight,
          });
        }
      }

      const finalPdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([finalPdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });

      await onSign(newSignatures, pdfBlob);
      setOpenSnackbar(true);
    } catch (error: any) {
      console.error("Lỗi khi ký và cập nhật file:", error);
      showErrorAlert(
        `Có lỗi xảy ra: ${error.message || "Không thể ký và cập nhật file."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setLoading(true);
    try {
      const sourceBytes =
        externalSourcePdfBytes ||
        (pdfUrl ? await fetch(pdfUrl).then((res) => res.arrayBuffer()) : null);
      if (!sourceBytes) throw new Error("Không có dữ liệu để xuất");

      const pdfDoc = await PDFDocument.load(sourceBytes);
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();

      for (const sig of signatures) {
        let imageBytes: ArrayBuffer | undefined;
        if (sig.loaiKy === 3) {
          const base64 = digitalSignatureMap[sig.id];
          if (!base64) continue;
          const bin = atob(base64.split(",")[1]);
          imageBytes = Uint8Array.from(bin, (c) => c.charCodeAt(0)).buffer;
        } else {
          const path = sig.chuKyNhay || sig.chuKyThuong;
          if (!path) continue;
          const s3Url = await S3Service.presignedGetUrl(path);
          if (!s3Url) continue;
          const response = await fetch(s3Url);
          if (!response.ok) continue;
          imageBytes = await response.arrayBuffer();
        }

        if (imageBytes) {
          const img = await pdfDoc.embedPng(imageBytes);
          // [FIX] Dùng widthRatio
          const effectiveWidthRatio =
            sig.widthRatio ??
            (sig.width * sig.scale) / (canvasDisplaySizes[0]?.width || 800);
          const pdfW = effectiveWidthRatio * sig.scale * width;
          const pdfH = (img.height / img.width) * pdfW;
          page.drawImage(img, {
            x: sig.x * width,
            y: height - sig.y * height - pdfH,
            width: pdfW,
            height: pdfH,
          });
        }
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `TaiLieuKy_${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setOpenSnackbar(true);
    } catch (e: any) {
      console.error(e);
      setPdfError("Xuất PDF thất bại");
    } finally {
      setLoading(false);
    }
  };

  // --- Render PDF ---
  useEffect(() => {
    const renderPDF = async () => {
      if (!pdfUrl) return;
      try {
        setLoading(true);
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const canvases: HTMLCanvasElement[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          const viewport = page.getViewport({ scale: 1.5 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          canvas.dataset.page = i.toString();
          await page.render({ canvasContext: context, viewport }).promise;
          canvases.push(canvas);
        }
        setPages(canvases);
        setPdfError(null);
      } catch (error: any) {
        setPdfError(`Lỗi đọc PDF: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    renderPDF();
  }, [pdfUrl]);

  // [FIX] Xóa ResizeObserver cũ ở đây — PdfViewer tự quản lý observe canvas DOM thực

  const sidebarProps = {
    signatureType,
    setSignatureType,
    employee,
    handleSign,
    handleConfirmSign,
    onCancel,
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: fullscreen ? "100vh" : "100%",
        bgcolor: "#f5f5f5",
        ...(fullscreen && { position: "fixed", inset: 0, zIndex: 9999 }),
      }}
    >
      <SignHeader
        pagesCount={pages.length}
        handleExportPDF={handleExportPDF}
        onCancel={() => {
          onCancel();
          setSignatures([]);
        }}
        title={title}
      />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          flexDirection: isMobile ? "column-reverse" : "row",
        }}
      >
        {showSignerSidebar &&
          (isMobile ? (
            <CollapsibleSidebar>
              <SidebarContent
                {...sidebarProps}
                onCancel={() => {
                  onCancel();
                  setSignatures([]);
                }}
              />
            </CollapsibleSidebar>
          ) : (
            <Paper
              elevation={6}
              sx={{
                width: 320,
                p: 2,
                borderRight: "1px solid #e0e0e0",
                height: "100%",
                overflowY: "auto",
              }}
            >
              <SidebarContent
                {...sidebarProps}
                onCancel={() => {
                  onCancel();
                  setSignatures([]);
                }}
              />
            </Paper>
          ))}

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
          {pdfError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {pdfError}
            </Alert>
          )}
          {loading ? (
            <CircularProgress sx={{ mt: 10 }} />
          ) : (
            <PdfViewer
              pages={pages}
              signatures={signatures}
              canvasDisplaySizes={canvasDisplaySizes}
              setCanvasDisplaySizes={setCanvasDisplaySizes} // [FIX] thêm dòng này
              digitalSignatureMap={digitalSignatureMap}
              handleUpdatePosition={handleUpdatePosition}
              handleUpdateScale={handleUpdateScale}
              handleDeleteSignature={handleDeleteSignature}
            />
          )}
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Thành công</Alert>
      </Snackbar>

      <ConfirmPin
        open={openConfirmPin}
        onClose={() => setOpenConfirmPin(false)}
        onConfirm={handleConfirmPinDialog}
      />
    </Box>
  );
}
