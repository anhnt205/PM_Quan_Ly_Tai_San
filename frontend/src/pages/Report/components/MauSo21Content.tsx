import React, { useState } from "react";
import { Box, Typography, TextField, Grid } from "@mui/material";

interface MauSo21ContentProps {
  onContentChange?: (content: any) => void;
  selectedDeptName?: string;
  selectedYear?: string | number;
}

export default function MauSo21Content({
  onContentChange,
  selectedDeptName,
  selectedYear,
}: MauSo21ContentProps) {
  const [formData, setFormData] = useState({
    donVi: "",
    diaChi: "",
    nam: "",
    loaiTaiSan: "",
  });

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onContentChange?.({ ...newData });
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

  const tableHeaderStyle = {
    border: "1px solid #000",
    padding: "5px",
    verticalAlign: "middle",
    backgroundColor: "#f0f0f0",
  };

  const tableCellStyle = {
    border: "1px solid #000",
    padding: "5px",
    height: "25px",
    verticalAlign: "middle",
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
        p: 2,
      }}
      id="printable-content"
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
            <TextField
              value={formData.donVi}
              onChange={(e) => handleInputChange("donVi", e.target.value)}
              variant="standard"
              fullWidth
              sx={{ ...dottedInputLeftSx }}
            />
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
              {selectedDeptName || formData.loaiTaiSan || ""}
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
            {[1, 2, 3, 4, 5].map((row, index) => (
              <tr key={index}>
                <td style={{ ...tableCellStyle, textAlign: "center" }}>
                  {index + 1}
                </td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
                <td style={tableCellStyle}></td>
              </tr>
            ))}

            <tr style={{ fontWeight: "bold" }}>
              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}>Cộng</td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}>x</td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}>x</td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}>x</td>
              <td style={tableCellStyle}></td>

              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}></td>
              <td style={tableCellStyle}></td>
              <td style={tableCellStyle}></td>

              <td style={{ ...tableCellStyle, textAlign: "center" }}>x</td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}>x</td>
              <td style={{ ...tableCellStyle, textAlign: "center" }}>x</td>
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
