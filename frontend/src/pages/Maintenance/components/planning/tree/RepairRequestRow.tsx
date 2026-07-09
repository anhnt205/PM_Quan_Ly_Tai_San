import React, { useState } from "react";
import { TableRow, TableCell, Typography, Box, Chip } from "@mui/material";
import { TreeConnector, ROW_H, CONNECTOR_WIDTH } from "./TreeConnector";
import { ActionCell } from "./ActionCell";
import { showStatus } from "../../../config";
import type {
  MaintenancePlanData,
  MaintenanceRepairData,
} from "../../../types";
import { useMaintenanceRepairMutation } from "../../../mutation";
import RepairRequestDialog from "../../dialog/RepairRequestDialog";
import { useAppSelector } from "../../../../../redux/store";
import { useLocation } from "react-router-dom";
import DraftIndicator from "../../../../../components/common/DraftIndicator";

interface Props {
  repairRequest: MaintenanceRepairData;
  plan?: MaintenancePlanData|null;
  isLast: boolean;
  depth?: number;
}

export const RepairRequestRow = ({
  repairRequest,
  plan,
  isLast,
  depth = 3,
}: Props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { createMutation, deleteMutation, updateMutation } =
    useMaintenanceRepairMutation();

  const isDraft = repairRequest.trangThai === 0;

  const handleDelete = () => {
    deleteMutation.mutateAsync(repairRequest);
  };

  return (
    <>
      <TableRow hover>
        <TableCell
          sx={{
            pl: 2,
            position: "relative",
            height: ROW_H,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TreeConnector depth={depth} isLast={isLast} />
          </Box>
          <Typography
            variant="body2"
            sx={{
              ml: `${CONNECTOR_WIDTH * depth + 36}px`,
            }}
          >
            {repairRequest.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip label="Lệnh sửa chữa" size="small" color="primary" />
        </TableCell>
        <TableCell>{repairRequest.ngayTao}</TableCell>
        <TableCell>{showStatus(repairRequest.trangThai ?? 0)}</TableCell>
        <TableCell align="right">
          <ActionCell
            isAdd={false}
            isEdit={isDraft}
            onEdit={() => setEditDialogOpen(true)}
            editTooltip="Sửa Lệnh sửa chữa"
            editColor="primary"
            isDelete={isDraft}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      {editDialogOpen && (
        <RepairRequestDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          initialData={repairRequest}
        />
      )}
    </>
  );
};
