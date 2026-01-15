import React from "react";
import { Box } from "@mui/material";

interface PieChartItem {
  ten: string;
  soLuong: number;
  phanTram: number;
  color: string;
}

interface Props {
  data: PieChartItem[];
  size?: number;
}

// --- GIỮ LẠI PHẦN NÀY ĐỂ DASHBOARD KHÔNG BỊ LỖI ---
export const COLORS = [
  "#FF9800", // Orange
  "#4CAF50", // Green
  "#F44336", // Red
  "#2196F3", // Blue
  "#9C27B0", // Purple
  "#00BCD4", // Cyan
  "#795548", // Brown
  "#607D8B", // Blue Grey
  "#E91E63", // Pink
  "#3F51B5", // Indigo
];
// --------------------------------------------------

export default function PieChart({ data, size = 120 }: Props) {
  const total = data.reduce((sum, item) => sum + item.soLuong, 0);

  // Tính toán các lát cắt (segments)
  let currentAngle = 0;
  const segments = data.map((item) => {
    const angle = (item.soLuong / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      startAngle,
      endAngle: currentAngle,
      color: item.color,
    };
  });

  const radius = size / 2;
  const center = { x: radius, y: radius };

  // Không dùng lỗ tròn ở giữa — vẽ toàn bộ pie (full pie)
  const innerRadius = 0;

  // Hàm chuyển đổi tọa độ cực sang tọa độ Decac
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Hàm tạo đường dẫn SVG (path)
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    radius: number
  ) => {
    const start = polarToCartesian(center.x, center.y, radius, endAngle);
    const end = polarToCartesian(center.x, center.y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      center.x,
      center.y,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      center.x,
      center.y,
    ].join(" ");
  };

  // Xác định trường hợp 100% (chỉ dùng để tối ưu hiển thị, không hiển thị số lớn ở giữa)
  const isFullCircle = data.length === 1;

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <svg width={size} height={size}>
        {/* LỚP 1: VẼ MÀU (NỀN) */}
        {isFullCircle ? (
          // Khi chỉ có 1 phần tử, vẽ vòng tròn đầy màu (nhưng không hiển thị số lớn ở giữa)
          <circle cx={radius} cy={radius} r={radius} fill={segments[0].color} />
        ) : (
          segments.map((segment, index) => (
            <path
              key={index}
              d={createArcPath(segment.startAngle, segment.endAngle, radius)}
              fill={segment.color}
              stroke="white"
              strokeWidth="1"
            />
          ))
        )}

        {/* Không vẽ lỗ tròn ở giữa — giữ full pie */}

        {/* LỚP 3: HIỂN THỊ SỐ LIỆU */}
        {isFullCircle
          ? null
          : // Trường hợp nhiều phần tử: Số hiển thị TRÊN VÒNG TRÒN màu
            segments.map((segment, index) => {
              const midAngle = (segment.startAngle + segment.endAngle) / 2;
              const textRadius = (radius + innerRadius) / 2;

              const pos = polarToCartesian(
                radius,
                radius,
                textRadius,
                midAngle
              );

              if (segment.endAngle - segment.startAngle < 15) return null;

              return (
                <text
                  key={index}
                  x={pos.x}
                  y={pos.y}
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ textShadow: "0px 0px 2px rgba(0,0,0,0.5)" }}
                >
                  {segment.soLuong}
                </text>
              );
            })}
      </svg>
    </Box>
  );
}
