import {
  Box,
  Button,
  Paper,
  Radio,
  FormControlLabel,
  RadioGroup,
  Typography,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close, PictureAsPdf } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import signatureImage from "../../../assets/images/sign.png";

// Set up worker with proper version matching
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface SignDocumentFormProps {
  selectedIds: string[];
  documents?: any[];
  onCancel: () => void;
  onSign: () => void;
  fullscreen?: boolean;
}

export default function SignDocumentForm({
  selectedIds,
  documents = [],
  onCancel,
  onSign,
  fullscreen = true,
}: SignDocumentFormProps) {
  const [signatureType, setSignatureType] = useState("standard");
  const [initials, setInitials] = useState("standard");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const defaultSampleFile = "/sample.pdf";
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documents && documents.length > 0) return;

    const renderPDF = async () => {
      try {
        setLoading(true);
        console.log("Loading PDF from:", defaultSampleFile);
        const pdf = await pdfjsLib.getDocument(defaultSampleFile).promise;
        console.log("PDF loaded, pages:", pdf.numPages);
        const imageUrls: string[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context!,
            viewport: viewport,
          }).promise;

          const imageUrl = canvas.toDataURL("image/png");
          console.log(
            `Page ${pageNum} rendered: ${canvas.width}x${canvas.height}`
          );
          imageUrls.push(imageUrl);
        }

        setPages(imageUrls);
        setLoading(false);
      } catch (error) {
        console.error("Error rendering PDF:", error);
        setLoading(false);
      }
    };

    renderPDF();
  }, [defaultSampleFile, documents]);

  React.useEffect(() => {
    console.log("SignDocumentForm mounted with selectedIds:", selectedIds);
  }, [selectedIds]);

  const handleExportPDF = () => {
    console.log("Exporting PDF...");
    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        ...(fullscreen && {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }),
      }}
    >
      {/* Header - chỉ hiển thị khi fullscreen */}
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
            <Typography variant="h5" fontWeight={600}>
              Soạn & Ký Tài Liệu
            </Typography>
            <Typography variant="caption" color="textSecondary">
              3 trang
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <Button
              variant="contained"
              startIcon={<PictureAsPdf />}
              sx={{
                bgcolor: "#6366f1",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { bgcolor: "#4f46e5" },
              }}
              onClick={handleExportPDF}
            >
              Xuất PDF
            </Button>
            <IconButton
              onClick={onCancel}
              sx={{
                color: "#ef4444",
                borderRadius: 1,
                border: "1px solid #fecaca",
                padding: 1,
                "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Content */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flex: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Left Sidebar - Signature Tools */}
        <Paper
          sx={{
            width: 380,
            padding: 2,
            borderRadius: 0,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflowY: "auto",
            flexShrink: 0,
            position: "sticky",
            top: fullscreen ? 72 : 0,
            height: fullscreen ? "calc(100vh - 72px)" : "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              mb={3}
              sx={{ fontSize: 20 }}
            >
              Công cụ ký
            </Typography>

            {/* Signature Type Selection - All options in one RadioGroup */}
            <Box mb={3}>
              <RadioGroup
                value={signatureType}
                onChange={(e) => setSignatureType(e.target.value)}
              >
                <FormControlLabel
                  value="standard"
                  control={
                    <Radio
                      sx={{
                        color: "#000",
                        "&.Mui-checked": { color: "#9c27b0" },
                      }}
                    />
                  }
                  label={
                    <Box
                      display="flex"
                      alignItems="center"
                      width="100%"
                      gap={0}
                    >
                      <Typography variant="body1" fontWeight={500}>
                        Ký thường
                      </Typography>
                      <Box
                        component="img"
                        src={signatureImage}
                        sx={{
                          width: 60,
                          height: 50,
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          p: 0.5,
                          marginLeft: "auto",
                        }}
                      />
                    </Box>
                  }
                />
                <FormControlLabel
                  value="initials"
                  control={
                    <Radio
                      sx={{
                        color: "#000",
                        "&.Mui-checked": { color: "#9c27b0" },
                      }}
                    />
                  }
                  label={
                    <Box
                      display="flex"
                      alignItems="center"
                      width="100%"
                      gap={0}
                    >
                      <Typography variant="body1" fontWeight={500}>
                        Ký nháy
                      </Typography>
                      <Box
                        component="img"
                        src={signatureImage}
                        sx={{
                          width: 60,
                          height: 50,
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          p: 0.5,
                          marginLeft: "auto",
                        }}
                      />
                    </Box>
                  }
                />

                {/* Chữ ký số Section within same RadioGroup */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    backgroundColor: "#fafafa",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Chữ ký số
                  </Typography>

                  <FormControlLabel
                    value="display-default"
                    control={
                      <Radio
                        sx={{
                          color: "#000",
                          "&.Mui-checked": { color: "#9c27b0" },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{ fontSize: 14 }}
                      >
                        Hiển thị mặc định
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="display-signature"
                    control={
                      <Radio
                        sx={{
                          color: "#000",
                          "&.Mui-checked": { color: "#9c27b0" },
                        }}
                      />
                    }
                    label={
                      <Box
                        display="flex"
                        alignItems="center"
                        width="100%"
                        gap={0.5}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{ fontSize: 14 }}
                        >
                          Hiển thị chữ ký thường
                        </Typography>
                        <Box
                          component="img"
                          src={signatureImage}
                          sx={{
                            width: 60,
                            height: 50,
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            p: 0.5,
                            marginRight: "auto",
                          }}
                        />
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="display-initials"
                    control={
                      <Radio
                        sx={{
                          color: "#000",
                          "&.Mui-checked": { color: "#9c27b0" },
                        }}
                      />
                    }
                    label={
                      <Box
                        display="flex"
                        alignItems="center"
                        width="100%"
                        gap={0.5}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{ fontSize: 14 }}
                        >
                          Hiển thị chữ ký nháy
                        </Typography>
                        <Box
                          component="img"
                          src={signatureImage}
                          sx={{
                            width: 60,
                            height: 50,
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            p: 0.5,
                            marginLeft: "auto",
                          }}
                        />
                      </Box>
                    }
                  />
                </Box>
              </RadioGroup>
            </Box>

            <Divider sx={{ my: 2 }} />
          </Box>

          {/* Action Buttons */}
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#04b46e",
                color: "white",
                fontWeight: 600,
                padding: "8px 12px",
                fontSize: 14,
                "&:hover": { backgroundColor: "#039558" },
              }}
              startIcon={<span>🖋️</span>}
            >
              Ký
            </Button>

            <Box sx={{ minHeight: 60 }} />

            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#1FA463",
                color: "white",
                fontWeight: 600,
                padding: "8px 12px",
                fontSize: 14,
                "&:hover": { backgroundColor: "#168a4a" },
              }}
              startIcon={<span>✓</span>}
              onClick={onSign}
            >
              Xác nhận
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                color: "#ff6b6b",
                borderColor: "#ff6b6b",
                fontWeight: 600,
                padding: "8px 12px",
                fontSize: 14,
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 107, 0.05)",
                  borderColor: "#ff6b6b",
                },
              }}
              startIcon={<Close sx={{ fontSize: 18 }} />}
              onClick={onCancel}
            >
              Hủy
            </Button>
          </Box>
        </Paper>

        {/* Right Content Area */}
        <Box
          sx={{
            flex: 1,
            padding: 0,
            overflow: "auto",
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {documents && documents.length > 0 ? (
            <Box sx={{ width: "100%", padding: 2, paddingBottom: 4 }}>
              {documents.map((doc: any) => (
                <Box key={doc.id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    {doc.name}
                  </Typography>
                  {doc.file ? (
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <Typography variant="body2">📎 {doc.file}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Không có tài liệu đính kèm
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              ref={containerRef}
              sx={{
                width: "100%",
                flex: 1,
                backgroundColor: "#f0f0f0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                gap: 2,
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                pages.map((imageUrl, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={imageUrl}
                      alt={`Page ${index + 1}`}
                      sx={{
                        display: "block",
                        maxWidth: "100%",
                        height: "auto",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>

        {/* Snackbar notification */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Đã xuất PDF thành công
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
