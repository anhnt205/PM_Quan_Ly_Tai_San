import { Box, Typography } from "@mui/material";

type ReportSidebarProps = {
  reports: { id: number; label: string }[];
  activeId: number;
  onSelect: (id: number) => void;
};

export default function ReportSidebar({
  reports,
  activeId,
  onSelect,
}: ReportSidebarProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        {/* Header của Sidebar với màu xanh yêu cầu */}
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{
            color: "#fff",
            bgcolor: "#309e5d",
            p: 2,
            borderRadius: "4px 4px 0 0",
            fontSize: "1.1rem",
          }}
        >
          DANH MỤC BÁO CÁO
        </Typography>

        {/* Menu items list */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            bgcolor: "#fff",
            border: "1px solid #e0e0e0",
            borderTop: "none",
            borderRadius: "0 0 4px 4px",
            overflow: "hidden",
          }}
        >
          {reports.map((item) => {
            const isActive = activeId === item.id;
            return (
              <Typography
                key={item.id}
                onClick={() => onSelect(item.id)}
                sx={{
                  cursor: "pointer",
                  pl: 2,
                  pr: 1,
                  py: 1.5,
                  borderLeft: "4px solid transparent",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#2e7d32" : "#333",
                  bgcolor: isActive ? "#f1f8e9" : "transparent",
                  borderLeftColor: isActive ? "#4caf50" : "transparent",
                  transition: "all 0.2s",
                  fontSize: "0.95rem",
                  borderBottom: "1px solid #f0f0f0",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                  "&:hover": {
                    color: "#2e7d32",
                    bgcolor: "#f1f8e9",
                    borderLeftColor: "#4caf50",
                  },
                }}
              >
                ▸ {item.label}
              </Typography>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
