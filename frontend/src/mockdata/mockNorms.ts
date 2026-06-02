import type { MaintenanceLevel } from './mockPlans';

export interface NormMaterial {
  name: string;
  quantity: number;
  unit: string;
}

export interface MaintenanceNorm {
  id: string;
  level: MaintenanceLevel;
  levelName: string;
  description: string;
  materials: NormMaterial[];
}

// Định mức theo loại sửa chữa — mỗi loại SC có danh sách vật tư cần thiết
export const maintenanceNorms: MaintenanceNorm[] = [
  {
    id: 'DM-CST',
    level: 'CST',
    levelName: 'Chăm sóc thường xuyên',
    description: 'Bảo dưỡng nhỏ: kiểm tra, bôi trơn, vệ sinh thiết bị',
    materials: [
      { name: 'Dầu bôi trơn', quantity: 20, unit: 'lít' },
      { name: 'Mỡ bò', quantity: 5, unit: 'kg' },
      { name: 'Giẻ lau', quantity: 10, unit: 'kg' },
      { name: 'Lọc gió', quantity: 1, unit: 'cái' },
    ],
  },
  {
    id: 'DM-SCN',
    level: 'SCN',
    levelName: 'Sửa chữa nhỏ',
    description: 'Thay thế các chi tiết hao mòn, kiểm tra hệ thống chính',
    materials: [
      { name: 'Dầu bôi trơn', quantity: 50, unit: 'lít' },
      { name: 'Dầu thủy lực', quantity: 100, unit: 'lít' },
      { name: 'Lọc dầu', quantity: 2, unit: 'cái' },
      { name: 'Lọc gió', quantity: 2, unit: 'cái' },
      { name: 'Phớt chắn dầu', quantity: 4, unit: 'cái' },
      { name: 'Bu lông M16', quantity: 20, unit: 'cái' },
      { name: 'Giẻ lau', quantity: 15, unit: 'kg' },
    ],
  },
  {
    id: 'DM-SCC',
    level: 'SCC',
    levelName: 'Sửa chữa lớn (Đại tu)',
    description: 'Đại tu toàn bộ: tháo rời, kiểm tra, thay thế các cụm chi tiết chính',
    materials: [
      { name: 'Dầu bôi trơn', quantity: 100, unit: 'lít' },
      { name: 'Dầu thủy lực', quantity: 200, unit: 'lít' },
      { name: 'Lọc dầu', quantity: 4, unit: 'cái' },
      { name: 'Lọc gió', quantity: 4, unit: 'cái' },
      { name: 'Lọc nhiên liệu', quantity: 4, unit: 'cái' },
      { name: 'Phớt chắn dầu', quantity: 8, unit: 'cái' },
      { name: 'Vòng bi', quantity: 4, unit: 'bộ' },
      { name: 'Dây curoa', quantity: 2, unit: 'bộ' },
      { name: 'Bu lông M16', quantity: 50, unit: 'cái' },
      { name: 'Đệm cao su', quantity: 10, unit: 'cái' },
      { name: 'Giẻ lau', quantity: 30, unit: 'kg' },
      { name: 'Que hàn', quantity: 20, unit: 'kg' },
    ],
  },
];

/**
 * Tính tổng vật tư cho một kế hoạch năm dựa trên lịch bảo dưỡng hàng tháng.
 * monthlySchedule: Record<deviceId, MaintenanceLevel[]> (12 phần tử)
 */
export function calculatePlanMaterials(
  monthlySchedule: Record<string, (MaintenanceLevel | string)[]>
): { name: string; quantity: number; unit: string }[] {
  const totals: Record<string, { quantity: number; unit: string }> = {};

  Object.values(monthlySchedule).forEach(months => {
    months.forEach(level => {
      if (!level || level === '') return;
      const norm = maintenanceNorms.find(n => n.level === level);
      if (!norm) return;
      norm.materials.forEach(mat => {
        if (totals[mat.name]) {
          totals[mat.name].quantity += mat.quantity;
        } else {
          totals[mat.name] = { quantity: mat.quantity, unit: mat.unit };
        }
      });
    });
  });

  return Object.entries(totals).map(([name, v]) => ({
    name,
    quantity: v.quantity,
    unit: v.unit,
  }));
}
