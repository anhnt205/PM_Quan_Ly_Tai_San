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
  handleUpdatePage,
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
      {/* 1. Canvases rendering */}
      {pages.map((canvas: HTMLCanvasElement, index: number) => (
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
        </Box>
      ))}

      {/* 2. Global overlay for all signatures */}
      {signatures.length > 0 &&
        canvasDisplaySizes.length > 0 &&
        canvasDisplaySizes[0].width > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {signatures.map((sig: any) => {
              const sigPage = sig.page || 1;
              const pageIdx = Math.min(sigPage - 1, canvasDisplaySizes.length - 1);
              
              // Calculate page top offset
              let pageTopOffset = 0;
              for (let i = 0; i < pageIdx; i++) {
                pageTopOffset += (canvasDisplaySizes[i]?.height || 0) + 24; // mb: 3 is 24px
              }

              return (
                <DraggableSignature
                  key={sig.id}
                  id={sig.id}
                  xRatio={sig.x}
                  yRatio={sig.y}
                  widthRatio={sig.widthRatio}
                  initialScale={sig.scale || 1}
                  sig={sig}
                  digitalSignatureMap={digitalSignatureMap}
                  pageTopOffset={pageTopOffset}
                  canvasDisplaySizes={canvasDisplaySizes}
                  onUpdatePosition={handleUpdatePosition}
                  onUpdateScale={handleUpdateScale}
                  onDelete={handleDeleteSignature}
                  onUpdatePage={handleUpdatePage}
                  pagesCount={pages.length}
                  isLocked={sig.isLocked}
                />
              );
            })}
          </Box>
        )}
    </Box>
  );
};
