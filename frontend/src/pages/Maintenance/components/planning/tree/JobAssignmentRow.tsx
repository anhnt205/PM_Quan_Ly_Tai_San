import React, { useState } from "react";
import { TableRow, TableCell, Typography, Box, Chip } from "@mui/material";
import { TreeConnector, ROW_H, CONNECTOR_WIDTH } from "./TreeConnector";
import { ActionCell } from "./ActionCell";
import { showStatus } from "../../../config";
import JobAssignmentDialog from "../../dialog/JobAssignmentDialog";
import { useJobAssignmentMutation } from "../../../mutation/JobAssignment";

interface Props {
  jobAssignment: any;
  depth: number;
  isLast: boolean;
  repairRequest?: any;
}

export const JobAssignmentRow = ({
  jobAssignment,
  depth,
  isLast,
  repairRequest,
}: Props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { deleteMutation } = useJobAssignmentMutation();

  const isDraft = jobAssignment.trangThai === 0;

  const handleDelete = () => {
    deleteMutation.mutateAsync(jobAssignment.id);
  };

  return (
    <>
      <TableRow hover>
        <TableCell
          sx={{
            pl: depth * 4,
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
              ml: `${CONNECTOR_WIDTH * depth - 6}px`,
            }}
          >
            {jobAssignment.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label="Phiếu giao việc"
            size="small"
            color="secondary"
            sx={{ color: "#fff" }}
          />
        </TableCell>
        <TableCell>{jobAssignment.ngayTao}</TableCell>
        <TableCell>{showStatus(jobAssignment.trangThai ?? 0)}</TableCell>
        <TableCell align="right">
          <ActionCell
            isEdit={isDraft}
            onEdit={() => setEditDialogOpen(true)}
            editTooltip="Sửa Phiếu giao việc"
            editColor="primary"
            isDelete={isDraft}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      {editDialogOpen && (
        <JobAssignmentDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          repairRequest={repairRequest}
          initialData={jobAssignment}
        />
      )}
    </>
  );
};
