import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/api.config";
import {
  Box,
  Button,
  Typography,
  Stack,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import { Print, TableChart } from "@mui/icons-material";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import FieldYearMonth from "../../../components/TextField/FieldYearMonth";
import MauSo01Content from "./MauSo01Content";

export default function MauSo01({ title }: { title?: string }) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [contentData, setContentData] = useState({});
  const [fetchKey, setFetchKey] = useState(0);

  const handleContentChange = useCallback((data: any) => {
    setContentData(data);
  }, []);

  const formik = useFormik({
    initialValues: {
      IdDonVi: "",
      KyBaoCao: `${String(new Date().getMonth() + 1).padStart(
        2,
        "0",
      )}/${new Date().getFullYear()}`,
    },
    onSubmit: (values) => {
      // require IdDonVi before fetching
      if (!values.IdDonVi) {
        setSnackbarMessage("Vui lòng chọn đơn vị trước khi lấy dữ liệu");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
      console.log("Lấy dữ liệu báo cáo:", values);
      setFetchKey((k) => k + 1);
    },
  });

  const idCongTy = "ct001";
  const { data: departments = [] } = useQuery({
    queryKey: ["departments", idCongTy],
    queryFn: async () =>
      (await api.get("/phongban", { params: { idcongty: idCongTy } })).data,
  });

  const handleExport = () => {
    const hasContent = (data: any) => {
      if (!data) return false;
      if (Array.isArray(data)) return data.length > 0;
      for (const k of Object.keys(data)) {
        const v = (data as any)[k];
        if (Array.isArray(v) && v.length > 0) return true;
        if (v && typeof v === "object") {
          for (const k2 of Object.keys(v)) {
            const v2 = v[k2];
            if (Array.isArray(v2) && v2.length > 0) return true;
          }
        }
      }
      return false;
    };

    if (!hasContent(contentData)) {
      setSnackbarMessage("Chưa có dữ liệu để xuất!");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    // TODO: implement export when data exists
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 2,
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          p: 3,
          bgcolor: "white",
          border: "2px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {title && (
          <Box sx={{ textAlign: "center", pb: 2, mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: "25px",
              }}
            >
              {title}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <FieldAutoCompleted
            title="Đơn vị"
            labelkey="tenPhongBan"
            data={departments}
            formik={formik}
            field="IdDonVi"
            componentsProps={{
              paper: {
                sx: {
                  backgroundColor: "#fff0f5",
                  borderRadius: "6px",
                },
              },
              popper: {
                style: { width: 360, overflow: "visible" },
                placement: "bottom-start",
              },
              listbox: {
                sx: { maxHeight: 220, overflow: "auto" },
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FieldYearMonth title="Kỳ báo cáo" formik={formik} field="KyBaoCao" />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#4caf50",
              color: "white",
              textTransform: "none",
              fontSize: 14,
              fontWeight: 500,
              "&:hover": { bgcolor: "#45a049" },
            }}
            onClick={formik.submitForm}
          >
            Lấy dữ liệu
          </Button>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Tooltip title="Xuất excel">
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#4caf50",
                  color: "white",
                  minWidth: "44px",
                  width: "44px",
                  height: "44px",
                  p: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { bgcolor: "#45a049" },
                }}
                onClick={handleExport}
              >
                <TableChart />
              </Button>
            </Tooltip>
            <Tooltip title="In">
              <Button
                variant="contained"
                color="info"
                sx={{
                  minWidth: "44px",
                  width: "44px",
                  height: "44px",
                  p: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Print />
              </Button>
            </Tooltip>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          p: 3,
          height: "800px",
          bgcolor: "white",
          border: "2px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <MauSo01Content
          onContentChange={handleContentChange}
          idDonVi={formik.values.IdDonVi}
          fetchKey={fetchKey}
          kyBaoCao={formik.values.KyBaoCao}
          onFetchSuccess={() => {
            setSnackbarMessage("Lấy dữ liệu thành công");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
          }}
        />
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
