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
import { useAssetTranferMutation } from "../Mutation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import "../../../assets/fonts/times_new_roman-normal";
import { findById, generateSha256 } from "../../../utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { SignaturesData } from "../types";
import dayjs from "dayjs";
import { showErrorAlert } from "../../../components/Alert";
import { canUserSign } from "../config";
import axios from "axios";
import { ConfirmPin } from "./ConfirmPin";
import { SignHeader } from "../../../components/SignDocument/SignHeader";
import CollapsibleSidebar from "../../../components/SignDocument/CollapsibleSidebar";
import SidebarContent from "../../../components/SignDocument/SidebarContent";
import { PdfViewer } from "../../../components/SignDocument/PdfViewer";
import { useStaffMutation } from "../../Staff/Mutation";
import api from "../../../config/api.config";

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
}

export default function SignDocumentForm({
  selectedIds,
  document: documentUrl,
  onCancel,
  onSign,
  fullscreen = true,
  showSignerSidebar = true,
  assetTransferDetail,
  allUnits = [],
  allCurrentStatus = [],
  staffs = [],
  handleSignatureList,
}: SignDocumentFormProps) {
  const [signatureType, setSignatureType] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const employee = findById(staffs, user?.taiKhoan?.tenDangNhap);
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

  // 1. Cập nhật useEffect lấy danh sách chữ ký từ API
  const fetchSignatures = async () => {
    if (selectedIds[0] && handleSignatureList) {
      try {
        const data = await handleSignatureList(selectedIds[0]);
        const initialSigs = data.map((item: any) => ({
          ...item,
          isLocked: true,
        }));
        setSignatures(initialSigs);
      } catch (err) {
        console.error("Lỗi lấy danh sách chữ ký:", err);
      }
    }
  };
  useEffect(() => {
    fetchSignatures();
  }, [selectedIds, handleSignatureList]);

  const generateBangKePdf = async (): Promise<Uint8Array> => {
    const doc = new jsPDF();

    doc.setFont("times_new_roman", "normal");
    doc.setFontSize(13);
    doc.text("BẢNG KÊ CHI TIẾT", 105, 15, { align: "center" });
    const tableData = (
      Array.isArray(assetTransferDetail) ? assetTransferDetail : []
    ).map((item: any, index: number) => {
      // Kiểm tra an toàn: Chỉ gọi findById khi mảng là hợp lệ
      const unit = Array.isArray(allUnits)
        ? findById(allUnits, item?.donViTinh)
        : null;
      const status = Array.isArray(allCurrentStatus)
        ? findById(allCurrentStatus, item?.hienTrang)
        : null;

      return [
        index + 1,
        item?.tenTaiSan || "",
        unit?.tenDonVi || "",
        item.soLuong || 0,
        status?.tenHTKT || "",
        item.ghiChu || "",
      ];
    });

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Stt",
          "Tên tài sản",
          "Đơn vị tính",
          "Số lượng",
          "Tình trạng kĩ thuật",
          "Ghi chú",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: false,
        textColor: 0,
        lineWidth: 0.1,
        lineColor: 0,
        font: "times_new_roman",
        fontStyle: "normal",
        halign: "center",
      },
      bodyStyles: {
        font: "times_new_roman",
        fontSize: 10,
        textColor: 0,
        lineWidth: 0.1,
        lineColor: 0,
      },
    });

    return new Uint8Array(doc.output("arraybuffer"));
  };

  useEffect(() => {
    const rebuildBangKe = async () => {
      try {
        const bytes = await generateBangKePdf();
        setBangKeBytes(bytes);
      } catch (err) {
        console.error("Lỗi build lại Bảng kê:", err);
      }
    };
    rebuildBangKe();
  }, [assetTransferDetail, allUnits, allCurrentStatus]);

  const mergeBangKeWithOriginalPdf = async (
    originalPdfUrl?: string | null,
  ): Promise<Uint8Array> => {
    if (!bangKeBytes) {
      throw new Error("BangKe chưa được khởi tạo");
    }
    const bangKeDoc = await PDFDocument.load(bangKeBytes);

    if (!originalPdfUrl) {
      return bangKeBytes;
    }

    const originalBytes = await fetch(originalPdfUrl).then((r) =>
      r.arrayBuffer(),
    );
    const originalDoc = await PDFDocument.load(originalBytes);

    // 👉 Ghép BẢNG KÊ LÊN ĐẦU (chuẩn hành chính)
    const bangKePages = await originalDoc.copyPages(
      bangKeDoc,
      bangKeDoc.getPageIndices(),
    );

    bangKePages.forEach((p) => originalDoc.addPage(p));

    return await originalDoc.save();
  };

  // State để tracking kích thước hiển thị thực tế của các canvas pages
  const [canvasDisplaySizes, setCanvasDisplaySizes] = useState<
    { width: number; height: number }[]
  >([]);

  // Ref chứa container để xử lý scroll
  const containerRef = useRef<HTMLDivElement>(null);

  const { handlePreviewS3 } = useStaffMutation();

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
    const data = signatures.filter((i) => !i.isLocked);
    if (data.length === 0) {
      return showErrorAlert("Chưa có chữ ký nào để lưu");
    }
    await onSign(data);
    fetchSignatures();
    onCancel();
  };

  // Lấy PDF từ backend
  useEffect(() => {
    let activeUrl: string | null = null;

    const fetchAndPrepare = async () => {
      try {
        setPdfError(null);
        setLoading(true);

        if (!documentUrl) {
          // 👉 CHỈ PREVIEW BẢNG KÊ
          const bangKeBytes = await generateBangKePdf();
          const blob = new Blob([bangKeBytes.buffer as ArrayBuffer], {
            type: "application/pdf",
          });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setLoading(false);
          return;
        }

        // TRƯỜNG HỢP 1: Document là File Object (Vừa upload xong)
        // Tương đương với việc có "path" trong Flutter
        if (documentUrl instanceof File || documentUrl instanceof Blob) {
          const url = URL.createObjectURL(documentUrl);
          activeUrl = url;

          const mergedBytes = await mergeBangKeWithOriginalPdf(url);

          const mergedBlob = new Blob([mergedBytes.buffer as ArrayBuffer], {
            type: "application/pdf",
          });

          const previewUrl = URL.createObjectURL(mergedBlob);
          setPdfUrl(previewUrl);
          return;
        }

        // TRƯỜNG HỢP 2: Document là string (Tên file từ Server)
        let fileName: string | null = null;
        if (typeof documentUrl === "string") {
          fileName = documentUrl;
        } else if (typeof documentUrl === "object") {
          fileName =
            documentUrl.duongDanFile ||
            documentUrl.fileName ||
            documentUrl.filePDF;
        }
        if (fileName) {
          console.log("Đang tải file từ server:", fileName);
          let originalUrl: string | null = null;

          // 1. CÔ LẬP LỖI TẢI FILE GỐC
          try {
            const blob = await handlePreviewS3(fileName);

            // Kiểm tra xem có phải nội dung lỗi (HTML) không
            const text = await blob.slice(0, 100).text();
            if (text.includes("<!DOCTYPE") || text.includes("<html")) {
              throw new Error(
                "File trên server không tồn tại (404) hoặc sai định dạng.",
              );
            }

            originalUrl = URL.createObjectURL(blob);
          } catch (err) {
            // Nếu lỗi ở đây, ta chỉ log cảnh báo, KHÔNG nhảy xuống catch tổng
            console.warn(
              "⚠️ Không lấy được file gốc, chuyển sang chế độ chỉ hiện Bảng kê:",
              err,
            );
            originalUrl = null;
          }

          // 2. TIẾP TỤC GHÉP FILE (Dù có file gốc hay không)
          try {
            // Luôn gọi hàm này, truyền originalUrl (có thể là null)
            const mergedBytes = await mergeBangKeWithOriginalPdf(originalUrl);

            const mergedBlob = new Blob([mergedBytes.buffer as ArrayBuffer], {
              type: "application/pdf",
            });

            const previewUrl = URL.createObjectURL(mergedBlob);
            setPdfUrl(previewUrl);
            setPdfError(null); // Xóa lỗi nếu trước đó có
          } catch (mergeError: any) {
            // Chỉ báo lỗi nếu ngay cả việc tạo Bảng kê cũng thất bại
            console.error("❌ Lỗi nghiêm trọng khi tạo PDF:", mergeError);
            setPdfError("Không thể khởi tạo tài liệu xem trước.");
            setPdfUrl(null);
          } finally {
            setLoading(false);
          }
        }
      } catch (error: any) {
        console.error("Lỗi chuẩn bị PDF:", error);
        setPdfUrl(null);
        setPdfError(error.message);
        setLoading(false);
      }
    };

    fetchAndPrepare();

    // Cleanup: Quan trọng để tránh tràn bộ nhớ
    return () => {
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, [documentUrl, bangKeBytes]);

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

            const res = await api.get(`/s3/get?key=${imgPath}`);
            const s3Url = res.data.data;

            if (!s3Url) continue;

            const response = await fetch(s3Url);

            if (!response.ok) {
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
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        ...(fullscreen && { position: "fixed", inset: 0, zIndex: 9999 }),
      }}
    >
      {/* --- 1. Header dùng chung --- */}
      {fullscreen && (
        <SignHeader
          pagesCount={pages.length}
          handleExportPDF={handleExportPDF}
          onCancel={onCancel}
        />
      )}

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
const renderDigitalSignatureToImage = async (
  name?: string | null,
  date?: string,
): Promise<string> => {
  // 1. Tạo một canvas ngầm
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 2. Thiết lập kích thước (tỉ lệ 2x để nét)
  const width = 260;
  const height = 90;
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);

  // 3. Vẽ nền trắng và khung viền đỏ
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#d32f2f";
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, width - 10, height - 10);

  // 4. Vẽ Text
  ctx.textBaseline = "top";

  // Dòng 1: Tiêu đề
  ctx.fillStyle = "#d32f2f";
  ctx.font = "bold 20px Arial";
  ctx.fillText("Chữ ký số", 15, 15);

  // Dòng 2: Người ký
  ctx.font = "bold 20px Arial";
  ctx.fillText(`Ký bởi: ${name || ""}`, 15, 40);

  // Dòng 3: Ngày ký
  ctx.font = "bold 20px Arial";
  ctx.fillText(`Ký ngày: ${date || ""}`, 15, 65);

  // 5. Xuất ra Base64
  return canvas.toDataURL("image/png");
};
