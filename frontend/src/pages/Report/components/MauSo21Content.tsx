import React, { useState, useMemo } from "react";
import { Box, Typography, TextField, Grid } from "@mui/material";
import InlineCell from "../../../components/common/InlineCell";
import api from "../../../config/api.config";

interface MauSo21ContentProps {
  onContentChange?: (content: any) => void;
  selectedDeptName?: string;
  selectedDeptAssetGroupName?: string;
  idDonVi?: string;
  selectedYear?: string | number;
  idCongTy?: string;
  idNhomTaiSan?: string | number;
  ngayBaoCao?: string;
  fetchKey?: number;
  onFetchSuccess?: () => void;
}

export default function MauSo21Content({
  onContentChange,
  selectedDeptName,
  selectedDeptAssetGroupName,
  selectedYear,
  idCongTy,
  idNhomTaiSan,
  idDonVi,
  ngayBaoCao,
  fetchKey,
  onFetchSuccess,
}: MauSo21ContentProps) {
  const [formData, setFormData] = useState({
    donVi: "",
    diaChi: "",
    nam: "",
    loaiTaiSan: "",
  });

  const [rows, setRows] = useState<any[]>([]);
  const handleRowChange = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    if (index >= 0 && index < newRows.length) {
      newRows[index] = { ...newRows[index], [field]: value };
      setRows(newRows);
      onContentChange?.({ diaChi: formData.diaChi, rows: newRows, footerData });
    }
  };
  const [loading, setLoading] = useState(false);

  const fmt = (v: any) => (v === null || v === undefined ? "" : String(v));

  const parseNumber = (v: any) => {
    if (v === null || v === undefined || v === "") return 0;
    try {
      const s = String(v).replace(/[,\s]/g, "");
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  };

  const formatToDMY = (v: any) => {
    if (v === null || v === undefined || v === "") return "";
    const s = String(v).trim();
    const m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }
    return s.split(" ")[0];
  };

  const integerPartString = (v: any) => {
    if (v === null || v === undefined || v === "") return "";
    const s = String(v).trim();
    const n = Number(s.replace(/[,\s]/g, ""));
    if (Number.isFinite(n)) return String(Math.trunc(n));
    if (s.indexOf(".") >= 0) return s.split(".")[0];
    return s;
  };

  const formatNumber = (n: number) => {
    if (!Number.isFinite(n) || n === 0) return "";
    return n.toLocaleString("en-US");
  };

  const { totalNguyenGia, totalKhauHaoDaTinh } = useMemo(() => {
    const t1 = rows.reduce((s, r) => s + parseNumber(r.nguyenGia), 0);
    const t2 = rows.reduce((s, r) => s + parseNumber(r.khauHaoDaTinh), 0);
    return { totalNguyenGia: t1, totalKhauHaoDaTinh: t2 };
  }, [rows]);

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    // Always preserve rows when updating form data
    onContentChange?.({ ...newData, rows, footerData });
  };

  const dottedInputSx = {
    "& .MuiInput-root": {
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: "inherit",
      marginTop: "0px",
      "&:before": { borderBottom: "1px dotted #000 !important" },
      "&:after": { borderBottom: "1px solid #000" },
    },
    "& input": {
      textAlign: "center",
      padding: "0 2px",
      height: "auto",
      lineHeight: "1.2",
      fontWeight: "bold",
    },
  };

  const dottedInputLeftSx = {
    ...dottedInputSx,
    "& input": {
      textAlign: "left",
      fontWeight: "normal",
    },
  };

  const fontStyle = {
    fontFamily: "inherit",
    fontSize: "inherit",
  };

  const footerData = {
    soTrang: "",
    denTrang: "",
    ngayMoSo: "",
    ngayKy: "",
    thangKy: "",
    namKy: "",
  };

  const handleFooterChange = (field: string, value: string) => {};

  React.useEffect(() => {
    if (
      selectedYear !== undefined &&
      selectedYear !== null &&
      selectedYear !== ""
    ) {
      setFormData((prev) => {
        const newData = { ...prev, nam: String(selectedYear) };
        onContentChange?.({ ...newData });
        return newData;
      });
    }
  }, [selectedYear, onContentChange]);

  const tableHeaderStyle: React.CSSProperties = {
    border: "1px solid #000",
    padding: "5px",
    verticalAlign: "middle",
    backgroundColor: "#f0f0f0",
  };

  const tableCellStyle: React.CSSProperties = {
    border: "1px solid #000",
    padding: "5px",
    height: "25px",
    verticalAlign: "middle",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (!idCongTy || !selectedYear) return;
      setLoading(true);
      try {
        let day = 1,
          month = 1;
        if (ngayBaoCao) {
          try {
            const d = new Date(ngayBaoCao);
            day = d.getDate() || 1;
            month = d.getMonth() + 1 || 1;
          } catch {}
        }

        const params: any = {
          idcongty: idCongTy,
          ngay: day,
          thang: month,
          nam: selectedYear,
          idDonViHienThoi: idDonVi,
        };
        if (idNhomTaiSan) params.idNhomTaiSan = idNhomTaiSan;

        const res = await api.get("/taisan/khauhaotaisanbynhom", { params });
        const data = res?.data?.data?.items || [];

        const map = (item: any) => {
          const date = formatToDMY(item?.ngayTinhKhao ?? item?.ngay ?? "");

          return {
            soHieu: "",
            ngay: date,
            ten: fmt(item?.tenTaiSan || ""),
            nuocSanXuat: "",
            thangNam: (function () {
              const raw = item?.thangKh ?? item?.thang ?? "";
              const v = fmt(raw);
              return v ? `Tháng ${v}` : "";
            })(),
            soHieuTscd: fmt(item?.soThe || ""),
            nguyenGia: integerPartString(item?.nguyenGia ?? ""),
            tyLeKhauHao: "",
            mucKhauHao: integerPartString(
              item?.khauHaoBinhQuan ?? item?.soTien ?? "",
            ),
            khauHaoDaTinh: integerPartString(item?.khauHaoPsck ?? ""),
            __raw: item,
          };
        };

        const BATCH = 200;
        setRows([]);
        const acc: any[] = [];
        for (let i = 0; i < data.length; i += BATCH) {
          const chunk = data.slice(i, i + BATCH).map(map);
          acc.push(...chunk);
          setRows((prev) => [...prev, ...chunk]);
          await new Promise((r) => setTimeout(r, 0));
        }

        const finalData = {
          diaChi: formData.diaChi,
          rows: acc,
          footerData: {},
        };
        onContentChange?.(finalData);
        onFetchSuccess?.();
      } catch (err) {
        console.error("Fetch khauhao error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchKey]);

  return (
    <Box
      sx={{
        fontFamily: "'Times New Roman', Times, serif !important",
        fontSize: "16px",
        color: "#000",
        width: "100%",
        backgroundColor: "transparent",
        lineHeight: 1.4,
        p: 2,
      }}
      id="printable-mauso21-content"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box sx={{ minWidth: "300px" }}>
          <Box sx={{ display: "flex", alignItems: "baseline", mb: 0.5 }}>
            <Typography
              sx={{
                fontFamily: "inherit",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                mr: 1,
              }}
            >
              Đơn vị:
            </Typography>
            <Typography>{selectedDeptName || ""}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "baseline" }}>
            <Typography
              sx={{ fontFamily: "inherit", whiteSpace: "nowrap", mr: 1 }}
            >
              Địa chỉ:
            </Typography>
            <TextField
              value={formData.diaChi}
              onChange={(e) => handleInputChange("diaChi", e.target.value)}
              variant="standard"
              fullWidth
              sx={{ ...dottedInputLeftSx }}
            />
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", minWidth: "250px" }}>
          <Typography
            sx={{
              fontFamily: "inherit",
              fontSize: "12pt",
              fontWeight: "bold",
              lineHeight: 1.3,
              mb: 0.5,
            }}
          >
            Mẫu số S21-DN
          </Typography>
          <Typography
            sx={{
              fontFamily: "inherit",
              fontSize: "10pt",
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            (Ban hành theo Thông tư số 200/2014/TT-BTC
          </Typography>
          <Typography
            sx={{
              fontFamily: "inherit",
              fontSize: "10pt",
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            ngày 22/12/2014 của Bộ Tài chính)
          </Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "inherit",
            fontSize: "18pt",
            fontWeight: "bold",
            textTransform: "uppercase",
            lineHeight: 1.4,
            mb: 2,
          }}
        >
          SỔ TÀI SẢN CỐ ĐỊNH
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            fontSize: "inherit",
            mb: 1,
          }}
        >
          <span>Năm:</span>
          {formData.nam ? (
            <Typography
              component="span"
              sx={{
                width: "80px",
                mx: 1,
                display: "inline-block",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {formData.nam}
            </Typography>
          ) : (
            <TextField
              value={formData.nam}
              onChange={(e) => handleInputChange("nam", e.target.value)}
              variant="standard"
              sx={{ ...dottedInputSx, width: "80px", mx: 1 }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            fontSize: "inherit",
            mb: 1,
          }}
        >
          <Typography component="span" sx={{ fontFamily: "inherit", mr: 1 }}>
            Loại tài sản:{" "}
            <b style={{ fontWeight: "bold" }}>
              {selectedDeptAssetGroupName || formData.loaiTaiSan || ""}
            </b>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ overflowX: "auto", width: "100%", mt: 2 }}>
        <table
          style={
            {
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: "10pt",
              minWidth: "1400px",
              tableLayout: "fixed",
            } as React.CSSProperties
          }
        >
          <thead>
            <tr style={{ textAlign: "center", fontWeight: "bold" }}>
              <th rowSpan={3} style={tableHeaderStyle}>
                STT
              </th>
              <th colSpan={7} style={tableHeaderStyle}>
                Ghi tăng TSCĐ
              </th>
              <th colSpan={3} style={tableHeaderStyle}>
                Khấu hao TSCĐ
              </th>
              <th colSpan={3} style={tableHeaderStyle}>
                Ghi giảm TSCĐ
              </th>
            </tr>

            <tr style={{ textAlign: "center", fontWeight: "bold" }}>
              <th colSpan={2} style={tableHeaderStyle}>
                Chứng từ
              </th>
              <th rowSpan={2} style={tableHeaderStyle}>
                Tên, đặc điểm, ký hiệu TSCĐ
              </th>
              <th rowSpan={2} style={tableHeaderStyle}>
                Nước sản xuất
              </th>
              <th rowSpan={2} style={tableHeaderStyle}>
                Tháng năm đưa vào sử dụng
              </th>
              <th rowSpan={2} style={tableHeaderStyle}>
                Số hiệu TSCĐ
              </th>
              <th rowSpan={2} style={tableHeaderStyle}>
                Nguyên giá TSCĐ
              </th>

              <th colSpan={2} style={tableHeaderStyle}>
                Khấu hao
              </th>
              <th rowSpan={2} style={tableHeaderStyle}>
                Khấu hao đã tính đến khi ghi giảm TSCĐ
              </th>

              <th colSpan={2} style={tableHeaderStyle}>
                Chứng từ
              </th>
              <th rowSpan={2} style={tableHeaderStyle}>
                Lý do giảm TSCĐ
              </th>
            </tr>

            <tr style={{ textAlign: "center", fontWeight: "bold" }}>
              <th style={tableHeaderStyle}>Số hiệu</th>
              <th style={tableHeaderStyle}>Ngày tháng</th>

              <th style={tableHeaderStyle}>Tỷ lệ (%) khấu hao</th>
              <th style={tableHeaderStyle}>Mức khấu hao</th>

              <th style={tableHeaderStyle}>Số hiệu</th>
              <th style={tableHeaderStyle}>Ngày, tháng, năm</th>
            </tr>

            <tr style={{ textAlign: "center", fontStyle: "italic" }}>
              <th style={tableHeaderStyle}>A</th>
              <th style={tableHeaderStyle}>B</th>
              <th style={tableHeaderStyle}>C</th>
              <th style={tableHeaderStyle}>D</th>
              <th style={tableHeaderStyle}>E</th>
              <th style={tableHeaderStyle}>G</th>
              <th style={tableHeaderStyle}>H</th>
              <th style={tableHeaderStyle}>I</th>
              <th style={tableHeaderStyle}>2</th>
              <th style={tableHeaderStyle}>3</th>
              <th style={tableHeaderStyle}>4</th>
              <th style={tableHeaderStyle}>K</th>
              <th style={tableHeaderStyle}>L</th>
              <th style={tableHeaderStyle}>M</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td style={{ ...tableCellStyle, textAlign: "center" }}>
                  {idx + 1}
                </td>
                <td style={tableCellStyle}>
                  <InlineCell
                    value={r.soHieu || ""}
                    onCommit={(v) => handleRowChange(idx, "soHieu", v)}
                    align="left"
                  />
                </td>
                <td style={tableCellStyle}>
                  <InlineCell
                    value={r.ngay || ""}
                    onCommit={(v) => handleRowChange(idx, "ngay", v)}
                    align="left"
                  />
                </td>
                <td style={tableCellStyle}>
                  <InlineCell
                    value={r.ten || ""}
                    onCommit={(v) => handleRowChange(idx, "ten", v)}
                    align="left"
                  />
                </td>
                <td style={tableCellStyle}>
                  <InlineCell
                    value={r.nuocSanXuat || ""}
                    onCommit={(v) => handleRowChange(idx, "nuocSanXuat", v)}
                    align="left"
                  />
                </td>
                <td style={tableCellStyle}>
                  <InlineCell
                    value={r.thangNam || ""}
                    onCommit={(v) => handleRowChange(idx, "thangNam", v)}
                    align="left"
                  />
                </td>
                <td style={tableCellStyle}>
                  <InlineCell
                    value={r.soHieuTscd || ""}
                    onCommit={(v) => handleRowChange(idx, "soHieuTscd", v)}
                    align="left"
                  />
                </td>
                <td style={tableCellStyle}>
                  <InlineCell
                    value={r.nguyenGia || ""}
                    onCommit={(v) => handleRowChange(idx, "nguyenGia", v)}
                    align="right"
                  />
                </td>
                <td style={tableCellStyle}>
                  <InlineCell
                    value={r.tyLeKhauHao || ""}
                    onCommit={(v) => handleRowChange(idx, "tyLeKhauHao", v)}
                    align="right"
                  />
                </td>
                <td style={tableCellStyle}>
                  <InlineCell
                    value={r.mucKhauHao || ""}
                    onCommit={(v) => handleRowChange(idx, "mucKhauHao", v)}
                    align="right"
                  />
                </td>
                <td style={tableCellStyle}>
                  <InlineCell
                    value={r.khauHaoDaTinh || ""}
                    onCommit={(v) => handleRowChange(idx, "khauHaoDaTinh", v)}
                    align="right"
                  />
                </td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
              </tr>
            ))}

            <tr style={{ fontWeight: "bold" }}>
              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}>Cộng</td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={tableCellStyle}></td>

              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={{ ...tableCellStyle, textAlign: "right" }}>
                {formatNumber(totalNguyenGia)}
              </td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={{ ...tableCellStyle, textAlign: "right" }}>
                {formatNumber(totalKhauHaoDaTinh)}
              </td>

              <td style={tableCellStyle}></td>
              <td style={tableCellStyle}></td>
              <td style={tableCellStyle}></td>
            </tr>
          </tbody>
        </table>
      </Box>
      <Box sx={{ ...fontStyle }}>
        <Box sx={{ mb: 1, display: "flex", alignItems: "baseline" }}>
          <Typography component="span" sx={fontStyle}>
            - Sổ này có&nbsp;
          </Typography>
          <TextField
            variant="standard"
            value={footerData.soTrang}
            onChange={(e) => handleFooterChange("soTrang", e.target.value)}
            sx={{ ...dottedInputSx, width: "50px" }}
          />
          <Typography component="span" sx={fontStyle}>
            &nbsp;trang, đánh số từ trang 01 đến trang&nbsp;
          </Typography>
          <TextField
            variant="standard"
            value={footerData.denTrang}
            onChange={(e) => handleFooterChange("denTrang", e.target.value)}
            sx={{ ...dottedInputSx, width: "50px" }}
          />
        </Box>

        <Box sx={{ mb: 3, display: "flex", alignItems: "baseline" }}>
          <Typography component="span" sx={fontStyle}>
            - Ngày mở sổ:&nbsp;
          </Typography>
          <TextField
            variant="standard"
            value={footerData.ngayMoSo}
            onChange={(e) => handleFooterChange("ngayMoSo", e.target.value)}
            sx={{
              ...dottedInputSx,
              width: "150px",
              "& input": { textAlign: "left" },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Box sx={{ width: "30%", textAlign: "center" }}>
            <Typography sx={{ ...fontStyle, fontWeight: "bold" }}>
              Người ghi sổ
            </Typography>
            <Typography sx={{ ...fontStyle, fontStyle: "italic" }}>
              (Ký, họ tên)
            </Typography>
          </Box>

          <Box sx={{ width: "30%", textAlign: "center" }}>
            <Typography sx={{ ...fontStyle, fontWeight: "bold" }}>
              Kế toán trưởng
            </Typography>
            <Typography sx={{ ...fontStyle, fontStyle: "italic" }}>
              (Ký, họ tên)
            </Typography>
          </Box>

          <Box sx={{ width: "35%", textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
                mb: 0.5,
              }}
            >
              <Typography sx={fontStyle}>Ngày&nbsp;</Typography>
              <TextField
                variant="standard"
                value={footerData.ngayKy}
                onChange={(e) => handleFooterChange("ngayKy", e.target.value)}
                sx={{ ...dottedInputSx, width: "30px" }}
              />
              <Typography sx={fontStyle}>&nbsp;tháng&nbsp;</Typography>
              <TextField
                variant="standard"
                value={footerData.thangKy}
                onChange={(e) => handleFooterChange("thangKy", e.target.value)}
                sx={{ ...dottedInputSx, width: "30px" }}
              />
              <Typography sx={fontStyle}>&nbsp;năm&nbsp;</Typography>
              <TextField
                variant="standard"
                value={footerData.namKy}
                onChange={(e) => handleFooterChange("namKy", e.target.value)}
                sx={{ ...dottedInputSx, width: "50px" }}
              />
            </Box>
            <Typography sx={{ ...fontStyle, fontWeight: "bold" }}>
              Giám đốc
            </Typography>
            <Typography sx={{ ...fontStyle, fontStyle: "italic" }}>
              (Ký, họ tên, đóng dấu)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
