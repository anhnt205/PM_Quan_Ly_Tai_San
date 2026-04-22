import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  initialAnnualPlans, initialWorkOrders, initialInspections,
  initialMaterialRequests, initialAcceptances,
  type AnnualPlan, type WorkOrder, type InspectionReport,
  type MaterialRequest, type AcceptanceRecord,
} from '../mockdata/mockWorkflow';
import { initialIncidentReports, type IncidentReport } from '../mockdata/mockIncidentReports';
import { initialIncidentInspectionRecords, type IncidentInspectionRecord } from '../mockdata/mockIncidentInspection';
import { devices as allDevices } from '../mockdata/mockDevices';
import { initialRepairRequests, type RepairRequest } from '../mockdata/mockRepairRequests';
import { type TechnicalInspectionRecord, type AcceptanceTestRecord, type MaterialQualityRecord, initialInspectionRecords, initialAcceptanceTestRecords, initialMaterialQualityRecords } from '../mockdata/mockInspectionRecords';

interface CmmsState {
  annualPlans: AnnualPlan[];
  workOrders: WorkOrder[];
  inspections: InspectionReport[];
  materialRequests: MaterialRequest[];
  acceptances: AcceptanceRecord[];
  repairRequests: RepairRequest[];
  inspectionRecords: TechnicalInspectionRecord[];
  acceptanceTestRecords: AcceptanceTestRecord[];
  materialQualityRecords: MaterialQualityRecord[];
  incidentReports: IncidentReport[];
  incidentInspectionRecords: IncidentInspectionRecord[];
  selectedDeviceId: string | null;
  addMaterialQualityRecord: (record: MaterialQualityRecord) => void;
  addIncidentReport: (rec: IncidentReport) => void;
  addIncidentInspectionRecord: (record: IncidentInspectionRecord) => void;
  setSelectedDeviceId: (id: string | null) => void;
  approvePlan: (planId: string) => void;
  addAnnualPlan: (plan: AnnualPlan) => void;
  addRepairRequest: (req: RepairRequest) => void;
  addInspectionRecord: (record: TechnicalInspectionRecord) => void;
  addAcceptanceTestRecord: (record: AcceptanceTestRecord) => void;
  signRepairRequests: (ids: string[]) => void;
  signInspectionRecords: (ids: string[]) => void;
  signAcceptanceRecords: (ids: string[]) => void;
  signMaterialQualityRecords: (ids: string[]) => void;
  signIncidentReports: (ids: string[]) => void;
  signIncidentInspectionRecords: (ids: string[]) => void;
}

const CmmsContext = createContext<CmmsState | null>(null);

export const useCmms = () => {
  const ctx = useContext(CmmsContext);
  if (!ctx) throw new Error('useCmms must be inside CmmsProvider');
  return ctx;
};

export const CmmsProvider = ({ children }: { children: ReactNode }) => {
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>(initialAnnualPlans);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [inspections, setInspections] = useState<InspectionReport[]>(initialInspections);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>(initialMaterialRequests);
  const [acceptances, setAcceptances] = useState<AcceptanceRecord[]>(initialAcceptances);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>(initialRepairRequests);
  const [inspectionRecords, setInspectionRecords] = useState<TechnicalInspectionRecord[]>(initialInspectionRecords);
  const [acceptanceTestRecords, setAcceptanceTestRecords] = useState<AcceptanceTestRecord[]>(initialAcceptanceTestRecords);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [materialQualityRecords, setMaterialQualityRecords] = useState<MaterialQualityRecord[]>(initialMaterialQualityRecords);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(initialIncidentReports);
  const [incidentInspectionRecords, setIncidentInspectionRecords] = useState<IncidentInspectionRecord[]>(initialIncidentInspectionRecords);

  const approvePlan = useCallback((planId: string) => {
    setAnnualPlans(prev => prev.map(p =>
      p.id === planId
        ? { ...p, status: 'da-duyet' as const, approvedDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    const plan = annualPlans.find(p => p.id === planId);
    if (plan) {
      const newOrders: WorkOrder[] = plan.deviceIds.map((deviceId, idx) => {
        const device = allDevices.find(d => d.id === deviceId);
        return {
          id: `SC-${planId.replace('KH-', '')}-${String(idx + 1).padStart(2, '0')}`,
          planId: plan.id,
          deviceId,
          deviceName: device?.name || deviceId,
          type: 'Sửa chữa thường xuyên',
          status: 'cho-duyet' as const,
          createdDate: new Date().toISOString().split('T')[0],
          assignedTo: ['Nguyễn Văn A', 'Trần Văn B', 'Lê Văn C', 'Phạm Văn D'][idx % 4],
          description: `Tự động tạo từ kế hoạch ${plan.id}`,
        };
      });
      setWorkOrders(prev => [...prev, ...newOrders]);
    }
  }, [annualPlans]);

  const addAnnualPlan = useCallback((plan: AnnualPlan) => {
    setAnnualPlans(prev => [...prev, plan]);
  }, []);

  const addRepairRequest = useCallback((req: RepairRequest) => {
    setRepairRequests(prev => [...prev, req]);
  }, []);

  const addInspectionRecord = useCallback((record: TechnicalInspectionRecord) => {
    setInspectionRecords(prev => [...prev, record]);
  }, []);

  const addAcceptanceTestRecord = useCallback((record: AcceptanceTestRecord) => {
    setAcceptanceTestRecords(prev => [...prev, record]);
  }, []);

  const addMaterialQualityRecord = useCallback((record: MaterialQualityRecord) => {
    setMaterialQualityRecords(prev => [...prev, record]);
  }, []);

  const addIncidentReport = useCallback((rec: IncidentReport) => {
    setIncidentReports(prev => [...prev, rec]);
  }, []);

  const addIncidentInspectionRecord = useCallback((record: IncidentInspectionRecord) => {
    setIncidentInspectionRecords(prev => [...prev, record]);
  }, []);

  const signRepairRequests = useCallback((ids: string[]) => {
    const now = new Date().toLocaleDateString('vi-VN');
    setRepairRequests(prev => prev.map(r =>
      ids.includes(r.id) ? {
        ...r,
        status: 'da-duyet' as const,
        signers: r.signers.map(s => ({ ...s, signed: true, signedAt: now })),
      } : r
    ));
  }, []);

  const signInspectionRecords = useCallback((ids: string[]) => {
    const now = new Date().toLocaleDateString('vi-VN');
    setInspectionRecords(prev => prev.map(r =>
      ids.includes(r.id) ? {
        ...r,
        status: 'da-duyet' as const,
        signers: r.signers.map(s => ({ ...s, signed: true, signedAt: now })),
      } : r
    ));
  }, []);

  const signAcceptanceRecords = useCallback((ids: string[]) => {
    const now = new Date().toLocaleDateString('vi-VN');
    setAcceptanceTestRecords(prev => prev.map(r =>
      ids.includes(r.id) ? {
        ...r,
        status: 'da-duyet' as const,
        signers: r.signers.map(s => ({ ...s, signed: true, signedAt: now })),
      } : r
    ));
  }, []);

  const signMaterialQualityRecords = useCallback((ids: string[]) => {
    const now = new Date().toLocaleDateString('vi-VN');
    setMaterialQualityRecords(prev => prev.map(r =>
      ids.includes(r.id) ? {
        ...r,
        status: 'da-duyet' as const,
        signers: r.signers.map(s => ({ ...s, signed: true, signedAt: now })),
      } : r
    ));
  }, []);

  const signIncidentReports = useCallback((ids: string[]) => {
    const now = new Date().toLocaleDateString('vi-VN');
    setIncidentReports(prev => prev.map(r =>
      ids.includes(r.id) ? { 
        ...r, 
        status: 'da-duyet', 
        signers: (r.signers || []).map((s: any) => ({ ...s, signed: true, signedAt: now })) 
      } : r
    ));
  }, []);

  const signIncidentInspectionRecords = useCallback((ids: string[]) => {
    const now = new Date().toLocaleDateString('vi-VN');
    setIncidentInspectionRecords(prev => prev.map(r =>
      ids.includes(r.id) ? {
        ...r,
        status: 'da-duyet' as const,
        signers: r.signers.map((s: any) => ({ ...s, signed: true, signedAt: now })),
      } : r
    ));
  }, []);

  return (
    <CmmsContext.Provider value={{
      annualPlans, workOrders, inspections, materialRequests, acceptances,
      repairRequests, inspectionRecords, acceptanceTestRecords,
      selectedDeviceId, materialQualityRecords, incidentReports, incidentInspectionRecords,
      addMaterialQualityRecord, addIncidentReport, addIncidentInspectionRecord, setSelectedDeviceId,
      approvePlan, addAnnualPlan, addRepairRequest,
      addInspectionRecord, addAcceptanceTestRecord,
      signRepairRequests, signInspectionRecords,
      signAcceptanceRecords, signMaterialQualityRecords, signIncidentReports, signIncidentInspectionRecords,
    }}>
      {children}
    </CmmsContext.Provider>
  );
};