import React, { useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface DraggableSignatureProps {
  id: string;
  initialX: number;
  initialY: number;
  xRatio: number;
  yRatio: number;
  imgSrc: string;
  width: number;
  onUpdatePosition: (id: string, xRatio: number, yRatio: number) => void;
  onUpdatePage: (id: string, newPage: number) => void; // Cập nhật page khi drag sang trang khác
  onDelete: (id: string) => void;
  containerWidth: number;
  containerHeight: number;
  canvasWidth: number; // Kích thước gốc (viewport pixels)
  canvasHeight: number; // Kích thước gốc (viewport pixels)
  currentPage: number; // Trang hiện tại của chữ ký
  totalPages: number; // Tổng số trang
}

export default function DraggableSignature({
  id,
  initialX,
  initialY,
  width,
  xRatio,
  yRatio,
  imgSrc,
  onUpdatePosition,
  onUpdatePage,
  onDelete,
  containerWidth,
  containerHeight,
  canvasWidth,
  canvasHeight,
  currentPage,
  totalPages,
}: DraggableSignatureProps) {
  // KHÔNG CÓ STATE - TẤT CẢ DỮ LIỆU ĐỀU LÀ REF
  const positionRef = useRef({ x: initialX, y: initialY });
  const sizeRef = useRef({ width: 100, height: 50 });
  // LƯU RATIO CỦA SIZE ĐỂ SCALE THEO CONTAINER
  // Khởi tạo ratio từ size ban đầu (100x50) dựa trên canvas GỐC
  const sizeRatioRef = useRef({
    widthRatio: 100 / canvasWidth,
    heightRatio: 50 / canvasHeight,
  });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const canvasSizeRef = useRef({
    width: canvasWidth,
    height: canvasHeight,
  });
  const parentBoxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Xử lý cập nhật size/position khi container size thay đổi (zoom) hoặc page thay đổi
  // Công thức: displayPos = ratio × canvasWidth × (displayWidth / canvasWidth)
  //          = ratio × displayWidth
  useEffect(() => {
    // Tính scale từ kích thước gốc → hiển thị
    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;

    // Size: tính từ ratio × canvasWidth × scaleX
    sizeRef.current.width =
      sizeRatioRef.current.widthRatio * canvasWidth * scaleX;
    sizeRef.current.height =
      sizeRatioRef.current.heightRatio * canvasHeight * scaleY;

    // Position: tính từ xRatio × canvasWidth × scaleX
    positionRef.current.x = xRatio * canvasWidth * scaleX;

    // Y position: thêm page offset để chữ ký nằm đúng trang
    // pageOffset = (currentPage - 1) × containerHeight
    // yInPage = yRatio × containerHeight × scaleY
    // totalY = pageOffset + yInPage
    const pageMarginAndGap = 48; // marginBottom 3 (24px) + divider (2px) + margins (22px)
    const pageOffset = (currentPage - 1) * (containerHeight + pageMarginAndGap);
    positionRef.current.y = pageOffset + yRatio * canvasHeight * scaleY;

    updateDOMDirectly();
  }, [
    containerWidth,
    containerHeight,
    canvasWidth,
    canvasHeight,
    xRatio,
    yRatio,
    currentPage,
  ]);

  const updateDOMDirectly = () => {
    if (!parentBoxRef.current) return;
    parentBoxRef.current.style.left = positionRef.current.x + "px";
    parentBoxRef.current.style.top = positionRef.current.y + "px";
    if (imgRef.current) {
      imgRef.current.style.width = sizeRef.current.width + "px";
      imgRef.current.style.height = sizeRef.current.height + "px";
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const sigRect = parentBoxRef.current?.getBoundingClientRect();
    const parentElem = parentBoxRef.current?.parentElement;
    const wrapper = parentElem?.parentElement; // Wrapper chứa tất cả pages + signatures
    const wrapperRect = wrapper?.getBoundingClientRect();

    if (!sigRect || !wrapperRect) return;

    // Tính scale hiện tại
    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;

    dragStartRef.current = {
      x: e.clientX - wrapperRect.left - positionRef.current.x,
      y: e.clientY - wrapperRect.top - positionRef.current.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Lấy wrapper container (document-level, không phải page-level)
      const wrapper = parentElem?.parentElement; // Wrapper bọc tất cả pages + signatures
      const wrapperRect = wrapper?.getBoundingClientRect();
      if (!wrapperRect) return;

      let newX = moveEvent.clientX - wrapperRect.left - dragStartRef.current.x;
      let newY = moveEvent.clientY - wrapperRect.top - dragStartRef.current.y;

      // Lấy kích thước hiển thị thực tế của chữ ký
      const sigBoundingRect = parentBoxRef.current?.getBoundingClientRect();
      const actualSigWidth = sigBoundingRect?.width || sizeRef.current.width;
      const actualSigHeight = sigBoundingRect?.height || sizeRef.current.height;

      // Tìm page container: tìm element đầu tiên có canvas để lấy chính xác left boundary
      // Pages được center với margin: "0 auto", tìm cái nào có canvas inside
      let pageContainer = null;
      if (wrapper?.children) {
        for (let i = 0; i < wrapper.children.length; i++) {
          const child = wrapper.children[i] as HTMLElement;
          if (child.querySelector("canvas")) {
            pageContainer = child;
            break;
          }
        }
      }

      let pageLeftBound = 0;
      let pageRightBound = containerWidth;

      if (pageContainer) {
        // Tìm Box container bên trong page wrapper (cái có margin: 0 auto)
        const pageContentBox = pageContainer.querySelector(
          '[style*="margin"], [style*="0 auto"]',
        ) as HTMLElement;

        if (pageContentBox) {
          const pageRect = pageContentBox.getBoundingClientRect();
          pageLeftBound = pageRect.left - wrapperRect.left;
          pageRightBound = pageLeftBound + containerWidth;
        } else {
          // Fallback: lấy child có canvas
          const canvasParent = pageContainer.querySelector(
            '[style*="position"]',
          ) as HTMLElement;
          if (canvasParent) {
            const pageRect = canvasParent.getBoundingClientRect();
            pageLeftBound = pageRect.left - wrapperRect.left;
            pageRightBound = pageLeftBound + containerWidth;
          }
        }
      }

      // Giới hạn X trong phạm vi trang PDF
      newX = Math.max(
        pageLeftBound,
        Math.min(newX, pageRightBound - actualSigWidth),
      );

      // Giới hạn Y: từ 0 đến tổng chiều cao của tất cả pages + margins
      const pageMarginAndGap = 48;
      const totalDocumentHeight =
        totalPages * (containerHeight + pageMarginAndGap) - pageMarginAndGap;
      newY = Math.max(0, Math.min(newY, totalDocumentHeight - actualSigHeight));

      positionRef.current.x = newX;
      positionRef.current.y = newY;
      updateDOMDirectly();
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      // Tính ratio dựa trên kích thước CANVAS GỐC (canvasWidth), không phải display
      const scaleX = containerWidth / canvasWidth;
      const scaleY = containerHeight / canvasHeight;

      // Page offset calculation (MUST match useEffect calculation)
      const pageMarginAndGap = 48; // marginBottom 3 (24px) + divider (2px) + margins (22px)
      const pageHeightWithGap = containerHeight + pageMarginAndGap;

      // Detect new page dựa trên Y position tuyệt đối
      // Y tuyệt đối được tính từ signature's absolute top position
      // Chia cho (containerHeight + margin) để được page index (1-indexed)
      const estimatedPageIndex = Math.floor(
        positionRef.current.y / pageHeightWithGap,
      );
      const newPage = Math.max(1, Math.min(estimatedPageIndex + 1, totalPages));

      // Tính page offset để lấy Y tương đối trong trang (MUST match useEffect)
      const pageOffset = (newPage - 1) * pageHeightWithGap;
      const yPositionInPage = positionRef.current.y - pageOffset;

      // X ratio: dựa trên position X tương đối trong trang hiện tại
      const xRatio = Math.max(
        0,
        Math.min(positionRef.current.x / scaleX / canvasWidth, 1),
      );

      // Y ratio: tính từ position tương đối trong trang hiện tại
      const yRatio = Math.max(
        0,
        Math.min(yPositionInPage / scaleY / canvasHeight, 1),
      );
      onUpdatePosition(id, xRatio, yRatio);

      if (newPage !== currentPage) {
        onUpdatePage(id, newPage);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const parentElem = parentBoxRef.current?.parentElement;
    const parentRect = parentElem?.getBoundingClientRect();

    if (!parentRect) return;

    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: sizeRef.current.width,
      h: sizeRef.current.height,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const actualParentRect = parentElem?.getBoundingClientRect();
      if (!actualParentRect) return;

      const deltaX = moveEvent.clientX - resizeStartRef.current.x;
      const deltaY = moveEvent.clientY - resizeStartRef.current.y;

      let newWidth = resizeStartRef.current.w + deltaX;
      let newHeight = resizeStartRef.current.h + deltaY;

      // Giới hạn resize trong phạm vi parent
      newWidth = Math.max(
        50,
        Math.min(newWidth, actualParentRect.width - positionRef.current.x),
      );
      newHeight = Math.max(
        25,
        Math.min(newHeight, actualParentRect.height - positionRef.current.y),
      );

      sizeRef.current = { width: newWidth, height: newHeight };
      if (imgRef.current) {
        imgRef.current.style.width = newWidth + "px";
        imgRef.current.style.height = newHeight + "px";
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      // Lưu ratio dựa trên CANVAS GỐC (canvasWidth), không phải display
      const scaleX = containerWidth / canvasWidth;
      sizeRatioRef.current = {
        widthRatio: sizeRef.current.width / scaleX / canvasWidth,
        heightRatio:
          sizeRef.current.height /
          (containerHeight / canvasHeight) /
          canvasHeight,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <Box
      ref={parentBoxRef}
      sx={{
        position: "absolute",
        left: positionRef.current.x,
        top: positionRef.current.y,
        cursor: "grab",
        border: "1px dashed #1976d2",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        padding: "4px",
        display: "inline-block",
        "&:hover .delete-btn": { display: "flex" },
        "&:hover .resize-btn": { display: "flex" },
        zIndex: 10,
        userSelect: "none",
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

      {/* Nút resize chữ ký */}
      <IconButton
        className="resize-btn"
        size="small"
        onMouseDown={handleResizeStart}
        sx={{
          display: "none",
          position: "absolute",
          bottom: -10,
          right: -10,
          bgcolor: "blue",
          color: "white",
          width: 20,
          height: 20,
          cursor: "nwse-resize",
          "&:hover": { bgcolor: "darkblue" },
          padding: "2px",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Top-left arrow */}
          <path d="M 3 3 L 9 3 M 3 3 L 3 9" />
          {/* Top-right arrow */}
          <path d="M 21 3 L 15 3 M 21 3 L 21 9" />
          {/* Bottom-left arrow */}
          <path d="M 3 21 L 9 21 M 3 21 L 3 15" />
          {/* Bottom-right arrow */}
          <path d="M 21 21 L 15 21 M 21 21 L 21 15" />
        </svg>
      </IconButton>

      {/* Ảnh chữ ký */}
      <img
        ref={imgRef}
        src={imgSrc}
        alt="Signature"
        style={{
          width: sizeRef.current.width,
          height: sizeRef.current.height,
          pointerEvents: "none",
          display: "block",
        }}
      />
    </Box>
  );
}
