import React, { useState } from "react";
import { TableRow, TableCell, Typography, Box, Chip } from "@mui/material";
import { TreeConnector, ROW_H, CONNECTOR_WIDTH } from "./TreeConnector";
import { ActionCell } from "./ActionCell";
import { showStatus } from "../../../config";
import MaterialRequisitionDialog from "../../dialog/MaterialRequisitionDialog";
import { useMaterialRequisitionMutation } from "../../../mutation";

interface Props {
  data: any;
  jobAssignment?: any;
  depth: number;
  isLast: boolean;
}

export const MaterialRequisitionRow = ({
  data,
  jobAssignment,
  depth,
  isLast,
}: Props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { deleteMutation } = useMaterialRequisitionMutation();

  const isDraft = data.trangThai === 0;

  const handleDelete = () => {
    deleteMutation.mutateAsync(data.id);
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
            {data.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label="Phiếu lĩnh vật tư"
            size="small"
            color="primary"
            sx={{ color: "#fff" }}
          />
        </TableCell>
        <TableCell>{data.ngayTao}</TableCell>
        <TableCell>{showStatus(data.trangThai ?? 0)}</TableCell>
        <TableCell align="right">
          <ActionCell
            isEdit={isDraft}
            onEdit={() => setEditDialogOpen(true)}
            editTooltip="Sửa Phiếu lĩnh vật tư"
            editColor="primary"
            isDelete={isDraft}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      {editDialogOpen && (
        <MaterialRequisitionDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          jobAssignment={jobAssignment}
          initialData={data}
        />
      )}
    </>
  );
};
