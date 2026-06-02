import { Box, Chip, Typography } from "@mui/material";
import { AssetGroup, AssetGroupType } from "../../../utils/const";

export default function Filter({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  nhomTaiSanFilter,
  setNhomTaiSanFilter,
}: {
  dateFrom?: string;
  setDateFrom?: (value: string) => void;
  dateTo?: string;
  setDateTo?: (value: string) => void;
  nhomTaiSanFilter?: AssetGroupType;
  setNhomTaiSanFilter?: (value: AssetGroupType) => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "#fafafa",
        flexWrap: "wrap",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ whiteSpace: "nowrap" }}
      >
        Lọc theo ngày:
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Từ
        </Typography>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom?.(e.target.value)}
          style={{
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: "4px 8px",
            fontSize: 13,
            color: "inherit",
            background: "transparent",
          }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Đến
        </Typography>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo?.(e.target.value)}
          style={{
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: "4px 8px",
            fontSize: 13,
            color: "inherit",
            background: "transparent",
          }}
        />
      </Box>
      {(dateFrom || dateTo) && (
        <Chip
          label="Xóa bộ lọc"
          size="small"
          onDelete={() => {
            setDateFrom?.("");
            setDateTo?.("");
          }}
          sx={{ fontSize: 11 }}
        />
      )}
      {/*Filter theo nhom tai san */}
      {nhomTaiSanFilter !== undefined && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            ml: "auto",
            pl: 2,
            borderLeft: { xs: "none", md: "1px solid" },
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Loại tài sản:
          </Typography>
          <Box
            sx={{
              display: "flex",
              bgcolor: "grey.100",
              p: 0.5,
              borderRadius: 2.5,
            }}
          >
            <Box
              onClick={() => {
                setNhomTaiSanFilter?.(AssetGroup.MAYMOC);
              }}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 2,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                bgcolor:
                  nhomTaiSanFilter === AssetGroup.MAYMOC
                    ? "#fff"
                    : "transparent",
                color:
                  nhomTaiSanFilter === AssetGroup.MAYMOC
                    ? "primary.main"
                    : "text.secondary",
                boxShadow:
                  nhomTaiSanFilter === AssetGroup.MAYMOC
                    ? "0px 1px 3px rgba(0,0,0,0.1)"
                    : "none",
                transition: "all 0.2s",
                "&:hover": {
                  color:
                    nhomTaiSanFilter === AssetGroup.MAYMOC
                      ? "primary.main"
                      : "text.primary",
                },
              }}
            >
              Máy móc
            </Box>
            <Box
              onClick={() => {
                setNhomTaiSanFilter?.(AssetGroup.PHUONGTIEN);
              }}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 2,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                bgcolor:
                  nhomTaiSanFilter === AssetGroup.PHUONGTIEN
                    ? "#fff"
                    : "transparent",
                color:
                  nhomTaiSanFilter === AssetGroup.PHUONGTIEN
                    ? "primary.main"
                    : "text.secondary",
                boxShadow:
                  nhomTaiSanFilter === AssetGroup.PHUONGTIEN
                    ? "0px 1px 3px rgba(0,0,0,0.1)"
                    : "none",
                transition: "all 0.2s",
                "&:hover": {
                  color:
                    nhomTaiSanFilter === AssetGroup.PHUONGTIEN
                      ? "primary.main"
                      : "text.primary",
                },
              }}
            >
              Phương tiện
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
