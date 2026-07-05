import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { TreeConnector, ROW_H, CONNECTOR_WIDTH } from "./TreeConnector";
import { ActionCell } from "./ActionCell";
import { showStatus } from "../../../config";
import type {
  MaintenancePlanData,
  MaintenanceRepairData,
} from "../../../types";
import {
  useMaintenanceInspectionByBienBanQuery,
  useMaintenanceVehicleInspectionByBienBanQuery,
  useMaintenanceRepairMutation,
} from "../../../mutation";
import { InspectionRow } from "./InspectionRow";
import RepairRequestDialog from "../../dialog/RepairRequestDialog";
import InspectionRecordDialog from "../../dialog/InspectionRecordDialog";
import InspectionRecordVehicleDialog from "../../dialog/InspectionRecordVehicleDialog";
import { AssetGroup } from "../../../../../utils/const";
import { useAppSelector } from "../../../../../redux/store";
import { useLocation } from "react-router-dom";
import DraftIndicator from "../../../../../components/common/DraftIndicator";

interface Props {
  repairRequest: MaintenanceRepairData;
  plan: MaintenancePlanData;
  isLast: boolean;
}

export const RepairRequestRow = ({ repairRequest, plan, isLast }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addInspectionDialogOpen, setAddInspectionDialogOpen] = useState(false);

  const location = useLocation();
  const tabPath = location.pathname;

  const lastMinimizedDialog = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return tab?.formData?.lastMinimizedDialog ?? null;
  });

  const hasMachineInspectionDraft = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return !!tab?.formData?.[`inspectionDraft_${repairRequest.id}`];
  });

  const hasVehicleInspectionDraft = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return !!tab?.formData?.[`inspectionVehicleDraft_${repairRequest.id}`];
  });

  const isMachine = plan?.nhomTaiSan === AssetGroup.MAYMOC;

  const { data: inspectionMachine = [] } =
    useMaintenanceInspectionByBienBanQuery(
      isMachine && expanded ? repairRequest.id || "" : "",
      isMachine,
    );
  const { data: inspectionVehicle = [] } =
    useMaintenanceVehicleInspectionByBienBanQuery(
      !isMachine && expanded ? repairRequest.id || "" : "",
      !isMachine,
    );

  const inspections = isMachine ? inspectionMachine : inspectionVehicle;

  const { deleteMutation, updateMutation } = useMaintenanceRepairMutation();

  const isDraft = repairRequest.trangThai === 0;
  const canAddInspection =
    repairRequest.trangThai === 3 && repairRequest.daCoGiamDinh !== 1;
  const hasInspections =
    repairRequest.daCoGiamDinh === 1 || inspections.length > 0;

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
            <TreeConnector depth={1} isLast={isLast && !hasInspections} />
          </Box>
          {hasInspections && (
            <IconButton
              size="small"
              sx={{ ml: `${CONNECTOR_WIDTH * 1 - 6}px` }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
          <Typography
            variant="body2"
            sx={{
              ml: hasInspections
                ? `${CONNECTOR_WIDTH * 1 + 8}px`
                : `${CONNECTOR_WIDTH * 1 + 36}px`,
            }}
          >
            {repairRequest.soPhieu}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip label="GĐ Sửa chữa" size="small" />
        </TableCell>
        <TableCell>{repairRequest.ngayTao}</TableCell>
        <TableCell>{showStatus(repairRequest.trangThai ?? 0)}</TableCell>
        <TableCell align="right">
          <ActionCell
            onAdd={() => setAddInspectionDialogOpen(true)}
            isAdd={canAddInspection}
            addTooltip="Tạo BB Giám định"
            addColor="success"
            isEdit={isDraft}
            onEdit={() => setEditDialogOpen(true)}
            editTooltip="Sửa"
            editColor="success"
            isDelete={isDraft}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      {expanded &&
        inspections.map((insp: any, idx: number) => (
          <InspectionRow
            key={insp.id}
            inspection={insp}
            depth={2}
            isLast={isLast && idx === inspections.length - 1}
            plan={plan}
            parentReq={repairRequest}
            useConnector={true}
          />
        ))}

      {editDialogOpen && (
        <RepairRequestDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          plan={plan}
          initialData={repairRequest}
          selectedDeviceIds={[]}
          selectedMonth={0}
          onSubmit={(updatedData) => {
            updateMutation.mutate(updatedData, {
              onSuccess: () => {
                setEditDialogOpen(false);
              },
            });
          }}
        />
      )}

      {addInspectionDialogOpen &&
        (isMachine ? (
          <InspectionRecordDialog
            open={addInspectionDialogOpen}
            onClose={() => setAddInspectionDialogOpen(false)}
            plan={plan}
            repairRequest={repairRequest}
            initData={null}
          />
        ) : (
          <InspectionRecordVehicleDialog
            open={addInspectionDialogOpen}
            onClose={() => setAddInspectionDialogOpen(false)}
            plan={plan}
            repairRequest={repairRequest}
            initData={null as any}
          />
        ))}

      {lastMinimizedDialog === "inspection" && hasMachineInspectionDraft && (
        <DraftIndicator onClick={() => setAddInspectionDialogOpen(true)} />
      )}
      {lastMinimizedDialog === "inspectionVehicle" &&
        hasVehicleInspectionDraft && (
          <DraftIndicator onClick={() => setAddInspectionDialogOpen(true)} />
        )}
    </>
  );
};
