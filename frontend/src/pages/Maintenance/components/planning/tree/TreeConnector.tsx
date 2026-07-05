import React from "react";
import { Box } from "@mui/material";

export const ROW_H = 36;
export const CONNECTOR_WIDTH = 16;
export const MAX_DEPTH = 5;

interface TreeConnectorProps {
  depth: number;
  isLast: boolean;
  rowHeight?: number;
  useConnector?: boolean;
}

export const TreeConnector = ({
  depth,
  isLast,
  rowHeight = ROW_H,
  useConnector = true,
}: TreeConnectorProps) => {
  if (!useConnector) return null;

  const lineColor =
    ["#90caf9", "#a5d6a7", "#ffcc80", "#ce93d8", "#bcaaa4"][depth - 1] ??
    "#bdbdbd";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        height: rowHeight,
        flexShrink: 0,
      }}
    >
      {Array.from({ length: depth - 1 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: CONNECTOR_WIDTH,
            flexShrink: 0,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              left: CONNECTOR_WIDTH / 2 - 0.75,
              top: 0,
              bottom: 0,
              width: 1.5,
              bgcolor: lineColor,
              opacity: 0.5,
            },
          }}
        />
      ))}
      <Box sx={{ width: CONNECTOR_WIDTH, flexShrink: 0, position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            left: CONNECTOR_WIDTH / 2 - 0.75,
            top: 0,
            height: isLast ? "50%" : "100%",
            width: 1.5,
            bgcolor: lineColor,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: CONNECTOR_WIDTH / 2 - 0.75,
            top: "50%",
            width: CONNECTOR_WIDTH / 2 + 0.75,
            height: 1.5,
            bgcolor: lineColor,
            transform: "translateY(-50%)",
          }}
        />
      </Box>
    </Box>
  );
};
