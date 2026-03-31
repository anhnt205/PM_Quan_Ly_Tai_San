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
import "../../../assets/fonts/times_new_roman-normal";
import { findById, generateSha256 } from "../../../utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { SignaturesData } from "../types";
import dayjs from "dayjs";
import { showErrorAlert } from "../../../components/Alert";
import {
  canUserSign,
  generateBangKePdf,
  mergeBangKeWithOriginalPdf,
} from "../config";
import axios from "axios";
import { ConfirmPin } from "./ConfirmPin";
import { SignHeader } from "../../../components/SignDocument/SignHeader";
import CollapsibleSidebar from "../../../components/SignDocument/CollapsibleSidebar";
import SidebarContent from "../../../components/SignDocument/SidebarContent";
import { PdfViewer } from "../../../components/SignDocument/PdfViewer";
import { useStaffMutation } from "../../Staff/Mutation";
import api from "../../../config/api.config";
import renderDigitalSignatureToImage from "../../../components/SignDocument/DigitalSignatureToImage";
import S3Service from "../../../services/S3Service";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface SignDocumentFormProps {
  selectedIds: string[];
  document?: File | string | any;
  onCancel: () => void;
  onSign: (data: SignaturesData[]) => void;
  fullscreen?: boolean;
  showSignerSidebar?: boolean;
  assetTransferDetail?: any[];
  allUnits?: any[];
  allCurrentStatus?: any[];
  staffs?: any[];
  handleSignatureList?: (idTaiLieu: string) => Promise<any>;
  isEdit?: boolean;
  title?: string;
}

export default function SignDocumentForm({
  selectedIds,
  document: documentUrl,
  onCancel,
  onSign,
  fullscreen = true,
  showSignerSidebar = true,
  assetTransferDetail = [],
  allUnits = [],
  allCurrentStatus = [],
  staffs = [],
  handleSignatureList,
  isEdit = false,
  title,
}: SignDocumentFormProps) {
  const [signatureType, setSignatureType] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const employee = findById(staffs, user?.taiKhoan?.tenDangNhap);
  const hasAutoSigned = useRef(false);
  // State quản lý danh sách chữ ký
  const [signatures, setSignatures] = useState<SignaturesData[]>([]);
  const [bangKeBytes, setBangKeBytes] = useState<Uint8Array | null>(null);

  // State quản lý Canvas và Loading
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [digitalSignatureMap, setDigitalSignatureMap] = useState<
    Record<string, string>
  >({});
  const [openConfirmPin, setOpenConfirmPin] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
      return result.data.signatureValue;
    } catch (error) {
      return showErrorAlert("Ký không thành công!");
    }
  };

  useEffect(() => {
    const rebuildBangKe = async () => {
      try {
        const bytes = await generateBangKePdf(
          assetTransferDetail,
          allUnits,
          allCurrentStatus,
        );
        setBangKeBytes(bytes);
      } catch (err) {
        console.error("Lỗi build lại Bảng kê:", err);
      }
    };
    rebuildBangKe();
  }, [assetTransferDetail, allUnits, allCurrentStatus]);

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
      x: 0.2, // Giữa trang theo chiều ngang
      y: 0.8, // Vị trí dọc chuẩn hóa
      chuKyNhay:
        (signatureType === 1 || signatureType === 5) && employee.chuKyNhay,
      chuKyThuong:
        (signatureType === 2 || signatureType === 4) && employee.chuKyThuong,
      width: 120,
      scale: 2,
      chuKySo: result,
      isLocked: false,
    };

    setSignatures((prev) => [...prev, newSignature]);
  };

  // 2. Sửa hàm handleConfirmSign để tính Y chuẩn hóa
  const handleSign = async () => {
    if (!employee) return;
    if (!employee.chuKyNhay && !employee.chuKyThuong && !employee.chuKySo) {
      return showErrorAlert("Không tìm thấy chữ ký");
    }
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
      x: 0.2, // Giữa trang theo chiều ngang
      y: 0.8, // Vị trí dọc chuẩn hóa
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
    if (employee && !hasAutoSigned.current && signatures.length === 0) {
      if (employee.kySo) setSignatureType(3);
      else if (employee.kyThuong) setSignatureType(2);
      else if (employee.kyNhay) setSignatureType(1);
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
            if (!imgPath) return showErrorAlert("Không tìm thấy chữ kí");

            const s3Url = await S3Service.presignedGetUrl(imgPath);
            if (!s3Url) return showErrorAlert("Lỗi tải chữ kí");

            const response = await fetch(s3Url);
            if (!response.ok) return showErrorAlert("Lỗi tải chữ kí");
            imageBytes = await response.arrayBuffer();
          }

          if (!imageBytes) return showErrorAlert("Lỗi tải chữ kí");

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
      await onSign(newSignatures);
      const pdfBlob = new Blob([finalPdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      await S3Service.updatePresignedPutUrl(documentUrl, pdfBlob);

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
  useEffect(() => {
    let activeUrl: string | null = null;

    const fetchAndPrepare = async () => {
      try {
        setLoading(true);

        // NHÁNH 1: Nếu có tài liệu cuối và KHÔNG phải đang edit -> Load thẳng S3
        if (!isEdit) {
          if (!documentUrl) return showErrorAlert("Không tìm thấy tài liệu");
          console.log("📂 Load trực tiếp từ S3 (Sign/View Mode)");
          const blob = await S3Service.preview(documentUrl);
          activeUrl = URL.createObjectURL(blob);
          setPdfUrl(activeUrl);
        }
        // NHÁNH 2: Đang edit hoặc chưa có file merge -> Build PDF động
        else {
          console.log("🛠 Build PDF preview (Create/Edit Mode)");
          const mergedFile = await mergeBangKeWithOriginalPdf(
            documentUrl,
            bangKeBytes,
          );
          if (mergedFile) {
            activeUrl = URL.createObjectURL(mergedFile);
            setPdfUrl(activeUrl);
          }
        }
      } catch (error) {
        setPdfError("Lỗi hiển thị tài liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndPrepare();
    return () => {
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, [isEdit, documentUrl, bangKeBytes]);

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
  }, [pdfUrl, bangKeBytes]);

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
    try {
      setLoading(true);
      if (!pdfUrl) throw new Error("Không có dữ liệu PDF để xuất");

      // 1. Ghép PDF ban đầu
      const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // 2. Lấy trang đầu
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width: pageWidth, height: pageHeight } = firstPage.getSize();

      // 3. Chiều rộng hiển thị thực tế
      const displayWidth = canvasDisplaySizes[0]?.width || 800;

      // 4. Vẽ chữ ký
      for (const sig of signatures) {
        let imageBytes: ArrayBuffer;
        let isPng = true;

        try {
          if (sig.loaiKy === 3) {
            // TRƯỜNG HỢP: CHỮ KÝ SỐ (Dùng dữ liệu Base64 từ digitalSignatureMap)
            const base64Data = digitalSignatureMap[sig.id];
            if (!base64Data) continue;

            // Chuyển Base64 thành ArrayBuffer
            const base64Content = base64Data.split(",")[1];
            const binaryString = window.atob(base64Content);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            imageBytes = bytes.buffer;
            isPng = true; // Canvas.toDataURL mặc định là PNG
          } else {
            // TRƯỜNG HỢP: CHỮ KÝ THƯỜNG (Tải từ Server)
            const imgPath =
              sig.loaiKy === 1 || sig.loaiKy === 5
                ? sig.chuKyNhay
                : sig.chuKyThuong;
            if (!imgPath) continue;

            const s3Url = await S3Service.presignedGetUrl(imgPath);

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

          const pdfImage = await pdfDoc.embedPng(imageBytes);

          // --- TÍNH KÍCH THƯỚC ---
          const widthRatio = (sig.width * (sig.scale || 1)) / displayWidth;

          const pdfImageWidth = widthRatio * pageWidth;
          const pdfImageHeight =
            (pdfImage.height / pdfImage.width) * pdfImageWidth;

          // --- TÍNH VỊ TRÍ ---
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

      // 5. Save & download DUY NHẤT 1 LẦN
      const finalBytes = await pdfDoc.save();
      const blob = new Blob([finalBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `BangKe_ChiTiet_${Date.now()}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      setPdfError("Không thể ghép file PDF.");
    } finally {
      setLoading(false);
    }
  };

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
      {/* --- 1. Header dùng chung --- */}
      <SignHeader
        pagesCount={pages.length}
        handleExportPDF={handleExportPDF}
        onCancel={() => {
          onCancel();
          setSignatures([]);
        }}
        title={title}
      />

      {/* --- 2. Body: Phân chia Sidebar và PDF Viewer --- */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          flexDirection: isMobile ? "column-reverse" : "row",
        }}
      >
        {/* --- Sidebar (Công cụ ký) --- */}
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

        {/* --- PDF Viewer Content --- */}
        <Box
          ref={containerRef}
          sx={{
            flex: 1,
            bgcolor: "#e0e0e0",
            p: isMobile ? 1 : 4,
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
            <CircularProgress sx={{ mt: 10 }} />
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

      {/* --- 3. Các thành phần Overlays (Thông báo, Nhập PIN) --- */}
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
