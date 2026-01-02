// DraggableSignature.tsx (Hoặc để chung file nếu muốn gọn)
import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { Close, DragIndicator } from "@mui/icons-material";

interface DraggableSignatureProps {
  id: string;
  initialX: number;
  initialY: number;
  imgSrc: string;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  containerWidth: number;
  containerHeight: number;
}

export default function DraggableSignature({
  id,
  initialX,
  initialY,
  imgSrc,
  onUpdatePosition,
  onDelete,
  containerWidth,
  containerHeight,
}: DraggableSignatureProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn click xuyên qua canvas
    setIsDragging(true);
    // Lưu vị trí chuột ban đầu so với vị trí của element
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      let newX = e.clientX - dragStartPos.current.x;
      let newY = e.clientY - dragStartPos.current.y;

      // Giới hạn không cho kéo ra ngoài khung PDF
      const imgWidth = 100; // Giả sử chiều rộng chữ ký
      const imgHeight = 50;

      newX = Math.max(0, Math.min(newX, containerWidth - imgWidth));
      newY = Math.max(0, Math.min(newY, containerHeight - imgHeight));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onUpdatePosition(id, position.x, position.y);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    containerWidth,
    containerHeight,
    id,
    onUpdatePosition,
    position.x,
    position.y,
  ]);

  return (
    <Box
      sx={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
        border: "1px dashed #1976d2",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        padding: "4px",
        display: "inline-block",
        "&:hover .delete-btn": { display: "flex" },
        zIndex: 10,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Nút xóa chữ ký */}
      <IconButton
        className="delete-btn"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        sx={{
          display: "none",
          position: "absolute",
          top: -10,
          right: -10,
          bgcolor: "red",
          color: "white",
          width: 20,
          height: 20,
          "&:hover": { bgcolor: "darkred" },
        }}
      >
        <Close sx={{ fontSize: 12 }} />
      </IconButton>

      {/* Ảnh chữ ký */}
      <img
        src={imgSrc}
        alt="Signature"
        style={{
          width: 100,
          height: 50,
          pointerEvents: "none",
          display: "block",
        }}
      />
    </Box>
  );
}
