import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { CongTy, MessageTypeFunctions, StatusPlan } from "../../../utils/const";
import {
  MaintenanceRepairData,
  MaintenanceRepairDetailItem,
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
      if (data.chiTietSuaChuas && data.chiTietSuaChuas.length > 0) {
        createMaintenanceRepairDetailManyMutation.mutate(
          data.chiTietSuaChuas?.map((item) => ({
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
      if (data.initialChiTiet && data.initialChiTiet.length > 0) {
        deleteMaintenanceRepairDetailItemManyMutation.mutate(
          data.initialChiTiet,
        );
      }
      if (data.chiTietSuaChuas && data.chiTietSuaChuas.length > 0) {
        createMaintenanceRepairDetailManyMutation.mutate(
          data.chiTietSuaChuas.map((item) => ({
            ...item,
            idSuaChua: data.id,
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

  // chi tiết sửa chữa

  const createMaintenanceRepairDetailManyMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairDetailItem[]) => {
      const res = await api.post("/chitiet-suachua/bulk", data);
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
  const deleteMaintenanceRepairDetailItemManyMutation = useMutation({
    mutationFn: async (data: string[]) => {
      const res = await api.delete("/chitiet-suachua/bulk", { data });
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

  const maintenanceRepairDetailAllMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/chitiet-suachua`, {
        params: {
          idSuaChua: id,
        },
      });
      return res.data;
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
        const taisan = (data.repair.chiTietSuaChuas || []).filter(
          (item): item is typeof item & { idTaiSan: string } =>
            Boolean(item.idTaiSan),
        );
        const ccdc = (data.repair.chiTietSuaChuas || []).filter(
          (
            item,
          ): item is typeof item & { idCCDC: string; idChiTietCCDC: string } =>
            Boolean(item.idChiTietCCDC),
        );
        if (taisan.length > 0) {
          updateAssetOwnershipMutation.mutate(
            taisan.map((item) => ({
              id: item.idTaiSan,
              idDonVi: data.repair.idDonViNhan,
            })),
          );
          createManyHistoryAssetMutation.mutate(
            taisan.map((item, index) => ({
              id: generateCode("LSDCTS-") + `${item.idTaiSan} -`,
              idBanGiaoTaiSan: data.repair.id,
              idTaiSan: item.idTaiSan,
              idDonViNhan: data.repair.idDonViNhan,
              idDonViGiao: data.repair.idDonViGiao,
              thoiGianBanGiao: dayjs(new Date()).format("YYYY-MM-DD"),
            })),
          );
        }
        if (ccdc.length > 0) {
          updateAssetOwnershipMutationTool.mutate(
            ccdc.map((item: any) => ({
              idCCDCVT: item.idCCDC,
              idDonViGui: data.repair.idDonViGiao,
              idDonViNhan: data.repair.idDonViNhan,
              idTsCon: item.idChiTietCCDC,
              soLuongBanGiao: item.soLuong,
              thoiGianBanGiao: now,
            })),
          );
          createManyHistoryToolMutation.mutate(
            ccdc.map((item: any) => ({
              id: generateCode("LSDCCCDC-") + `${item.idCCDCVatTu} -`,
              idCCDCVatTu: item.idCCDC,
              idChiTietCCDCVatTu: item.idChiTietCCDC,
              idDonViNhan: data.repair.idDonViNhan,
              idDonViGiao: data.repair.idDonViGiao,
              soLuong: item.soLuong,
              thoiGianBanGiao: now,
            })),
          );
        }
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
    maintenanceRepairDetailAllMutation,
  };
};
