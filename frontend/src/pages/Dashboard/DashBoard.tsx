import React, { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import { useDashboardMutation } from "./Mutation";
import { COLORS } from "./components/PieChart";
import CcdcGroupCard from "./sections/CcdcGroupCard";
import CcdcTypeCard from "./sections/CcdcTypeCard";
import CcdcMonthlyCard from "./sections/CcdcMonthlyCard";
import TaisanGroupCard from "./sections/TaisanGroupCard";
import TaisanTypeCard from "./sections/TaisanTypeCard";
import TaisanMonthlyCard from "./sections/TaisanMonthlyCard";
import Top5Panel from "./sections/Top5Panel";
import NearDepreciationPanel from "./sections/NearDepreciationPanel";

export default function DashBoard() {
  const currentYear = new Date().getFullYear();
  const [selectedNhomTaiSan, setSelectedNhomTaiSan] = useState<
    string | undefined
  >(undefined);
  const [selectedNhomCCDC, setSelectedNhomCCDC] = useState<string | undefined>(
    undefined,
  );
  const [yearTaiSan, setYearTaiSan] = useState(currentYear);
  const [yearCCDC, setYearCCDC] = useState(currentYear);

  const {
    statistics,
    taiSanTheoNhom,
    ccdcTheoNhom,
    nhomCCDCList,
    nhomTaiSanList,
    uniqueNhomCCDC,
    ccdcTheoNhomByData,
    tongCCDC,
    tongGiaTriCCDC,
    ccdcTheoThangByNgayNhap,
    taiSanTheoThangByNgayVaoSo,
    taiSanTheoLoai,
    ccdcTheoLoai,
    taiSanTheoThang,
    ccdcTheoThang,
    isLoading,
  } = useDashboardMutation(
    selectedNhomTaiSan,
    selectedNhomCCDC,
    yearTaiSan,
    yearCCDC,
  );

  React.useEffect(() => {
    if (
      !selectedNhomCCDC &&
      Array.isArray(uniqueNhomCCDC) &&
      uniqueNhomCCDC.length > 0
    ) {
      const first = uniqueNhomCCDC[0];
      if (first && first.id) setSelectedNhomCCDC(String(first.id));
    }
  }, [uniqueNhomCCDC, selectedNhomCCDC, setSelectedNhomCCDC]);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  let ccdcPieData = (ccdcTheoNhom || []).map((item: any, index: number) => ({
    ten: item.tenNhom || item.ten,
    soLuong: item.soLuong,
    phanTram: item.phanTram,
    color: COLORS[index % COLORS.length],
  }));

  let hideCcdcLegend = false;
  const allEmptyGroup =
    !ccdcPieData ||
    ccdcPieData.length === 0 ||
    ccdcPieData.every(
      (it: any) =>
        !it.ten ||
        String(it.ten).trim() === "" ||
        String(it.ten).trim() === "Chưa xác định",
    );

  if (allEmptyGroup) {
    ccdcPieData = [{ ten: "", soLuong: 1, phanTram: 100, color: COLORS[0] }];
    hideCcdcLegend = true;
  }

  console.log(
    "ccdcPieData for PieChart:",
    ccdcPieData,
    "hideLegend:",
    hideCcdcLegend,
  );

  const taiSanPieData = (taiSanTheoNhom || []).map(
    (item: any, index: number) => ({
      ten: item.ten || item.tenNhom,
      soLuong: item.soLuong,
      phanTram: item.phanTram,
      color: COLORS[index % COLORS.length],
    }),
  );

  const ccdcBarData =
    ccdcTheoLoai && ccdcTheoLoai.length > 0 ? ccdcTheoLoai : [];

  const taiSanBarData = (taiSanTheoLoai || []).map((item: any) => ({
    label: item.tenLoai || item.ten,
    value: item.soLuong,
  }));

  const rawCcdcMonthly =
    ccdcTheoThang && ccdcTheoThang.length > 0
      ? ccdcTheoThang
      : ccdcTheoThangByNgayNhap || [];
  const ccdcMonthlyData = (rawCcdcMonthly || [])
    .filter((item: any) => item.nam === yearCCDC)
    .sort((a: any, b: any) => a.thang - b.thang);

  const rawTaiSanMonthly =
    taiSanTheoThang && taiSanTheoThang.length > 0
      ? taiSanTheoThang
      : taiSanTheoThangByNgayVaoSo || [];
  const taiSanMonthlyData = (rawTaiSanMonthly || [])
    .filter((item: any) => item.nam === yearTaiSan)
    .sort((a: any, b: any) => a.thang - b.thang);

  const getMonthName = (month: number) => `Tháng ${month}`;

  const maxCCDC = Math.max(
    ...(ccdcMonthlyData || []).map((d: any) => d.soLuong || 0),
    1,
  );
  const maxTaiSan = Math.max(
    ...(taiSanMonthlyData || []).map((d: any) => d.soLuong || 0),
    1,
  );

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", p: 2 }}>
      <Box sx={{ borderRadius: 2, bgcolor: "rgba(255, 255, 255, 0.5)", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              bgcolor: "#e8f5e9",
              borderRadius: 1,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DashboardIcon sx={{ color: "#04b46e", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#04b46e" }}>
              Tổng quan thống kê
            </Typography>
            <Typography variant="body2" sx={{ color: "#04b46e" }}>
              Thống kê tổng quan về tài sản và thiết bị
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 3 }}>
            <CcdcGroupCard
              ccdcPieData={ccdcPieData}
              hideCcdcLegend={hideCcdcLegend}
              tongCCDC={tongCCDC}
              tongGiaTriCCDC={tongGiaTriCCDC}
            />
          </Grid>
          <Grid size={{ xs: 4.5 }}>
            <CcdcTypeCard
              selectedNhomCCDC={selectedNhomCCDC}
              setSelectedNhomCCDC={setSelectedNhomCCDC}
              uniqueNhomCCDC={uniqueNhomCCDC}
              ccdcBarData={ccdcBarData}
            />
          </Grid>
          <Grid size={{ xs: 4.5 }}>
            <CcdcMonthlyCard
              ccdcMonthlyData={ccdcMonthlyData}
              maxCCDC={maxCCDC}
              yearCCDC={yearCCDC}
              setYearCCDC={setYearCCDC}
              years={years}
            />
          </Grid>

          <Grid size={{ xs: 3 }}>
            <TaisanGroupCard
              taiSanPieData={taiSanPieData}
              statistics={statistics}
            />
          </Grid>
          <Grid size={{ xs: 4.5 }}>
            <TaisanTypeCard taiSanBarData={taiSanBarData} />
          </Grid>
          <Grid size={{ xs: 4.5 }}>
            <TaisanMonthlyCard
              taiSanMonthlyData={taiSanMonthlyData}
              maxTaiSan={maxTaiSan}
              yearTaiSan={yearTaiSan}
              setYearTaiSan={setYearTaiSan}
              years={years}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Top5Panel />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <NearDepreciationPanel />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
