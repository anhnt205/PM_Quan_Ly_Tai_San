// Utility to manage MaintenanceRepairType data in localStorage

const STORAGE_KEY = "maintenanceRepairTypes";

export const getMaintenanceRepairTypesFromStorage = (): any[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveMaintenanceRepairTypesToStorage = (data: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Hook to use MaintenanceRepairTypes data
import { useState, useEffect } from "react";

export const useMaintenanceRepairTypes = () => {
  const [repairTypes, setRepairTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getMaintenanceRepairTypesFromStorage();
    setRepairTypes(data);
    setIsLoading(false);
  }, []);

  return { repairTypes, isLoading };
};
