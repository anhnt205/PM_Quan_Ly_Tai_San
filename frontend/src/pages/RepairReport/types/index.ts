export interface BienBanSuaChua {
  id?: string;
  ma: string;
  ten: string;
  congTy?: string;
  macDinh: boolean;
  loaiBienBan: string; // key mapping đến hàm generate
}
