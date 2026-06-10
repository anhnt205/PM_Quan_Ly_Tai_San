import React from "react";
import {
  Box,
  Fade,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";
import {
  colors,
  headerCellSx,
  dataCellSx,
  sumCellSx,
  inputSx,
  cellBorderCss,
  AssetScheduleData,
} from "./AssetLichTrinhVanDungModal";

const ROWS_PER_ASSET = 4;

interface Props {
  assetsData: AssetScheduleData[];
  days: number[];
  daysInMonth: number;
  getShiftValue: (assetIdx: number, day: number, ca: number) => number;
  setShiftValue: (
    assetIdx: number,
    day: number,
    ca: number,
    value: number,
  ) => void;
  getDayTotal: (assetIdx: number, day: number) => number;
  getShiftMonthTotal: (assetIdx: number, ca: number) => number;
  getMonthGrandTotal: (assetIdx: number) => number;
  setAssetField: (
    assetIdx: number,
    field: keyof AssetScheduleData,
    value: any,
  ) => void;
}

export default function LichTrinhTable({
  assetsData,
  days,
  daysInMonth,
  getShiftValue,
  setShiftValue,
  getDayTotal,
  getShiftMonthTotal,
  getMonthGrandTotal,
  setAssetField,
}: Props) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        p: 3,
      }}
    >
      <Fade in timeout={400}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: `1px solid ${colors.cellBorder}`,
            borderRadius: "12px",
            overflow: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            "&::-webkit-scrollbar": { height: 10, width: 10 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5e1",
              borderRadius: 5,
              border: "2px solid transparent",
              backgroundClip: "content-box",
            },
            "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#94a3b8" },
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              borderCollapse: "collapse",
              tableLayout: "fixed",
              minWidth: 678 + daysInMonth * 42,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerCellSx, width: 44 }}>STT</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 100 }}>
                  Mã thiết bị
                </TableCell>
                <TableCell
                  sx={{ ...headerCellSx, width: 180, textAlign: "left", pl: 2 }}
                >
                  Tên phương tiện / Số đăng ký
                </TableCell>
                <TableCell sx={{ ...headerCellSx, width: 50 }}>Ca</TableCell>
                {days.map((d) => (
                  <TableCell
                    key={d}
                    sx={{
                      ...headerCellSx,
                      width: 42,
                      padding: "6px 0",
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    {d}
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    ...headerCellSx,
                    width: 90,
                    backgroundColor: "#036940",
                    color: "#ffffff",
                  }}
                >
                  Tổng tháng
                </TableCell>
                <TableCell sx={{ ...headerCellSx, width: 220 }}>
                  GHI CHÚ
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {assetsData.map((asset, assetIdx) => (
                <React.Fragment key={asset.idTaiSan}>
                  {[1, 2, 3, "cong"].map((caVal, rowIdx) => {
                    const isCong = caVal === "cong";
                    const ca = typeof caVal === "number" ? caVal : 0;
                    return (
                      <TableRow
                        key={`${asset.idTaiSan}-${caVal}`}
                        sx={{
                          backgroundColor: isCong ? colors.sumBg : "#ffffff",
                          borderBottom: isCong
                            ? `2px solid ${colors.borderDark}`
                            : `1px dashed ${colors.borderLight}`,
                          "&:hover": {
                            backgroundColor: isCong
                              ? "rgba(4,180,110,0.12)"
                              : colors.rowHover,
                          },
                        }}
                      >
                        {rowIdx === 0 && (
                          <TableCell
                            rowSpan={ROWS_PER_ASSET}
                            sx={{
                              ...dataCellSx,
                              fontWeight: 700,
                              fontSize: "13px",
                              backgroundColor: "#ffffff",
                              verticalAlign: "middle",
                              color: colors.textMuted,
                            }}
                          >
                            {assetIdx + 1}
                          </TableCell>
                        )}
                        {rowIdx === 0 && (
                          <TableCell
                            rowSpan={ROWS_PER_ASSET}
                            sx={{
                              ...dataCellSx,
                              fontWeight: 600,
                              fontSize: "11px",
                              backgroundColor: "#ffffff",
                              verticalAlign: "middle",
                              fontFamily: '"JetBrains Mono", monospace',
                            }}
                          >
                            {asset.soThe}
                          </TableCell>
                        )}
                        {rowIdx === 0 && (
                          <TableCell
                            rowSpan={ROWS_PER_ASSET}
                            sx={{
                              ...dataCellSx,
                              textAlign: "left",
                              padding: "8px 12px",
                              verticalAlign: "middle",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: colors.textMain,
                                lineHeight: 1.35,
                              }}
                            >
                              {asset.tenTaiSan}
                            </Typography>
                          </TableCell>
                        )}

                        <TableCell
                          sx={{
                            ...dataCellSx,
                            fontWeight: 700,
                            fontSize: isCong ? "11px" : "12px",
                            backgroundColor: isCong ? colors.sumBg : "#f8fafc",
                            color: isCong ? colors.sumText : colors.headerBg,
                            borderRight: `2px solid ${colors.cellBorder}`,
                          }}
                        >
                          {isCong ? "Cộng" : ca}
                        </TableCell>

                        {days.map((d) => {
                          if (isCong) {
                            const total = getDayTotal(assetIdx, d);
                            return (
                              <TableCell key={d} sx={sumCellSx}>
                                {total > 0 ? total : ""}
                              </TableCell>
                            );
                          }
                          const val = getShiftValue(assetIdx, d, ca);
                          return (
                            <TableCell key={d} sx={dataCellSx}>
                              <TextField
                                variant="standard"
                                size="small"
                                type="number"
                                value={val || ""}
                                onChange={(e) =>
                                  setShiftValue(
                                    assetIdx,
                                    d,
                                    ca,
                                    Number(e.target.value) || 0,
                                  )
                                }
                                sx={{
                                  ...inputSx,
                                  width: "100%",
                                  "& .MuiInputBase-input": {
                                    ...inputSx["& .MuiInputBase-input"],
                                    color:
                                      val > 0 ? colors.textMain : "#94a3b8",
                                  },
                                }}
                                slotProps={{
                                  input: { inputProps: { min: 0, max: 24 } },
                                }}
                              />
                            </TableCell>
                          );
                        })}

                        <TableCell
                          sx={
                            isCong
                              ? {
                                  ...sumCellSx,
                                  backgroundColor: "rgba(4,180,110,0.15)",
                                  fontSize: "13px",
                                  fontWeight: 800,
                                  borderLeft: `2px solid ${colors.cellBorder}`,
                                }
                              : {
                                  ...dataCellSx,
                                  fontWeight: 700,
                                  backgroundColor: "#f8fafc",
                                  fontFamily: '"JetBrains Mono", monospace',
                                  borderLeft: `2px solid ${colors.cellBorder}`,
                                }
                          }
                        >
                          {isCong
                            ? getMonthGrandTotal(assetIdx) || ""
                            : getShiftMonthTotal(assetIdx, ca) || ""}
                        </TableCell>

                        {rowIdx === 0 && (
                          <TableCell
                            rowSpan={ROWS_PER_ASSET}
                            sx={{
                              ...dataCellSx,
                              padding: 0,
                              position: "relative",
                              backgroundColor: "#fffdf9",
                              borderLeft: cellBorderCss,
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                p: 1,
                              }}
                            >
                              <TextField
                                variant="standard"
                                multiline
                                value={asset.ghiChu}
                                onChange={(e) =>
                                  setAssetField(
                                    assetIdx,
                                    "ghiChu",
                                    e.target.value,
                                  )
                                }
                                placeholder="Nhập tình trạng hư hỏng, sự cố, thuyên chuyển..."
                                slotProps={{
                                  input: {
                                    disableUnderline: true,
                                    sx: {
                                      height: "100%",
                                      alignItems: "flex-start",
                                      p: 0,
                                      fontSize: "11px",
                                      lineHeight: 1.45,
                                      fontFamily: '"Inter", sans-serif',
                                      color: colors.textMain,
                                    },
                                  },
                                }}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  "& .MuiInputBase-root": { height: "100%" },
                                  "& .MuiInputBase-input": {
                                    height: "100% !important",
                                    overflow: "auto !important",
                                  },
                                }}
                              />
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>
    </Box>
  );
}
