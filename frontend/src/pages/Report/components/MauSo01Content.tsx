import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";

interface MauSo01ContentProps {
  onContentChange?: (content: any) => void;
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
}: MauSo01ContentProps) {
  const [formData, setFormData] = useState({
    soQuyetDinh: "",
    ngay: "",
    thang: "",
    thangBaoCao: "",
    namBaoCao: "",
  });

  const [tableRows, setTableRows] = useState<TableRowData[]>(
    Array.from({ length: 4 }).map(() => ({
      stt: "",
      tenNhanHieu: "",
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
    }))
  );

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onContentChange?.({ ...newData, tableRows });
  };

  const handleRowChange = (
    index: number,
    field: keyof TableRowData,
    value: string
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
      id="printable-content" 
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
            CÔNG TY THAN UÔNG BÍ - TKV
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
          <TextField
            value={formData.thangBaoCao}
            onChange={(e) => handleInputChange("thangBaoCao", e.target.value)}
            variant="standard"
            sx={{ ...dottedInputSx, width: "50px", mx: 1 }}
          />
          <span>năm</span>
          <TextField
            value={formData.namBaoCao}
            onChange={(e) => handleInputChange("namBaoCao", e.target.value)}
            variant="standard"
            sx={{ ...dottedInputSx, width: "70px", mx: 1 }}
          />
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
            {tableRows.map((row, index) => (
              <tr key={index}>
                <td style={tableCellSx}>
                  <input
                    style={{ ...inputTableStyle, fontWeight: "bold" }}
                    value={row.stt}
                    onChange={(e) =>
                      handleRowChange(index, "stt", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={{ ...inputTableStyle, textAlign: "left" }}
                    value={row.tenNhanHieu}
                    onChange={(e) =>
                      handleRowChange(index, "tenNhanHieu", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={inputTableStyle}
                    value={row.donViTinh}
                    onChange={(e) =>
                      handleRowChange(index, "donViTinh", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={inputTableStyle}
                    value={row.nuocSanXuat}
                    onChange={(e) =>
                      handleRowChange(index, "nuocSanXuat", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={{ ...inputTableStyle, textAlign: "right" }}
                    value={row.soDuDauKy}
                    onChange={(e) =>
                      handleRowChange(index, "soDuDauKy", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={{ ...inputTableStyle, textAlign: "right" }}
                    value={row.tangSoLuong}
                    onChange={(e) =>
                      handleRowChange(index, "tangSoLuong", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={{ ...inputTableStyle, textAlign: "left" }}
                    value={row.tangLyDo}
                    onChange={(e) =>
                      handleRowChange(index, "tangLyDo", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={{ ...inputTableStyle, textAlign: "right" }}
                    value={row.giamSoLuong}
                    onChange={(e) =>
                      handleRowChange(index, "giamSoLuong", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={{ ...inputTableStyle, textAlign: "left" }}
                    value={row.giamLyDo}
                    onChange={(e) =>
                      handleRowChange(index, "giamLyDo", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={{
                      ...inputTableStyle,
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    value={row.soDuCuoiKy}
                    onChange={(e) =>
                      handleRowChange(index, "soDuCuoiKy", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={inputTableStyle}
                    value={row.tinhTrang}
                    onChange={(e) =>
                      handleRowChange(index, "tinhTrang", e.target.value)
                    }
                  />
                </td>
                <td style={tableCellSx}>
                  <input
                    style={{ ...inputTableStyle, textAlign: "left" }}
                    value={row.ghiChu}
                    onChange={(e) =>
                      handleRowChange(index, "ghiChu", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Box sx={{ mb: 4, px: 1 }}>
        <Typography
          sx={{ fontFamily: "inherit", fontStyle: "italic", mb: 0.5 }}
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