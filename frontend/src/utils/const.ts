export const MessageTypeFunctions = {
  ASSET_TRANSFER: "ASSET_TRANSFER",
  ASSET_HANDOVER: "ASSET_HANDOVER",
  TOOL_TRANSFER: "TOOL_TRANSFER",
  TOOL_HANDOVER: "TOOL_HANDOVER",
  ALL_FUNCTION: "ALL_FUNCTION",
  REPAIR: "REPAIR",
  PLAN: "PLAN",
  INCIDENT: "INCIDENT",
  INCIDENT_INSPECTION: "INCIDENT_INSPECTION",
  INSPECTION: "INSPECTION",
  MATERIAL: "MATERIAL",
  ACCEPTANCE_TEST: "ACCEPTANCE_TEST",
  MEASURE: "MEASURE",
};
export const MessageTypeActions = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export const Devicetype = {
  ASSET: "TAI_SAN",
  TOOL: "CCDC",
};
export const PlanType = {
  DEVICE: "THIET_BI",
  WORK: "CHU_KY",
  TIME: "GIO_MAY",
};

export const CongTy = {
  CT001: "CT001",
};

export const Action = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export type ActionType = (typeof Action)[keyof typeof Action];

export const StatusPlan = {
  PENDING: "CHUA_THUC_HIEN",
  PROGRESS: "DANG_THUC_HIEN",
  COMPLETED: "DA_HOAN_THANH",
};
export type StatusPlanType = (typeof StatusPlan)[keyof typeof StatusPlan];

export const TypeBienBan = {
  SUA_CHUA: "sua_chua",
  SU_CO: "su_co",
};
export type TypeBienBanType = (typeof TypeBienBan)[keyof typeof TypeBienBan];

export const AssetGroup = {
  MAYMOC: "MAY_MOC",
  PHUONGTIEN: "PHUONG_TIEN",
};
export type AssetGroupType = (typeof AssetGroup)[keyof typeof AssetGroup];

export const BIEN_PHAP_XU_LY = {
  PHUC_HOI: "Phục hồi",
  PHE_LIEU: "Phế liệu",
  HUY: "Hủy",
} as const;