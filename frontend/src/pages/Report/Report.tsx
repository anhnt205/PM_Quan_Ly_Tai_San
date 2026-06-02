import { useState, useEffect, useMemo, JSX } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import ReportS22DN from "./components/ReportS22DN";
import BienBanKiemKe from "./components/BienBanKiemKe";
import BaoCaoTSCD from "./components/BaoCaoTSCD";
import MauSo01 from "./components/MauSo01";
import MauSo21 from "./components/MauSo21";
import ReportSidebar from "./components/ReportSidebar/ReportSidebar";

type ReportItem = {
  id: number;
  label: string;
  component: JSX.Element;
};

export default function Report() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeId, setActiveId] = useState<number>(1);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const newType = typeParam ? Number(typeParam) : 1;
    if (!Number.isNaN(newType)) {
      setActiveId(newType);
    }
  }, [searchParams]);

  // Giữ lại đúng 5 báo cáo theo yêu cầu, bỏ description vì Sidebar mới không dùng đến
  const reports: ReportItem[] = useMemo(
    () => [
      {
        id: 1,
        label: "Báo cáo S22-DN",
        component: (
          <ReportS22DN
            key="report-1"
            title="Sổ Theo dõi tài sản cố định (S22-DN)"
          />
        ),
      },
      {
        id: 2,
        label: "Biên bản kiểm kê",
        component: <BienBanKiemKe key="report-2" title="Biên bản kiểm kê" />,
      },
      {
        id: 3,
        label: "Báo cáo 05-TSCD-24-2017-TT-BTC",
        component: (
          <BaoCaoTSCD key="report-3" title="Biên bản kiểm kê tài sản cố định" />
        ),
      },
      {
        id: 4,
        label: "Mẫu số-01",
        component: <MauSo01 key="report-4" title="Mẫu số-01" />,
      },
      {
        id: 5,
        label: "Mẫu số-21",
        component: (
          <MauSo21 key="report-5" title="Sổ tài sản cố định (S21-DN)" />
        ),
      },
    ],
    [],
  );

  const activeReport = reports.find((r) => r.id === activeId) ?? reports[0];

  const handleSelect = (id: number) => {
    setActiveId(id);
    setSearchParams({ type: String(id) });
  };

  return (
    <Box
      sx={{
        // Phần nền tổng thể của trang báo cáo
        minHeight: "100%",
        backgroundColor: "#f5f7fa",
        p: { xs: 2, md: 3 }, // Tạo khoảng cách lề trên, dưới, trái, phải
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start", // Giúp Sidebar không bị kéo dài bằng nội dung nếu nội dung quá dài
          gap: 3, // Khoảng cách giữa Sidebar và Phần nội dung
          maxWidth: "100%",
          mx: "auto", // Căn giữa nội dung nếu màn hình quá to
        }}
      >
        {/* Cột Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: 300 },
            flexShrink: 0,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
            borderRadius: "4px",
            position: "sticky",
            top: 78,
            zIndex: 1,
          }}
        >
          <ReportSidebar
            reports={reports}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: "500px",
            overflow: "auto",
          }}
        >
          {activeReport.component}
        </Box>
      </Box>
    </Box>
  );
}
