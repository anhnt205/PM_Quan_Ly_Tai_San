import { useEffect, useState, useCallback } from "react";
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
import FieldYear from "../../../components/TextField/FieldYear";
import ReportS22DNContent from "./ReportS22DNContent";

export default function ReportS22DN({ title }: { title?: string }) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [contentData, setContentData] = useState({});

  const handleContentChange = useCallback((data: any) => {
    setContentData(data);
  }, []);

  const formik = useFormik({
    initialValues: {
      IdDonVi: "",
      Nam: new Date().getFullYear(),
    },
    onSubmit: (values) => {
      console.log("Lấy dữ liệu báo cáo:", values);
      setSnackbarMessage("Không có dữ liệu!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
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
        minHeight: "auto",
        position: "relative",
        zIndex: 0,
      }}
    >
      {/* Box 1: Form chọn đơn vị, năm và các nút */}
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
            title="Chọn đơn vị"
            labelkey="department"
            data={[]}
            formik={formik}
            field="IdDonVi"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FieldYear title="Năm" formik={formik} field="Nam" />
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

      {/* Box 2: Nội dung báo cáo */}
      <Box
        sx={{
          p: 3,
          height: "300px",
          bgcolor: "white",
          border: "2px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <ReportS22DNContent onContentChange={handleContentChange} />
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
