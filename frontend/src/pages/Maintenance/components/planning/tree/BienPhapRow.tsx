import React, { useState } from "react";
import { TableRow, TableCell, Typography, Box, Chip, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { TreeConnector, ROW_H, CONNECTOR_WIDTH } from "./TreeConnector";
import { ActionCell } from "./ActionCell";
import { showStatus } from "../../../config";
import type { MaintenancePlanData } from "../../../types";
import {
  useMaintenanceAcceptanceByBienPhapQuery,
  useMaintenanceAcceptanceVehicleByBienPhapQuery,
} from "../../../mutation";
import {
  useBienPhapMayMocMutation,
} from "../../../mutation/MachineMeasure";
import {
  useBienPhapPhuongTienMutation,
} from "../../../mutation/VehicleMeasure";
import { AcceptanceRow } from "./AcceptanceRow";
import BienPhapMayMocDialog from "../../dialog/BienPhapMayMocDialog";
import BienPhapPhuongTienDialog from "../../dialog/BienPhapPhuongTienDialog";
import NghiemThuPhuongTienDialog from "../../dialog/NghiemThuPhuongTienDialog";
import AcceptanceTestDialog from "../../dialog/AcceptanceTestDialog";
import { AssetGroup } from "../../../../../utils/const";
import { useAppSelector } from "../../../../../redux/store";
import { useLocation } from "react-router-dom";
import DraftIndicator from "../../../../../components/common/DraftIndicator";

interface Props {
  bienPhap: any;
  depth: number;
  isLast: boolean;
  plan?: MaintenancePlanData | null;
  inspection: any;
  useConnector?: boolean;
  isMachine: boolean;
}

export const BienPhapRow = ({
  bienPhap,
  depth,
  isLast,
  plan,
  inspection,
  useConnector = true,
  isMachine,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addAcceptanceDialogOpen, setAddAcceptanceDialogOpen] = useState(false);

  const location = useLocation();
  const tabPath = location.pathname;

  const lastMinimizedDialog = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return tab?.formData?.lastMinimizedDialog ?? null;
  });

  const hasAcceptanceMachineDraft = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return !!tab?.formData?.[`acceptanceDraft_${bienPhap.id}`];
  });

  const hasAcceptanceVehicleDraft = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return !!tab?.formData?.[`acceptanceVehicleDraft_${bienPhap.id}`];
  });

  const { data: acceptancesMachine = [] } = useMaintenanceAcceptanceByBienPhapQuery(
    isMachine && expanded ? bienPhap.id : ""
  );
  const { data: acceptancesVehicle = [] } = useMaintenanceAcceptanceVehicleByBienPhapQuery(
    !isMachine && expanded ? bienPhap.id : ""
  );

  const acceptances = isMachine ? acceptancesMachine : acceptancesVehicle;

  const { deleteMutation: deleteBPMachine } = useBienPhapMayMocMutation();
  const { deleteMutation: deleteBPVehicle } = useBienPhapPhuongTienMutation();

  const isDraft = bienPhap.trangThai === 0;
  const canAddAcceptance = bienPhap.trangThai === 3 && bienPhap.daCoNghiemThu !== 1;
  const hasAcceptances = bienPhap.daCoNghiemThu === 1 || acceptances.length > 0;

  const handleDelete = () => {
    const mut = isMachine ? deleteBPMachine : deleteBPVehicle;
    mut.mutateAsync(bienPhap.id);
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
              <TreeConnector depth={depth} isLast={isLast && acceptances.length === 0} />
            </Box>
          )}
          {hasAcceptances && (
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
              ml: hasAcceptances
                ? useConnector ? `${CONNECTOR_WIDTH * depth + 8}px` : "8px"
                : useConnector ? `${CONNECTOR_WIDTH * depth + 36}px` : "36px",
            }}
          >
            {bienPhap.soPhieu || bienPhap.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label="Biện pháp SC"
            size="small"
            sx={{ bgcolor: "#d32f2f", color: "#fff" }}
          />
        </TableCell>
        <TableCell>{bienPhap.thoiGianBatDau || bienPhap.ngayTao}</TableCell>
        <TableCell>{showStatus(bienPhap.trangThai ?? 0)}</TableCell>
        <TableCell align="right">
          <ActionCell
            onAdd={() => setAddAcceptanceDialogOpen(true)}
            isAdd={canAddAcceptance}
            addTooltip="Tạo BB Nghiệm thu"
            addColor="warning"
            isEdit={isDraft}
            onEdit={() => setEditDialogOpen(true)}
            editTooltip="Chỉnh sửa Biện pháp"
            editColor="primary"
            isDelete={isDraft}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      {expanded &&
        acceptances.map((acc: any, idx: number) => (
          <AcceptanceRow
            key={acc.id}
            acceptance={acc}
            depth={depth + 1}
            isLast={idx === acceptances.length - 1}
            plan={plan}
            bienPhap={bienPhap}
            inspection={inspection}
            useConnector={useConnector}
            isMachine={isMachine}
          />
        ))}

      {editDialogOpen && (
        isMachine ? (
          <BienPhapMayMocDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            inspectionRecord={inspection}
            initData={bienPhap}
          />
        ) : (
          <BienPhapPhuongTienDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            inspectionRecord={inspection}
            initData={bienPhap}
          />
        )
      )}

      {addAcceptanceDialogOpen && (
        isMachine ? (
          <AcceptanceTestDialog
            open={addAcceptanceDialogOpen}
            onClose={() => setAddAcceptanceDialogOpen(false)}
            inspectionRecord={inspection}
            bienPhap={bienPhap}
            initData={null}
          />
        ) : (
          <NghiemThuPhuongTienDialog
            open={addAcceptanceDialogOpen}
            onClose={() => setAddAcceptanceDialogOpen(false)}
            bienPhap={bienPhap}
            inspectionRecord={inspection}
            initData={null}
          />
        )
      )}

      {lastMinimizedDialog === "acceptance" && hasAcceptanceMachineDraft && (
        <DraftIndicator onClick={() => setAddAcceptanceDialogOpen(true)} />
      )}
      {lastMinimizedDialog === "acceptanceVehicle" && hasAcceptanceVehicleDraft && (
        <DraftIndicator onClick={() => setAddAcceptanceDialogOpen(true)} />
      )}
    </>
  );
};
