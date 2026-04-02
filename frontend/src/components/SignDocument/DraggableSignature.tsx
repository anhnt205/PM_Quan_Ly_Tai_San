import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton, Slider, Tooltip } from "@mui/material";
import { Close, Add, Remove } from "@mui/icons-material";
import { useGetFileQuery } from "../../pages/Staff/Mutation";

interface DraggableSignatureProps {
  id: string;
  /** Tỉ lệ X so với containerWidth (0.0 → 1.0) */
  xRatio: number;
  /** Tỉ lệ Y so với containerHeight (0.0 → 1.0) */
  yRatio: number;
  /**
   * Chiều rộng chữ ký tính theo tỉ lệ container (0.0 → 1.0).
   * Nếu không truyền, fallback về widthPx / containerWidth.
   */
  widthRatio?: number;
  initialScale?: number;
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
  xRatio,
  yRatio,
  widthRatio,
  initialScale = 1,
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

  const [scale, setScale] = useState(initialScale);
  useEffect(() => {
    if (!isNaN(initialScale)) setScale(initialScale);
  }, [initialScale]);

  const { data: fileUrl } = useGetFileQuery(sig.chuKyNhay || sig.chuKyThuong);

  // ─── Tính vị trí pixel từ ratio ───────────────────────────────────────────
  // containerWidth/Height có thể thay đổi khi resize → tính lại mỗi render
  const safeX = isNaN(xRatio) ? 0 : xRatio;
  const safeY = isNaN(yRatio) ? 0 : yRatio;

  // Chiều rộng hiển thị: ưu tiên widthRatio, fallback về sig.width (px cũ)
  const baseWidthPx = widthRatio
    ? widthRatio * containerWidth
    : sig.width || 120;
  const displayWidthPx = baseWidthPx * scale;

  // Vị trí pixel tính từ ratio × kích thước container hiện tại
  const leftPx = safeX * containerWidth;
  const topPx = safeY * containerHeight;

  // ─── Dragging ref (chỉ lưu ratio, không lưu px) ───────────────────────────
  const ratioRef = useRef({ x: safeX, y: safeY });
  const boxRef = useRef<HTMLDivElement>(null);

  // Cập nhật DOM position trực tiếp (bypass React re-render khi kéo)
  const applyPositionToDOM = (xR: number, yR: number) => {
    if (boxRef.current) {
      boxRef.current.style.left = `${xR * containerWidth}px`;
      boxRef.current.style.top = `${yR * containerHeight}px`;
    }
  };

  // Khi container resize → vị trí pixel tự cập nhật qua leftPx/topPx
  useEffect(() => {
    ratioRef.current = { x: safeX, y: safeY };
    applyPositionToDOM(safeX, safeY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeX, safeY, containerWidth, containerHeight]);

  // ─── Zoom ─────────────────────────────────────────────────────────────────
  const handleZoom = (newScale: number) => {
    if (isLocked) return;
    const clamped = Math.min(Math.max(newScale, 0.5), 2.0);
    setScale(clamped);
    onUpdateScale(id, clamped);
  };

  // ─── Mouse drag ───────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    e.stopPropagation();
    e.preventDefault();

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startRatioX = ratioRef.current.x;
    const startRatioY = ratioRef.current.y;

    const handleMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startMouseX;
      const dy = ev.clientY - startMouseY;

      let newX = startRatioX + dx / containerWidth;
      let newY = startRatioY + dy / containerHeight;

      // Clamp: không cho chạy ra ngoài container
      const maxX = (containerWidth - displayWidthPx) / containerWidth;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, 1));

      ratioRef.current = { x: newX, y: newY };
      applyPositionToDOM(newX, newY);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      onUpdatePosition(id, ratioRef.current.x, ratioRef.current.y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // ─── Touch drag ───────────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLocked) return;

    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setShowMobileControls((prev) => !prev);
    }
    lastTapRef.current = now;

    const touch = e.touches[0];
    const startTouchX = touch.clientX;
    const startTouchY = touch.clientY;
    const startRatioX = ratioRef.current.x;
    const startRatioY = ratioRef.current.y;

    const handleTouchMove = (ev: TouchEvent) => {
      if (ev.cancelable) ev.preventDefault();
      const t = ev.touches[0];
      const dx = t.clientX - startTouchX;
      const dy = t.clientY - startTouchY;

      let newX = startRatioX + dx / containerWidth;
      let newY = startRatioY + dy / containerHeight;

      const maxX = (containerWidth - displayWidthPx) / containerWidth;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, 1));

      ratioRef.current = { x: newX, y: newY };
      applyPositionToDOM(newX, newY);
    };

    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      onUpdatePosition(id, ratioRef.current.x, ratioRef.current.y);
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <Box
      ref={boxRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      sx={{
        position: "absolute",
        left: leftPx,
        top: topPx,
        width: displayWidthPx,
        zIndex: 100,
        padding: 0,
        margin: 0,
        touchAction: "none",
        cursor: isLocked ? "default" : "grab",
        border: isLocked ? "none" : "1px dashed #1976d2",
        pointerEvents: "auto",
        "&:active": { cursor: isLocked ? "default" : "grabbing" },
        "&:hover": {
          borderColor: isLocked ? "transparent" : "#1565c0",
          "& .sig-controls": { display: isLocked ? "none" : "flex" },
        },
        ...(showMobileControls && !isLocked && { borderColor: "#1565c0" }),
      }}
    >
      <img
        src={sig.loaiKy === 3 ? digitalSignatureMap[id] : fileUrl}
        alt="signature"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {!isLocked && (
        <Box
          className="sig-controls"
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
