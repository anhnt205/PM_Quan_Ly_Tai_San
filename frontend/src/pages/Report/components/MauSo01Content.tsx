import React, { useState, useEffect } from "react";
import api from "../../../config/api.config";
import { Box, Typography, TextField } from "@mui/material";
import InlineCell from "../../../components/common/InlineCell";
import { currentBrandConfig } from "../../../config/brandConfig";

interface MauSo01ContentProps {
  onContentChange?: (content: any) => void;
  idDonVi?: string;
  fetchKey?: number;
  kyBaoCao?: string;
  onFetchSuccess?: () => void;
}

interface TableRowData {
  stt: string;
  tenNhanHieu: string;
  donViTinh: string;
  nuocSanXuat: string;
  soDuDauKy: string;
  tangSoLuong: string;
  tangLyDo: string;
  giamSoLuong: string;
  giamLyDo: string;
  soDuCuoiKy: string;
  tinhTrang: string;
  ghiChu: string;
}

export default function MauSo01Content({
  onContentChange,
  idDonVi,
  fetchKey,
  kyBaoCao,
  onFetchSuccess,
}: MauSo01ContentProps) {
  const [formData, setFormData] = useState({
    soQuyetDinh: "",
    ngay: "",
    thang: "",
    thangBaoCao: "",
    namBaoCao: "",
  });

  const [tableRows, setTableRows] = useState<TableRowData[]>([]);

  const pick = (obj: any, keys: string[]) => {
    for (const k of keys) {
      if (!obj) break;
      const v = obj[k];
      if (v !== undefined && v !== null && String(v) !== "") return String(v);
    }
    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!idDonVi) return;
      try {
        const res = await api.get("/baocao/tang-giam-trong-ky", {
          params: { idPhongBan: idDonVi, thangNam: kyBaoCao },
        });
        const data = res?.data || {};
        const items = Array.isArray(data) ? data : data.data || [];

        const taiSan: TableRowData[] = [];
        const ccdc: TableRowData[] = [];

        items.forEach((it: any) => {
          const mapped: TableRowData = {
            stt: "",
            tenNhanHieu: pick(it, ["tenTaiSan", "ten", "tentscd", "tenTSCD"]),
            donViTinh: pick(it, ["donViTinh", "dvt", "donVi"]),
            nuocSanXuat: pick(it, ["nuocSanXuat", "nuocSX", "nuoc"]),
            soDuDauKy: pick(it, [
              "soDuDauKy",
              "soDuDauKyNhap",
              "soDauKy",
              "soDuDauKy",
            ]),
            tangSoLuong: pick(it, [
              "soLuongTang",
              "soLuongTangTrongKy",
              "tangSoLuong",
            ]),
            tangLyDo: pick(it, ["lyDoTang", "lyDo"]),
            giamSoLuong: pick(it, [
              "soLuongGiam",
              "soLuongGiamTrongKy",
              "giamSoLuong",
            ]),
            giamLyDo: pick(it, ["lyDoGiam", "lyDo"]),
            soDuCuoiKy: pick(it, ["soDuCuoiKy", "soCuoiKy", "soDuCuoiKy"]),
            tinhTrang: pick(it, [
              "tinhTrang",
              "tinhTrangKyThuat",
              "tinhTrangKT",
            ]),
            ghiChu: pick(it, ["ghiChu", "note", "notes"]),
          };

          if (it?.loai === "TaiSan") taiSan.push(mapped);
          else if (it?.loai === "CCDCVatTu" || it?.loai === "CCDC")
            ccdc.push(mapped);
          else taiSan.push(mapped);
        });

        taiSan.forEach((r, i) => (r.stt = String(i + 1)));
        ccdc.forEach((r, i) => (r.stt = String(i + 1)));

        const newRows: TableRowData[] = [];
        newRows.push({
          stt: "A",
          tenNhanHieu: "Tài sản cố định",
          donViTinh: "",
          nuocSanXuat: "",
          soDuDauKy: "",
          tangSoLuong: "",
          tangLyDo: "",
          giamSoLuong: "",
          giamLyDo: "",
          soDuCuoiKy: "",
          tinhTrang: "",
          ghiChu: "",
        });
        newRows.push(...taiSan);
        newRows.push({
          stt: "B",
          tenNhanHieu: "Công cụ dụng cụ",
          donViTinh: "",
          nuocSanXuat: "",
          soDuDauKy: "",
          tangSoLuong: "",
          tangLyDo: "",
          giamSoLuong: "",
          giamLyDo: "",
          soDuCuoiKy: "",
          tinhTrang: "",
          ghiChu: "",
        });
        newRows.push(...ccdc);

        setTableRows(newRows);
        onContentChange?.({
          ...formData,
          tableRows: newRows, 
          tsRows: taiSan, 
          ccdcRows: ccdc,
        });
        onFetchSuccess?.();
      } catch (err) {
        console.error("Fetch MauSo01 tang-giam error", err);
      }
    };

    fetchData();
  }, [fetchKey]);

  useEffect(() => {
    if (!kyBaoCao) return;
    const v = String(kyBaoCao || "").trim();
    let month = "";
    let year = "";
    if (v.includes("/")) {
      const parts = v.split("/").map((p) => p.trim());
      if (parts.length === 2) {
        if (parts[0].length === 4) {
          year = parts[0];
          month = parts[1];
        } else {
          month = parts[0];
          year = parts[1];
        }
      }
    } else if (v.includes("-")) {
      const parts = v.split("-").map((p) => p.trim());
      if (parts.length === 2) {
        if (parts[0].length === 4) {
          year = parts[0];
          month = parts[1];
        } else {
          month = parts[0];
          year = parts[1];
        }
      }
    } else if (/^\d{6}$/.test(v)) {
      year = v.slice(0, 4);
      month = v.slice(4);
    }

    month = month.replace(/^0+/, "") || month;
    if (month === "") {
      const d = new Date();
      month = String(d.getMonth() + 1);
      year = year || String(d.getFullYear());
    }

    const newData = {
      ...formData,
      thangBaoCao: month,
      namBaoCao: year,
    };
    setFormData(newData);
    onContentChange?.({ ...newData, tableRows });
  }, [kyBaoCao]);

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onContentChange?.({ ...newData, tableRows });
  };

  const handleRowChange = (
    index: number,
    field: keyof TableRowData,
    value: string,
  ) => {
    const newRows = [...tableRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setTableRows(newRows);
    onContentChange?.({ ...formData, tableRows: newRows });
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

  const tableCellSx = {
    border: "1px solid #000",
    padding: "0",
    fontSize: "inherit",
    fontFamily: "inherit",
    verticalAlign: "middle",
    position: "relative" as "relative",
  };

  const tableHeaderSx: React.CSSProperties = {
    border: "1px solid #000",
    padding: "5px",
    fontSize: "inherit",
    fontFamily: "inherit",
    textAlign: "center",
    fontWeight: "bold",
    verticalAlign: "middle",
  };

  const inputTableStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontFamily: "inherit",
    fontSize: "inherit",
    padding: "4px 2px",
    boxSizing: "border-box",
    textAlign: "center",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  };

  return (
    <Box
      sx={{
        fontFamily: "'Times New Roman', Times, serif !important",
        fontSize: "16px",
        color: "#000",
        width: "100%",
        backgroundColor: "transparent",
        lineHeight: 1.4,
      }}
      id="printable-mauso01-content"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box sx={{ textAlign: "center", minWidth: "250px" }}>
          <Typography
            sx={{ fontFamily: "inherit", fontSize: "inherit", lineHeight: 1.3 }}
          >
            TẬP ĐOÀN CÔNG NGHIỆP <br /> THAN – KHOÁNG SẢN VIỆT NAM
          </Typography>
          <Typography
            sx={{
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "bold",
              textTransform: "uppercase",
              lineHeight: 1.3,
              mt: 0.5,
            }}
          >
            {currentBrandConfig.company}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", minWidth: "250px" }}>
          <Typography
            sx={{
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "bold",
              lineHeight: 1.3,
              mb: 0.5,
            }}
          >
            Mẫu số 01
          </Typography>
          <Box
            sx={{ fontSize: "inherit", fontStyle: "italic", lineHeight: 1.4 }}
          >
            <span>Ban hành kèm theo QĐ số </span>
            <TextField
              value={formData.soQuyetDinh}
              onChange={(e) => handleInputChange("soQuyetDinh", e.target.value)}
              variant="standard"
              sx={{ ...dottedInputSx, width: "50px" }}
            />
            <span> /QĐ-TUB</span>
          </Box>
          <Box
            sx={{ fontSize: "inherit", fontStyle: "italic", lineHeight: 1.4 }}
          >
            <span>ngày </span>
            <TextField
              value={formData.ngay}
              onChange={(e) => handleInputChange("ngay", e.target.value)}
              variant="standard"
              sx={{ ...dottedInputSx, width: "30px" }}
            />
            <span> / </span>
            <TextField
              value={formData.thang}
              onChange={(e) => handleInputChange("thang", e.target.value)}
              variant="standard"
              sx={{ ...dottedInputSx, width: "30px" }}
            />
            <span> / </span>
            <TextField
              value={formData.thang}
              onChange={(e) => handleInputChange("thang", e.target.value)}
              variant="standard"
              sx={{ ...dottedInputSx, width: "30px" }}
            />
            <span> của Giám đốc Công ty</span>
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: "center", mt: 3, mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "inherit",
            fontSize: "inherit",
            textTransform: "uppercase",
            lineHeight: 1.4,
          }}
        >
          SỐ THEO DÕI
        </Typography>
        <Typography
          sx={{
            fontFamily: "inherit",
            fontSize: "1.25em",
            fontWeight: "bold",
            textTransform: "uppercase",
            lineHeight: 1.4,
            mb: 1,
          }}
        >
          TÀI SẢN CỐ ĐỊNH VÀ CÔNG CỤ DỤNG CỤ TẠI NƠI SỬ DỤNG
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            fontSize: "inherit",
            fontWeight: "bold",
            fontStyle: "italic",
            mb: 1,
          }}
        >
          <span>Tháng</span>
          {formData.thangBaoCao ? (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                minWidth: "50px",
                textAlign: "center",
                fontWeight: "bold",
                mx: 1,
              }}
            >
              {formData.thangBaoCao}
            </Box>
          ) : (
            <TextField
              value={formData.thangBaoCao}
              onChange={(e) => handleInputChange("thangBaoCao", e.target.value)}
              variant="standard"
              sx={{ ...dottedInputSx, width: "50px", mx: 1 }}
            />
          )}
          <span>năm</span>
          {formData.namBaoCao ? (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                minWidth: "70px",
                textAlign: "center",
                fontWeight: "bold",
                mx: 1,
              }}
            >
              {formData.namBaoCao}
            </Box>
          ) : (
            <TextField
              value={formData.namBaoCao}
              onChange={(e) => handleInputChange("namBaoCao", e.target.value)}
              variant="standard"
              sx={{ ...dottedInputSx, width: "70px", mx: 1 }}
            />
          )}
        </Box>
        <Typography
          sx={{ fontFamily: "inherit", fontSize: "0.9em", fontStyle: "italic" }}
        >
          (Áp dụng cho các phân xưởng)
        </Typography>
      </Box>

      <Box sx={{ width: "100%", mb: 2 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "inherit",
            fontSize: "inherit",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "60px" }} />
            <col style={{ width: "70px" }} />
            <col style={{ width: "70px" }} />
            <col style={{ width: "60px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "60px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "70px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "80px" }} />
          </colgroup>
          <thead>
            <tr>
              <th style={tableHeaderSx} rowSpan={2}>
                STT
              </th>
              <th style={tableHeaderSx} rowSpan={2}>
                Tên nhãn hiệu, quy cách
                <br />
                tài sản cố định, công cụ
                <br />
                dụng cụ
              </th>
              <th style={tableHeaderSx} rowSpan={2}>
                Đơn vị
                <br />
                tính
              </th>
              <th style={tableHeaderSx} rowSpan={2}>
                Nước
                <br />
                sản xuất
              </th>
              <th style={tableHeaderSx} rowSpan={2}>
                Số dư đầu kỳ
              </th>
              <th style={tableHeaderSx} colSpan={2}>
                Tăng trong kỳ
              </th>
              <th style={tableHeaderSx} colSpan={2}>
                Giảm trong kỳ
              </th>
              <th style={tableHeaderSx} rowSpan={2}>
                Số dư cuối kỳ
              </th>
              <th style={tableHeaderSx} rowSpan={2}>
                Tình trạng kỹ
                <br />
                thuật
              </th>
              <th style={tableHeaderSx} rowSpan={2}>
                Ghi chú
              </th>
            </tr>
            <tr>
              <th style={tableHeaderSx}>Số lượng</th>
              <th style={tableHeaderSx}>Lý do tăng</th>
              <th style={tableHeaderSx}>Số lượng</th>
              <th style={tableHeaderSx}>Lý do giảm</th>
            </tr>
            <tr>
              <th style={tableHeaderSx}>A</th>
              <th style={tableHeaderSx}>B</th>
              <th style={tableHeaderSx}>C</th>
              <th style={tableHeaderSx}>1</th>
              <th style={tableHeaderSx}>2</th>
              <th style={tableHeaderSx}>3</th>
              <th style={tableHeaderSx}>4</th>
              <th style={tableHeaderSx}>5</th>
              <th style={tableHeaderSx}>6</th>
              <th style={tableHeaderSx}>7=2+3-5</th>
              <th style={tableHeaderSx}>8</th>
              <th style={tableHeaderSx}>9</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => {
              const titleRegex = /Tài sản cố định|Công cụ dụng cụ/;
              const isHeader =
                row.stt === "A" ||
                row.stt === "B" ||
                titleRegex.test(row.tenNhanHieu || "");
              return (
                <tr key={index}>
                  <td style={tableCellSx}>
                    <div
                      style={{
                        ...inputTableStyle,
                        fontWeight: isHeader ? "bold" : "normal",
                      }}
                    >
                      {row.stt}
                    </div>
                  </td>
                  <td style={tableCellSx}>
                    {isHeader ? (
                      <div
                        style={{
                          ...inputTableStyle,
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {row.tenNhanHieu}
                      </div>
                    ) : (
                      <InlineCell
                        value={row.tenNhanHieu}
                        onCommit={(v) =>
                          handleRowChange(index, "tenNhanHieu", v)
                        }
                        align="left"
                      />
                    )}
                  </td>
                  <td style={tableCellSx}>
                    <InlineCell
                      value={row.donViTinh}
                      onCommit={(v) => handleRowChange(index, "donViTinh", v)}
                      align="center"
                    />
                  </td>
                  <td style={tableCellSx}>
                    <InlineCell
                      value={row.nuocSanXuat}
                      onCommit={(v) => handleRowChange(index, "nuocSanXuat", v)}
                      align="center"
                    />
                  </td>
                  <td style={tableCellSx}>
                    <InlineCell
                      value={row.soDuDauKy}
                      onCommit={(v) => handleRowChange(index, "soDuDauKy", v)}
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={tableCellSx}>
                    <InlineCell
                      value={row.tangSoLuong}
                      onCommit={(v) => handleRowChange(index, "tangSoLuong", v)}
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={tableCellSx}>
                    <InlineCell
                      value={row.tangLyDo}
                      onCommit={(v) => handleRowChange(index, "tangLyDo", v)}
                      align="left"
                    />
                  </td>
                  <td style={tableCellSx}>
                    <InlineCell
                      value={row.giamSoLuong}
                      onCommit={(v) => handleRowChange(index, "giamSoLuong", v)}
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={tableCellSx}>
                    <InlineCell
                      value={row.giamLyDo}
                      onCommit={(v) => handleRowChange(index, "giamLyDo", v)}
                      align="left"
                    />
                  </td>
                  <td style={tableCellSx}>
                    <InlineCell
                      value={row.soDuCuoiKy}
                      onCommit={(v) => handleRowChange(index, "soDuCuoiKy", v)}
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={tableCellSx}>
                    <InlineCell
                      value={row.tinhTrang}
                      onCommit={(v) => handleRowChange(index, "tinhTrang", v)}
                      align="center"
                    />
                  </td>
                  <td style={tableCellSx}>
                    <InlineCell
                      value={row.ghiChu}
                      onCommit={(v) => handleRowChange(index, "ghiChu", v)}
                      align="left"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Typography
          sx={{
            fontFamily: "'Times New Roman'",
            fontSize: "12pt",
            mt: 1,
            fontStyle: "italic",
          }}
        >
          Gửi kèm theo các Quyết định, biên bản giao nhận tăng giảm tài sản,
          công cụ dụng cụ trong kỳ báo cáo
        </Typography>
        <Typography sx={{ fontFamily: "inherit" }}>
          Lưu ý: Báo cáo tháng trước vào ngày 15 hàng tháng <br /> (tháng sau)
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 2,
          mb: 5,
        }}
      >
        <Box sx={{ textAlign: "center", minWidth: "200px" }}>
          <Typography sx={{ fontFamily: "inherit", fontWeight: "bold" }}>
            Thống kê phân xưởng
          </Typography>
          <Typography sx={{ fontFamily: "inherit", fontStyle: "italic" }}>
            (Ký, ghi rõ họ tên)
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", minWidth: "200px" }}>
          <Typography sx={{ fontFamily: "inherit", fontWeight: "bold" }}>
            Phó quản đốc cơ điện
          </Typography>
          <Typography sx={{ fontFamily: "inherit", fontStyle: "italic" }}>
            (Ký, ghi rõ họ tên)
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", minWidth: "200px" }}>
          <Typography sx={{ fontFamily: "inherit", fontWeight: "bold" }}>
            Quản đốc phân xưởng
          </Typography>
          <Typography sx={{ fontFamily: "inherit", fontStyle: "italic" }}>
            (Ký, ghi rõ họ tên)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
