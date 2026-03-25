import React, { useState, useEffect } from "react";
import InlineCell from "../../../components/common/InlineCell";
import api from "../../../config/api.config";
import { Box, Typography, TextField } from "@mui/material";

interface ReportS22DNContentProps {
  onContentChange?: (content: any) => void;
  selectedDeptName?: string;
  selectedYear?: string | number;
  idDonVi?: string;
  fetchKey?: number;
  onFetchSuccess?: () => void;
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
  selectedDeptName,
  selectedYear,
  idDonVi,
  fetchKey,
  onFetchSuccess,
}: ReportS22DNContentProps) {
  const [diaChi, setDiaChi] = useState("");

  const [tsRows, setTsRows] = useState<TableRowData[]>([]);
  const [ccdcRows, setCcdcRows] = useState<TableRowData[]>([]);

  const [loading, setLoading] = useState(false);

  const fmt = (v: any) => (v === null || v === undefined ? "" : String(v));

  const mapItemToRow = (item: any, isReduce = false): TableRowData => {
    const date = item?.ngayThang ? String(item.ngayThang).split(" ")[0] : "";
    const id = fmt(item?.idTaiSan || item?.soHieu || "");
    const ten = fmt(item?.tenTaiSan || item?.ten || "");
    const dvt = fmt(item?.donViTinh || item?.dvt || "");
    const soLuong = fmt(item?.soLuong ?? item?.sl ?? "");
    const donGia = fmt(item?.donGia ?? item?.dg ?? "");
    const tongTien = fmt(item?.tongTien ?? item?.thanhTien ?? "");
    const ghiChu = fmt(item?.ghiChu || "");

    if (!isReduce) {
      return {
        ctTangSoHieu: id,
        ctTangNgay: date,
        tenNhanHieu: ten,
        dvt: dvt,
        tangSoLuong: soLuong,
        tangDonGia: donGia,
        tangSoTien: tongTien,
        ctGiamSoHieu: "",
        ctGiamNgay: "",
        giamLyDo: "",
        giamSoLuong: "",
        giamSoTien: "",
        ghiChu,
      };
    }

    return {
      ctTangSoHieu: "",
      ctTangNgay: "",
      tenNhanHieu: ten,
      dvt: dvt,
      tangSoLuong: "",
      tangDonGia: "",
      tangSoTien: "",
      ctGiamSoHieu: id,
      ctGiamNgay: date,
      giamLyDo: "",
      giamSoLuong: soLuong,
      giamSoTien: tongTien,
      ghiChu,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!idDonVi || !selectedYear) return;
      setLoading(true);
      try {
        const tsRes = await api.get("/baocao/s22dn", {
          params: { iddonvi: idDonVi, nam: selectedYear },
        });
        const tsData = tsRes?.data || {};
        const tsInc = Array.isArray(tsData.data_increase)
          ? tsData.data_increase
          : [];
        const tsDec = Array.isArray(tsData.data_reduce)
          ? tsData.data_reduce
          : [];
        const tsRowsNew: TableRowData[] = [];
        tsInc.forEach((it: any) => tsRowsNew.push(mapItemToRow(it, false)));
        tsDec.forEach((it: any) => tsRowsNew.push(mapItemToRow(it, true)));

        const cRes = await api.get("/baocao/s22dn-ccdc", {
          params: { iddonvi: idDonVi, nam: selectedYear },
        });
        const cData = cRes?.data || {};
        const cInc = Array.isArray(cData.data_increase)
          ? cData.data_increase
          : [];
        const cDec = Array.isArray(cData.data_reduce) ? cData.data_reduce : [];
        const cRowsNew: TableRowData[] = [];
        cInc.forEach((it: any) => cRowsNew.push(mapItemToRow(it, false)));
        cDec.forEach((it: any) => cRowsNew.push(mapItemToRow(it, true)));

        setTsRows(tsRowsNew);
        setCcdcRows(cRowsNew);
        onContentChange?.({
          diaChi,
          tsRows: tsRowsNew,
          ccdcRows: cRowsNew,
          footerData,
        });
        onFetchSuccess?.();
      } catch (err) {
        console.error("Fetch S22DN error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchKey]);

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
    onContentChange?.({ diaChi: value, tsRows, ccdcRows, footerData });
  };

  const handleRowChange = (
    index: number,
    field: keyof TableRowData,
    value: string,
  ) => {
    if (index < tsRows.length) {
      const newRows = [...tsRows];
      newRows[index] = { ...newRows[index], [field]: value };
      setTsRows(newRows);
      onContentChange?.({ diaChi, tsRows: newRows, ccdcRows, footerData });
      return;
    }
    const cIndex = index - tsRows.length;
    if (cIndex >= 0 && cIndex < ccdcRows.length) {
      const newRows = [...ccdcRows];
      newRows[cIndex] = { ...newRows[cIndex], [field]: value };
      setCcdcRows(newRows);
      onContentChange?.({ diaChi, tsRows, ccdcRows: newRows, footerData });
      return;
    }
  };

  const handleFooterChange = (
    field: keyof typeof footerData,
    value: string,
  ) => {
    const newData = { ...footerData, [field]: value };
    setFooterData(newData);
    onContentChange?.({ diaChi, tsRows, ccdcRows, footerData: newData });
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
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "transparent",
          p: 2,
          ...fontStyle,
        }}
        id="printable-s22dn-content"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box sx={{ width: "55%" }}>
            <Typography
              component="div"
              sx={{ ...fontStyle, fontWeight: "normal" }}
            >
              Đơn vị:{" "}
              <b style={{ fontWeight: "bold" }}>{selectedDeptName || ""}</b>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography sx={{ ...fontStyle, whiteSpace: "nowrap" }}>
                Địa chỉ:&nbsp;
              </Typography>
              <TextField
                value={diaChi}
                onChange={handleDiaChiChange}
                variant="standard"
                sx={{
                  ...dottedInputSx,
                  width: "200px",
                  "& input": { textAlign: "left" },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ width: "45%", textAlign: "center" }}>
            <Typography sx={{ ...fontStyle, fontWeight: "bold", mb: 0.5 }}>
              Mẫu số S22-DN
            </Typography>
            <Typography
              sx={{
                ...fontStyle,
                fontSize: "12pt",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              (Ban hành theo Thông tư số 200/2014/TT-BTC <br /> Ngày 22/12/2014
              của Bộ Tài chính)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", mt: 3, mb: 3 }}>
          <Typography
            sx={{ ...fontStyle, fontSize: "16pt", fontWeight: "bold" }}
          >
            Sổ Theo dõi tài sản cố định và công cụ, dụng cụ tại nơi sử dụng
          </Typography>
        </Box>

        <Box sx={{ pl: 0, mb: 2 }}>
          <Typography sx={{ ...fontStyle, mb: 1 }}>
            Năm <b style={{ fontWeight: "bold" }}>{selectedYear || ""}</b>
          </Typography>
          <Typography sx={{ ...fontStyle }}>
            Tên đơn vị (phòng, ban hoặc người sử dụng){" "}
            <b style={{ fontWeight: "bold" }}>{selectedDeptName || ""}</b>
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Typography sx={{ ...fontStyle, fontWeight: "bold" }}>
            Bảng ghi tăng/giảm Tài sản cố định
          </Typography>
        </Box>

        <Box sx={{ width: "100%", overflowX: "auto", mb: 4 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'Times New Roman'",
              fontSize: "12pt",
              tableLayout: "fixed",
            }}
          >
            <colgroup>
              <col style={{ width: "60px" }} />{" "}
              <col style={{ width: "80px" }} />{" "}
              <col style={{ width: "150px" }} />
              <col style={{ width: "60px" }} />{" "}
              <col style={{ width: "60px" }} />{" "}
              <col style={{ width: "90px" }} />
              <col style={{ width: "90px" }} />{" "}
              <col style={{ width: "60px" }} />{" "}
              <col style={{ width: "80px" }} />
              <col style={{ width: "100px" }} />{" "}
              <col style={{ width: "60px" }} />{" "}
              <col style={{ width: "90px" }} />
              <col style={{ width: "100px" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={headerStyle} colSpan={7}>
                  Ghi tăng tài sản cố định
                </th>
                <th style={headerStyle} colSpan={5}>
                  Ghi giảm tài sản cố định
                </th>
                <th style={headerStyle} rowSpan={3}>
                  Ghi chú
                </th>
              </tr>
              <tr>
                <th style={headerStyle} colSpan={2}>
                  Chứng từ
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Tên, nhãn hiệu, quy
                  <br />
                  cách tài sản cố định
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Đơn vị
                  <br />
                  tính
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Số
                  <br />
                  lượng
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Đơn giá
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Số tiền
                </th>
                <th style={headerStyle} colSpan={2}>
                  Chứng từ
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Lý do
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Số
                  <br />
                  lượng
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Số tiền
                </th>
              </tr>
              <tr>
                <th style={headerStyle}>Số hiệu</th>
                <th style={headerStyle}>
                  Ngày,
                  <br />
                  tháng
                </th>
                <th style={headerStyle}>Số hiệu</th>
                <th style={headerStyle}>
                  Ngày,
                  <br />
                  tháng
                </th>
              </tr>
              <tr>
                <th style={headerStyle}>A</th> <th style={headerStyle}>B</th>{" "}
                <th style={headerStyle}>C</th>
                <th style={headerStyle}>D</th> <th style={headerStyle}>1</th>{" "}
                <th style={headerStyle}>2</th>
                <th style={headerStyle}>3</th> <th style={headerStyle}>E</th>{" "}
                <th style={headerStyle}>G</th>
                <th style={headerStyle}>H</th> <th style={headerStyle}>4</th>{" "}
                <th style={headerStyle}>5</th>
                <th style={headerStyle}>I</th>
              </tr>
            </thead>
            <tbody>
              {tsRows.map((row, index) => (
                <tr key={index}>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.ctTangSoHieu}
                      onCommit={(v) =>
                        handleRowChange(index, "ctTangSoHieu", v)
                      }
                      align="center"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.ctTangNgay}
                      onCommit={(v) => handleRowChange(index, "ctTangNgay", v)}
                      align="center"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.tenNhanHieu}
                      onCommit={(v) => handleRowChange(index, "tenNhanHieu", v)}
                      align="left"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.dvt}
                      onCommit={(v) => handleRowChange(index, "dvt", v)}
                      align="center"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.tangSoLuong}
                      onCommit={(v) => handleRowChange(index, "tangSoLuong", v)}
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.tangDonGia}
                      onCommit={(v) => handleRowChange(index, "tangDonGia", v)}
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.tangSoTien}
                      onCommit={(v) => handleRowChange(index, "tangSoTien", v)}
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.ctGiamSoHieu}
                      onCommit={(v) =>
                        handleRowChange(index, "ctGiamSoHieu", v)
                      }
                      align="center"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.ctGiamNgay}
                      onCommit={(v) => handleRowChange(index, "ctGiamNgay", v)}
                      align="center"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.giamLyDo}
                      onCommit={(v) => handleRowChange(index, "giamLyDo", v)}
                      align="left"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.giamSoLuong}
                      onCommit={(v) => handleRowChange(index, "giamSoLuong", v)}
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.giamSoTien}
                      onCommit={(v) => handleRowChange(index, "giamSoTien", v)}
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.ghiChu}
                      onCommit={(v) => handleRowChange(index, "ghiChu", v)}
                      align="left"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Typography sx={{ ...fontStyle, fontWeight: "bold" }}>
            Bảng ghi tăng/giảm Công cụ dụng cụ cố định
          </Typography>
        </Box>

        <Box sx={{ width: "100%", overflowX: "auto", mb: 4 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'Times New Roman'",
              fontSize: "12pt",
              tableLayout: "fixed",
            }}
          >
            <colgroup>
              <col style={{ width: "60px" }} />{" "}
              <col style={{ width: "80px" }} />{" "}
              <col style={{ width: "150px" }} />
              <col style={{ width: "60px" }} />{" "}
              <col style={{ width: "60px" }} />{" "}
              <col style={{ width: "90px" }} />
              <col style={{ width: "90px" }} />{" "}
              <col style={{ width: "60px" }} />{" "}
              <col style={{ width: "80px" }} />
              <col style={{ width: "100px" }} />{" "}
              <col style={{ width: "60px" }} />{" "}
              <col style={{ width: "90px" }} />
              <col style={{ width: "100px" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={headerStyle} colSpan={7}>
                  Ghi tăng công cụ, dụng cụ cố định
                </th>
                <th style={headerStyle} colSpan={5}>
                  Ghi giảm công cụ, dụng cụ cố định
                </th>
                <th style={headerStyle} rowSpan={3}>
                  Ghi chú
                </th>
              </tr>
              <tr>
                <th style={headerStyle} colSpan={2}>
                  Chứng từ
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Tên, nhãn hiệu, quy
                  <br />
                  cách công cụ, dụng cụ cố định
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Đơn vị
                  <br />
                  tính
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Số
                  <br />
                  lượng
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Đơn giá
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Số tiền
                </th>
                <th style={headerStyle} colSpan={2}>
                  Chứng từ
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Lý do
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Số
                  <br />
                  lượng
                </th>
                <th style={headerStyle} rowSpan={2}>
                  Số tiền
                </th>
              </tr>
              <tr>
                <th style={headerStyle}>Số hiệu</th>
                <th style={headerStyle}>
                  Ngày,
                  <br />
                  tháng
                </th>
                <th style={headerStyle}>Số hiệu</th>
                <th style={headerStyle}>
                  Ngày,
                  <br />
                  tháng
                </th>
              </tr>
              <tr>
                <th style={headerStyle}>A</th> <th style={headerStyle}>B</th>{" "}
                <th style={headerStyle}>C</th>
                <th style={headerStyle}>D</th> <th style={headerStyle}>1</th>{" "}
                <th style={headerStyle}>2</th>
                <th style={headerStyle}>3</th> <th style={headerStyle}>E</th>{" "}
                <th style={headerStyle}>G</th>
                <th style={headerStyle}>H</th> <th style={headerStyle}>4</th>{" "}
                <th style={headerStyle}>5</th>
                <th style={headerStyle}>I</th>
              </tr>
            </thead>
            <tbody>
              {ccdcRows.map((row, index) => (
                <tr key={index}>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.ctTangSoHieu}
                      onCommit={(v) =>
                        handleRowChange(
                          tsRows.length + index,
                          "ctTangSoHieu",
                          v,
                        )
                      }
                      align="center"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.ctTangNgay}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "ctTangNgay", v)
                      }
                      align="center"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.tenNhanHieu}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "tenNhanHieu", v)
                      }
                      align="left"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.dvt}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "dvt", v)
                      }
                      align="center"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.tangSoLuong}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "tangSoLuong", v)
                      }
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.tangDonGia}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "tangDonGia", v)
                      }
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.tangSoTien}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "tangSoTien", v)
                      }
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.ctGiamSoHieu}
                      onCommit={(v) =>
                        handleRowChange(
                          tsRows.length + index,
                          "ctGiamSoHieu",
                          v,
                        )
                      }
                      align="center"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.ctGiamNgay}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "ctGiamNgay", v)
                      }
                      align="center"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.giamLyDo}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "giamLyDo", v)
                      }
                      align="left"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.giamSoLuong}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "giamSoLuong", v)
                      }
                      align="center" 
                      type="number"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.giamSoTien}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "giamSoTien", v)
                      }
                      align="center"
                      type="number"
                    />
                  </td>
                  <td style={cellStyle}>
                    <InlineCell
                      value={row.ghiChu}
                      onCommit={(v) =>
                        handleRowChange(tsRows.length + index, "ghiChu", v)
                      }
                      align="left"
                    />
                  </td>
                </tr>
              ))}
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
                  onChange={(e) =>
                    handleFooterChange("thangKy", e.target.value)
                  }
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
      <Box sx={{ height: 200 }} />
      <Box sx={{ mt: 4 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            sx={{ ...fontStyle, fontSize: "16pt", fontWeight: "bold" }}
          >
            SỔ THEO DÕI TÀI SẢN CỐ ĐỊNH VÀ CÔNG CỤ,
            <br /> DỤNG CỤ TẠI NƠI SỬ DỤNG
          </Typography>
          <Typography
            sx={{ ...fontStyle, fontSize: "12pt", fontStyle: "italic" }}
          >
            (Mẫu số S22-DN)
          </Typography>
        </Box>
        <Typography sx={{ ...fontStyle, fontWeight: "bold", mb: 1 }}>
          1. Mục đích:
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 1 }}>
          Sổ này dùng để ghi chép tình hình tăng, giảm tài sản cố định và công
          cụ, dụng cụ tại nơi sử dụng nhằm quản lý tài sản và dụng cụ đã được
          cấp cho các phòng, ban; làm căn cứ đối chiếu khi tiến hành kiểm kê
          định kỳ.
        </Typography>

        <Typography sx={{ ...fontStyle, fontWeight: "bold", mb: 1 }}>
          2. Căn cứ và phương pháp ghi sổ:
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 1 }}>
          Mỗi đơn vị hoặc bộ phận (phân xưởng, phòng ban...) thuộc doanh nghiệp
          phải mở một sổ để theo dõi tài sản. Căn cứ vào chứng từ gốc về tăng,
          giảm tài sản để ghi vào sổ theo đơn vị sử dụng như sau:
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 0.5 }}>
          - Cột A, B: Ghi số hiệu, ngày tháng của chứng từ tăng tài sản cố định
          và công cụ, dụng cụ.
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 0.5 }}>
          - Cột C: Ghi tên nhãn hiệu, đặc điểm TSCĐ và công cụ, dụng cụ.
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 0.5 }}>
          - Cột D: Ghi đơn vị tính (cái, chiếc,...).
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 0.5 }}>
          - Cột 1: Ghi số lượng.
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 0.5 }}>
          - Cột 2: Ghi nguyên giá TSCĐ hoặc đơn giá công cụ, dụng cụ.
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 0.5 }}>
          - Cột 3: Ghi số tiền (Cột 3 = Cột 1 x Cột 2).
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 0.5 }}>
          - Cột E, G: Ghi số hiệu, ngày tháng của chứng từ ghi giảm tài sản cố
          định và công cụ, dụng cụ.
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 0.5 }}>
          - Cột H: Ghi lý do giảm tài sản cố định và công cụ, dụng cụ.
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 0.5 }}>
          - Cột 4: Ghi số lượng tài sản/công cụ giảm.
        </Typography>
        <Typography sx={{ ...fontStyle, mb: 0.5 }}>
          - Cột 5: Ghi nguyên giá tài sản cố định và giá trị công cụ, dụng cụ
          giảm.
        </Typography>
      </Box>
    </>
  );
}
