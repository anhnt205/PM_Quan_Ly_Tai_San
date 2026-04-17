export type MaintenanceLevel = "" | "CST" | "SCN" | "SCC";

export const maintenanceLevelLabels: Record<MaintenanceLevel, string> = {
  "": "Không",
  CST: "Chăm sóc",
  SCN: "SC nhỏ",
  SCC: "SC lớn",
};

export const maintenanceLevelColors: Record<string, string> = {
  "": "transparent",
  CST: "#e8f5e9",
  SCN: "#fff3e0",
  SCC: "#fce4ec",
};
export interface PlanSigner {
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  order: number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"; // thêm ?
  signed: boolean;
  signedAt?: string;
}

export interface MaintenancePlanDetail {
  id: string;
  sourceDepartmentId: string;
  sourceDepartmentName: string;
  executionDepartmentId: string;
  executionDepartmentName: string;
  assetIds: string[];
  monthlySchedule: Record<string, MaintenanceLevel[]>; // deviceId -> 12 months
  signers: PlanSigner[];
  status: "draft" | "pending-approval" | "approved" | "rejected";
  createdDate: string;
  createdBy: string;
}

export const signaturePositions = [
  { value: "top-left", label: "Trên - Trái" },
  { value: "top-center", label: "Trên - Giữa" },
  { value: "top-right", label: "Trên - Phải" },
  { value: "bottom-left", label: "Dưới - Trái" },
  { value: "bottom-center", label: "Dưới - Giữa" },
  { value: "bottom-right", label: "Dưới - Phải" },
] as const;

export const months = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];
