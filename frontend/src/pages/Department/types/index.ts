export interface DepartmentType {
  Id: string;
  UnitGroupId?: string;
  DepartmentName: string;
  ManagerId?: string;
  CompanyId: string;
  ParentDepartment?: string;
  ColorCode?: string;
  IsActive: number;
  IsStore?: number;
  WarehouseType?: number;
  IsLeader?: number;
}
