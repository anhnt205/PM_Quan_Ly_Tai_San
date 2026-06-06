import React, { useState, useEffect } from "react";
import { Box, Typography, TextField } from "@mui/material";
import InlineCell from "../../../components/common/InlineCell";

interface BBKiemKeContentProps {
  onContentChange?: (content: any) => void;
  selectedDeptName?: string;
  idPhongBan?: string;
  fetchKey?: number;
  onFetchSuccess?: () => void;
}

interface MemberRow {
  name: string;
  position: string;
}

interface InventoryItem {
  stt: string;
  tenTaiSan: string;
  dvt: string;
  nuocSx: string;
  phuongThuc: string;
  soLuong: string;
  hienTrang: string;
  ghiChu: string;
}

export default function BBKiemKeContent({
  onContentChange,
  selectedDeptName,
  idPhongBan,
  fetchKey,
  onFetchSuccess,
}: BBKiemKeContentProps) {
  useEffect(() => {
    const fetchData = async () => {
      if (!idPhongBan) return;
      try {
        const res = await (
          await import("../../../config/api.config")
        ).default.get("/baocao/bienban-kiemke", { params: { idPhongBan } });
        const data = res?.data || [];
        if (!Array.isArray(data)) return;

        const BATCH = 200;
        if (data.length <= BATCH) {
          const mapped = data.map((it: any, idx: number) => ({
            stt: String(idx + 1),
            tenTaiSan: it.tenTaiSan || it.ten || "",
            dvt: it.donViTinh || it.dvt || "",
            nuocSx: it.nuocSx || "",
            phuongThuc: it.phuongThucKiemKe || it.phuongThuc || "",
            soLuong: String(it.soLuongKiemKeThucTe ?? it.soLuong ?? ""),
            hienTrang: it.hienTrang || "",
            ghiChu: it.ghiChu || "",
          }));
          setInventoryItems(mapped);
          onContentChange?.({
            headerInfo,
            generalInfo,
            members,
            membersUnit,
            inventoryItems: mapped,
            closingTime,
          });
          onFetchSuccess?.();
          return;
        }

        setInventoryItems([]);
        for (let i = 0; i < data.length; i += BATCH) {
          const slice = data.slice(i, i + BATCH);
          const mapped = slice.map((it: any, idx: number) => ({
            stt: String(i + idx + 1),
            tenTaiSan: it.tenTaiSan || it.ten || "",
            dvt: it.donViTinh || it.dvt || "",
            nuocSx: it.nuocSx || "",
            phuongThuc: it.phuongThucKiemKe || it.phuongThuc || "",
            soLuong: String(it.soLuongKiemKeThucTe ?? it.soLuong ?? ""),
            hienTrang: it.hienTrang || "",
            ghiChu: it.ghiChu || "",
          }));
          setInventoryItems((prev) => {
            const next = prev.concat(mapped);
            onContentChange?.({
              headerInfo,
              generalInfo,
              members,
              membersUnit,
              inventoryItems: next,
              closingTime,
            });
            return next;
          });
          await new Promise((r) => setTimeout(r, 0));
        }
        onFetchSuccess?.();
      } catch (err) {
        console.error("Fetch bienban-kiemke error", err);
      }
    };

    fetchData();
  }, [fetchKey]);
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
    { name: "", position: "" },
    { name: "", position: "" },
    { name: "", position: "" },
  ]);

  const [membersUnit, setMembersUnit] = useState<MemberRow[]>([
    { name: "", position: "" },
    { name: "", position: "" },
  ]);

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const [closingTime, setClosingTime] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setCurrentDateStr(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleHeaderChange = (
    field: keyof typeof headerInfo,
    value: string,
  ) => {
    const newInfo = { ...headerInfo, [field]: value };
    setHeaderInfo(newInfo);
    onContentChange?.({
      headerInfo: newInfo,
      generalInfo,
      members,
      membersUnit,
      inventoryItems,
      closingTime,
    });
  };

  const handleGeneralInfoChange = (
    field: keyof typeof generalInfo,
    value: string,
  ) => {
    const newInfo = { ...generalInfo, [field]: value };
    setGeneralInfo(newInfo);
    onContentChange?.({
      headerInfo,
      generalInfo: newInfo,
      members,
      membersUnit,
      inventoryItems,
      closingTime,
    });
  };

  const handleMemberChange = (
    index: number,
    field: keyof MemberRow,
    value: string,
  ) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
    onContentChange?.({
      headerInfo,
      generalInfo,
      members: newMembers,
      membersUnit,
      inventoryItems,
      closingTime,
    });
  };

  const handleMemberUnitChange = (
    index: number,
    field: keyof MemberRow,
    value: string,
  ) => {
    const newMembersUnit = [...membersUnit];
    newMembersUnit[index] = { ...newMembersUnit[index], [field]: value };
    setMembersUnit(newMembersUnit);
    onContentChange?.({
      headerInfo,
      generalInfo,
      members,
      membersUnit: newMembersUnit,
      inventoryItems,
      closingTime,
    });
  };

  const handleInventoryChange = (
    index: number,
    field: keyof InventoryItem,
    value: string,
  ) => {
    const newItems = [...inventoryItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setInventoryItems(newItems);
    onContentChange?.({
      headerInfo,
      generalInfo,
      members,
      membersUnit,
      inventoryItems: newItems,
      closingTime,
    });
  };

  const handleClosingTimeChange = (value: string) => {
    setClosingTime(value);
    onContentChange?.({
      headerInfo,
      generalInfo,
      members,
      membersUnit,
      inventoryItems,
      closingTime: value,
    });
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

  const tableCellSx = {
    border: "1px solid #000",
    padding: "4px",
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
    fontWeight: "bold",
    ...fontStyle,
  };

  const tableBodyCellSx = {
    ...tableCellSx,
    fontWeight: "normal",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  };

  const tableInputSx = {
    "& .MuiInput-root": {
      ...fontStyle,
      "&:before": { borderBottom: "none !important" },
      "&:after": { borderBottom: "none !important" },
    },
    "& input": { padding: "0 2px", textAlign: "center" },
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box sx={{ width: "50%", textAlign: "center" }}>
          <Typography sx={{ ...fontStyle, textTransform: "uppercase" }}>
            TẬP ĐOÀN CÔNG NGHIỆP <br /> THAN - KHOÁNG SẢN VIỆT NAM
          </Typography>
          <Typography
            sx={{
              ...fontStyle,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            CÔNG TY THAN KHO VẬN CẨM PHÁ - VINACOMIN
          </Typography>
        </Box>

        <Box sx={{ width: "50%", textAlign: "center" }}>
          <Typography sx={{ ...fontStyle, fontWeight: "bold", mb: 0.5 }}>
            Mẫu số 01a-TS
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              flexWrap: "wrap",
            }}
          >
            <Typography sx={fontStyle}>
              Ban hành kèm theo QĐ số&nbsp;
            </Typography>
            <TextField
              variant="standard"
              value={headerInfo.qdSo}
              onChange={(e) => handleHeaderChange("qdSo", e.target.value)}
              sx={{ ...dottedInputSx, width: "60px" }}
            />
            <Typography sx={fontStyle}>&nbsp;/QĐ-TUB</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
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
        <Typography
          sx={{
            ...fontStyle,
            fontSize: "16pt",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          BIÊN BẢN KIỂM KÊ TSCĐ, CCDC TẠI HIỆN TRƯỜNG
        </Typography>
        <Typography sx={{ ...fontStyle, mt: 1, fontWeight: "bold" }}>
          Đơn vị: <b style={{ fontWeight: "bold" }}>{selectedDeptName || ""}</b>
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
          <Typography sx={fontStyle}>Hôm nay, ngày&nbsp;</Typography>
          <TextField
            variant="standard"
            value={generalInfo.ngayKiemKe}
            onChange={(e) =>
              handleGeneralInfoChange("ngayKiemKe", e.target.value)
            }
            sx={{ ...dottedInputSx, width: "30px" }}
          />
          <Typography sx={fontStyle}>&nbsp;tháng&nbsp;</Typography>
          <TextField
            variant="standard"
            value={generalInfo.thangKiemKe}
            onChange={(e) =>
              handleGeneralInfoChange("thangKiemKe", e.target.value)
            }
            sx={{ ...dottedInputSx, width: "30px" }}
          />
          <Typography sx={fontStyle}>&nbsp;năm&nbsp;</Typography>
          <TextField
            variant="standard"
            value={generalInfo.namKiemKe}
            onChange={(e) =>
              handleGeneralInfoChange("namKiemKe", e.target.value)
            }
            sx={{ ...dottedInputSx, width: "50px" }}
          />
          <Typography sx={fontStyle}>&nbsp;tại&nbsp;</Typography>
          <TextField
            variant="standard"
            value={generalInfo.diaDiem}
            onChange={(e) => handleGeneralInfoChange("diaDiem", e.target.value)}
            sx={{
              ...dottedInputSx,
              width: "150px",
              flexGrow: 1,
              "& input": { textAlign: "left" },
            }}
          />
        </Box>
        <Typography sx={{ ...fontStyle, mt: 1 }}>
          Thành phần kiểm kê chúng tôi gồm:
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{ ...fontStyle, fontWeight: "bold", textTransform: "uppercase" }}
        >
          A. THÀNH PHẦN
        </Typography>
        <Typography sx={{ ...fontStyle, fontWeight: "bold" }}>
          I. Tiểu ban kiểm kê
        </Typography>

        {members.map((row, index) => (
          <Box
            key={`mb1-${index}`}
            sx={{ display: "flex", alignItems: "baseline", mt: 0.5 }}
          >
            <Typography sx={fontStyle}>{index + 1}. Ông (bà):&nbsp;</Typography>
            <TextField
              variant="standard"
              value={row.name}
              onChange={(e) =>
                handleMemberChange(index, "name", e.target.value)
              }
              sx={{
                ...dottedInputSx,
                flexGrow: 1,
                "& input": { textAlign: "left" },
              }}
            />
            <Typography sx={{ ...fontStyle, ml: 1 }}>
              &nbsp;Chức vụ:&nbsp;
            </Typography>
            <TextField
              variant="standard"
              value={row.position}
              onChange={(e) =>
                handleMemberChange(index, "position", e.target.value)
              }
              sx={{
                ...dottedInputSx,
                width: "30%",
                "& input": { textAlign: "left" },
              }}
            />
          </Box>
        ))}

        <Typography sx={{ ...fontStyle, fontWeight: "bold", mt: 1 }}>
          II. Đơn vị được kiểm kê
        </Typography>

        {membersUnit.map((row, index) => (
          <Box
            key={`mb2-${index}`}
            sx={{ display: "flex", alignItems: "baseline", mt: 0.5 }}
          >
            <Typography sx={fontStyle}>{index + 1}. Ông (bà):&nbsp;</Typography>
            <TextField
              variant="standard"
              value={row.name}
              onChange={(e) =>
                handleMemberUnitChange(index, "name", e.target.value)
              }
              sx={{
                ...dottedInputSx,
                flexGrow: 1,
                "& input": { textAlign: "left" },
              }}
            />
            <Typography sx={{ ...fontStyle, ml: 1 }}>
              &nbsp;Chức vụ:&nbsp;
            </Typography>
            <TextField
              variant="standard"
              value={row.position}
              onChange={(e) =>
                handleMemberUnitChange(index, "position", e.target.value)
              }
              sx={{
                ...dottedInputSx,
                width: "30%",
                "& input": { textAlign: "left" },
              }}
            />
          </Box>
        ))}

        <Typography
          sx={{
            ...fontStyle,
            fontWeight: "bold",
            textTransform: "uppercase",
            mt: 2,
          }}
        >
          B. NỘI DUNG
        </Typography>

        <Typography sx={{ ...fontStyle, mt: 1, mb: 2 }}>
          Tiến hành kiểm kê TSCĐ, CCDC hiện có tại đơn vị đến ngày{" "}
          {currentDateStr} cụ thể như sau:
        </Typography>

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid black",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    ...(tableCellSx as React.CSSProperties),
                    width: "5%",
                  }}
                >
                  STT
                </th>
                <th
                  style={{
                    ...(tableCellSx as React.CSSProperties),
                    width: "30%",
                  }}
                >
                  Tên tài sản, công cụ dụng cụ ( ký mã hiệu )
                </th>
                <th
                  style={{
                    ...(tableCellSx as React.CSSProperties),
                    width: "10%",
                  }}
                >
                  Đơn vị tính
                </th>
                <th
                  style={{
                    ...(tableCellSx as React.CSSProperties),
                    width: "10%",
                  }}
                >
                  Nước sản xuất
                </th>
                <th
                  style={{
                    ...(tableCellSx as React.CSSProperties),
                    width: "10%",
                  }}
                >
                  Phương thức kiểm kê
                </th>
                <th
                  style={{
                    ...(tableCellSx as React.CSSProperties),
                    width: "10%",
                  }}
                >
                  Số lượng kiểm kê thực tế
                </th>
                <th
                  style={{
                    ...(tableCellSx as React.CSSProperties),
                    width: "10%",
                  }}
                >
                  Hiện trạng
                </th>
                <th
                  style={{
                    ...(tableCellSx as React.CSSProperties),
                    width: "15%",
                  }}
                >
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item, index) => (
                <tr key={index}>
                  <td style={tableBodyCellSx as React.CSSProperties}>
                    {item.stt}
                  </td>
                  <td style={tableBodyCellSx as React.CSSProperties}>
                    <InlineCell
                      value={item.tenTaiSan}
                      onCommit={(v) =>
                        handleInventoryChange(index, "tenTaiSan", v)
                      }
                      align="left"
                    />
                  </td>
                  <td style={tableBodyCellSx as React.CSSProperties}>
                    <InlineCell
                      value={item.dvt}
                      onCommit={(v) => handleInventoryChange(index, "dvt", v)}
                      align="center"
                    />
                  </td>
                  <td style={tableBodyCellSx as React.CSSProperties}>
                    <InlineCell
                      value={item.nuocSx}
                      onCommit={(v) =>
                        handleInventoryChange(index, "nuocSx", v)
                      }
                      align="center"
                    />
                  </td>
                  <td style={tableBodyCellSx as React.CSSProperties}>
                    <InlineCell
                      value={item.phuongThuc}
                      onCommit={(v) =>
                        handleInventoryChange(index, "phuongThuc", v)
                      }
                      align="center"
                    />
                  </td>
                  <td style={tableBodyCellSx as React.CSSProperties}>
                    <InlineCell
                      value={item.soLuong}
                      onCommit={(v) =>
                        handleInventoryChange(index, "soLuong", v)
                      }
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={tableBodyCellSx as React.CSSProperties}>
                    <InlineCell
                      value={item.hienTrang}
                      onCommit={(v) =>
                        handleInventoryChange(index, "hienTrang", v)
                      }
                      align="center"
                    />
                  </td>
                  <td style={tableBodyCellSx as React.CSSProperties}>
                    <InlineCell
                      value={item.ghiChu}
                      onCommit={(v) =>
                        handleInventoryChange(index, "ghiChu", v)
                      }
                      align="left"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "flex-start",
          }}
        >
          <Typography sx={fontStyle}>
            Biên bản được lập xong hồi&nbsp;
          </Typography>
          <TextField
            variant="standard"
            value={closingTime}
            onChange={(e) => handleClosingTimeChange(e.target.value)}
            sx={{ ...dottedInputSx, width: "60px" }}
          />
          <Typography sx={fontStyle}>
            &nbsp;giờ cùng ngày, các thành viên thống nhất thông qua.
          </Typography>
        </Box>

        <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ width: "50%" }}></Box>

          <Box sx={{ width: "50%", textAlign: "center" }}>
            <Typography
              sx={{
                ...fontStyle,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              TRƯỞNG TIỂU BAN KIỂM KÊ
            </Typography>
            <Box sx={{ height: "40px" }}></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
