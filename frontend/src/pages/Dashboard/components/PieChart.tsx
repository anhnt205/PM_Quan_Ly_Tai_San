import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart as RechartsChart, Pie, Cell, Sector } from "recharts";
import { animate } from "framer-motion";
import { formattedPrice } from "../../../utils/helpers";

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

export const COLORS = [
  "#FF9800",
  "#4CAF50",
  "#F44336",
  "#2196F3",
  "#9C27B0",
  "#00BCD4",
  "#795548",
  "#607D8B",
  "#E91E63",
  "#3F51B5",
];

// Component custom để vẽ từng mảnh cắt và xử lý animation bán kính
const AnimatedSector = (props: any) => {
  const {
    isActive,
    isDimmed,
    outerRadius,
    innerRadius,
    cx,
    cy,
    startAngle,
    endAngle,
    fill,
  } = props;

  // State lưu trữ bán kính hiện tại
  const [currentRadius, setCurrentRadius] = useState(outerRadius);

  useEffect(() => {
    // Mục tiêu: Nếu hover vào thì bán kính là outerRadius + 8, nếu không thì về lại outerRadius
    const targetRadius = isActive ? outerRadius + 8 : outerRadius;

    // Sử dụng framer-motion để tween (nội suy) con số này mượt mà trong 0.25s
    const controls = animate(currentRadius, targetRadius, {
      duration: 0.25,
      ease: "easeOut",
      onUpdate: (val) => setCurrentRadius(val),
    });

    return () => controls.stop();
  }, [isActive, outerRadius]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={currentRadius} // Sử dụng bán kính đang chuyển động
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      style={{
        // Làm mờ bằng CSS thuần cho nhẹ
        opacity: isDimmed ? 0.3 : 1,
        transition: "opacity 0.25s ease-out",
        cursor: "pointer",
        outline: "none",
      }}
    />
  );
};

export default function PieChart({ data, size = 120 }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.soLuong, 0),
    [data],
  );

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const activeItem = activeIndex !== undefined ? data[activeIndex] : null;

  const radius = size / 2;
  const innerRadius = radius * 0.6;
  const containerSize = size + 40;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      // Bắt sự kiện rời chuột ở Box tổng để bỏ hover toàn bộ
      onMouseLeave={onPieLeave}
    >
      {/* LỚP 1: BIỂU ĐỒ */}
      <RechartsChart width={containerSize} height={containerSize}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={radius}
          dataKey="soLuong"
          nameKey="ten"
          onMouseEnter={onPieEnter}
          stroke="none"
          startAngle={90}
          endAngle={-270}
          isAnimationActive={false} // Tắt animation sinh ra mặc định của recharts
          // Truyền AnimatedSector thay thế cho shape mặc định
          shape={(props: any) => {
            const isActive = activeIndex === props.index;
            const isDimmed =
              activeIndex !== undefined && activeIndex !== props.index;
            return (
              <AnimatedSector
                {...props}
                isActive={isActive}
                isDimmed={isDimmed}
              />
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </RechartsChart>

      {/* LỚP 2: THÔNG TIN Ở GIỮA */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
          width: innerRadius * 2 - 10,
          zIndex: 20,
        }}
      >
        {activeItem ? (
          <>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: "0.7rem",
                display: "block",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {activeItem.ten}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: activeItem.color,
                fontSize: "1rem",
                lineHeight: 1,
              }}
            >
              {activeItem.phanTram?.toFixed(1)}%
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontSize: "0.65rem" }}
            >
              ({formattedPrice(activeItem.soLuong)})
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              Tổng số
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: "1.1rem",
              }}
            >
              {total.toLocaleString()}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
