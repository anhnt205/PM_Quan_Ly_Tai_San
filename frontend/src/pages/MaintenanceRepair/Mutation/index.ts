import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import {
  Action,
  CongTy,
  MessageTypeFunctions,
  StatusPlan,
} from "../../../utils/const";
import {
  MaintenanceAssetItem,
  MaintenanceCCDCItem,
  MaintenanceRepairData,
  MaintenanceRepairResultData,
  MaintenanceResultAssetItem,
  MaintenanceResultCCDCItem,
  SignaturesData,
  Signer,
} from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import dayjs from "dayjs";
import { listNguoiKy } from "../config";
import socketService from "../../../services/socketService";
import { useAssetManagerMutation } from "../../AssetManager/Mutation";
import { generateCode } from "../../../utils/helpers";
import { useToolManagerMutation } from "../../ToolManager/Mutation";
import { useMaintenancePlanningMutation } from "../../MainenancePlanRepair/Mutation";

export const useMaintenanceRepairPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  userId?: string,
) => {
  return useQuery({
    queryKey: ["maintenanceRepairPage", page, pageSize, searchValue, trangThai],
    queryFn: async () => {
      const res = await api.get("/suachua", {
        params: {
          idCongTy: CongTy.CT001,
          page: page,
          size: pageSize,
          search: searchValue,
          trangThai: trangThai,
          userId,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useMaintenanceRepairAllQuery = () => {
  return useQuery({
    queryKey: ["maintenanceRepairAll"],
    queryFn: async () => {
      const res = await api.get("/sua_chua_bao_duong", {
        params: {
          idcongty: CongTy.CT001,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const getAssetMaintenanceQuery = (id: string) => {
  return useQuery({
    queryKey: ["assetMaintenance"],
    queryFn: async () => {
      const res = await api.get(`/suachua-chitiettaisan/by-suachua/${id}`);
      return res.data.data;
    },
    placeholderData: (previousData) => previousData,
    enabled: !!id,
  });
};

export const getToolMaintenanceQuery = (id: string) => {
  return useQuery({
    queryKey: ["toolMaintenance"],
    queryFn: async () => {
      const res = await api.get(`/suachua-vattutieuhao/by-suachua/${id}`);
      return res.data.data;
    },
    placeholderData: (previousData) => previousData,
    enabled: !!id,
  });
};

export const useMaintenanceRepairMutation = () => {
  const queryClient = useQueryClient();
  const idCongTy = CongTy.CT001;
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  const createMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairData) => {
      const res = await api.post("/suachua", {
        ...data,
        ngayTao: now,
        nguoiTao: user?.taiKhoan?.tenDangNhap,
      });
      return res.data;
    },
    onSuccess: async (response, data) => {
      const idSCBD = response.id;
      if (data.danhSachTaiSan && data.danhSachTaiSan.length > 0) {
        createMaintenanceRepairAssetManyMutation.mutate(
          data.danhSachTaiSan?.map((item) => ({
            ...item,
            idSuaChua: idSCBD,
          })),
        );
      }
      if (data.danhSachVatTu && data.danhSachVatTu.length > 0) {
        createMaintenanceRepairToolManyMutation.mutate(
          data.danhSachVatTu?.map((item) => ({
            ...item,
            idSuaChua: idSCBD,
          })),
        );
      }
      if (data.nguoiKyList && data.nguoiKyList.length > 0) {
        updateSignerMutation.mutate({
          idTaiLieu: idSCBD,
          data: data.nguoiKyList.map((item) => ({
            ...item,
            idTaiLieu: idSCBD,
          })),
        });
      }
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.MAINTENANCE,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });

      showSuccessAlert("Tạo phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo phiếu sửa chữa thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairData) => {
      const res = await api.put(`/suachua/${data.id}`, {
        ...data,
        ngayCapNhat: now,
        nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
      });
      return res.data;
    },
    onSuccess: async (response, data) => {
      if (data.initialTaiSan && data.initialTaiSan.length > 0) {
        deleteMaintenanceRepairAssetManyMutation.mutate(data.initialTaiSan);
      }
      if (data.initialVatTu && data.initialVatTu.length > 0) {
        deleteMaintenanceRepairToolItemManyMutation.mutate(data.initialVatTu);
      }
      if (data.danhSachTaiSan && data.danhSachTaiSan.length > 0) {
        createMaintenanceRepairAssetManyMutation.mutate(
          data.danhSachTaiSan.map((item) => ({
            ...item,
            idSuaChua: data.id,
            idKeHoachSuaChua: data.idKeHoach,
          })),
        );
      }
      if (data.danhSachVatTu && data.danhSachVatTu.length > 0) {
        createMaintenanceRepairToolManyMutation.mutate(
          data.danhSachVatTu.map((item) => ({
            ...item,
            idSuaChua: data.id,
            idKeHoachSuaChua: data.idKeHoach,
          })),
        );
      }
      if (data.nguoiKyList && data.nguoiKyList.length > 0 && data.id) {
        updateSignerMutation.mutate({
          idTaiLieu: data.id,
          data: data.nguoiKyList.map((item) => ({
            ...item,
            idTaiLieu: data.id,
          })),
        });
      }
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.MAINTENANCE,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });
      showSuccessAlert("Sửa phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa phiếu sửa chữa thất bại",
      );
    },
  });
  const updateManyMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairData[]) => {
      const res = await api.put(`/suachua/bulk`, data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });
      console.log("Sửa phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Sửa phiếu sửa chữa thất bại",
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.delete(`/suachua/${data.id}`);
      return res.data;
    },
    onSuccess: async (_, data) => {
      deleteSignerMutation.mutate(data.id);
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.MAINTENANCE,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });
      showSuccessAlert("Xóa phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa phiếu sửa chữa thất bại",
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/suachua/bulk`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });
      showSuccessAlert(data || "Xóa phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa phiếu sửa chữa thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/suachua/${data.id}/huy`);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });
      deleteSignerMutation.mutate(data.id);
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.MAINTENANCE,
        recieve: list,
      });
      showSuccessAlert("Hủy phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Hủy phiếu sửa chữa thất bại",
      );
    },
  });

  // chi tiết sửa chữa tài sản

  const createMaintenanceRepairAssetManyMutation = useMutation({
    mutationFn: async (data: MaintenanceAssetItem[]) => {
      const res = await api.post("/suachua-chitiettaisan/batch", data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });

      console.log("Tạo chi tiết tài sản sửa chữa thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết tài sản sửa chữa thất bại",
      );
    },
  });
  const deleteMaintenanceRepairAssetManyMutation = useMutation({
    mutationFn: async (data: string[]) => {
      const res = await api.delete("/suachua-chitiettaisan/batch", { data });
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });

      console.log("Tạo chi tiết phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết phiếu sửa chữa thất bại",
      );
    },
  });

  //chi tiết vật tư tiêu hao
  const createMaintenanceRepairToolManyMutation = useMutation({
    mutationFn: async (data: MaintenanceCCDCItem[]) => {
      const res = await api.post("/suachua-vattutieuhao/batch", data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });

      console.log("Tạo vật tư tiêu hao thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo vật tư tiêu hao thất bại",
      );
    },
  });
  const deleteMaintenanceRepairToolItemManyMutation = useMutation({
    mutationFn: async (data: string[]) => {
      const res = await api.delete("/suachua-vattutieuhao/batch", { data });
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });

      console.log("Xóa vật tư tiêu hao thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa vật tư tiêu hao thất bại",
      );
    },
  });

  // nguoi ky
  const createSignerMutation = useMutation({
    mutationFn: async (data: Signer) => {
      const res = await api.post("/chuky/nguoi-ky", data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });

      console.log("Tạo người ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo người ký thất bại",
      );
    },
  });
  const updateSignerMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      data,
    }: {
      idTaiLieu: string;
      data: Signer[];
    }) => {
      const res = await api.put(`/chuky/nguoi-ky/update/${idTaiLieu}`, data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });

      console.log("Cập nhật người ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật người ký thất bại",
      );
    },
  });
  const deleteSignerMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/chuky/${id}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });

      console.log("Xóa người ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa người ký thất bại",
      );
    },
  });

  const getByIdMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/chitiet-suachua/${id}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      console.log("Lấy chi tiết phiếu sửa chữahành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Lấy chi tiết phiếu sửa chữan thất bại",
      );
      return null;
    },
  });

  // list chu ky theo tai lieu
  const handleSignatureList = async (idTaiLieu: string) => {
    if (!idTaiLieu) return;
    try {
      // Encode tên file để xử lý ký tự đặc biệt
      const response = await api.get(`/chuky/${idTaiLieu}`);
      // response.data lúc này là một đối tượng Blob (Binary Large Object)
      return response.data;
    } catch (error) {
      console.log("Không thể tải chữ ký");
      return null;
    }
  };

  // ky tai lieu
  const signMutation = useMutation({
    mutationFn: async ({
      SignaturesData,
      asset,
    }: {
      SignaturesData: SignaturesData[];
      asset: any;
    }) => {
      const res = await api.post("/chuky", SignaturesData);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });
      data.SignaturesData.forEach((item) => {
        signStatusMutation.mutate({
          idTaiLieu: item.idTaiLieu,
          userId: item.idNguoiKy,
          repair: data.asset,
        });
      });
      const list = await listNguoiKy([data.asset]);
      socketService.send({
        type: MessageTypeFunctions.MAINTENANCE,
        recieve: list,
      });
      showSuccessAlert("Ký thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Ký thất bại",
      );
    },
  });

  // cap nhat trang thai ky
  // ky tai lieu
  const { createManyHistoryAssetMutation, updateAssetOwnershipMutation } =
    useAssetManagerMutation();
  const { updateStatusPlanMutation } = useMaintenancePlanningMutation();

  const {
    createManyHistoryToolMutation,
    updateAssetOwnershipMutation: updateAssetOwnershipMutationTool,
  } = useToolManagerMutation();
  const signStatusMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      userId,
      repair,
    }: {
      idTaiLieu: string;
      userId: string;
      repair: MaintenanceRepairData;
    }) => {
      const res = await api.post(
        `/suachua/capnhattrangthai?id=${idTaiLieu}&userId=${userId}`,
      );
      return res.data.data;
    },
    onSuccess: (response, data) => {
      if (response === 3) {
        updateStatusPlanMutation.mutate({
          id: data.repair.idKeHoach,
          status: StatusPlan.PROGRESS,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["maintenanceRepairPage"] });

      console.log("Cập nhật trạng thái ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật trạng thái ký thất bại",
      );
    },
  });

  const handleAssetByDonVi = async (loai: number, idDonViGiao: string) => {
    try {
      // Encode tên file để xử lý ký tự đặc biệt
      const res = await api.get(
        loai === 1
          ? "/taisan/by-donvi-bandau/paged"
          : "/taisan/by-donvi-hienthoi/paged",
        {
          params: {
            idcongty: CongTy.CT001,
            page: 0,
            size: 999,
            ...(loai === 1
              ? {
                  iddonvibandau: idDonViGiao,
                }
              : { iddonvihienthoi: idDonViGiao }),
          },
        },
      );
      return res.data.data || res.data;
    } catch (error) {
      console.log("Không thể lấy dữ liệu");
      return { items: [] };
    }
  };

  //download file
  const handleDownloadFile = async (fileName: string) => {
    if (!fileName) return;
    try {
      // Encode tên file để xử lý ký tự đặc biệt
      const encodedFileName = encodeURIComponent(fileName);
      const response = await api.get(`/upload/download/${encodedFileName}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showErrorAlert("Không thể tải tập tin");
    }
  };
  //priview
  const handlePreview = async (fileName: string) => {
    if (!fileName) return;
    try {
      // Encode tên file để xử lý ký tự đặc biệt
      const encodedFileName = encodeURIComponent(fileName);
      const response = await api.get(`/upload/preview/${encodedFileName}`, {
        responseType: "blob",
        withCredentials: false,
      });
      // response.data lúc này là một đối tượng Blob (Binary Large Object)
      return response.data;
    } catch (error) {
      console.log("Không thể tải tập tin");
      return null;
    }
  };

  // convert doc to execl

  const convertDocxToPdf = async (file: File) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(`/upload/convert/docx-to-pdf`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });
      const data = response.data;
      // response.data lúc này là một đối tượng Blob (Binary Large Object)
      return data;
    } catch (error) {
      showErrorAlert("Không thể tải tập tin");
      return null;
    }
  };

  // upload file
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.message;
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ["staffsPage"] });
      // showSuccessAlert(data || "Xóa nhân viên thành công");
    },
    onError: (error: any) => {
      console.log(error);
      // showErrorAlert(
      //   error.response?.data?.message ||
      //     error.message ||
      //     "Xóa nhân viên thất bại"
      // );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    handleDownloadFile,
    handlePreview,
    convertDocxToPdf,
    cancelMutation,
    updateManyMutation,
    handleSignatureList,
    signMutation,
    handleAssetByDonVi,
    getByIdMutation,
  };
};

export const useMaintenanceRepairResultPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  userId?: string,
) => {
  return useQuery({
    queryKey: [
      "maintenanceRepairResultPage",
      page,
      pageSize,
      searchValue,
      trangThai,
    ],
    queryFn: async () => {
      const res = await api.get("/ketqua-suachua", {
        params: {
          idCongTy: CongTy.CT001,
          page: page,
          size: pageSize,
          search: searchValue,
          trangThai: trangThai,
          userId,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useMaintenanceRepairResultMutation = () => {
  const queryClient = useQueryClient();
  const idCongTy = CongTy.CT001;
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  const createMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairResultData) => {
      const res = await api.post("/ketqua-suachua", data, {
        params: {
          userId: user?.taiKhoan?.tenDangNhap,
        },
      });
      return res.data;
    },
    onSuccess: async (response, data) => {
      const idKQSC = response.id;
      if (data.chiTietTaiSanList && data.chiTietTaiSanList.length > 0) {
        data.chiTietTaiSanList?.forEach((item) => {
          createMaintenanceRepairDetailMutation.mutate({
            ...item,
            idKetQuaSuaChua: idKQSC,
          });
        });
      }

      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.MAINTENANCE,
        recieve: list,
      });
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      showSuccessAlert("Tạo phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo phiếu sửa chữa thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairResultData) => {
      const res = await api.put(`/ketqua-suachua/${data.id}`, data, {
        params: {
          userId: user?.taiKhoan?.tenDangNhap,
        },
      });
      return res.data;
    },
    onSuccess: async (response, data) => {
      const idKQSC = response.id;
      const createChiTietTaiSanList = data.chiTietTaiSanList.filter(
        (item) => item.action === Action.CREATE,
      );
      const updateChiTietTaiSanList = data.chiTietTaiSanList.filter(
        (item) => item.action === Action.UPDATE,
      );
      const deleteChiTietTaiSanList = data.chiTietTaiSanList.filter(
        (item) => item.action === Action.DELETE && item.id,
      );
      if (createChiTietTaiSanList.length > 0) {
        createChiTietTaiSanList?.forEach((item) => {
          createMaintenanceRepairDetailMutation.mutate({
            ...item,
            idKetQuaSuaChua: idKQSC,
          });
        });
      }
      if (updateChiTietTaiSanList.length > 0) {
        updateChiTietTaiSanList?.forEach((item) => {
          updateMaintenanceRepairDetailMutation.mutate({
            ...item,
            idKetQuaSuaChua: idKQSC,
          });
        });
      }
      if (deleteChiTietTaiSanList.length > 0) {
        deleteMaintenanceRepairDetailItemManyMutation.mutate(
          deleteChiTietTaiSanList.map((item) => item.id),
        );
      }

      if (data.nguoiKyList && data.nguoiKyList.length > 0 && data.id) {
        updateSignerMutation.mutate({
          idTaiLieu: data.id,
          data: data.nguoiKyList.map((item) => ({
            ...item,
            idTaiLieu: data.id,
          })),
        });
      }
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.MAINTENANCE,
        recieve: list,
      });
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });
      showSuccessAlert("Sửa phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa phiếu sửa chữa thất bại",
      );
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.delete(`/ketqua-suachua/${data.id}`);
      return res.data;
    },
    onSuccess: async (_, data) => {
      deleteSignerMutation.mutate(data.id);
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.MAINTENANCE,
        recieve: list,
      });
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });
      showSuccessAlert("Xóa phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa phiếu sửa chữa thất bại",
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/ketqua-suachua/bulk`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });
      showSuccessAlert(data || "Xóa phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa phiếu sửa chữa thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/ketqua-suachua/${data.id}/huy`);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });
      deleteSignerMutation.mutate(data.id);
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.MAINTENANCE,
        recieve: list,
      });
      showSuccessAlert("Hủy phiếu sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Hủy phiếu sửa chữa thất bại",
      );
    },
  });

  // chi tiết sửa chữa

  const createMaintenanceRepairDetailMutation = useMutation({
    mutationFn: async (data: MaintenanceResultAssetItem) => {
      const res = await api.post("/ketqua-suachua/chitiet", data, {
        params: {
          userId: user?.taiKhoan?.tenDangNhap,
        },
      });
      return res.data;
    },
    onSuccess: (response, data) => {
      if (data.vatTuList && data.vatTuList.length > 0) {
        createMaintenanceRepairToolManyMutation.mutate(
          data.vatTuList.map((item) => ({
            ...item,
            idKetQuaSuaChua: response.idKetQuaSuaChua,
            idKetQuaSuaChuaChiTiet: response.id,
          })),
        );
      }
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      console.log("Tạo chi tiết phiếu kết quả thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết phiếu kết quả thất bại",
      );
    },
  });
  const updateMaintenanceRepairDetailMutation = useMutation({
    mutationFn: async (data: MaintenanceResultAssetItem) => {
      const res = await api.put(`/ketqua-suachua/chitiet/${data.id}`, data, {
        params: {
          userId: user?.taiKhoan?.tenDangNhap,
        },
      });
      return res.data;
    },
    onSuccess: (response, data) => {
      if (data.vatTuList && data.vatTuList.length > 0) {
        const createChiTietVatTuList = data.vatTuList.filter(
          (item) => item.action === Action.CREATE,
        );
        const updateChiTietVatTuList = data.vatTuList.filter(
          (item) => item.action === Action.UPDATE,
        );
        const deleteChiTietVatTuList = data.vatTuList.filter(
          (item) => item.action === Action.DELETE && item.id,
        );

        if (createChiTietVatTuList.length > 0) {
          createMaintenanceRepairToolManyMutation.mutate(
            createChiTietVatTuList.map((item) => ({
              ...item,
              idKetQuaSuaChua: response.idKetQuaSuaChua,
              idKetQuaSuaChuaChiTiet: response.id,
            })),
          );
        }
        if (updateChiTietVatTuList.length > 0) {
          updateMaintenanceRepairToolManyMutation.mutate(
            updateChiTietVatTuList.map((item) => ({
              ...item,
              idKetQuaSuaChua: response.idKetQuaSuaChua,
              idKetQuaSuaChuaChiTiet: response.id,
            })),
          );
        }
        if (deleteChiTietVatTuList.length > 0) {
          deleteMaintenanceRepairToolManyMutation.mutate(
            deleteChiTietVatTuList.map((item) => item.id),
          );
        }
      }
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      console.log("Tạo chi tiết phiếu kết quả thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết phiếu kết quả thất bại",
      );
    },
  });
  const deleteMaintenanceRepairDetailItemManyMutation = useMutation({
    mutationFn: async (data: string[]) => {
      const res = await api.delete("/ketqua-suachua/chitiet/bulk", { data });
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      console.log("Xóa chi tiết kết quả thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa chi tiết kết quả thất bại",
      );
    },
  });
  // chi tiết vật tư tiêu hao

  const createMaintenanceRepairToolManyMutation = useMutation({
    mutationFn: async (data: MaintenanceResultCCDCItem[]) => {
      const res = await api.post("/ketqua-suachua/chitiet-vattu/bulk", data, {
        params: {
          userId: user?.taiKhoan?.tenDangNhap,
        },
      });
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      console.log("Tạo chi tiết phiếu kết quả thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết phiếu kết quả thất bại",
      );
    },
  });

  const updateMaintenanceRepairToolManyMutation = useMutation({
    mutationFn: async (data: MaintenanceResultCCDCItem[]) => {
      const res = await api.put("/ketqua-suachua/chitiet-vattu/bulk", data, {
        params: {
          userId: user?.taiKhoan?.tenDangNhap,
        },
      });
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      console.log("Sửa chi tiết phiếu kết quả thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Sửa chi tiết phiếu kết quả thất bại",
      );
    },
  });
  const deleteMaintenanceRepairToolManyMutation = useMutation({
    mutationFn: async (data: string[]) => {
      const res = await api.delete("/ketqua-suachua/chitiet/bulk", { data });
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      console.log("Xóa vật tư tiêu hao thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa vật tư tiêu hao thất bại",
      );
    },
  });

  // nguoi ky
  const createSignerMutation = useMutation({
    mutationFn: async (data: Signer) => {
      const res = await api.post("/chuky/nguoi-ky", data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      console.log("Tạo người ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo người ký thất bại",
      );
    },
  });
  const updateSignerMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      data,
    }: {
      idTaiLieu: string;
      data: Signer[];
    }) => {
      const res = await api.put(`/chuky/nguoi-ky/update/${idTaiLieu}`, data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      console.log("Cập nhật người ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật người ký thất bại",
      );
    },
  });
  const deleteSignerMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/chuky/${id}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      console.log("Xóa người ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa người ký thất bại",
      );
    },
  });

  const getByIdMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/chitiet-suachua/${id}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      console.log("Lấy chi tiết phiếu sửa chữahành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Lấy chi tiết phiếu sửa chữan thất bại",
      );
      return null;
    },
  });

  // list chu ky theo tai lieu
  const handleSignatureList = async (idTaiLieu: string) => {
    if (!idTaiLieu) return;
    try {
      // Encode tên file để xử lý ký tự đặc biệt
      const response = await api.get(`/chuky/${idTaiLieu}`);
      // response.data lúc này là một đối tượng Blob (Binary Large Object)
      return response.data;
    } catch (error) {
      console.log("Không thể tải chữ ký");
      return null;
    }
  };

  // ky tai lieu
  const signMutation = useMutation({
    mutationFn: async ({
      SignaturesData,
      asset,
    }: {
      SignaturesData: SignaturesData[];
      asset: any;
    }) => {
      const res = await api.post("/chuky", SignaturesData);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });
      data.SignaturesData.forEach((item) => {
        signStatusMutation.mutate({
          idTaiLieu: item.idTaiLieu,
          userId: item.idNguoiKy,
          repair: data.asset,
        });
      });
      const list = await listNguoiKy([data.asset]);
      socketService.send({
        type: MessageTypeFunctions.MAINTENANCE,
        recieve: list,
      });
      showSuccessAlert("Ký thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Ký thất bại",
      );
    },
  });

  // cap nhat trang thai ky
  // ky tai lieu
  const { createManyHistoryAssetMutation, updateAssetOwnershipMutation } =
    useAssetManagerMutation();
  const { updateStatusPlanMutation } = useMaintenancePlanningMutation();

  const {
    createManyHistoryToolMutation,
    updateAssetOwnershipMutation: updateAssetOwnershipMutationTool,
  } = useToolManagerMutation();
  const signStatusMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      userId,
      repair,
    }: {
      idTaiLieu: string;
      userId: string;
      repair: MaintenanceRepairData;
    }) => {
      const res = await api.post(
        `/ketqua-suachua/chitiet/capnhattrangthai?id=${idTaiLieu}&userId=${userId}`,
      );
      return res.data.data;
    },
    onSuccess: (response, data) => {
      if (response === 3) {
        // const taisan = (data.repair.chiTietSuaChuas || []).filter(
        //   (item): item is typeof item & { idTaiSan: string } =>
        //     Boolean(item.idTaiSan),
        // );
        // const ccdc = (data.repair.chiTietSuaChuas || []).filter(
        //   (
        //     item,
        //   ): item is typeof item & { idCCDC: string; idChiTietCCDC: string } =>
        //     Boolean(item.idChiTietCCDC),
        // );
        // if (taisan.length > 0) {
        //   updateAssetOwnershipMutation.mutate(
        //     taisan.map((item) => ({
        //       id: item.idTaiSan,
        //       idDonVi: data.repair.idDonViNhan,
        //     })),
        //   );
        //   createManyHistoryAssetMutation.mutate(
        //     taisan.map((item, index) => ({
        //       id: generateCode("LSDCTS-") + `${item.idTaiSan} -`,
        //       idBanGiaoTaiSan: data.repair.id,
        //       idTaiSan: item.idTaiSan,
        //       idDonViNhan: data.repair.idDonViNhan,
        //       idDonViGiao: data.repair.idDonViGiao,
        //       thoiGianBanGiao: dayjs(new Date()).format("YYYY-MM-DD"),
        //     })),
        //   );
        // }
        // if (ccdc.length > 0) {
        //   updateAssetOwnershipMutationTool.mutate(
        //     ccdc.map((item: any) => ({
        //       idCCDCVT: item.idCCDC,
        //       idDonViGui: data.repair.idDonViGiao,
        //       idDonViNhan: data.repair.idDonViNhan,
        //       idTsCon: item.idChiTietCCDC,
        //       soLuongBanGiao: item.soLuong,
        //       thoiGianBanGiao: now,
        //     })),
        //   );
        //   createManyHistoryToolMutation.mutate(
        //     ccdc.map((item: any) => ({
        //       id: generateCode("LSDCCCDC-") + `${item.idCCDCVatTu} -`,
        //       idCCDCVatTu: item.idCCDC,
        //       idChiTietCCDCVatTu: item.idChiTietCCDC,
        //       idDonViNhan: data.repair.idDonViNhan,
        //       idDonViGiao: data.repair.idDonViGiao,
        //       soLuong: item.soLuong,
        //       thoiGianBanGiao: now,
        //     })),
        //   );
        // }
        updateStatusPlanMutation.mutate({
          id: data.repair.idKeHoach,
          status: StatusPlan.PROGRESS,
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["maintenanceRepairResultPage"],
      });

      console.log("Cập nhật trạng thái ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật trạng thái ký thất bại",
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    cancelMutation,
    handleSignatureList,
    signMutation,
    getByIdMutation,
  };
};
