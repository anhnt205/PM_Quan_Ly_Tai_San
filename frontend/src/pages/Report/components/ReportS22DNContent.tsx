import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";

interface ReportS22DNContentProps {
  onContentChange?: (content: any) => void;
}

interface TableRowData {
  ctTangSoHieu: string;
  ctTangNgay: string;
  tenNhanHieu: string;
  dvt: string;
  tangSoLuong: string;
  tangDonGia: string;
  tangSoTien: string;
  ctGiamSoHieu: string;
  ctGiamNgay: string;
  giamLyDo: string;
  giamSoLuong: string;
  giamSoTien: string;
  ghiChu: string;
}

export default function ReportS22DNContent({
  onContentChange,
}: ReportS22DNContentProps) {
  const [diaChi, setDiaChi] = useState("");

  const [tableRows, setTableRows] = useState<TableRowData[]>([
    { ctTangSoHieu: "", ctTangNgay: "", tenNhanHieu: "", dvt: "", tangSoLuong: "", tangDonGia: "", tangSoTien: "", ctGiamSoHieu: "", ctGiamNgay: "", giamLyDo: "", giamSoLuong: "", giamSoTien: "", ghiChu: "" },
    { ctTangSoHieu: "", ctTangNgay: "", tenNhanHieu: "", dvt: "", tangSoLuong: "", tangDonGia: "", tangSoTien: "", ctGiamSoHieu: "", ctGiamNgay: "", giamLyDo: "", giamSoLuong: "", giamSoTien: "", ghiChu: "" },
  ]);

  const [footerData, setFooterData] = useState({
    soTrang: "",
    denTrang: "",
    ngayMoSo: "",
    ngayKy: "",
    thangKy: "",
    namKy: "",
  });

  const handleDiaChiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDiaChi(value);
    onContentChange?.({ diaChi: value, tableRows, footerData });
  };

  const handleRowChange = (index: number, field: keyof TableRowData, value: string) => {
    const newRows = [...tableRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setTableRows(newRows);
    onContentChange?.({ diaChi, tableRows: newRows, footerData });
  };

  const handleFooterChange = (field: keyof typeof footerData, value: string) => {
    const newData = { ...footerData, [field]: value };
    setFooterData(newData);
    onContentChange?.({ diaChi, tableRows, footerData: newData });
  };

  const fontStyle = {
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "13pt",
    color: "#000",
    lineHeight: 1.5,
  };

  const dottedInputSx = {
    "& .MuiInput-root": {
      ...fontStyle,
      marginTop: "0px",
      "&:before": { borderBottom: "1px dotted #000 !important" },
      "&:after": { borderBottom: "1px dotted #000 !important" },
    },
    "& input": { padding: "0 5px", textAlign: "center" },
  };

  const cellStyle: React.CSSProperties = {
    border: "1px solid #000",
    padding: "0",
    verticalAlign: "middle",
  };

  const headerStyle: React.CSSProperties = {
    border: "1px solid #000",
    padding: "5px",
    fontWeight: "bold",
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: "11pt",
  };

  const tableInputStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    padding: "5px",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "12pt",
    backgroundColor: "transparent",
    textAlign: "center",
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "transparent",
        p: 2,
        ...fontStyle,
      }}
      id="printable-s22dn-content"
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
        <Box sx={{ width: "55%" }}>
          <Typography component="div" sx={{ ...fontStyle, fontWeight: "normal" }}>
            Đơn vị: <b style={{ fontWeight: "bold" }}>Ban lãnh đạo</b>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline" }}>
            <Typography sx={{ ...fontStyle, whiteSpace: "nowrap" }}>Địa chỉ:&nbsp;</Typography>
            <TextField
              value={diaChi}
              onChange={handleDiaChiChange}
              variant="standard"
              sx={{ ...dottedInputSx, width: "200px", "& input": { textAlign: "left" } }}
            />
          </Box>
        </Box>
        <Box sx={{ width: "45%", textAlign: "center" }}>
          <Typography sx={{ ...fontStyle, fontWeight: "bold", mb: 0.5 }}>Mẫu số S22-DN</Typography>
          <Typography sx={{ ...fontStyle, fontSize: "12pt", fontStyle: "italic", textAlign: "center" }}>
            (Ban hành theo Thông tư số 200/2014/TT-BTC <br /> Ngày 22/12/2014 của Bộ Tài chính)
          </Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: "center", mt: 3, mb: 3 }}>
        <Typography sx={{ ...fontStyle, fontSize: "16pt", fontWeight: "bold" }}>
          Sổ Theo dõi tài sản cố định và công cụ, dụng cụ tại nơi sử dụng
        </Typography>
      </Box>

      <Box sx={{ pl: 0, mb: 2 }}>
        <Typography sx={{ ...fontStyle, mb: 1 }}>
          Năm <b style={{ fontWeight: "bold" }}>2026</b>
        </Typography>
        <Typography sx={{ ...fontStyle }}>
          Tên đơn vị (phòng, ban hoặc người sử dụng) <b style={{ fontWeight: "bold" }}>Ban lãnh đạo</b>
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Typography sx={{ ...fontStyle, fontWeight: "bold" }}>
          Bảng ghi tăng/giảm Tài sản cố định
        </Typography>
      </Box>

      <Box sx={{ width: "100%", overflowX: "auto", mb: 4 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Times New Roman'", fontSize: "12pt" }}>
          <colgroup>
            <col style={{ width: "60px" }} /> <col style={{ width: "80px" }} /> <col style={{ width: "150px" }} />
            <col style={{ width: "60px" }} /> <col style={{ width: "60px" }} /> <col style={{ width: "90px" }} />
            <col style={{ width: "90px" }} /> <col style={{ width: "60px" }} /> <col style={{ width: "80px" }} />
            <col style={{ width: "100px" }} /> <col style={{ width: "60px" }} /> <col style={{ width: "90px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr>
              <th style={headerStyle} colSpan={7}>Ghi tăng tài sản cố định</th>
              <th style={headerStyle} colSpan={5}>Ghi giảm tài sản cố định</th>
              <th style={headerStyle} rowSpan={3}>Ghi chú</th>
            </tr>
            <tr>
              <th style={headerStyle} colSpan={2}>Chứng từ</th>
              <th style={headerStyle} rowSpan={2}>Tên, nhãn hiệu, quy<br/>cách tài sản cố định</th>
              <th style={headerStyle} rowSpan={2}>Đơn vị<br/>tính</th>
              <th style={headerStyle} rowSpan={2}>Số<br/>lượng</th>
              <th style={headerStyle} rowSpan={2}>Đơn giá</th>
              <th style={headerStyle} rowSpan={2}>Số tiền</th>
              <th style={headerStyle} colSpan={2}>Chứng từ</th>
              <th style={headerStyle} rowSpan={2}>Lý do</th>
              <th style={headerStyle} rowSpan={2}>Số<br/>lượng</th>
              <th style={headerStyle} rowSpan={2}>Số tiền</th>
            </tr>
            <tr>
              <th style={headerStyle}>Số hiệu</th>
              <th style={headerStyle}>Ngày,<br/>tháng</th>
              <th style={headerStyle}>Số hiệu</th>
              <th style={headerStyle}>Ngày,<br/>tháng</th>
            </tr>
            <tr>
              <th style={headerStyle}>A</th> <th style={headerStyle}>B</th> <th style={headerStyle}>C</th>
              <th style={headerStyle}>D</th> <th style={headerStyle}>1</th> <th style={headerStyle}>2</th>
              <th style={headerStyle}>3</th> <th style={headerStyle}>E</th> <th style={headerStyle}>G</th>
              <th style={headerStyle}>H</th> <th style={headerStyle}>4</th> <th style={headerStyle}>5</th>
              <th style={headerStyle}>I</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index}>
                <td style={cellStyle}><input style={tableInputStyle} value={row.ctTangSoHieu} onChange={(e) => handleRowChange(index, "ctTangSoHieu", e.target.value)} /></td>
                <td style={cellStyle}><input style={tableInputStyle} value={row.ctTangNgay} onChange={(e) => handleRowChange(index, "ctTangNgay", e.target.value)} /></td>
                <td style={cellStyle}><input style={{...tableInputStyle, textAlign: "left"}} value={row.tenNhanHieu} onChange={(e) => handleRowChange(index, "tenNhanHieu", e.target.value)} /></td>
                <td style={cellStyle}><input style={tableInputStyle} value={row.dvt} onChange={(e) => handleRowChange(index, "dvt", e.target.value)} /></td>
                <td style={cellStyle}><input style={{...tableInputStyle, textAlign: "right"}} value={row.tangSoLuong} onChange={(e) => handleRowChange(index, "tangSoLuong", e.target.value)} /></td>
                <td style={cellStyle}><input style={{...tableInputStyle, textAlign: "right"}} value={row.tangDonGia} onChange={(e) => handleRowChange(index, "tangDonGia", e.target.value)} /></td>
                <td style={cellStyle}><input style={{...tableInputStyle, textAlign: "right"}} value={row.tangSoTien} onChange={(e) => handleRowChange(index, "tangSoTien", e.target.value)} /></td>
                <td style={cellStyle}><input style={tableInputStyle} value={row.ctGiamSoHieu} onChange={(e) => handleRowChange(index, "ctGiamSoHieu", e.target.value)} /></td>
                <td style={cellStyle}><input style={tableInputStyle} value={row.ctGiamNgay} onChange={(e) => handleRowChange(index, "ctGiamNgay", e.target.value)} /></td>
                <td style={cellStyle}><input style={{...tableInputStyle, textAlign: "left"}} value={row.giamLyDo} onChange={(e) => handleRowChange(index, "giamLyDo", e.target.value)} /></td>
                <td style={cellStyle}><input style={{...tableInputStyle, textAlign: "right"}} value={row.giamSoLuong} onChange={(e) => handleRowChange(index, "giamSoLuong", e.target.value)} /></td>
                <td style={cellStyle}><input style={{...tableInputStyle, textAlign: "right"}} value={row.giamSoTien} onChange={(e) => handleRowChange(index, "giamSoTien", e.target.value)} /></td>
                <td style={cellStyle}><input style={{...tableInputStyle, textAlign: "left"}} value={row.ghiChu} onChange={(e) => handleRowChange(index, "ghiChu", e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Box sx={{ ...fontStyle }}>
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'baseline' }}>
          <Typography component="span" sx={fontStyle}>- Sổ này có&nbsp;</Typography>
          <TextField
            variant="standard"
            value={footerData.soTrang}
            onChange={(e) => handleFooterChange("soTrang", e.target.value)}
            sx={{ ...dottedInputSx, width: "50px" }}
          />
          <Typography component="span" sx={fontStyle}>&nbsp;trang, đánh số từ trang 01 đến trang&nbsp;</Typography>
          <TextField
            variant="standard"
            value={footerData.denTrang}
            onChange={(e) => handleFooterChange("denTrang", e.target.value)}
            sx={{ ...dottedInputSx, width: "50px" }}
          />
        </Box>

        <Box sx={{ mb: 3, display: 'flex', alignItems: 'baseline' }}>
          <Typography component="span" sx={fontStyle}>- Ngày mở sổ:&nbsp;</Typography>
          <TextField
            variant="standard"
            value={footerData.ngayMoSo}
            onChange={(e) => handleFooterChange("ngayMoSo", e.target.value)}
            sx={{ ...dottedInputSx, width: "150px", "& input": { textAlign: "left" } }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Box sx={{ width: "30%", textAlign: "center" }}>
            <Typography sx={{ ...fontStyle, fontWeight: "bold" }}>Người ghi sổ</Typography>
            <Typography sx={{ ...fontStyle, fontStyle: "italic" }}>(Ký, họ tên)</Typography>
          </Box>

          <Box sx={{ width: "30%", textAlign: "center" }}>
            <Typography sx={{ ...fontStyle, fontWeight: "bold" }}>Kế toán trưởng</Typography>
            <Typography sx={{ ...fontStyle, fontStyle: "italic" }}>(Ký, họ tên)</Typography>
          </Box>

          <Box sx={{ width: "35%", textAlign: "center" }}>
             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 0.5 }}>
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
            <Typography sx={{ ...fontStyle, fontWeight: "bold" }}>Giám đốc</Typography>
            <Typography sx={{ ...fontStyle, fontStyle: "italic" }}>(Ký, họ tên, đóng dấu)</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}