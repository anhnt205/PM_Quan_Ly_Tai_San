import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  TextField,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import type { PlanSigner } from "../../../../mockdata/mockPlans";
import type { IncidenDetailData } from "../../types";

interface Props {
  number?: string;
  detectedAt?: string;
  reporter?: string;
  reporterDeptId?: string;
  signers?: PlanSigner[];
  systemName?: string;
  subsystem?: string;
  location?: string;
  description?: string;
  severity?: number;
  deviceEntries?: IncidenDetailData[];
  onDeviceEntriesChange?: (entries: IncidenDetailData[]) => void;
  planIds?: string[];
}

// ─── Ô text chỉnh sửa inline ───
const EditableCell = ({
  value,
  onChange,
  placeholder = "—",
  width = 100,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDraft(value);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  const save = () => {
    onChange(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          minWidth: width,
        }}
      >
        <TextField
          inputRef={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancel();
          }}
          size="small"
          variant="standard"
          sx={{ flex: 1 }}
          inputProps={{ style: { fontSize: 11, padding: "2px 0" } }}
        />
        <IconButton size="small" onClick={save} sx={{ p: 0.3 }}>
          <CheckIcon sx={{ fontSize: 13, color: "success.main" }} />
        </IconButton>
        <IconButton size="small" onClick={cancel} sx={{ p: 0.3 }}>
          <CloseIcon sx={{ fontSize: 13, color: "error.main" }} />
        </IconButton>
      </Box>
    );
  }

  return (
    <Tooltip title="Nhấn để chỉnh sửa" placement="top" arrow>
      <Box
        onClick={startEdit}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          cursor: "pointer",
          minWidth: width,
          borderRadius: 1,
          px: 0.5,
          py: 0.25,
          "&:hover": { bgcolor: "action.hover" },
          "&:hover .edit-icon": { opacity: 1 },
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            flex: 1,
            color: value ? "text.primary" : "text.disabled",
            fontStyle: value ? "normal" : "italic",
          }}
        >
          {value || placeholder}
        </Typography>
        <EditIcon
          className="edit-icon"
          sx={{
            fontSize: 11,
            color: "primary.main",
            opacity: 0,
            transition: "opacity 0.15s",
            flexShrink: 0,
          }}
        />
      </Box>
    </Tooltip>
  );
};

// ─── Ô dropdown chọn phòng ban ───
const DeptSelectCell = ({
  value,
  onChange,
  departments,
  placeholder = "— Chọn đơn vị —",
  width = 140,
}: {
  value: string;
  onChange: (name: string) => void;
  departments: { id: string; name: string }[];
  placeholder?: string;
  width?: number;
}) => {
  // Tìm id theo tên đang lưu để Select hiển thị đúng
  const selectedId = departments.find((d) => d.name === value)?.id ?? "";

  return (
    <Tooltip title="Nhấn để chọn đơn vị" placement="top" arrow>
      <Box sx={{ minWidth: width }}>
        <Select
          value={selectedId}
          onChange={(e) => {
            const dept = departments.find((d) => d.id === e.target.value);
            if (dept) onChange(dept.id);
            else onChange("");
          }}
          displayEmpty
          size="small"
          variant="standard"
          IconComponent={UnfoldMoreIcon}
          renderValue={() => (
            <Typography
              sx={{
                fontSize: 11,
                color: value ? "text.primary" : "text.disabled",
                fontStyle: value ? "normal" : "italic",
              }}
            >
              {value || placeholder}
            </Typography>
          )}
          sx={{
            width: "100%",
            fontSize: 11,
            "&:before": { borderBottom: "none" },
            "&:hover:not(.Mui-disabled):before": {
              borderBottom: "1px solid rgba(0,0,0,0.2)",
            },
            "& .MuiSelect-icon": { fontSize: 14, color: "primary.main" },
            "& .MuiSelect-select": {
              py: 0.25,
              px: 0.5,
              borderRadius: 1,
              "&:hover": { bgcolor: "action.hover" },
            },
          }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 260 } } }}
        >
          <MenuItem
            value=""
            sx={{ fontSize: 11, fontStyle: "italic", color: "text.disabled" }}
          >
            — Chọn đơn vị —
          </MenuItem>
          {departments.map((d) => (
            <MenuItem key={d.id} value={d.id} sx={{ fontSize: 11 }}>
              {d.id}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Tooltip>
  );
};

// ─── Component chính ───
const IncidentPreview = ({
  number,
  detectedAt,
  reporter,
  reporterDeptId,
  signers = [],
  systemName,
  subsystem,
  location,
  description,
  severity,
  deviceEntries = [],
  onDeviceEntriesChange,
  planIds = [],
}: Props) => {
  const severityLabels: Record<number, string> = {
    0: "Nhẹ",
    1: "Trung bình",
    2: "Nặng",
    3: "Nghiêm trọng",
  };
  const severityText =
    severity !== undefined ? severityLabels[severity] : "...";

  const { data: apiDepartments = [] } = useAllDepartmentsQuery();

  const departments: { id: string; name: string }[] = (
    apiDepartments || []
  ).map((d: any) => ({
    id: String(d?.id ?? ""),
    name: String(d?.tenPhongBan ?? d?.name ?? ""),
  }));

  // Tên đơn vị báo cáo = đơn vị quản lý TB
  const reporterDeptName =
    departments.find((d) => d.id === reporterDeptId)?.name ?? "";

  const today = new Date();
  const dateStr = detectedAt
    ? (() => {
        const d = new Date(detectedAt);
        return !isNaN(d.getTime())
          ? `Quảng Ninh, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`
          : detectedAt;
      })()
    : `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  const detectedAtDisplay = detectedAt
    ? (() => {
        const d = new Date(detectedAt);
        return !isNaN(d.getTime())
          ? d.toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : detectedAt;
      })()
    : "...";

  const updateEntry = (
    idx: number,
    field: keyof IncidenDetailData,
    value: string,
  ) => {
    if (!onDeviceEntriesChange) return;
    const updatedValue = field === "soLuong" ? Number(value) : value;
    onDeviceEntriesChange(
      deviceEntries.map((e, i) =>
        i === idx ? { ...e, [field]: updatedValue } : e,
      ),
    );
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, mt: 0, fontFamily: '"Times New Roman", serif' }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}
          >
            CÔNG TY THAN UÔNG BÍ - TKV
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            Đơn vị: {reporterDeptName}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}
          >
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            Độc lập – Tự do – Hạnh phúc
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          textAlign: "right",
          fontStyle: "italic",
          fontSize: 12,
          mb: 2,
          fontFamily: "inherit",
        }}
      >
        {dateStr}
      </Typography>

      <Typography
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 16,
          color: "primary.main",
          fontFamily: "inherit",
        }}
      >
        PHIẾU BÁO SỰ CỐ THIẾT BỊ
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          color: "error.main",
          fontSize: 13,
          mb: 2,
          fontFamily: "inherit",
        }}
      >
        Số: {number || "..."}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: "inherit" }}>
        - Đơn vị báo cáo: <b>{reporterDeptName || "..."}</b>
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: "inherit" }}>
        - Ngày giờ phát hiện: <b>{detectedAtDisplay}</b>
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: "inherit" }}>
        - Tên hệ thống/thiết bị gặp sự cố: <b>{systemName || "..."}</b>
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: "inherit" }}>
        - Phân hệ/vị trí xảy ra sự cố: <b>{subsystem || "..."}</b>
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: "inherit" }}>
        - Mô tả tình trạng sự cố: {description || "..."}
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 2, fontFamily: "inherit" }}>
        - Đánh giá mức độ:{" "}
        <b style={{ color: severity === 3 ? "#d32f2f" : undefined }}>
          {severityText}
        </b>
      </Typography>

      {/* Table */}
      <Typography
        sx={{ fontSize: 12, fontWeight: 700, mb: 1, fontFamily: "inherit" }}
      >
        Danh sách hệ thống/thiết bị bị sự cố:
      </Typography>

      {deviceEntries.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <EditIcon sx={{ fontSize: 12, color: "primary.main" }} />
          <Typography variant="caption" color="primary.main">
            Các cột có biểu tượng bút / mũi tên có thể nhấn để chỉnh sửa trực
            tiếp
          </Typography>
        </Box>
      )}

      <TableContainer sx={{ mb: 2 }}>
        <Table
          size="small"
          sx={{
            "& th, & td": {
              fontSize: 11,
              fontFamily: '"Times New Roman", serif',
              border: "1px solid #999",
              py: 0.5,
              px: 1,
            },
          }}
        >
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                STT
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Số chứng chỉ từ
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Mã thiết bị
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Tên TB
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Nhóm chủng loại
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Số lượng
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  Thuộc hệ thống{" "}
                  <EditIcon sx={{ fontSize: 11, color: "primary.main" }} />
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  Vị trí{" "}
                  <EditIcon sx={{ fontSize: 11, color: "primary.main" }} />
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  Tình trạng{" "}
                  <EditIcon sx={{ fontSize: 11, color: "primary.main" }} />
                </Box>
              </TableCell>
              {/* Đơn vị quản lý TB = đơn vị báo cáo, không cho sửa */}
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Đơn vị quản lý TB
              </TableCell>
              {/* Đơn vị quản lý KT → dropdown chọn phòng ban */}
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  Đơn vị quản lý KT{" "}
                  <UnfoldMoreIcon
                    sx={{ fontSize: 12, color: "primary.main" }}
                  />
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Mức độ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceEntries.length > 0 ? (
              deviceEntries.map((entry, idx) => (
                <TableRow key={`${entry.idTaiSan}-${idx}`}>
                  <TableCell align="center">{idx + 1}</TableCell>
                  <TableCell align="center">{number}</TableCell>
                  <TableCell align="center">{entry.idTaiSan}</TableCell>
                  <TableCell>{entry.tenTaiSan}</TableCell>

                  {/* Nhóm chủng loại — từ API */}
                  <TableCell align="center">
                    {entry.tenNhomTaiSan || "—"}
                  </TableCell>

                  {/* Số lượng */}
                  <TableCell align="center">
                    <EditableCell
                      value={String(entry.soLuong ?? 1)}
                      onChange={(v) => updateEntry(idx, "soLuong", v)}
                      width={60}
                    />
                  </TableCell>

                  {/* Thuộc hệ thống — không có trong API → edit text */}
                  <TableCell sx={{ minWidth: 110 }}>
                    <EditableCell
                      value={entry.thuocHeThong || ""}
                      onChange={(v) => updateEntry(idx, "thuocHeThong", v)}
                      placeholder="Nhập hệ thống..."
                      width={100}
                    />
                  </TableCell>

                  {/* Vị trí — từ API */}
                  <TableCell align="center">
                    {" "}
                    <EditableCell
                      value={entry.viTri || ""}
                      onChange={(v) => updateEntry(idx, "viTri", v)}
                      placeholder="Vị trí..."
                      width={100}
                    />
                  </TableCell>

                  {/* Tình trạng — map từ hienTrang, cho sửa */}
                  <TableCell sx={{ minWidth: 120 }}>
                    <EditableCell
                      value={entry.tinhTrang || ""}
                      onChange={(v) => updateEntry(idx, "tinhTrang", v)}
                      placeholder="Nhập tình trạng..."
                      width={110}
                    />
                  </TableCell>

                  {/* Đơn vị quản lý TB — tự động = đơn vị báo cáo */}
                  <TableCell align="center">{reporterDeptId || "—"}</TableCell>

                  {/* Đơn vị quản lý KT — dropdown chọn phòng ban */}
                  <TableCell sx={{ minWidth: 150 }}>
                    <DeptSelectCell
                      value={entry.idDonViQuanLyKyThuat || ""}
                      onChange={(name) =>
                        updateEntry(idx, "idDonViQuanLyKyThuat", name)
                      }
                      departments={departments}
                      width={140}
                    />
                  </TableCell>

                  <TableCell align="center">{severityText}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Chưa có thiết bị nào được thêm
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Signatures */}
      <Box
        sx={{ mt: 4, display: "flex", justifyContent: "space-between", gap: 2 }}
      >
        {(() => {
          const sorted = [...(signers || [])].sort(
            (a, b) => (a.order || 0) - (b.order || 0),
          );
          const cols = sorted.map((s, idx) => ({
            label:
              idx === 0
                ? "Người lập"
                : idx === sorted.length - 1
                  ? "Phê duyệt"
                  : (s.departmentName || "").toUpperCase(),
            signer: s,
          }));

          if (cols.length === 0) {
            return (
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography variant="caption" color="text.disabled">
                  Chưa có người duyệt
                </Typography>
              </Box>
            );
          }

          return cols.map((col, idx) => (
            <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                variant="caption"
                fontWeight={700}
                display="block"
                sx={{ textTransform: "uppercase", mb: 0.5 }}
              >
                {col.label}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ fontStyle: "italic", mb: 4 }}
              >
                (Ký, ghi rõ họ tên)
              </Typography>
              <Box
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "text.primary",
                  width: "70%",
                  mx: "auto",
                  mb: 0.5,
                }}
              />
              {col.signer ? (
                <>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    display="block"
                  >
                    {col.signer.userName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {col.signer.departmentName}
                  </Typography>
                </>
              ) : (
                <Typography variant="caption" color="text.disabled">
                  Chưa chọn
                </Typography>
              )}
            </Box>
          ));
        })()}
      </Box>
    </Paper>
  );
};

export default IncidentPreview;
