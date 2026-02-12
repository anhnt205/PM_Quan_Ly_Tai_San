import {
  Box,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useAssetHandoverMutation } from "../Mutation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import "../../../assets/fonts/times_new_roman-normal";
import "../../../assets/fonts/times_new_roman-bold";
import { findById, formatted, generateSha256 } from "../../../utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { AssetHandoverData, SignaturesData } from "../types";
import dayjs from "dayjs";
import { showErrorAlert } from "../../../components/Alert";
import { canUserSign, generateBienBanPdf } from "../config";
import axios from "axios";
import { ConfirmPin } from "../../AssetTransfer/components/ConfirmPin";
import CollapsibleSidebar from "../../../components/SignDocument/CollapsibleSidebar";
import SidebarContent from "../../../components/SignDocument/SidebarContent";
import { PdfViewer } from "../../../components/SignDocument/PdfViewer";
import { SignHeader } from "../../../components/SignDocument/SignHeader";

import renderDigitalSignatureToImage from "../../../components/SignDocument/DigitalSignatureToImage";
import S3Service from "../../../services/S3Service";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}
interface SignDocumentFormProps {
  selectedIds: string[];
  onCancel: () => void;
  onSign: (data: SignaturesData[], assetHandover: AssetHandoverData) => void;
  fullscreen?: boolean;
  showSignerSidebar?: boolean;
  assetHandover: AssetHandoverData;
  allUnits?: any[];
  staffs?: any[];
  departments?: any[];
  positions?: any[];
  handleSignatureList?: (idTaiLieu: string) => Promise<any>;
  document?: File | string | any;
  bangKe?: File | string | any;
  previewDocument?: boolean;
  isEdit?: boolean;
}

export default function SignDocumentForm({
  selectedIds,
  onCancel,
  onSign,
  fullscreen = true,
  showSignerSidebar = true,
  assetHandover,
  allUnits = [],
  staffs = [],
  departments = [],
  positions = [],
  handleSignatureList,
  document: documentUrl,
  bangKe,
  previewDocument = false,
  isEdit,
}: SignDocumentFormProps) {
  const [signatureType, setSignatureType] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const employee = findById(staffs, user?.taiKhoan?.tenDangNhap);
  // State quản lý danh sách chữ ký
  const [signatures, setSignatures] = useState<SignaturesData[]>([]);

  // State quản lý Canvas và Loading
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [digitalSignatureMap, setDigitalSignatureMap] = useState<
    Record<string, string>
  >({});
  const [openConfirmPin, setOpenConfirmPin] = useState(false);
  const [sourcePdfBytes, setSourcePdfBytes] = useState<Uint8Array | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [sidebarHeight, setSidebarHeight] = useState(250);
  const isDraggingSidebar = useRef(false);
  const startYSidebar = useRef(0);
  const startHeightSidebar = useRef(0);

  // login ký
  const handleLogin = async () => {
    const url = "https://rms.efy.com.vn/clients/login";
    const payload = {
      username: "rp_test",
      password: "rp_test",
      rpCode: "RP_TEST",
    };
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const token = response.data.token;
      console.log("Đăng nhập thành công!");
      return token;
    } catch (error) {
      console.log("Đăng nhập thất bại!", error);
    }
  };

  // ký hash

  const handleSigning = async (idNguoiKy: string, idTaiLieu: string) => {
    const value = idNguoiKy + idTaiLieu;
    const hash = generateSha256(value);
    const token = await handleLogin();
    if (token === null) {
      showErrorAlert("Đăng nhập thất bại!. Không thể ký");
      return;
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
      console.log(result);
      return result.data.signatureValue;
    } catch (error) {
      console.log(error);
      return showErrorAlert("Ký không thành công!");
    }
  };

  // State để tracking kích thước hiển thị thực tế của các canvas pages
  const [canvasDisplaySizes, setCanvasDisplaySizes] = useState<
    { width: number; height: number }[]
  >([]);

  // Ref chứa container để xử lý scroll
  const containerRef = useRef<HTMLDivElement>(null);

  const handleConfirmPinDialog = async (pin: string) => {
    if (employee.pin !== pin) {
      showErrorAlert("Mã pin không chính xác!");
      return;
    }

    setOpenConfirmPin(false);

    // 👉 tiếp tục ký số
    const result = await handleSigning(
      user?.taiKhoan?.tenDangNhap,
      selectedIds[0],
    );

    if (!result) {
      showErrorAlert("Ký không thành công!");
      return;
    }

    // thêm chữ ký số
    const newSignature: SignaturesData = {
      stt: signatures.length + 1,
      id: `temp-${Date.now()}`,
      idTaiLieu: selectedIds[0],
      idNguoiKy: user?.taiKhoan?.tenDangNhap,
      loaiKy: signatureType,
      ngayKy: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      x: 0.5, // Giữa trang theo chiều ngang
      y: 0.2, // Vị trí dọc chuẩn hóa
      chuKyNhay:
        (signatureType === 1 || signatureType === 5) && employee.chuKyNhay,
      chuKyThuong:
        (signatureType === 2 || signatureType === 4) && employee.chuKyThuong,
      width: 120,
      scale: 1,
      chuKySo: result,
      isLocked: false,
    };

    setSignatures((prev) => [...prev, newSignature]);
  };

  // 2. Sửa hàm handleConfirmSign để tính Y chuẩn hóa
  const handleSign = async () => {
    if (!employee) return;

    if (signatureType === 0) {
      return showErrorAlert("Chưa chọn chữ ký");
    }
    const hasDigitalSignature = signatures.some(
      (img) => img.loaiKy === 3 || img.loaiKy === 4 || img.loaiKy === 5,
    );

    // Kiểm tra quyền ký
    if (!canUserSign(signatureType, signatures)) {
      let errorMessage;
      if (
        hasDigitalSignature &&
        signatureType !== 3 &&
        signatureType !== 4 &&
        signatureType !== 5
      ) {
        errorMessage =
          "Tài liệu đã có chữ ký số, bạn chỉ có thể ký bằng chữ ký số!";
      } else {
        errorMessage = "Bạn đã ký tài liệu này rồi, không thể ký thêm!";
      }

      showErrorAlert(errorMessage);
      return;
    }
    let key = "";
    if (signatureType === 3 || signatureType === 4 || signatureType === 5) {
      if (!employee.savePin) {
        setOpenConfirmPin(true);
        return;
      }
      const result = await handleSigning(
        user?.taiKhoan?.tenDangNhap,
        selectedIds[0],
      );
      if (!result) {
        return showErrorAlert("Ký không thành công!");
      }
      key = result;
    }

    const newSignature: SignaturesData = {
      stt: signatures.length + 1,
      id: `temp-${Date.now()}`,
      idTaiLieu: selectedIds[0],
      idNguoiKy: user?.taiKhoan?.tenDangNhap,
      loaiKy: signatureType,
      ngayKy: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      x: 0.5, // Giữa trang theo chiều ngang
      y: 0.2, // Vị trí dọc chuẩn hóa
      chuKyNhay:
        (signatureType === 1 || signatureType === 5) && employee.chuKyNhay,
      chuKyThuong:
        (signatureType === 2 || signatureType === 4) && employee.chuKyThuong,
      width: 120,
      scale: 1,
      chuKySo: key,
      isLocked: false,
    };

    setSignatures([...signatures, newSignature]);
  };

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

  // 3. Cập nhật hàm xử lý vị trí (Nhận ratio thay vì pixel)
  const handleUpdatePosition = (
    id: string,
    newXRatio: number,
    newYRatio: number,
  ) => {
    console.log("Updated Position (Normalized):", newXRatio, newYRatio);
    setSignatures((prev) =>
      prev.map((sig) =>
        sig.id === id ? { ...sig, x: newXRatio, y: newYRatio } : sig,
      ),
    );
  };
  const handleUpdateScale = (id: string, newScale: number) => {
    console.log("scale", newScale);
    setSignatures((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, scale: newScale } : sig)),
    );
  };

  const handleConfirmSign = async () => {
    const newSignatures = signatures.filter((i) => !i.isLocked);
    if (newSignatures.length === 0) {
      return showErrorAlert("Chưa có chữ ký nào để lưu");
    }

    setLoading(true);
    try {
      // Step 1: Generate new PDF with all signatures burned in.
      if (!pdfUrl) throw new Error("Không có dữ liệu PDF để xử lý");

      const existingPdfBytes = await fetch(pdfUrl).then((res) =>
        res.arrayBuffer(),
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width: pageWidth, height: pageHeight } = firstPage.getSize();
      const displayWidth = canvasDisplaySizes[0]?.width || 800;

      for (const sig of signatures) {
        let imageBytes: ArrayBuffer | undefined;
        try {
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

          if (!imageBytes) continue;

          const pdfImage = await pdfDoc.embedPng(imageBytes);
          const widthRatio = (sig.width * (sig.scale || 1)) / displayWidth;
          const pdfImageWidth = widthRatio * pageWidth;
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
        } catch (err) {
          console.error(`Không thể chèn chữ ký ${sig.id}:`, err);
        }
      }

      const finalPdfBytes = await pdfDoc.save();

      // Step 2: Save signature metadata and pass the new file bytes to the parent
      await onSign(newSignatures, assetHandover);
      const pdfBlob = new Blob([finalPdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      await S3Service.updatePresignedPutUrl(bangKe, pdfBlob);

      setOpenSnackbar(true);
      onCancel();
    } catch (error: any) {
      console.error("Lỗi khi ký và cập nhật file:", error);
      showErrorAlert(
        `Có lỗi xảy ra: ${error.message || "Không thể ký và cập nhật file."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Lấy PDF từ backend
  // Lấy PDF từ backend hoặc generate từ dữ liệu
  useEffect(() => {
    const preparePdf = async () => {
      try {
        setLoading(true);
        setPdfError(null);

        // Cleanup URL cũ để tránh rò rỉ bộ nhớ
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
          setPdfUrl(null);
        }

        let finalBytes: Uint8Array | null = null;

        // 👉 TRƯỜNG HỢP 1: XEM TÀI LIỆU ĐÍNH KÈM (previewDocument = true)
        if (previewDocument) {
          if (documentUrl instanceof File || documentUrl instanceof Blob) {
            // File vừa mới upload ở client
            const url = URL.createObjectURL(documentUrl);
            setPdfUrl(url);

            // Lưu bytes để phục vụ hàm Export sau này
            const buffer = await documentUrl.arrayBuffer();
            setSourcePdfBytes(new Uint8Array(buffer));
          } else if (typeof documentUrl === "string" && documentUrl !== "") {
            // File đã có trên server (S3)
            const blob = await S3Service.preview(documentUrl);
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);

            const buffer = await blob.arrayBuffer();
            setSourcePdfBytes(new Uint8Array(buffer));
          } else {
            throw new Error("Không có tài liệu đính kèm để hiển thị");
          }
          setLoading(false);
          return; // Thoát sớm vì đã xử lý xong preview
        }

        // 👉 TRƯỜNG HỢP 2: XỬ LÝ BIÊN BẢN/BẢNG KÊ (previewDocument = false)
        if (!isEdit && bangKe && typeof bangKe === "string") {
          // Chế độ SIGN/VIEW: Tải file đã chốt từ S3
          const blob = await S3Service.preview(bangKe);
          finalBytes = new Uint8Array(await blob.arrayBuffer());
        } else {
          // Chế độ CREATE/EDIT: Tự động generate PDF từ dữ liệu hiện tại
          finalBytes = await generateBienBanPdf(
            assetHandover,
            allUnits,
            staffs,
            departments,
            positions,
          );
        }

        if (finalBytes) {
          setSourcePdfBytes(finalBytes);
          const newBlob = new Blob([finalBytes.buffer as ArrayBuffer], {
            type: "application/pdf",
          });
          const newUrl = URL.createObjectURL(newBlob);
          setPdfUrl(newUrl);
        }
      } catch (err: any) {
        console.error("Lỗi chuẩn bị PDF:", err);
        setPdfError(err.message || "Không thể khởi tạo tài liệu");
      } finally {
        setLoading(false);
      }
    };

    preparePdf();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [documentUrl, previewDocument, isEdit, assetHandover]); // Thêm assetHandover để re-gen khi dữ liệu thay đổi

  // --- Render PDF ---
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

          // Lưu số trang
          canvas.dataset.page = pageNum.toString();

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          canvases.push(canvas);
        }

        setPages(canvases);
        setPdfError(null);
        setLoading(false);
      } catch (error: any) {
        console.error("Lỗi render PDF:", error);
        setPdfError(`Lỗi đọc PDF: ${error.message}`);
        setLoading(false);
      }
    };

    renderPDF();
  }, [pdfUrl]);

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

  // Xóa chữ ký
  const handleDeleteSignature = (id: string) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id));
  };

  const handleExportPDF = async () => {
    if (!sourcePdfBytes) {
      showErrorAlert("Không có tài liệu để xuất");
      return;
    }

    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.load(sourcePdfBytes);
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();

      const displayWidth = canvasDisplaySizes[0]?.width || 800;

      for (const sig of signatures) {
        let imageBytes: ArrayBuffer;

        if (sig.loaiKy === 3) {
          const base64 = digitalSignatureMap[sig.id];
          if (!base64) continue;

          const bin = atob(base64.split(",")[1]);
          imageBytes = Uint8Array.from(bin, (c) => c.charCodeAt(0)).buffer;
        } else {
          const path =
            sig.loaiKy === 1 || sig.loaiKy === 5
              ? sig.chuKyNhay
              : sig.chuKyThuong;

          if (!path) continue;

          const s3Url = await S3Service.presignedGetUrl(path);

          if (!s3Url) continue;

          const response = await fetch(s3Url);

          const contentType = response.headers.get("Content-Type");
          if (!response.ok || contentType !== "image/png") {
            console.warn("File không phải PNG hoặc không tải được:", s3Url);
            continue;
          }

          imageBytes = await response.arrayBuffer();
        }
        if (!imageBytes) continue;

        const img = await pdfDoc.embedPng(imageBytes);

        const pdfW = ((sig.width * sig.scale) / displayWidth) * width;
        const pdfH = (img.height / img.width) * pdfW;

        page.drawImage(img, {
          x: sig.x * width,
          y: height - sig.y * height - pdfH,
          width: pdfW,
          height: pdfH,
        });
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `TaiLieuKy_${Date.now()}.pdf`;
      a.click();

      setOpenSnackbar(true);
    } catch (e) {
      console.error(e);
      setPdfError("Xuất PDF thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleTouchStartSidebar = (e: React.TouchEvent) => {
    if (!isMobile) return;
    isDraggingSidebar.current = true;
    startYSidebar.current = e.touches[0].clientY;
    startHeightSidebar.current = sidebarHeight;
  };

  const handleTouchMoveSidebar = (e: TouchEvent) => {
    if (!isDraggingSidebar.current || !isMobile) return;
    const deltaY = startYSidebar.current - e.touches[0].clientY;
    const newHeight = Math.min(
      Math.max(startHeightSidebar.current + deltaY, 100),
      window.innerHeight * 0.8,
    );
    setSidebarHeight(newHeight);
  };

  const handleTouchEndSidebar = () => {
    isDraggingSidebar.current = false;
  };

  useEffect(() => {
    if (isMobile) {
      window.addEventListener("touchmove", handleTouchMoveSidebar, {
        passive: false,
      });
      window.addEventListener("touchend", handleTouchEndSidebar);
    }
    return () => {
      window.removeEventListener("touchmove", handleTouchMoveSidebar);
      window.removeEventListener("touchend", handleTouchEndSidebar);
    };
  }, [isMobile]);

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
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        ...(fullscreen && { position: "fixed", inset: 0, zIndex: 9999 }),
      }}
    >
      {/* --- Header --- */}
      {fullscreen && (
        <SignHeader
          pagesCount={pages.length}
          handleExportPDF={handleExportPDF}
          onCancel={onCancel}
        />
      )}

      {/* --- Body --- */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          flexDirection: isMobile ? "column-reverse" : "row",
        }}
      >
        {/* --- Sidebar (Công cụ) --- */}
        {showSignerSidebar &&
          (isMobile ? (
            <CollapsibleSidebar>
              <SidebarContent {...sidebarProps} />
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
              <SidebarContent {...sidebarProps} />
            </Paper>
          ))}

        {/* --- PDF Viewer Content --- */}
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
            <Alert severity="error" sx={{ mb: 2, maxWidth: "600px" }}>
              {pdfError}
            </Alert>
          )}

          {loading ? (
            <CircularProgress />
          ) : (
            <PdfViewer
              pages={pages}
              signatures={signatures}
              canvasDisplaySizes={canvasDisplaySizes}
              digitalSignatureMap={digitalSignatureMap}
              handleUpdatePosition={handleUpdatePosition}
              handleUpdateScale={handleUpdateScale}
              handleDeleteSignature={handleDeleteSignature}
            />
          )}
        </Box>
      </Box>

      {/* --- Overlays --- */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Đã xuất PDF thành công</Alert>
      </Snackbar>

      <ConfirmPin
        open={openConfirmPin}
        onClose={() => setOpenConfirmPin(false)}
        onConfirm={handleConfirmPinDialog}
      />
    </Box>
  );
}
