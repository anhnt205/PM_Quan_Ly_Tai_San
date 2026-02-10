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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import "../../../assets/fonts/times_new_roman-normal";
import "../../../assets/fonts/times_new_roman-bold";
import { findById, formatted, generateSha256 } from "../../../utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ToolHandoverData, SignaturesData } from "../types";
import dayjs from "dayjs";
import { showErrorAlert } from "../../../components/Alert";
import { canUserSign } from "../config";
import axios from "axios";
import { ConfirmPin } from "../../AssetTransfer/components/ConfirmPin";
import { SignHeader } from "../../../components/SignDocument/SignHeader";
import CollapsibleSidebar from "../../../components/SignDocument/CollapsibleSidebar";
import SidebarContent from "../../../components/SignDocument/SidebarContent";
import { PdfViewer } from "../../../components/SignDocument/PdfViewer";
import { useStaffMutation } from "../../Staff/Mutation";
import api from "../../../config/api.config";

// --- Config Worker ---
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}
interface SignDocumentFormProps {
  selectedIds: string[];
  onCancel: () => void;
  onSign: (data: SignaturesData[], toolHandover: ToolHandoverData) => void;
  fullscreen?: boolean;
  showSignerSidebar?: boolean;
  toolHandover: ToolHandoverData;
  allUnits?: any[];
  staffs?: any[];
  departments?: any[];
  positions?: any[];
  handleSignatureList?: (idTaiLieu: string) => Promise<any>;
  document?: File | string | any;
  previewDocument?: boolean;
}

export default function SignDocumentForm({
  selectedIds,
  onCancel,
  onSign,
  fullscreen = true,
  showSignerSidebar = true,
  toolHandover,
  allUnits = [],
  staffs = [],
  departments = [],
  positions = [],
  handleSignatureList,
  document: documentUrl,
  previewDocument = false,
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

  const getChucVu = async (idUser: string) => {
    const nhanVien = await findById(staffs, idUser);
    const chucVu = await findById(positions, nhanVien?.chucVuId ?? "");
    return chucVu?.tenChucVu ?? "";
  };

  const getDonVi = async (idUser: string) => {
    const nhanVien = await findById(staffs, idUser);
    const donVi = await findById(departments, nhanVien?.phongBanId ?? "");
    return donVi?.tenPhongBan ?? "";
  };

  const isCheckKho = async (idUser: string) => {
    const nhanVien = await findById(staffs, idUser);
    const phongBan = await findById(departments, nhanVien?.phongBanId ?? "");
    return phongBan?.isKho == true;
  };

  const listSigneInfo = async (item?: ToolHandoverData) => {
    if (!item) return [];

    const result: any[] = [];

    // ===== ĐẠI DIỆN BÊN GIAO =====
    const isKhoGiao = await isCheckKho(item.idDaiDienBenGiao ?? "");
    const donViGiao = isKhoGiao
      ? ((await findById(departments, item.idDonViGiao ?? ""))?.tenPhongBan ??
        "")
      : await getDonVi(item.idDaiDienBenGiao ?? "");

    result.push({
      idNhanVien: item.idDaiDienBenGiao ?? "",
      title: "Đại diện đơn vị bên giao",
      hoTen: item.tenDaiDienBenGiao ?? "",
      chucVu: await getChucVu(item.idDaiDienBenGiao ?? ""),
      donVi: donViGiao,
    });

    // ===== ĐẠI DIỆN BÊN NHẬN =====
    const isKhoNhan = await isCheckKho(item.idDaiDienBenNhan ?? "");
    const donViNhan = isKhoNhan
      ? ((await findById(departments, item.idDonViNhan ?? ""))?.tenPhongBan ??
        "")
      : await getDonVi(item.idDaiDienBenNhan ?? "");

    result.push({
      idNhanVien: item.idDaiDienBenNhan ?? "",
      title: "Đại diện đơn vị bên nhận",
      hoTen: item.tenDaiDienBenNhan ?? "",
      chucVu: await getChucVu(item.idDaiDienBenNhan ?? ""),
      donVi: donViNhan,
    });

    // ===== NGƯỜI KÝ BỔ SUNG =====
    if (item.nguoiKyList?.length) {
      for (let i = 0; i < item.nguoiKyList.length; i++) {
        const sign = item.nguoiKyList[i];
        result.push({
          idNhanVien: sign.idNguoiKy ?? "",
          title: `Đại diện ký ${i + 1}`,
          hoTen: sign.tenNguoiKy ?? "",
          chucVu: await getChucVu(sign.idNguoiKy ?? ""),
          donVi: await getDonVi(sign.idNguoiKy ?? ""),
        });
      }
    }

    // ===== GIÁM ĐỐC =====
    result.push({
      idNhanVien: item.idGiamDoc ?? "",
      title: "Giám đốc ký duyệt",
      hoTen: item.tenGiamDoc ?? "",
      chucVu: await getChucVu(item.idGiamDoc ?? ""),
      donVi: await getDonVi(item.idGiamDoc ?? ""),
    });

    return result;
  };

  const generateBienBanPdf = async (): Promise<Uint8Array> => {
    console.log(">>> CHECK toolHandover inside PDF:", toolHandover);
    console.log(">>> CHECK allUnits:", allUnits);

    const listSigneInfos: any[] = await listSigneInfo(toolHandover);
    console.log(">>> CHECK listSigneInfos:", listSigneInfos);

    const doc = new jsPDF("p", "mm", "a4");

    // Đảm bảo font times_new_roman đã được add trước đó
    doc.setFont("times_new_roman", "normal");

    // ===== HEADER =====
    doc.setFontSize(11);
    doc.text("TẬP ĐOÀN CÔNG NGHIỆP", 50, 20, { align: "center" });
    doc.text("THAN - KHOÁNG SẢN VIỆT NAM", 50, 26, { align: "center" });

    doc.setFont("times_new_roman", "bold");
    doc.text("CÔNG TY THAN UÔNG BÍ - TKV", 50, 32, { align: "center" });
    doc.line(40, 34, 80, 34); // Đường kẻ dưới tên công ty

    doc.setFont("times_new_roman", "normal");
    doc.setFontSize(10);
    doc.text("Mẫu số 17/BBGN-TS", 190, 20, { align: "right" });

    doc.setFont("times_new_roman", "bold");
    doc.setFontSize(13);
    doc.text("BIÊN BẢN", 140, 30, { align: "center" });
    doc.text("GIAO NHẬN TÀI SẢN", 140, 36, { align: "center" });

    // ===== CĂN CỨ =====
    doc.setFont("times_new_roman", "normal");
    doc.setFontSize(11);

    let y = 50;
    const canCuText = `Căn cứ QĐ số: ${toolHandover?.soQuyetDinh ?? "........."} ${formatted(toolHandover?.ngayQuyetDinh ?? "")} của Giám đốc Công ty V/v điều động tài sản từ PX ${toolHandover?.tenDonViGiao ?? "...................."} đến PX ${toolHandover?.tenDonViNhan ?? "...................."}.`;

    const splitCanCu = doc.splitTextToSize(canCuText, 170);
    doc.text(splitCanCu, 25, y);

    y += splitCanCu.length * 7;
    doc.text(
      `Hôm nay, ${formatted(toolHandover?.ngayBanGiao ?? "")} tại ${toolHandover?.diaDiemQuyetDinh ?? "..........."}.`,
      25,
      y,
    );

    // ===== DANH SÁCH NGƯỜI KÝ =====
    y += 10;
    doc.setFont("times_new_roman", "bold");
    doc.text("Chúng tôi gồm:", 20, y);
    doc.setFont("times_new_roman", "bold");

    y += 7;
    // Giả sử signatures là mảng đối tượng có { hoTen, chucVu, phongBan }
    listSigneInfos?.forEach((s, index) => {
      const nameText = doc.splitTextToSize(
        `${index + 1}. Ông (bà): ${s.hoTen}`,
        55,
      );

      const chucVuText = doc.splitTextToSize(`Chức vụ: ${s.chucVu}`, 45);

      const phongText = doc.splitTextToSize(`Phòng: ${s.donVi}`, 50);

      doc.text(nameText, 25, y);
      doc.text(chucVuText, 85, y);
      doc.text(phongText, 135, y);

      // 👉 Tăng y theo dòng cao nhất
      const maxLines = Math.max(
        nameText.length,
        chucVuText.length,
        phongText.length,
      );
      y += maxLines * 7;
    });

    // ===== MÔ TẢ GIAO NHẬN =====
    y += 5;
    const moTaGiaoNhan = `Tiến hành giao nhận tài sản từ phân xưởng ${toolHandover?.tenDonViGiao ?? "........"} giao cho phân xưởng ${toolHandover?.tenDonViNhan ?? "........"} cụ thể như sau:`;
    doc.text(doc.splitTextToSize(moTaGiaoNhan, 175), 20, y);

    // ===== TABLE =====
    const tableData = (toolHandover?.chiTietBanGiaoCCDCVatTu ?? []).map(
      (item: any, index: number) => [
        index + 1,
        item.tenCCDCVatTu || item.tenVatTu || "",
        item.kyHieu ?? "",
        item.moTa ?? "",
        findById(allUnits, item.donViTinh)?.tenDonVi ?? "",
        item.soLuong || 1,
        item.ghiChu ?? "",
      ],
    );

    autoTable(doc, {
      startY: y + 5,
      margin: { left: 20, right: 20 },
      head: [
        [
          "STT",
          "Tên ccdc - vật tư",
          "Mã hiệu, quy cách",
          "Nước sản xuất",
          "Đơn vị tính",
          "Số lượng",
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
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        font: "times_new_roman",
        fontSize: 10,
        textColor: 0,
        lineWidth: 0.1,
        lineColor: 0,
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        4: { cellWidth: 20, halign: "center" },
        5: { cellWidth: 15, halign: "center" },
      },
    });

    // ===== KẾT LUẬN & CHỮ KÝ =====
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(
      "Sau khi hai bên kiểm tra kỹ lưỡng tình trạng và thống nhất ký tên vào biên bản.",
      20,
      finalY,
    );

    finalY += 15;

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 40; // Lề trái và lề phải (giống lề của bảng phía trên)
    const printableWidth = pageWidth - 2 * marginX; // Chiều rộng thực tế dùng để chia cột

    const colWidth = 45; // Độ rộng vùng text mỗi chữ ký
    const maxPerRow = 5; // Tối đa 4 chữ ký / hàng
    const rowGap = 70;
    const baseY = finalY;

    listSigneInfos?.forEach((s, index) => {
      const rowIndex = Math.floor(index / maxPerRow);
      const colIndex = index % maxPerRow;

      // Xác định số lượng chữ ký thực tế của hàng này
      const itemsInRow = Math.min(
        maxPerRow,
        listSigneInfos.length - rowIndex * maxPerRow,
      );

      let x;
      if (itemsInRow === 1) {
        // 1 người: Căn giữa trang
        x = pageWidth / 2;
      } else {
        // Từ 2 người trở lên: Chia đều khoảng cách để 2 người ngoài cùng sát lề marginX
        // Công thức: Lề trái + (vị trí cột * (chiều rộng khả dụng / số khoảng trống giữa các cột))
        const gapSize = printableWidth / (itemsInRow - 1);
        x = marginX + colIndex * gapSize;
      }

      const y = baseY + rowIndex * rowGap;

      // 1️⃣ Đơn vị (Phòng ban/Phân xưởng)
      // Dùng fontSize nhỏ hơn một chút nếu cần giống ảnh mẫu
      doc.setFontSize(10);
      const donViLines = doc.splitTextToSize(s?.donVi || "", colWidth);
      doc.text(donViLines, x, y, { align: "center" });

      // 2️⃣ Họ tên người ký
      // Cố định khoảng cách nameY để tạo khoảng trống cho chữ ký tay
      const nameY = y + 35;
      const hoTenLines = doc.splitTextToSize(s?.hoTen || "", colWidth);
      doc.text(hoTenLines, x, nameY, { align: "center" });
    });

    return new Uint8Array(doc.output("arraybuffer"));
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
    await onSign(data, toolHandover);
    fetchSignatures();
    onCancel();
  };

  // Lấy PDF từ backend
  useEffect(() => {
    const preparePdf = async () => {
      try {
        setLoading(true);
        setPdfError(null);

        // Quan trọng: Xóa URL cũ trước khi tạo cái mới để tránh render đè
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
          setPdfUrl(null);
        }

        let finalBytes: Uint8Array;

        // 👉 TRƯỜNG HỢP 1: CÓ DOCUMENT → CHỈ XỬ LÝ DOCUMENT
        if (previewDocument) {
          if (documentUrl instanceof File || documentUrl instanceof Blob) {
            const arrayBuffer = await documentUrl.arrayBuffer();
            finalBytes = new Uint8Array(arrayBuffer);
          } else {
            // File từ server (string path)
            let fileName =
              typeof documentUrl === "string"
                ? documentUrl
                : documentUrl?.duongDanFile || documentUrl?.filePDF;

            if (!fileName) throw new Error("Không xác định được file");

            const blob = await handlePreviewS3(fileName);
            finalBytes = new Uint8Array(await blob.arrayBuffer());
          }
        }
        // 👉 TRƯỜNG HỢP 2: KHÔNG CÓ DOCUMENT HOẶC previewDocument = false → DÙNG BẢNG KÊ
        else {
          finalBytes = await generateBienBanPdf();
        }

        // Chỉ thực hiện tạo Blob 1 lần duy nhất sau khi đã xác định được nguồn
        setSourcePdfBytes(finalBytes);
        const newBlob = new Blob([finalBytes.buffer as ArrayBuffer], {
          type: "application/pdf",
        });
        const newUrl = URL.createObjectURL(newBlob);
        setPdfUrl(newUrl);
      } catch (err) {
        console.error(err);
        setPdfError("Không thể khởi tạo tài liệu");
      } finally {
        setLoading(false);
      }
    };

    preparePdf();

    // Cleanup function để tránh rò rỉ bộ nhớ
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [documentUrl, previewDocument]); // Chạy lại khi 1 trong 2 cái này đổi

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

          const res = await api.get(`/s3/get?key=${path}`);
          const s3Url = res.data.data;

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

      {/* --- 2. Body --- */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          flexDirection: isMobile ? "column-reverse" : "row",
        }}
      >
        {/* --- Sidebar Công cụ --- */}
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

        {/* --- 3. PDF Viewer dùng chung --- */}
        <Box
          ref={containerRef}
          sx={{
            flex: 1,
            bgcolor: "#e0e0e0",
            p: isMobile ? 1 : 4, // Mobile giảm padding để canvas to hơn
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

      {/* --- 4. Overlays --- */}
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

export const renderDigitalSignatureToImage = async (
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
