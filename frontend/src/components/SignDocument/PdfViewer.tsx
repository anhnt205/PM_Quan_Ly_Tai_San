import { Box } from "@mui/material";
import DraggableSignature from "./DraggableSignature";
import { useGetFileQuery } from "../../pages/Staff/Mutation";

export const PdfViewer = ({
  pages,
  signatures,
  canvasDisplaySizes,
  digitalSignatureMap,
  handleUpdatePosition,
  handleUpdateScale,
  handleDeleteSignature,
}: any) => (
  <Box sx={{ position: "relative" }}>
    {pages.map((canvas: any, index: number) => (
      <Box key={index} sx={{ position: "relative", mb: 3 }}>
        {/* Render Canvas */}
        <div
          ref={(el) => {
            if (el && !el.hasChildNodes()) el.appendChild(canvas);
          }}
        />

        {/* Chỉ render chữ ký ở trang 1 (index 0) */}
        {index === 0 && signatures.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            {signatures.map((sig: any) => {
              const displaySize = canvasDisplaySizes[0] ?? {
                width: 800,
                height: 800 * (297 / 210),
              };

              if (displaySize.width === 0 || displaySize.height === 0)
                return null;

              const currentCanvas = pages[index];
              if (!currentCanvas || !displaySize) return null;

              const scale = displaySize.width / currentCanvas.width;

              return (
                <DraggableSignature
                  key={sig.id}
                  id={sig.id}
                  initialX={sig.x * displaySize.width}
                  initialY={sig.y * displaySize.height}
                  width={sig.width * scale}
                  initialScale={sig.scale || 2}
                  sig={sig}
                  digitalSignatureMap={digitalSignatureMap}
                  containerWidth={displaySize.width}
                  containerHeight={displaySize.height}
                  onUpdatePosition={handleUpdatePosition}
                  onUpdateScale={handleUpdateScale}
                  onDelete={handleDeleteSignature}
                  isLocked={sig.isLocked}
                />
              );
            })}
          </Box>
        )}
      </Box>
    ))}
  </Box>
);
