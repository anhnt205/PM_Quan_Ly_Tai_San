// import { useState } from "react";
// import {
//   Box,
//   Button,
//   Chip,
//   Divider,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tabs,
//   Tab,
//   Typography,
//   Paper,
// } from "@mui/material";
// import { X } from "lucide-react";
// import { StatusPlan } from "../../../utils/const";
// import { MaintenancePlanData } from "../planning/";

// /* ─── Helpers ────────────────────────────────────────── */
// const thSx = {
//   fontSize: 12,
//   fontWeight: 600,
//   color: "text.secondary",
//   bgcolor: "grey.50",
//   py: 1,
//   px: 1.5,
//   whiteSpace: "nowrap" as const,
// };

// const tdSx = { fontSize: 13, py: 0.75, px: 1.5 };

// const labelSx = {
//   fontSize: 10,
//   fontWeight: 600,
//   color: "text.secondary",
//   textTransform: "uppercase" as const,
//   letterSpacing: "0.5px",
//   display: "block",
//   mb: 0.25,
// };

// const statusChipMap: Record<string, { label: string; color: "warning" | "info" | "success" }> = {
//   [StatusPlan.PENDING]:   { label: "Chưa thực hiện", color: "warning" },
//   [StatusPlan.PROGRESS]:  { label: "Đang thực hiện", color: "info"    },
//   [StatusPlan.COMPLETED]: { label: "Đã hoàn thành",  color: "success" },
// };

// const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
//   <Box>
//     <Typography sx={labelSx}>{label}</Typography>
//     <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>
//       {value || "—"}
//     </Typography>
//   </Box>
// );

// /* ─── Props ──────────────────────────────────────────── */
// interface Props {
//   plan: MaintenancePlanData & {
//     danhSachTaiSan: any[];
//     danhSachVatTu: any[];
//     congViecs: any[];
//   };
//   onClose: () => void;
// }

// /* ─── Component ──────────────────────────────────────── */
// export default function PlanDetailPanel({ plan, onClose }: Props) {
//   const [tab, setTab] = useState(0);

//   const statusCfg = statusChipMap[plan.trangThai ?? ""] ?? null;

//   const renderPeriod = () => {
//     if (!plan.ngayBatDau) return "—";
//     const d = new Date(plan.ngayBatDau);
//     const thang = d.getMonth() + 1;
//     const quy = Math.ceil(thang / 3);
//     const nam = d.getFullYear();
//     return `Tháng ${thang} · Quý ${quy} · Năm ${nam}`;
//   };

//   return (
//     <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

//       {/* ── Header ── */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
//         <Box>
//           <Typography sx={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, mb: 0.75 }}>
//             {plan.tenKeHoach || "Chi tiết kế hoạch"}
//           </Typography>
//           <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
//             {statusCfg && (
//               <Chip label={statusCfg.label} color={statusCfg.color} size="small" sx={{ fontSize: 11, height: 22 }} />
//             )}
//             {plan.ngayTao && (
//               <Typography variant="caption" color="text.secondary">Tạo: {plan.ngayTao}</Typography>
//             )}
//           </Box>
//         </Box>
//         <IconButton size="small" onClick={onClose} sx={{ color: "text.secondary", mt: -0.5 }}>
//           <X size={16} />
//         </IconButton>
//       </Box>

//       <Divider sx={{ mb: 2 }} />

//       {/* ── Tabs ── */}
//       <Tabs
//         value={tab}
//         onChange={(_, v) => setTab(v)}
//         sx={{
//           mb: 2,
//           minHeight: 36,
//           "& .MuiTab-root": {
//             minHeight: 36,
//             fontSize: 13,
//             fontWeight: 500,
//             textTransform: "none",
//             py: 0.5,
//           },
//           "& .MuiTabs-indicator": { bgcolor: "success.main" },
//           "& .Mui-selected": { color: "success.dark !important" },
//         }}
//       >
//         <Tab label="Thông tin chung" />
//         <Tab label="Tài sản & Vật tư" />
//         <Tab label="Công việc" />
//       </Tabs>

//       {/* ══════════════════════════════════════════════
//           TAB 0 – Thông tin chung
//       ══════════════════════════════════════════════ */}
//       {tab === 0 && (
//         <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 2 }}>

//           {/* Phân loại */}
//           <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
//             <Field label="Loại kế hoạch"   value={plan.tenLoaiKeHoach} />
//             <Field label="Loại sửa chữa"   value={plan.tenLoaiSuaChua} />
//             <Field label="Thuộc kỳ"        value={renderPeriod()} />
//             <Field label="Trạng thái"      value={statusCfg ? (
//               <Chip label={statusCfg.label} color={statusCfg.color} size="small" sx={{ fontSize: 11, height: 20, mt: 0.25 }} />
//             ) : undefined} />
//           </Box>

//           <Divider />

//           {/* Đơn vị */}
//           <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
//             <Field label="Đơn vị giao"      value={plan.tenDonViGiao} />
//             <Field label="Đơn vị thực hiện" value={plan.tenDonViThucHien} />
//             <Field label="Người phụ trách"  value={plan.tenNguoiPhuTrach} />
//           </Box>

//           <Divider />

//           {/* Thời gian */}
//           <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
//             <Field label="Ngày bắt đầu" value={plan.ngayBatDau} />
//             <Field label="Ngày kết thúc" value={plan.ngayKetThuc} />
//           </Box>

//           {plan.ghiChu && (
//             <>
//               <Divider />
//               <Field label="Ghi chú" value={plan.ghiChu} />
//             </>
//           )}
//         </Box>
//       )}

//       {/* ══════════════════════════════════════════════
//           TAB 1 – Tài sản & Vật tư
//       ══════════════════════════════════════════════ */}
//       {tab === 1 && (
//         <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 3 }}>

//           {/* Danh sách tài sản */}
//           <Box>
//             <Typography sx={{ ...labelSx, mb: 1 }}>
//               Tài sản ({plan.danhSachTaiSan.length})
//             </Typography>
//             {plan.danhSachTaiSan.length === 0 ? (
//               <Box sx={{ py: 3, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 1.5 }}>
//                 <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
//                   Chưa có tài sản
//                 </Typography>
//               </Box>
//             ) : (
//               <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 1.5 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={thSx}>STT</TableCell>
//                       <TableCell sx={thSx}>Tên tài sản</TableCell>
//                       <TableCell sx={thSx}>Mã tài sản</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {plan.danhSachTaiSan.map((ts: any, i: number) => (
//                       <TableRow key={i} hover>
//                         <TableCell sx={tdSx}>{i + 1}</TableCell>
//                         <TableCell sx={{ ...tdSx, fontWeight: 500 }}>
//                           {ts.tenTaiSan || "—"}
//                         </TableCell>
//                         <TableCell sx={{ ...tdSx, color: "primary.main" }}>
//                           {ts.maTaiSan || "—"}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Box>

//           {/* Danh sách vật tư */}
//           <Box>
//             <Typography sx={{ ...labelSx, mb: 1 }}>
//               Vật tư – CCDC ({plan.danhSachVatTu.length})
//             </Typography>
//             {plan.danhSachVatTu.length === 0 ? (
//               <Box sx={{ py: 3, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 1.5 }}>
//                 <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
//                   Chưa có vật tư
//                 </Typography>
//               </Box>
//             ) : (
//               <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 1.5 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={thSx}>STT</TableCell>
//                       <TableCell sx={thSx}>Tên vật tư</TableCell>
//                       <TableCell sx={thSx} align="right">Số lượng</TableCell>
//                       <TableCell sx={thSx}>Đơn vị</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {plan.danhSachVatTu.map((vt: any, i: number) => (
//                       <TableRow key={i} hover>
//                         <TableCell sx={tdSx}>{i + 1}</TableCell>
//                         <TableCell sx={{ ...tdSx, fontWeight: 500 }}>
//                           {vt.tenVatTu || "—"}
//                         </TableCell>
//                         <TableCell sx={tdSx} align="right">{vt.soLuong ?? "—"}</TableCell>
//                         <TableCell sx={tdSx}>{vt.donViTinh || "—"}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Box>
//         </Box>
//       )}

//       {/* ══════════════════════════════════════════════
//           TAB 2 – Công việc
//       ══════════════════════════════════════════════ */}
//       {tab === 2 && (
//         <Box sx={{ flex: 1, overflow: "auto" }}>
//           <Typography sx={{ ...labelSx, mb: 1 }}>
//             Công việc ({plan.congViecs.length})
//           </Typography>
//           {plan.congViecs.length === 0 ? (
//             <Box sx={{ py: 3, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 1.5 }}>
//               <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
//                 Chưa có công việc
//               </Typography>
//             </Box>
//           ) : (
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//               {plan.congViecs.map((cv: any, i: number) => (
//                 <Box
//                   key={i}
//                   sx={{
//                     p: 1.5,
//                     border: "1px solid",
//                     borderColor: "divider",
//                     borderRadius: 1.5,
//                     bgcolor: "grey.50",
//                   }}
//                 >
//                   <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
//                     {i + 1}. {cv.tenCongViec || "Công việc chưa rõ tên"}
//                   </Typography>
//                   {cv.nguoiThucHien && (
//                     <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
//                       Người thực hiện: {cv.nguoiThucHien}
//                     </Typography>
//                   )}
//                   {cv.ghiChu && (
//                     <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: "block", mt: 0.25 }}>
//                       Ghi chú: {cv.ghiChu}
//                     </Typography>
//                   )}
//                 </Box>
//               ))}
//             </Box>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// }