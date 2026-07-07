import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { TreeConnector, ROW_H, CONNECTOR_WIDTH } from "./TreeConnector";
import { ActionCell } from "./ActionCell";
import { showStatus } from "../../../config";
import type {
  MaintenancePlanData,
} from "../../../types";
import { TechnicalReportData } from "../../../types";
import { useTechnicalReportMutation } from "../../../mutation/TechnicalReport";
import TechnicalReportDialog from "../../dialog/TechnicalReportDialog";

interface Props {
  report: TechnicalReportData;
  plan: MaintenancePlanData;
  isLast: boolean;
}

export const TechnicalReportRow = ({ report, plan, isLast }: Props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { deleteMutation, updateMutation } = useTechnicalReportMutation();

  const isDraft = report.trangThai === 0;

  const handleDelete = () => {
    deleteMutation.mutateAsync(report.id || "");
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
            <TreeConnector depth={1} isLast={isLast} />
          </Box>
          <Typography
            variant="body2"
            sx={{
              ml: `${CONNECTOR_WIDTH * 1 + 36}px`,
            }}
          >
            {report.id || "Chưa có số"}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip label="Báo cáo kỹ thuật" size="small" />
        </TableCell>
        <TableCell>{report.ngayTao}</TableCell>
        <TableCell>{showStatus(report.trangThai ?? 0)}</TableCell>
        <TableCell align="right">
          <ActionCell
            isEdit={isDraft}
            onEdit={() => setEditDialogOpen(true)}
            editTooltip="Sửa"
            editColor="success"
            isDelete={isDraft}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      {editDialogOpen && (
        <TechnicalReportDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          plan={plan}
          initialData={report}
          selectedDeviceIds={[]}
          selectedMonth={report.thang || 0}
          onSubmit={(updatedData: TechnicalReportData) => {
            updateMutation.mutate(updatedData, {
              onSuccess: () => {
                setEditDialogOpen(false);
              },
            });
          }}
        />
      )}
    </>
  );
};
