import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Slider,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import { Close, Add, Remove } from "@mui/icons-material";
import { useGetFileQuery } from "../../pages/Staff/Mutation";

const findScrollContainer = (el: HTMLElement | null): HTMLElement | null => {
  if (!el) return null;
  const style = window.getComputedStyle(el);
  if (style.overflowY === "auto" || style.overflowY === "scroll") {
    return el;
  }
  return findScrollContainer(el.parentElement);
};

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
  pageTopOffset: number;
  canvasDisplaySizes: { width: number; height: number }[];
  onUpdatePosition: (
    id: string,
    xRatio: number,
    yRatio: number,
    page?: number,
  ) => void;
  onUpdateScale: (id: string, newScale: number) => void;
  onDelete: (id: string) => void;
  onUpdatePage?: (id: string, newPage: number) => void;
  pagesCount?: number;
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
  pageTopOffset,
  canvasDisplaySizes,
  onUpdatePosition,
  onUpdateScale,
  onDelete,
  onUpdatePage,
  pagesCount = 1,
  isLocked = false,
}: DraggableSignatureProps) {
  const [showControls, setShowControls] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const lastTapRef = useRef<number>(0);

  const [scale, setScale] = useState(initialScale);
  useEffect(() => {
    if (!isNaN(initialScale)) setScale(initialScale);
  }, [initialScale]);

  const { data: fileUrl } = useGetFileQuery(sig.chuKyNhay || sig.chuKyThuong);

  // ─── Tính vị trí pixel từ ratio ───────────────────────────────────────────
  const safeX = isNaN(xRatio) ? 0 : xRatio;
  const safeY = isNaN(yRatio) ? 0 : yRatio;

  const sigPage = sig.page || 1;
  const pageIdx = Math.min(sigPage - 1, canvasDisplaySizes.length - 1);
  const currentCanvasSize = canvasDisplaySizes[pageIdx] || {
    width: 800,
    height: 600,
  };
  const containerWidth = currentCanvasSize.width;
  const containerHeight = currentCanvasSize.height;

  // Chiều rộng hiển thị: ưu tiên widthRatio, fallback về sig.width (px cũ)
  const baseWidthPx = widthRatio
    ? widthRatio * containerWidth
    : sig.width || 120;
  const displayWidthPx = baseWidthPx * scale;

  // Vị trí pixel tính từ ratio × kích thước container hiện tại
  const leftPx = safeX * containerWidth;
  const topPx = pageTopOffset + safeY * containerHeight;

  // ─── Dragging ref ──────────────────────────────────────────────────────────
  const ratioRef = useRef({ x: safeX, y: safeY, page: sigPage });
  const boxRef = useRef<HTMLDivElement>(null);

  // Click outside to hide control panels
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setShowControls(false);
        setShowMobileControls(false);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Cập nhật DOM position trực tiếp (bypass React re-render khi kéo)
  const applyPositionToDOM = (
    xR: number,
    yR: number,
    pOffset: number,
    cWidth: number,
    cHeight: number,
  ) => {
    if (boxRef.current) {
      boxRef.current.style.left = `${xR * cWidth}px`;
      boxRef.current.style.top = `${pOffset + yR * cHeight}px`;
    }
  };

  // Khi container resize hoặc thay đổi tọa độ từ bên ngoài
  useEffect(() => {
    ratioRef.current = { x: safeX, y: safeY, page: sigPage };
    applyPositionToDOM(
      safeX,
      safeY,
      pageTopOffset,
      containerWidth,
      containerHeight,
    );
  }, [safeX, safeY, pageTopOffset, containerWidth, containerHeight, sigPage]);

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
    setShowControls(true);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startLeftPx = ratioRef.current.x * containerWidth;
    const startTopPx = pageTopOffset + ratioRef.current.y * containerHeight;

    const scrollContainer = findScrollContainer(boxRef.current);
    const startScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    let currentClientX = startMouseX;
    let currentClientY = startMouseY;
    let animationFrameId: number | null = null;

    const updatePosition = (clientX: number, clientY: number) => {
      const dx = clientX - startMouseX;
      const scrollContainerCurrent = findScrollContainer(boxRef.current);
      const scrollDiff = scrollContainerCurrent
        ? scrollContainerCurrent.scrollTop - startScrollTop
        : 0;
      const dy = clientY - startMouseY + scrollDiff;

      const newLeftPx = startLeftPx + dx;
      const newTopPx = startTopPx + dy;

      if (boxRef.current) {
        boxRef.current.style.left = `${newLeftPx}px`;
        boxRef.current.style.top = `${newTopPx}px`;
      }
    };

    const checkScroll = () => {
      const scrollContainerCurrent = findScrollContainer(boxRef.current);
      if (scrollContainerCurrent) {
        const rect = scrollContainerCurrent.getBoundingClientRect();
        const threshold = 60; // distance from edge in px
        const maxSpeed = 15; // max scroll speed in px/frame

        let scrollAmount = 0;
        if (currentClientY > rect.bottom - threshold) {
          const ratio =
            (currentClientY - (rect.bottom - threshold)) / threshold;
          scrollAmount = Math.min(maxSpeed, Math.max(1, ratio * maxSpeed));
        } else if (currentClientY < rect.top + threshold) {
          const ratio = (rect.top + threshold - currentClientY) / threshold;
          scrollAmount = -Math.min(maxSpeed, Math.max(1, ratio * maxSpeed));
        }

        if (scrollAmount !== 0) {
          scrollContainerCurrent.scrollTop += scrollAmount;
          updatePosition(currentClientX, currentClientY);
        }
      }
      animationFrameId = requestAnimationFrame(checkScroll);
    };

    animationFrameId = requestAnimationFrame(checkScroll);

    const handleMouseMove = (ev: MouseEvent) => {
      currentClientX = ev.clientX;
      currentClientY = ev.clientY;
      updatePosition(ev.clientX, ev.clientY);
    };

    const handleMouseUp = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      const finalLeftPx = boxRef.current
        ? parseFloat(boxRef.current.style.left)
        : startLeftPx;
      const finalTopPx = boxRef.current
        ? parseFloat(boxRef.current.style.top)
        : startTopPx;

      // Xác định chữ ký thuộc trang nào dựa trên cao độ y (finalTopPx)
      let droppedPage = 1;
      let relativeY = 0;
      let accumulatedTop = 0;

      for (let i = 0; i < canvasDisplaySizes.length; i++) {
        const pageH = canvasDisplaySizes[i]?.height || 0;
        const pageBottom = accumulatedTop + pageH;

        if (finalTopPx >= accumulatedTop && finalTopPx <= pageBottom) {
          droppedPage = i + 1;
          relativeY = (finalTopPx - accumulatedTop) / pageH;
          break;
        }

        if (i < canvasDisplaySizes.length - 1) {
          const nextAccumulatedTop = pageBottom + 24; // Khoảng cách giữa các trang (mb: 3)
          if (finalTopPx > pageBottom && finalTopPx < nextAccumulatedTop) {
            if (finalTopPx - pageBottom < nextAccumulatedTop - finalTopPx) {
              droppedPage = i + 1;
              relativeY = 1.0;
            } else {
              droppedPage = i + 2;
              relativeY = 0.0;
            }
            break;
          }
        }
        accumulatedTop = pageBottom + 24;
      }

      const targetPageSize =
        canvasDisplaySizes[droppedPage - 1] || canvasDisplaySizes[0];
      const targetPageWidth = targetPageSize?.width || 800;
      let relativeX = finalLeftPx / targetPageWidth;

      const maxX = (targetPageWidth - displayWidthPx) / targetPageWidth;
      relativeX = Math.max(0, Math.min(relativeX, maxX));
      relativeY = Math.max(0, Math.min(relativeY, 1.0));

      ratioRef.current = { x: relativeX, y: relativeY, page: droppedPage };
      onUpdatePosition(id, relativeX, relativeY, droppedPage);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // ─── Touch drag ───────────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLocked) return;
    setShowControls(true);

    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setShowMobileControls((prev) => !prev);
    }
    lastTapRef.current = now;

    const touch = e.touches[0];
    const startTouchX = touch.clientX;
    const startTouchY = touch.clientY;
    const startLeftPx = ratioRef.current.x * containerWidth;
    const startTopPx = pageTopOffset + ratioRef.current.y * containerHeight;

    const scrollContainer = findScrollContainer(boxRef.current);
    const startScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    let currentClientX = startTouchX;
    let currentClientY = startTouchY;
    let animationFrameId: number | null = null;

    const updatePosition = (clientX: number, clientY: number) => {
      const dx = clientX - startTouchX;
      const scrollContainerCurrent = findScrollContainer(boxRef.current);
      const scrollDiff = scrollContainerCurrent
        ? scrollContainerCurrent.scrollTop - startScrollTop
        : 0;
      const dy = clientY - startTouchY + scrollDiff;

      const newLeftPx = startLeftPx + dx;
      const newTopPx = startTopPx + dy;

      if (boxRef.current) {
        boxRef.current.style.left = `${newLeftPx}px`;
        boxRef.current.style.top = `${newTopPx}px`;
      }
    };

    const checkScroll = () => {
      const scrollContainerCurrent = findScrollContainer(boxRef.current);
      if (scrollContainerCurrent) {
        const rect = scrollContainerCurrent.getBoundingClientRect();
        const threshold = 60;
        const maxSpeed = 15;

        let scrollAmount = 0;
        if (currentClientY > rect.bottom - threshold) {
          const ratio =
            (currentClientY - (rect.bottom - threshold)) / threshold;
          scrollAmount = Math.min(maxSpeed, Math.max(1, ratio * maxSpeed));
        } else if (currentClientY < rect.top + threshold) {
          const ratio = (rect.top + threshold - currentClientY) / threshold;
          scrollAmount = -Math.min(maxSpeed, Math.max(1, ratio * maxSpeed));
        }

        if (scrollAmount !== 0) {
          scrollContainerCurrent.scrollTop += scrollAmount;
          updatePosition(currentClientX, currentClientY);
        }
      }
      animationFrameId = requestAnimationFrame(checkScroll);
    };

    animationFrameId = requestAnimationFrame(checkScroll);

    const handleTouchMove = (ev: TouchEvent) => {
      if (ev.cancelable) ev.preventDefault();
      const t = ev.touches[0];
      currentClientX = t.clientX;
      currentClientY = t.clientY;
      updatePosition(t.clientX, t.clientY);
    };

    const handleTouchEnd = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      const finalLeftPx = boxRef.current
        ? parseFloat(boxRef.current.style.left)
        : startLeftPx;
      const finalTopPx = boxRef.current
        ? parseFloat(boxRef.current.style.top)
        : startTopPx;

      let droppedPage = 1;
      let relativeY = 0;
      let accumulatedTop = 0;

      for (let i = 0; i < canvasDisplaySizes.length; i++) {
        const pageH = canvasDisplaySizes[i]?.height || 0;
        const pageBottom = accumulatedTop + pageH;

        if (finalTopPx >= accumulatedTop && finalTopPx <= pageBottom) {
          droppedPage = i + 1;
          relativeY = (finalTopPx - accumulatedTop) / pageH;
          break;
        }

        if (i < canvasDisplaySizes.length - 1) {
          const nextAccumulatedTop = pageBottom + 24;
          if (finalTopPx > pageBottom && finalTopPx < nextAccumulatedTop) {
            if (finalTopPx - pageBottom < nextAccumulatedTop - finalTopPx) {
              droppedPage = i + 1;
              relativeY = 1.0;
            } else {
              droppedPage = i + 2;
              relativeY = 0.0;
            }
            break;
          }
        }
        accumulatedTop = pageBottom + 24;
      }

      const targetPageSize =
        canvasDisplaySizes[droppedPage - 1] || canvasDisplaySizes[0];
      const targetPageWidth = targetPageSize?.width || 800;
      let relativeX = finalLeftPx / targetPageWidth;

      const maxX = (targetPageWidth - displayWidthPx) / targetPageWidth;
      relativeX = Math.max(0, Math.min(relativeX, maxX));
      relativeY = Math.max(0, Math.min(relativeY, 1.0));

      ratioRef.current = { x: relativeX, y: relativeY, page: droppedPage };
      onUpdatePosition(id, relativeX, relativeY, droppedPage);
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
  };

  const controlsVisible = (showControls || showMobileControls) && !isLocked;

  return (
    <Box
      ref={boxRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => !isLocked && setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
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
        border: isLocked ? "none" : "1.5px dashed #04b46e",
        pointerEvents: "auto",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:active": { cursor: isLocked ? "default" : "grabbing" },
        ...(controlsVisible && {
          borderColor: "#038d56",
          boxShadow: "0 0 12px rgba(4, 180, 110, 0.3)",
        }),
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

      {controlsVisible && (
        <Box
          className="sig-controls"
          sx={{
            display: "flex",
            position: "absolute",
            top: -48,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(4, 180, 110, 0.15)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            borderRadius: "30px",
            p: "4px 10px",
            gap: 0.5,
            alignItems: "center",
            zIndex: 101,
            whiteSpace: "nowrap",
            pointerEvents: "auto",
            transition: "all 0.2s ease-in-out",
            // Pseudo-element cầu nối để tránh mất hover khi di chuyển chuột qua khoảng trống
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -20,
              left: 0,
              right: 0,
              height: 20,
              bgcolor: "transparent",
            },
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Tooltip title="Giảm">
            <IconButton
              size="small"
              onClick={() => handleZoom(scale - 0.1)}
              sx={{
                color: "#4b5563",
                "&:hover": {
                  color: "#04b46e",
                  bgcolor: "rgba(4, 180, 110, 0.06)",
                },
              }}
            >
              <Remove fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box sx={{ width: 60, px: 1, display: "flex", alignItems: "center" }}>
            <Slider
              size="small"
              min={0.5}
              max={2.0}
              step={0.1}
              value={scale}
              onChange={(_, val) => handleZoom(val as number)}
              sx={{
                color: "#04b46e",
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0px 0px 0px 6px rgba(4, 180, 110, 0.16)",
                  },
                },
              }}
            />
          </Box>
          <Tooltip title="Tăng">
            <IconButton
              size="small"
              onClick={() => handleZoom(scale + 0.1)}
              sx={{
                color: "#4b5563",
                "&:hover": {
                  color: "#04b46e",
                  bgcolor: "rgba(4, 180, 110, 0.06)",
                },
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              width: 1,
              height: 16,
              bgcolor: "rgba(0, 0, 0, 0.1)",
              mx: 0.5,
            }}
          />
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(id)}
              sx={{ "&:hover": { bgcolor: "rgba(239, 68, 68, 0.06)" } }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
