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
} from "@mui/material";
import { useFormik } from "formik";
import { Print, TableChart } from "@mui/icons-material";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import FieldYearMonth from "../../../components/TextField/FieldYearMonth";
import MauSo01Content from "./MauSo01Content";

export default function MauSo01({ title }: { title?: string }) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );
  const [contentData, setContentData] = useState({});

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
      console.log("Lấy dữ liệu báo cáo:", values);
      setSnackbarMessage("Không có dữ liệu!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
  });

  const idCongTy = "ct001";
  const { data: departments = [] } = useQuery({
    queryKey: ["departments", idCongTy],
    queryFn: async () =>
      (await api.get("/phongban", { params: { idcongty: idCongTy } })).data,
  });

  const handleExport = () => {
    setSnackbarMessage("Không có dữ liệu để xuất!");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
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
        <MauSo01Content onContentChange={handleContentChange} />
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
