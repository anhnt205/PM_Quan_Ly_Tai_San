import { Box, Chip, Typography } from "@mui/material";
import { AssetGroup, AssetGroupType } from "../../../utils/const";

export default function Filter({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  nhomTaiSanFilter,
  setNhomTaiSanFilter,
  isCompact = false,
}: {
  dateFrom?: string;
  setDateFrom?: (value: string) => void;
  dateTo?: string;
  setDateTo?: (value: string) => void;
  nhomTaiSanFilter?: AssetGroupType;
  setNhomTaiSanFilter?: (value: AssetGroupType) => void;
  isCompact?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: isCompact ? "column" : "row" },
        alignItems: {
          xs: "flex-start",
          sm: isCompact ? "flex-start" : "center",
        },
        gap: { xs: 1.5, sm: isCompact ? 1.5 : 2 },
        px: 2,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "#fafafa",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isCompact ? "column" : "row",
          alignItems: isCompact ? "flex-start" : "center",
          gap: 1.5,
          flexWrap: "wrap",
          width: isCompact ? "100%" : "auto",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Lọc theo ngày:
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: isCompact ? "100%" : "auto",
          }}
        >
          <Typography variant="caption" sx={{ minWidth: 28 }}>
            Từ
          </Typography>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom?.(e.target.value)}
            style={{
              flex: 1,
              minWidth: 0,
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 13,
              color: "inherit",
              background: "transparent",
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: isCompact ? "100%" : "auto",
          }}
        >
          <Typography variant="caption" sx={{ minWidth: 28, fontWeight: 400 }}>
            Đến
          </Typography>

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo?.(e.target.value)}
            style={{
              flex: 1,
              minWidth: 0,
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 13,
              color: "inherit",
              background: "transparent",
              fontFamily: "inherit",
              outline: "none",
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
          />
        )}
      </Box>
      {/*Filter theo nhom tai san */}
      {nhomTaiSanFilter !== undefined && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            ml: { xs: 0, sm: isCompact ? 0 : "auto" },
            pl: { xs: 0, sm: isCompact ? 0 : 2 },
            borderLeft: { xs: "none", sm: isCompact ? "none" : "1px solid" },
            borderColor: "divider",
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "flex-start" },
            mt: { xs: 0.5, sm: 0 },
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
                    ? "#1FA463"
                    : "text.secondary",
                boxShadow:
                  nhomTaiSanFilter === AssetGroup.MAYMOC
                    ? "0px 1px 3px rgba(0,0,0,0.1)"
                    : "none",
                transition: "all 0.2s",
                "&:hover": {
                  color:
                    nhomTaiSanFilter === AssetGroup.MAYMOC
                      ? "#1FA463"
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
                    ? "#1FA463"
                    : "text.secondary",
                boxShadow:
                  nhomTaiSanFilter === AssetGroup.PHUONGTIEN
                    ? "0px 1px 3px rgba(0,0,0,0.1)"
                    : "none",
                transition: "all 0.2s",
                "&:hover": {
                  color:
                    nhomTaiSanFilter === AssetGroup.PHUONGTIEN
                      ? "#1FA463"
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
