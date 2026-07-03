import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  SignaturesData,
  Signer,
  ToolHandoverData,
  ToolHandoverDetail,
  ToolHandoverFormValues,
} from "../types";
import axios from "axios";
import { useToolManagerMutation } from "../../ToolManager/Mutation";
import { generateCode } from "../../../utils/helpers";
import { listNguoiKy } from "../config";
import socketService from "../../../services/socketService";
import { CongTy, MessageTypeFunctions } from "../../../utils/const";

export const useToolHandoverMutation = () => {
  const queryClient = useQueryClient();
  const mainKey = "toolHandoverPage";
  const idCongTy = CongTy.CT001;
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs().startOf("day").format("YYYY-MM-DDTHH:mm:ss");

  // --- 2. MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: async (data: ToolHandoverFormValues) => {
      const res = await api.post("/bangiaoccdcvattu", {
        ...data,
        ngayTao: now,
        ngayCapNhat: now,
        nguoiTao: user?.taiKhoan?.tenDangNhap,
      });
      return res.data;
    },
    onSuccess: async (response, data) => {
      const idBGTS = response.data.id;

      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_HANDOVER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: [mainKey] });

      showSuccessAlert("Tạo bàn giao ccdc vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo bàn giao ccdc vật tư thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ToolHandoverFormValues) => {
      const res = await api.put(`/bangiaoccdcvattu`, {
        ...data,
        ngayCapNhat: now,
        nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
      });
      return res.data;
    },
    onSuccess: async (response, data) => {

      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_HANDOVER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Sửa bàn giao ccdc vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa bàn giao ccdc vật tư thất bại",
      );
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (data: any) =>
      (await api.delete(`/bangiaoccdcvattu/${data.id}`)).data,
    onSuccess: async (response, data) => {
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_HANDOVER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Xóa thành công");
    },
  });
  const updateManyMutation = useMutation({
    mutationFn: async (data: ToolHandoverFormValues[]) => {
      const res = await api.put(`/bangiaoccdcvattu/batch`, data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      console.log("Sửa bàn giao ccdc vật tư thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Sửa bàn giao ccdc vật tư thất bại",
      );
    },
  });
  const cancelMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(
        `/bangiaoccdcvattu/huytrangthai?id=${data.id}`,
      );
      return res.data;
    },
    onSuccess: async (response, data) => {
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_HANDOVER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      deleteSignerMutation.mutate(data.id);
      showSuccessAlert("Hủy bàn giao ccdc vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Hủy bàn giao ccdc vật tư thất bại",
      );
    },
  });

  // chi tiết bàn giao

  const createToolHandoverDetailManyMutation = useMutation({
    mutationFn: async (data: ToolHandoverDetail[]) => {
      const res = await api.post("/chitietbangiaoccdcvattu/batch", data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });

      console.log("Tạo chi tiết bàn giao ccdc vật tư thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết bàn giao ccdc vật tư thất bại",
      );
    },
  });
  const deleteToolHandoverDetailManyMutation = useMutation({
    mutationFn: async (data: string[]) => {
      const res = await api.delete("/chitietbangiaoccdcvattu/batch", { data });
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });

      console.log("Tạo chi tiết bàn giao ccdc vật tư thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết bàn giao ccdc vật tư thất bại",
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
      queryClient.invalidateQueries({ queryKey: [mainKey] });

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
      queryClient.invalidateQueries({ queryKey: [mainKey] });

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
  // --- 3. QUERIES LẤY DỮ LIỆU BẢNG ---

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
      data,
      assetHandover,
    }: {
      data: SignaturesData[];
      assetHandover: ToolHandoverData;
    }) => {
      const res = await api.post("/chuky", data);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      data.data.forEach((item) => {
        signStatusMutation.mutate({
          idTaiLieu: item.idTaiLieu,
          userId: item.idNguoiKy,
          assetHandover: data.assetHandover,
        });
      });
      const list = await listNguoiKy([data.assetHandover]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_HANDOVER,
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

  // cập nhật trạng thái bàn giao
  const updateStateAssetTransferMutation = useMutation({
    mutationFn: async ({
      id,
      trangThaiBanGiao,
    }: {
      id: string;
      trangThaiBanGiao: boolean;
    }) => {
      const res = await api.post(
        `/dieudongccdcvattu/update-trang-thai-ban-giao?id=${id}&trangThaiBanGiao=${trangThaiBanGiao}`,
      );
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });

      console.log("Cập nhật trạng thái bàn giao thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật trạng thái bàn giao thất bại",
      );
    },
  });
  // cập nhật tai sản theo đơn vị
  const updateAssetOwnershipMutation = useMutation({
    mutationFn: async (
      data: {
        idCCDCVT: string;
        idDonViGui: string;
        idDonViNhan: string;
        idTsCon: string;
        soLuongBanGiao: number;
        soQuyetDinh: string;
        soChungTu: string;
        thoiGianBanGiao: string;
      }[],
    ) => {
      const res = await api.post(
        `/chitietdonvisohuu/update-so-luong/batch`,
        data,
      );
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });

      console.log("Cập nhật ccdc vật tư theo đơn vị thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật ccdc vật tư theo đơn vị thất bại",
      );
    },
  });

  const { createManyHistoryToolMutation } = useToolManagerMutation();
  // cap nhat trang thai ky
  // ky tai lieu
  const signStatusMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      userId,
      assetHandover,
    }: {
      idTaiLieu: string;
      userId: string;
      assetHandover: any;
    }) => {
      const res = await api.post(
        `/bangiaoccdcvattu/capnhattrangthai?id=${idTaiLieu}&userId=${userId}`,
      );
      return res.data.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });

      const list = await listNguoiKy([data.assetHandover]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_HANDOVER,
        recieve: list,
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

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    handlePreview,
    handleDownloadFile,
    cancelMutation,
    updateManyMutation,
    signMutation,
    handleSignatureList,
  };
};

export const useToolHandoverDetailsQuery = (idDieuDong: string) => {
  return useQuery({
    queryKey: ["toolHandoverDetails", idDieuDong],
    queryFn: async () => {
      if (!idDieuDong) return [];
      const res = await api.get(
        `/chitietbangiaoccdcvattu/by-dieu-dong/${idDieuDong}`,
      );
      return res.data; // Giả định res.data trả về mảng các chi tiết
    },
    placeholderData: (placeholderData) => placeholderData,
    enabled: !!idDieuDong,
  });
};
export const useToolHandoverAllQuery = () => {
  const idCongTy = CongTy.CT001;

  return useQuery({
    queryKey: ["toolHandoverAll"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/bangiaoccdcvattu", {
        params: {
          idcongty: idCongTy,
        },
      });
      return res.data;
    },
    placeholderData: (placeholderData) => placeholderData,
  });
};
export const useToolHandoverPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  status?: number,
  isSign?: boolean,
) => {
  const idCongTy = CongTy.CT001;
  const { user } = useSelector((state: RootState) => state.user);

  return useQuery({
    queryKey: ["toolHandoverPage", page, pageSize, searchValue, status, isSign],
    queryFn: async () => {
      const res = await api.get("/bangiaoccdcvattu/paged", {
        params: {
          page,
          size: pageSize,
          search: searchValue,
          idcongty: idCongTy,
          userid: user?.taiKhoan?.tenDangNhap,
          trangThai: status,
          isSign,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
