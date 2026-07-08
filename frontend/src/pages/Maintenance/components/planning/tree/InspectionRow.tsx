import React, { useState } from "react";
import { TableRow, TableCell, Typography, Box, Chip, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { TreeConnector, ROW_H, CONNECTOR_WIDTH } from "./TreeConnector";
import { ActionCell } from "./ActionCell";
import { showStatus } from "../../../config";
import type { MaintenancePlanData } from "../../../types";
import {
  useMaintenanceInspectionMutation,
} from "../../../mutation";

import InspectionRecordDialog from "../../dialog/InspectionRecordDialog";
import { useAppSelector } from "../../../../../redux/store";
import { useLocation } from "react-router-dom";
import DraftIndicator from "../../../../../components/common/DraftIndicator";

interface Props {
  inspection: any;
  depth: number;
  isLast: boolean;
  plan?: MaintenancePlanData | null;
  parentReq?: any; // RepairRequest or IncidentInspection parent
  useConnector?: boolean;
  isMachine: boolean;
}

export const InspectionRow = ({
  inspection,
  depth,
  isLast,
  plan,
  parentReq,
  useConnector = true,
  isMachine,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addBienPhapDialogOpen, setAddBienPhapDialogOpen] = useState(false);
  const [addAcceptanceDialogOpen, setAddAcceptanceDialogOpen] = useState(false);

  const location = useLocation();
  const tabPath = location.pathname;

  const lastMinimizedDialog = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return tab?.formData?.lastMinimizedDialog ?? null;
  });

  const hasRrepairDraft = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return !!tab?.formData?.[`repairDraft_${inspection.id}`];
  });
  


  const { deleteMutation: deleteInspMachine } = useMaintenanceInspectionMutation();

  const isDraft = inspection.trangThai === 0;
  const canAddBienPhap =
    inspection.trangThai === 3 &&
    (!inspection.daCoSuaChua || inspection.daCoSuaChua === 0)

  const hasChildren =
    (inspection.daCoSuaChua && inspection.daCoSuaChua > 0)

  const handleDelete = () => {
    deleteInspMachine.mutateAsync(inspection.id);
  };

  return (
    <>
      <TableRow hover>
        <TableCell
          sx={{
            pl: useConnector ? 2 : depth * 4,
            position: "relative",
            height: ROW_H,
            display: "flex",
            alignItems: "center",
          }}
        >
          {useConnector && (
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
              <TreeConnector depth={depth} isLast={isLast && !hasChildren} />
            </Box>
          )}
          {hasChildren && (
            <IconButton
              size="small"
              sx={{
                ml: useConnector ? `${CONNECTOR_WIDTH * depth - 6}px` : 0,
              }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
          <Typography
            variant="body2"
            sx={{
              ml: hasChildren
                ? useConnector ? `${CONNECTOR_WIDTH * depth + 8}px` : "8px"
                : useConnector ? `${CONNECTOR_WIDTH * depth + 36}px` : "36px",
            }}
          >
            {inspection.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label="BB Giám định"
            size="small"
            color="success"
            sx={{ color: "#fff" }}
          />
        </TableCell>
        <TableCell>{inspection.ngayGiamDinh}</TableCell>
        <TableCell>{showStatus(inspection.trangThai ?? 0)}</TableCell>
        <TableCell align="right">
          <ActionCell
            onAdd={() => setAddBienPhapDialogOpen(true)}
            isAdd={canAddBienPhap}
            addTooltip="Tạo lệnh sửa chữa"
            addColor="error"
            isEdit={isDraft}
            onEdit={() => setEditDialogOpen(true)}
            editTooltip="Chỉnh sửa BB Giám định"
            editColor="primary"
            isDelete={isDraft}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      {/* {expanded &&
        directAcceptances.map((acc: any, idx: number) => (
          <AcceptanceRow
            key={acc.id}
            acceptance={acc}
            depth={depth + 1}
            isLast={idx === directAcceptances.length - 1}
            plan={plan}
            inspection={inspection}
            useConnector={useConnector}
            isMachine={isMachine}
          />
        ))} */}

      {editDialogOpen && (
          <InspectionRecordDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            technicalReport={null}
            initData={inspection}
          />
      )}

      {lastMinimizedDialog === "repair" && hasRrepairDraft && (
        <DraftIndicator onClick={() => setAddBienPhapDialogOpen(true)} />
      )}
    </>
  );
};
