import {
  Box,
  Button,
  Paper,
  Radio,
  FormControlLabel,
  RadioGroup,
  Typography,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close, PictureAsPdf } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import signatureImage from "../../../assets/images/sign.png"; // Ảnh chữ ký mẫu
import DraggableSignature from "./DraggableSignature";

// Import component kéo thả ở trên (giả sử bạn để chung file thì không cần import)
// import DraggableSignature from "./DraggableSignature";

// --- Config Worker ---
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

// --- Types ---
interface SignatureData {
  id: string;
  page: number; // Trang số mấy
  x: number;
  y: number;
  type: string; // 'standard' | 'initials'
}

interface SignDocumentFormProps {
  selectedIds: string[];
  documents?: any;
  onCancel: () => void;
  onSign: () => void;
  fullscreen?: boolean;
}

export default function SignDocumentForm({
  selectedIds,
  documents,
  onCancel,
  onSign,
  fullscreen = true,
}: SignDocumentFormProps) {
  const [signatureType, setSignatureType] = useState("standard");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // State quản lý danh sách chữ ký
  const [signatures, setSignatures] = useState<SignatureData[]>([]);

  // State quản lý Canvas và Loading
  const defaultSampleFile = "/sample.pdf";
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [loading, setLoading] = useState(true);

  // Ref chứa container để xử lý scroll
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Render PDF ---
  useEffect(() => {
    const renderPDF = async () => {
      try {
        setLoading(true);
        const pdf = await pdfjsLib.getDocument(defaultSampleFile).promise;
        const canvases: HTMLCanvasElement[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;

          // Scale 1.5 để nét
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // CSS width/height để hiển thị vừa vặn (quan trọng cho tính tọa độ)
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block"; // Tránh khoảng trắng dưới canvas

          // Lưu số trang
          canvas.dataset.page = pageNum.toString();

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          canvases.push(canvas);
        }

        setPages(canvases);
        setLoading(false);
      } catch (error) {
        console.error("Error rendering PDF:", error);
        setLoading(false);
      }
    };

    renderPDF();
  }, [defaultSampleFile]);

  // --- Handlers ---

  // Khi click vào PDF -> Thêm chữ ký
  const handlePageClick = (e: React.MouseEvent, pageIndex: number) => {
    // Lấy tọa độ click tương đối trong thẻ bao ngoài (wrapper)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Tạo chữ ký mới căn giữa vị trí click (trừ đi 1/2 kích thước ảnh)
    const newSignature: SignatureData = {
      id: Date.now().toString(),
      page: pageIndex + 1, // Page bắt đầu từ 1
      x: x - 50, // 50 là nửa chiều rộng chữ ký
      y: y - 25, // 25 là nửa chiều cao chữ ký
      type: signatureType,
    };
    console.log(newSignature);

    setSignatures([...signatures, newSignature]);
  };

  // Cập nhật vị trí sau khi kéo thả
  const handleUpdatePosition = (id: string, newX: number, newY: number) => {
    setSignatures((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, x: newX, y: newY } : sig))
    );
  };

  // Xóa chữ ký
  const handleDeleteSignature = (id: string) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id));
  };

  // Nút Xuất PDF (Console log tọa độ cuối cùng)
  const handleConfirmSign = () => {
    console.log("Danh sách chữ ký và tọa độ:", signatures);
    onSign();
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
      {/* --- Header (Giữ nguyên) --- */}
      {fullscreen && (
        <Box
          sx={{
            bgcolor: "white",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6">Soạn & Ký Tài Liệu</Typography>
          </Box>
          <Box>
            <IconButton onClick={onCancel}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* --- Body --- */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* --- Left Sidebar (Công cụ) --- */}
        <Paper
          sx={{
            width: 320,
            p: 2,
            overflowY: "auto",
            borderRight: "1px solid #ddd",
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Công cụ ký
          </Typography>

          <RadioGroup
            value={signatureType}
            onChange={(e) => setSignatureType(e.target.value)}
          >
            <FormControlLabel
              value="standard"
              control={<Radio />}
              label="Ký thường"
            />
            <Box sx={{ ml: 4, mb: 2 }}>
              <img
                src={signatureImage}
                alt="sample"
                width={80}
                style={{ border: "1px solid #eee" }}
              />
            </Box>

            <FormControlLabel
              value="initials"
              control={<Radio />}
              label="Ký nháy"
            />
          </RadioGroup>

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            fullWidth
            color="success"
            onClick={handleConfirmSign} // Log kết quả
            sx={{ mb: 1 }}
          >
            Xác nhận ký
          </Button>
          <Typography variant="caption" color="text.secondary">
            *Click vào trang tài liệu bên phải để đặt chữ ký.
          </Typography>
        </Paper>

        {/* --- Right Content (PDF Viewer) --- */}
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
          {loading ? (
            <CircularProgress />
          ) : (
            pages.map((canvas, index) => {
              const pageNum = index + 1;
              // Lọc chữ ký thuộc trang hiện tại
              const pageSignatures = signatures.filter(
                (sig) => sig.page === pageNum
              );

              return (
                <Box
                  key={index}
                  sx={{
                    position: "relative", // QUAN TRỌNG: Để con (chữ ký) tuyệt đối theo cha
                    marginBottom: 3,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    maxWidth: canvas.width, // Giới hạn chiều rộng bằng canvas
                  }}
                  // Click vào vùng trống để thêm chữ ký
                  onClick={(e) => handlePageClick(e, index)}
                >
                  {/* 1. Render Canvas */}
                  <Box
                    ref={(el: HTMLDivElement | null) => {
                      if (el && !el.hasChildNodes()) {
                        el.appendChild(canvas);
                      }
                    }}
                  />

                  {/* 2. Render Các chữ ký đè lên trên */}
                  {pageSignatures.map((sig) => (
                    <DraggableSignature
                      key={sig.id}
                      {...sig}
                      initialX={sig.x}
                      initialY={sig.y}
                      imgSrc={signatureImage}
                      containerWidth={canvas.width}
                      containerHeight={canvas.height}
                      onUpdatePosition={handleUpdatePosition}
                      onDelete={handleDeleteSignature}
                    />
                  ))}
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Đã xuất PDF thành công</Alert>
      </Snackbar>
    </Box>
  );
}
