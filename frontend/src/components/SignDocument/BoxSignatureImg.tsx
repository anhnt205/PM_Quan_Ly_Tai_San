import { Box } from "@mui/material";
import { useGetFileQuery } from "../../pages/Staff/Mutation";

export default function BoxSignatureImg({
  sig,
  currentDisplay,
  scale,
  digitalSignatureMap,
}: {
  sig: any;
  currentDisplay: { width: number; height: number };
  scale: number;
  digitalSignatureMap: Record<string, string>;
}) {
  const { data: fileUrl } = useGetFileQuery(sig.chuKyNhay || sig.chuKyThuong);
  return (
    <Box
      key={sig.id}
      sx={{
        position: "absolute",
        left: `${sig.x * currentDisplay.width}px`,
        top: `${sig.y * currentDisplay.height}px`,
        width: `${sig.width * (sig.scale || 1) * scale}px`,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <img
        src={sig.loaiKy === 3 ? digitalSignatureMap[sig.id] : fileUrl}
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
        }}
        alt=""
        onError={(e) => console.error("Lỗi load ảnh:", fileUrl)}
      />
    </Box>
  );
}
