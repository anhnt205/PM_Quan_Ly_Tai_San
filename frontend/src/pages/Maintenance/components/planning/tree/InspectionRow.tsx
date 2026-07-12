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
  useMaintenanceVehicleInspectionMutation,
  useMaintenanceAcceptanceByGiamDinhQuery,
  useMaintenanceAcceptanceVehicleByGiamDinhQuery,
} from "../../../mutation";
import {
  useBienPhapMayMocByGiamDinhQuery,
} from "../../../mutation/MachineMeasure";
import {
  useBienPhapPhuongTienByGiamDinhQuery,
} from "../../../mutation/VehicleMeasure";
import { BienPhapRow } from "./BienPhapRow";
import { AcceptanceRow } from "./AcceptanceRow";
import InspectionRecordDialog from "../../dialog/InspectionRecordDialog";
import InspectionRecordVehicleDialog from "../../dialog/InspectionRecordVehicleDialog";
import BienPhapMayMocDialog from "../../dialog/BienPhapMayMocDialog";
import BienPhapPhuongTienDialog from "../../dialog/BienPhapPhuongTienDialog";
import AcceptanceTestDialog from "../../dialog/AcceptanceTestDialog";
import NghiemThuPhuongTienDialog from "../../dialog/NghiemThuPhuongTienDialog";
import { AssetGroup } from "../../../../../utils/const";
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

  const hasBienPhapMachineDraft = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return !!tab?.formData?.[`bienPhapMayMocDraft_${inspection.id}`];
  });
  
  const hasBienPhapVehicleDraft = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return !!tab?.formData?.[`bienPhapPhuongTienDraft_${inspection.id}`];
  });

  const hasAcceptanceMachineDraft = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return !!tab?.formData?.[`acceptanceDraft_${inspection.id}`];
  });

  const hasAcceptanceVehicleDraft = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t: any) => t.path === tabPath);
    return !!tab?.formData?.[`acceptanceVehicleDraft_${inspection.id}`];
  });

  const { data: bienPhapMachine = [] } = useBienPhapMayMocByGiamDinhQuery(
    isMachine && expanded ? inspection.id : ""
  );
  const { data: bienPhapVehicle = [] } = useBienPhapPhuongTienByGiamDinhQuery(
    !isMachine && expanded ? inspection.id : ""
  );

  const { data: acceptanceMachine = [] } = useMaintenanceAcceptanceByGiamDinhQuery(
    isMachine && expanded ? inspection.id : ""
  );
  const { data: acceptanceVehicle = [] } = useMaintenanceAcceptanceVehicleByGiamDinhQuery(
    !isMachine && expanded ? inspection.id : ""
  );

  const bienPhaps = isMachine ? bienPhapMachine : bienPhapVehicle;
  const directAcceptances = (isMachine ? acceptanceMachine : acceptanceVehicle).filter(
    (acc: any) => !acc.idBienPhapMayMoc && !acc.idBienPhapPhuongTien
  );

  const { deleteMutation: deleteInspMachine } = useMaintenanceInspectionMutation();
  const { deleteMutation: deleteInspVehicle } = useMaintenanceVehicleInspectionMutation();

  const isDraft = inspection.trangThai === 0;
  const canAddBienPhap =
    inspection.trangThai === 3 &&
    (!inspection.daCoBienPhap || inspection.daCoBienPhap === 0) &&
    (!inspection.daCoNghiemThu || inspection.daCoNghiemThu === 0);

  const hasChildren =
    (inspection.daCoBienPhap && inspection.daCoBienPhap > 0) ||
    (inspection.daCoNghiemThu && inspection.daCoNghiemThu > 0) ||
    bienPhaps.length > 0 ||
    directAcceptances.length > 0;

  const handleDelete = () => {
    const mut = isMachine ? deleteInspMachine : deleteInspVehicle;
    mut.mutateAsync(inspection.id);
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
            {inspection.soPhieu}
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
            addTooltip="Tạo Biện pháp sửa chữa"
            addColor="error"
            onAdd2={() => setAddAcceptanceDialogOpen(true)}
            isAdd2={canAddBienPhap} // same condition
            addTooltip2="Tạo BB Nghiệm thu"
            addColor2="warning"
            isEdit={isDraft}
            onEdit={() => setEditDialogOpen(true)}
            editTooltip="Chỉnh sửa BB Giám định"
            editColor="primary"
            isDelete={isDraft}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      {expanded &&
        bienPhaps.map((bp: any, idx: number) => (
          <BienPhapRow
            key={bp.id}
            bienPhap={bp}
            depth={depth + 1}
            isLast={idx === bienPhaps.length - 1 && directAcceptances.length === 0}
            plan={plan}
            inspection={inspection}
            useConnector={useConnector}
            isMachine={isMachine}
          />
        ))}

      {expanded &&
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
        ))}

      {editDialogOpen && (
        isMachine ? (
          <InspectionRecordDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            plan={plan}
            repairRequest={parentReq}
            incidentInspection={parentReq} // if it's an incident
            initData={inspection}
          />
        ) : (
          <InspectionRecordVehicleDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            plan={plan}
            repairRequest={parentReq}
            incidentInspection={parentReq} // if it's an incident
            initData={inspection}
          />
        )
      )}

      {addBienPhapDialogOpen && (
        isMachine ? (
          <BienPhapMayMocDialog
            open={addBienPhapDialogOpen}
            onClose={() => setAddBienPhapDialogOpen(false)}
            inspectionRecord={inspection}
            initData={null}
          />
        ) : (
          <BienPhapPhuongTienDialog
            open={addBienPhapDialogOpen}
            onClose={() => setAddBienPhapDialogOpen(false)}
            inspectionRecord={inspection}
            initData={null}
          />
        )
      )}

      {addAcceptanceDialogOpen && (
        isMachine ? (
          <AcceptanceTestDialog
            open={addAcceptanceDialogOpen}
            onClose={() => setAddAcceptanceDialogOpen(false)}
            inspectionRecord={inspection}
            initData={null}
          />
        ) : (
          <NghiemThuPhuongTienDialog
            open={addAcceptanceDialogOpen}
            onClose={() => setAddAcceptanceDialogOpen(false)}
            inspectionRecord={inspection}
            initData={null}
          />
        )
      )}

      {lastMinimizedDialog === "bienPhapMayMoc" && hasBienPhapMachineDraft && (
        <DraftIndicator onClick={() => setAddBienPhapDialogOpen(true)} />
      )}
      {lastMinimizedDialog === "bienPhapPhuongTien" && hasBienPhapVehicleDraft && (
        <DraftIndicator onClick={() => setAddBienPhapDialogOpen(true)} />
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
