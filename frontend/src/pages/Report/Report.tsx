import { useSearchParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import ReportS22DN from "./components/ReportS22DN";
import BienBanKiemKe from "./components/BienBanKiemKe";
import BaoCaoTSCD from "./components/BaoCaoTSCD";
import MauSo21 from "./components/MauSo21";
import MauSo01 from "./components/MauSo01";

export default function Report() {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState<number>(1);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const newType = typeParam ? Number(typeParam) : 1;
    console.log("Report type changed to:", newType);
    setType(newType);
  }, [searchParams]);

  const renderReport = () => {
    switch (type) {
      case 1:
        return (
          <ReportS22DN
            key="report-1"
            title="Sổ Theo dõi tài sản cố định (S22-DN)"
          />
        );
      case 2:
        return <BienBanKiemKe key="report-2" title="Biên bản kiểm kê" />;
      case 3:
        return (
          <BaoCaoTSCD key="report-3" title="Biên bản kiểm kê tài sản cố định" />
        );
      case 4:
        return <MauSo01 key="report-4" title="Mẫu số-01" />;
      case 5:
        return <MauSo21 key="report-5" title="Số tài sản cố định (S21-DN)" />;
      default:
        return (
          <ReportS22DN
            key="report-default"
            title="Sổ Theo dõi tài sản cố định (S22-DN)"
          />
        );
    }
  };

  return <Box>{renderReport()}</Box>;
}
