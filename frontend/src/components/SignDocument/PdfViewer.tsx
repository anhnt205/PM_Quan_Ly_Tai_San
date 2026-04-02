import { Box } from "@mui/material";
import { useRef, useEffect, useCallback } from "react";
import DraggableSignature from "./DraggableSignature";

export const PdfViewer = ({
  pages,
  signatures,
  canvasDisplaySizes,
  setCanvasDisplaySizes, // ← Cần truyền setter từ parent xuống
  digitalSignatureMap,
  handleUpdatePosition,
  handleUpdateScale,
  handleDeleteSignature,
}: any) => {
  // Lưu ref tới wrapper div của mỗi canvas (element thực trong DOM)
  const canvasWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  const measureSizes = useCallback(() => {
    const sizes = canvasWrapperRefs.current.map((wrapper) => {
      if (!wrapper) return { width: 0, height: 0 };
      const rect = wrapper.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    setCanvasDisplaySizes(sizes);
  }, [setCanvasDisplaySizes]);

  useEffect(() => {
    if (pages.length === 0) return;

    // Đo ngay lần đầu sau khi DOM mount
    // requestAnimationFrame đảm bảo canvas đã được paint và có kích thước thực
    const raf = requestAnimationFrame(() => {
      measureSizes();
    });

    // Observe wrapper div thực trong DOM (không phải canvas object từ useState)
    const observer = new ResizeObserver(() => {
      measureSizes();
    });

    canvasWrapperRefs.current.forEach((wrapper) => {
      if (wrapper) observer.observe(wrapper);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [pages, measureSizes]);

  return (
    <Box sx={{ position: "relative" }}>
      {pages.map((canvas: HTMLCanvasElement, index: number) => {
        const displaySize = canvasDisplaySizes[index];

        return (
          <Box key={index} sx={{ position: "relative", mb: 3 }}>
            {/* Wrapper div — đây là element thực ta observe resize */}
            <div
              ref={(el) => {
                canvasWrapperRefs.current[index] = el;
                if (el && !el.hasChildNodes()) {
                  el.appendChild(canvas);
                }
              }}
              style={{ position: "relative", lineHeight: 0 }}
            />

            {/* Lớp overlay chữ ký — chỉ render khi đã có displaySize hợp lệ */}
            {index === 0 &&
              signatures.length > 0 &&
              displaySize &&
              displaySize.width > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    // Căn chính xác với canvas bên trên
                    top: 0,
                    left: 0,
                    width: displaySize.width,
                    height: displaySize.height,
                    pointerEvents: "none",
                  }}
                >
                  {signatures.map((sig: any) => (
                    <DraggableSignature
                      key={sig.id}
                      id={sig.id}
                      xRatio={sig.x}
                      yRatio={sig.y}
                      widthRatio={sig.widthRatio}
                      initialScale={sig.scale || 1}
                      sig={sig}
                      digitalSignatureMap={digitalSignatureMap}
                      containerWidth={displaySize.width}
                      containerHeight={displaySize.height}
                      onUpdatePosition={handleUpdatePosition}
                      onUpdateScale={handleUpdateScale}
                      onDelete={handleDeleteSignature}
                      isLocked={sig.isLocked}
                    />
                  ))}
                </Box>
              )}
          </Box>
        );
      })}
    </Box>
  );
};
