import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton, Slider, Tooltip } from "@mui/material";
import { Close, Add, Remove } from "@mui/icons-material";
import { useGetFileQuery } from "../../pages/Staff/Mutation";

interface DraggableSignatureProps {
  id: string;
  initialX: number;
  initialY: number;
  initialScale?: number;
  width: number;
  sig: any;
  digitalSignatureMap: any;
  containerWidth: number;
  containerHeight: number;
  onUpdatePosition: (id: string, xRatio: number, yRatio: number) => void;
  onUpdateScale: (id: string, newScale: number) => void;
  onDelete: (id: string) => void;
  isLocked: boolean;
}

export default function DraggableSignature({
  id,
  initialX,
  initialY,
  initialScale = 1,
  width,
  sig,
  digitalSignatureMap,
  containerWidth,
  containerHeight,
  onUpdatePosition,
  onUpdateScale,
  onDelete,
  isLocked = false,
}: DraggableSignatureProps) {
  const [showMobileControls, setShowMobileControls] = useState(false);
  const lastTapRef = useRef<number>(0);
  // 1. Đồng bộ state scale
  const [scale, setScale] = useState(initialScale);
  useEffect(() => {
    if (!isNaN(initialScale)) {
      setScale(initialScale);
    }
  }, [initialScale]);

  const { data: fileUrl } = useGetFileQuery(sig.chuKyNhay || sig.chuKyThuong);

  // 2. Xử lý vị trí an toàn
  const safeInitialX = isNaN(initialX) ? 0 : initialX;
  const safeInitialY = isNaN(initialY) ? 0 : initialY;

  const positionRef = useRef({ x: safeInitialX, y: safeInitialY });
  const parentBoxRef = useRef<HTMLDivElement>(null);

  // Cập nhật DOM khi props thay đổi
  useEffect(() => {
    positionRef.current = { x: safeInitialX, y: safeInitialY };
    if (parentBoxRef.current) {
      parentBoxRef.current.style.left = `${safeInitialX}px`;
      parentBoxRef.current.style.top = `${safeInitialY}px`;
    }
  }, [safeInitialX, safeInitialY]);

  const updateDOMPosition = () => {
    if (parentBoxRef.current) {
      parentBoxRef.current.style.left = `${positionRef.current.x}px`;
      parentBoxRef.current.style.top = `${positionRef.current.y}px`;
    }
  };

  const handleZoom = (newScale: number) => {
    if (isLocked) return;
    const clampedScale = Math.min(Math.max(newScale, 0.5), 2.0);
    setScale(clampedScale);
    onUpdateScale(id, clampedScale);
  };

  // Logic Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    e.stopPropagation(); // Ngăn sự kiện nổi lên cha
    e.preventDefault(); // Ngăn hành vi mặc định (chọn text/ảnh)

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startPosX = positionRef.current.x;
    const startPosY = positionRef.current.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startMouseX;
      const dy = moveEvent.clientY - startMouseY;

      let newX = startPosX + dx;
      let newY = startPosY + dy;

      const currentWidth = width * scale;
      // const currentHeight = BASE_HEIGHT * scale;

      // Giới hạn trong khung
      newX = Math.max(0, Math.min(newX, containerWidth - currentWidth));
      // newY = Math.max(0, Math.min(newY, containerHeight - currentHeight));

      positionRef.current = { x: newX, y: newY };
      updateDOMPosition();
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      if (containerWidth > 0 && containerHeight > 0) {
        const xRatio = positionRef.current.x / containerWidth;
        const yRatio = positionRef.current.y / containerHeight;
        onUpdatePosition(id, xRatio, yRatio);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Logic Dragging cho Điện thoại (Touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLocked) return;

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Nếu chạm 2 lần nhanh -> Đảo ngược trạng thái hiện menu
      setShowMobileControls(!showMobileControls);
    }
    lastTapRef.current = now;

    const touch = e.touches[0];
    const startTouchX = touch.clientX;
    const startTouchY = touch.clientY;
    const startPosX = positionRef.current.x;
    const startPosY = positionRef.current.y;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.cancelable) moveEvent.preventDefault();

      const touchMove = moveEvent.touches[0];
      const dx = touchMove.clientX - startTouchX;
      const dy = touchMove.clientY - startTouchY;

      let newX = startPosX + dx;
      let newY = startPosY + dy;

      const currentWidth = width * scale;
      newX = Math.max(0, Math.min(newX, containerWidth - currentWidth));

      positionRef.current = { x: newX, y: newY };
      updateDOMPosition();
    };

    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      if (containerWidth > 0 && containerHeight > 0) {
        const xRatio = positionRef.current.x / containerWidth;
        const yRatio = positionRef.current.y / containerHeight;
        onUpdatePosition(id, xRatio, yRatio);
      }
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <Box
      ref={parentBoxRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      sx={{
        position: "absolute",
        left: safeInitialX,
        top: safeInitialY,
        width: width * scale,
        zIndex: 100,
        padding: 0, // 1. Xóa padding để ảnh sát viền
        margin: 0,
        touchAction: "none",
        // 👉 Logic style khi Locked vs Unlocked
        cursor: isLocked ? "default" : "grab", // Locked thì chuột bình thường
        border: isLocked ? "none" : "1px dashed #1976d2", // Locked thì ẩn viền
        pointerEvents: "auto", // Vẫn bắt click để chặn click xuyên thấu (nếu muốn)

        "&:active": { cursor: isLocked ? "default" : "grabbing" },

        // 👉 Chỉ hiện Controls khi hover VÀ chưa bị khóa
        "&:hover": {
          borderColor: isLocked ? "transparent" : "#1565c0",
          // Menu hiện khi hover (Desktop)
          "& .controls": { display: isLocked ? "none" : "flex" },
        },
        borderColor:
          showMobileControls && !isLocked
            ? "#1565c0"
            : isLocked
              ? "transparent"
              : "1px dashed #1976d2",
      }}
    >
      <img
        src={sig.loaiKy === 3 ? digitalSignatureMap[id] : fileUrl}
        alt="signature"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // Giữ tỷ lệ ảnh
          display: "block",
          // --- QUAN TRỌNG: NGĂN TRÌNH DUYỆT KÉO ẢNH RA NGOÀI ---
          pointerEvents: "none", // Ảnh không bắt sự kiện, để Box cha bắt
          userSelect: "none",
        }}
      />

      {/* Controls Toolbar */}
      {!isLocked && (
        <Box
          className="controls"
          sx={{
            display: showMobileControls ? "flex" : "none",
            position: "absolute",
            top: -45,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "white",
            boxShadow: 3,
            borderRadius: 1,
            p: 0.5,
            gap: 0.5,
            alignItems: "center",
            zIndex: 101,
            whiteSpace: "nowrap",

            // --- Đảm bảo Toolbar cũng bấm được ---
            pointerEvents: "auto",
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Tooltip title="Giảm">
            <IconButton size="small" onClick={() => handleZoom(scale - 0.1)}>
              <Remove fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ width: 60, px: 1 }}>
            <Slider
              size="small"
              min={0.5}
              max={2.0}
              step={0.1}
              value={scale}
              onChange={(_, val) => handleZoom(val as number)}
            />
          </Box>

          <Tooltip title="Tăng">
            <IconButton size="small" onClick={() => handleZoom(scale + 0.1)}>
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ width: 1, height: 20, bgcolor: "#ddd", mx: 0.5 }} />

          <Tooltip title="Xóa">
            <IconButton size="small" color="error" onClick={() => onDelete(id)}>
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
