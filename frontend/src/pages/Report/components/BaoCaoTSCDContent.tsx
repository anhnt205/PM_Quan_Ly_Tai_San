import React, { useState, useEffect } from "react";
import { Box, Typography, TextField } from "@mui/material";

interface BaoCaoTSCDContentProps {
  onContentChange?: (content: any) => void;
  selectedDeptName?: string;
}

interface MemberRow {
  name: string;
  position: string;
  representing: string;
}

interface InventoryItem {
  stt: string;
  tenTSCD: string;
  maso: string;
  noiSudung: string;
  soluongkt: string;
  nguyengiakt: string;
  giatriconlaikt: string;
  soluongkk: string;
  nguyengiakk: string;
  giatriconlaikk: string;
  soluongcl: string;
  nguyengiacl: string;
  giatriconlaicl: string;
  ghiChu: string;
}

export default function BaoCaoTSCDContent({
  onContentChange,
  selectedDeptName,
}: BaoCaoTSCDContentProps) {
  const [headerInfo, setHeaderInfo] = useState({
    qdSo: "",
    ngayQd: "",
    thangQd: "",
    namQd: "",
  });

  const [generalInfo, setGeneralInfo] = useState({
    ngayKiemKe: "",
    thangKiemKe: "",
    namKiemKe: "",
    diaDiem: "",
  });

  const [members, setMembers] = useState<MemberRow[]>([
    { name: "", position: "", representing: "" },
    { name: "", position: "", representing: "" },
    { name: "", position: "", representing: "" },
  ]);

  const [membersUnit, setMembersUnit] = useState<MemberRow[]>([
    { name: "", position: "", representing: "" },
    { name: "", position: "", representing: "" },
  ]);

  // Tạo sẵn 5 dòng trắng cố định
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { stt: "1", tenTSCD: "", maso: "", noiSudung: "", soluongkt: "", nguyengiakt: "", giatriconlaikt: "", soluongkk: "", nguyengiakk: "", giatriconlaikk: "", soluongcl: "", nguyengiacl: "", giatriconlaicl: "", ghiChu: "" },
    { stt: "2", tenTSCD: "", maso: "", noiSudung: "", soluongkt: "", nguyengiakt: "", giatriconlaikt: "", soluongkk: "", nguyengiakk: "", giatriconlaikk: "", soluongcl: "", nguyengiacl: "", giatriconlaicl: "", ghiChu: "" },
    { stt: "3", tenTSCD: "", maso: "", noiSudung: "", soluongkt: "", nguyengiakt: "", giatriconlaikt: "", soluongkk: "", nguyengiakk: "", giatriconlaikk: "", soluongcl: "", nguyengiacl: "", giatriconlaicl: "", ghiChu: "" },
    { stt: "4", tenTSCD: "", maso: "", noiSudung: "", soluongkt: "", nguyengiakt: "", giatriconlaikt: "", soluongkk: "", nguyengiakk: "", giatriconlaikk: "", soluongcl: "", nguyengiacl: "", giatriconlaicl: "", ghiChu: "" },
    { stt: "5", tenTSCD: "", maso: "", noiSudung: "", soluongkt: "", nguyengiakt: "", giatriconlaikt: "", soluongkk: "", nguyengiakk: "", giatriconlaikk: "", soluongcl: "", nguyengiacl: "", giatriconlaicl: "", ghiChu: "" },
  ]);

  const [closingTime, setClosingTime] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setCurrentDateStr(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleHeaderChange = (field: keyof typeof headerInfo, value: string) => {
    const newInfo = { ...headerInfo, [field]: value };
    setHeaderInfo(newInfo);
    onContentChange?.({ headerInfo: newInfo, generalInfo, members, membersUnit, inventoryItems, closingTime });
  };

  const handleGeneralInfoChange = (field: keyof typeof generalInfo, value: string) => {
    const newInfo = { ...generalInfo, [field]: value };
    setGeneralInfo(newInfo);
    onContentChange?.({ headerInfo, generalInfo: newInfo, members, membersUnit, inventoryItems, closingTime });
  };

  const handleMemberChange = (index: number, field: keyof MemberRow, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
    onContentChange?.({ headerInfo, generalInfo, members: newMembers, membersUnit, inventoryItems, closingTime });
  };

  const handleMemberUnitChange = (index: number, field: keyof MemberRow, value: string) => {
    const newMembersUnit = [...membersUnit];
    newMembersUnit[index] = { ...newMembersUnit[index], [field]: value };
    setMembersUnit(newMembersUnit);
    onContentChange?.({ headerInfo, generalInfo, members, membersUnit: newMembersUnit, inventoryItems, closingTime });
  };

  const handleInventoryChange = (index: number, field: keyof InventoryItem, value: string) => {
    const newItems = [...inventoryItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setInventoryItems(newItems);
    onContentChange?.({ headerInfo, generalInfo, members, membersUnit, inventoryItems: newItems, closingTime });
  };

  const handleClosingTimeChange = (value: string) => {
    setClosingTime(value);
    onContentChange?.({ headerInfo, generalInfo, members, membersUnit, inventoryItems, closingTime: value });
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
    "& input": { padding: "0 2px", textAlign: "center" },
  };

  const tableHeaderSx = {
    border: "1px solid #000",
    padding: "2px", 
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
    fontWeight: "bold",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "11pt",
    lineHeight: "1.2",
  };

  const tableBodyCellSx = {
    border: "1px solid #000",
    padding: "0px 2px", 
    verticalAlign: "middle" as const,
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "11pt", 
  };

  const tableInputSx = {
    "& .MuiInput-root": {
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: "11pt",
      "&:before": { borderBottom: "none !important" },
      "&:after": { borderBottom: "none !important" },
    },
    "& input": { 
      padding: "4px 0", 
      textAlign: "right"
    }, 
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "transparent",
        p: 2,
        ...fontStyle,
      }}
      id="printable-bbkiemke-content"
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box sx={{ width: "50%", textAlign: "center" }}>
          <Typography sx={{ ...fontStyle, textTransform: "uppercase" }}>
            TẬP ĐOÀN CÔNG NGHIỆP <br /> THAN - KHOÁNG SẢN VIỆT NAM
          </Typography>
          <Typography sx={{ ...fontStyle, fontWeight: "bold", textTransform: "uppercase" }}>
            CÔNG TY THAN UÔNG BÍ - TKV
          </Typography>
        </Box>

        <Box sx={{ width: "50%", textAlign: "center" }}>
          <Typography sx={{ ...fontStyle, fontWeight: "bold", mb: 0.5 }}>
            Mẫu số 05-TSCĐ
          </Typography>
          
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "baseline", flexWrap: "wrap" }}>
            <Typography sx={fontStyle}>Ban hành kèm theo QĐ số&nbsp;</Typography>
            <TextField
              variant="standard"
              value={headerInfo.qdSo}
              onChange={(e) => handleHeaderChange("qdSo", e.target.value)}
              sx={{ ...dottedInputSx, width: "60px" }}
            />
            <Typography sx={fontStyle}>&nbsp;/QĐ-TUB</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "baseline" }}>
            <Typography sx={fontStyle}>ngày&nbsp;</Typography>
            <TextField
              variant="standard"
              value={headerInfo.ngayQd}
              onChange={(e) => handleHeaderChange("ngayQd", e.target.value)}
              sx={{ ...dottedInputSx, width: "30px" }}
            />
            <Typography sx={fontStyle}>&nbsp;/&nbsp;</Typography>
            <TextField
              variant="standard"
              value={headerInfo.thangQd}
              onChange={(e) => handleHeaderChange("thangQd", e.target.value)}
              sx={{ ...dottedInputSx, width: "30px" }}
            />
            <Typography sx={fontStyle}>&nbsp;/&nbsp;</Typography>
            <TextField
              variant="standard"
              value={headerInfo.namQd}
              onChange={(e) => handleHeaderChange("namQd", e.target.value)}
              sx={{ ...dottedInputSx, width: "30px" }}
            />
            <Typography sx={fontStyle}>&nbsp;của Giám đốc Công ty</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography sx={{ ...fontStyle, fontSize: "16pt", fontWeight: "bold", textTransform: "uppercase" }}>
          BIÊN BẢN KIỂM KÊ TÀI SẢN CỐ ĐỊNH
        </Typography>
        <Typography sx={{ ...fontStyle, mt: 1, fontWeight: "bold" }}>
          Đơn vị: {" "}
            <b style={{ fontWeight: "bold" }}>
              {selectedDeptName || ""}
            </b>
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
          <Typography sx={fontStyle}>Thời điểm kiểm kê, ngày&nbsp;</Typography>
          <TextField
            variant="standard"
            value={generalInfo.ngayKiemKe}
            onChange={(e) => handleGeneralInfoChange("ngayKiemKe", e.target.value)}
            sx={{ ...dottedInputSx, width: "30px" }}
          />
          <Typography sx={fontStyle}>&nbsp;tháng&nbsp;</Typography>
          <TextField
            variant="standard"
            value={generalInfo.thangKiemKe}
            onChange={(e) => handleGeneralInfoChange("thangKiemKe", e.target.value)}
            sx={{ ...dottedInputSx, width: "30px" }}
          />
          <Typography sx={fontStyle}>&nbsp;năm&nbsp;</Typography>
          <TextField
            variant="standard"
            value={generalInfo.namKiemKe}
            onChange={(e) => handleGeneralInfoChange("namKiemKe", e.target.value)}
            sx={{ ...dottedInputSx, width: "50px" }}
          />
          <Typography sx={fontStyle}>&nbsp;tại&nbsp;</Typography>
          <TextField
            variant="standard"
            value={generalInfo.diaDiem}
            onChange={(e) => handleGeneralInfoChange("diaDiem", e.target.value)}
            sx={{ ...dottedInputSx, width: "150px", flexGrow: 1, "& input": { textAlign: "left" } }}
          />
        </Box>
        <Typography sx={{ ...fontStyle, mt: 1 }}>
          Ban kiểm kê gồm:
        </Typography>
      </Box>

      <Box>
        {members.map((row, index) => (
          <Box key={`mb1-${index}`} sx={{ display: "flex", alignItems: "baseline", mt: 0.5 }}>
            <Typography sx={fontStyle}>{index + 1}. Ông (bà):&nbsp;</Typography>
            <TextField
              variant="standard"
              value={row.name}
              onChange={(e) => handleMemberChange(index, "name", e.target.value)}
              sx={{ ...dottedInputSx, width: "20%", "& input": { textAlign: "left" } }}
            />
            <Typography sx={{ ...fontStyle, ml: 1 }}>&nbsp;Chức vụ:&nbsp;</Typography>
            <TextField
              variant="standard"
              value={row.position}
              onChange={(e) => handleMemberChange(index, "position", e.target.value)}
              sx={{ ...dottedInputSx, width: "20%", "& input": { textAlign: "left" } }}
            />
            <Typography sx={{ ...fontStyle, ml: 1 }}>&nbsp;Đại diện:&nbsp;</Typography>
            <TextField
              variant="standard"
              value={row.position}
              onChange={(e) => handleMemberChange(index, "representing", e.target.value)}
              sx={{ ...dottedInputSx, width: "20%", "& input": { textAlign: "left" } }}
            />
          </Box>
        ))}

        <Typography sx={{ ...fontStyle, mt: 1, mb: 2 }}>
          Đã kiểm kê TSCĐ, kết quả như sau
        </Typography>

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black" }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ ...tableHeaderSx, width: "40px" }}>STT</th>
                <th rowSpan={2} style={{ ...tableHeaderSx, minWidth: "150px" }}>Tên tài sản cố định<br/>(Ký mã hiệu)</th>
                <th rowSpan={2} style={{ ...tableHeaderSx, width: "60px" }}>Mã số</th>
                <th rowSpan={2} style={{ ...tableHeaderSx, width: "80px" }}>Nơi sử dụng</th>

                <th colSpan={3} style={tableHeaderSx}>Kế toán</th>
                <th colSpan={3} style={tableHeaderSx}>Kiểm kê</th>
                <th colSpan={3} style={tableHeaderSx}>Chênh lệch</th>
                
                <th rowSpan={2} style={{ ...tableHeaderSx, width: "80px" }}>Ghi chú</th>
              </tr>

              <tr>
                <th style={tableHeaderSx}>Số lượng</th>
                <th style={tableHeaderSx}>Nguyên giá</th>
                <th style={tableHeaderSx}>Giá trị còn lại</th>
                <th style={tableHeaderSx}>Số lượng</th>
                <th style={tableHeaderSx}>Nguyên giá</th>
                <th style={tableHeaderSx}>Giá trị còn lại</th>
                <th style={tableHeaderSx}>Số lượng</th>
                <th style={tableHeaderSx}>Nguyên giá</th>
                <th style={tableHeaderSx}>Giá trị còn lại</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item, index) => (
                <tr key={index}>
                  <td style={tableBodyCellSx}>{item.stt}</td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.tenTSCD}
                      onChange={(e) => handleInventoryChange(index, "tenTSCD", e.target.value)}
                      sx={{ ...tableInputSx, "& input": { textAlign: "left" } }}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.maso}
                      onChange={(e) => handleInventoryChange(index, "maso", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.noiSudung}
                      onChange={(e) => handleInventoryChange(index, "noiSudung", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.soluongkt}
                      onChange={(e) => handleInventoryChange(index, "soluongkt", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.nguyengiakt}
                      onChange={(e) => handleInventoryChange(index, "nguyengiakt", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.giatriconlaikt}
                      onChange={(e) => handleInventoryChange(index, "giatriconlaikt", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.soluongkk}
                      onChange={(e) => handleInventoryChange(index, "soluongkk", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.nguyengiakk}
                      onChange={(e) => handleInventoryChange(index, "nguyengiakk", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.giatriconlaikk}
                      onChange={(e) => handleInventoryChange(index, "giatriconlaikk", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.soluongcl}
                      onChange={(e) => handleInventoryChange(index, "soluongcl", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.nguyengiacl}
                      onChange={(e) => handleInventoryChange(index, "nguyengiacl", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.giatriconlaicl}
                      onChange={(e) => handleInventoryChange(index, "giatriconlaicl", e.target.value)}
                      sx={tableInputSx}
                    />
                  </td>
                  <td style={tableBodyCellSx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.ghiChu}
                      onChange={(e) => handleInventoryChange(index, "ghiChu", e.target.value)}
                      sx={{ ...tableInputSx, "& input": { textAlign: "left" } }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        <Box sx={{ mt: 3, display: "flex", alignItems: "baseline", justifyContent: "flex-start" }}>
            <Typography sx={fontStyle}>Biên bản được lập xong hồi&nbsp;</Typography>
            <TextField
              variant="standard"
              value={closingTime}
              onChange={(e) => handleClosingTimeChange(e.target.value)}
              sx={{ ...dottedInputSx, width: "60px" }}
            />
            <Typography sx={fontStyle}>&nbsp;giờ cùng ngày, các thành viên thống nhất thông qua.</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ width: "45%", textAlign: "center" }}>
            <Typography sx={{ ...fontStyle, fontWeight: "bold", textTransform: "uppercase" }}>
            GIÁM ĐỐC
            </Typography>
            <Typography sx={{ ...fontStyle, fontStyle: "italic", fontSize: "11pt" }}>
            (Ghi ý kiến giải quyết số chênh lệch)
            </Typography>
            <Typography sx={{ ...fontStyle, fontStyle: "italic", fontSize: "11pt" }}>
            (Ký, họ tên, đóng dấu)
            </Typography>
            <Box sx={{ height: "100px" }}></Box>
        </Box>

        <Box sx={{ width: "45%", textAlign: "center" }}>
            <Typography sx={{ ...fontStyle, fontWeight: "bold", textTransform: "uppercase" }}>
            KẾ TOÁN 
            </Typography>
            <Typography sx={{ ...fontStyle, fontStyle: "italic", fontSize: "11pt" }}>
            (Ký, họ tên)
            </Typography>
            <Box sx={{ height: "100px" }}></Box>
        </Box>
        </Box>
      </Box>
    </Box>
  );
}