import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { Close, PictureAsPdf } from "@mui/icons-material";
import AssetEbookContent from "./AssetEbookContent";

const AssetEbookModal = ({
  open,
  onClose,
  onEdit,
  onCancel,
  selectedAsset,
  readOnly,
  onSave,
  allAssetModel,
  allCurrentStatus,
  assetGroups,
  allDepartments,
  allUnits,
  allReasonIncreases,
}: {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
  selectedAsset?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  allAssetModel: any[];
  allCurrentStatus: any[];
  assetGroups: any[];
  allDepartments: any[];
  allUnits: any[];
  allReasonIncreases: any[];
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#e8e0d0",
        },
      }}
    >
      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        <AssetEbookContent
          selectedAsset={selectedAsset}
          readOnly={readOnly}
          onEdit={onEdit}
          onCancel={onCancel}
          onClose={onClose}
          onSave={onSave}
          allAssetModel={allAssetModel}
          allCurrentStatus={allCurrentStatus}
          assetGroups={assetGroups}
          allDepartments={allDepartments}
          allUnits={allUnits}
          allReasonIncreases={allReasonIncreases}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AssetEbookModal;
