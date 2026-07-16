import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import {
  AssetHandoverData,
  AssetHandoverDetail,
  AssetHandoverFormValues,
  SignaturesData,
  Signer,
} from "../types";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { ContactlessOutlined } from "@mui/icons-material";
import { useAssetManagerMutation } from "../../AssetManager/Mutation";
import { generateCode } from "../../../utils/helpers";
import { listNguoiKy } from "../config";
import socketService from "../../../services/socketService";
import { CongTy, MessageTypeFunctions } from "../../../utils/const";

export const useAssetHandoverMutation = () => {
  const queryClient = useQueryClient();
  const mainKey = "assetHandoverPage";
  const idCongTy = CongTy.CT001;
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss");

  // --- 2. MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: async (data: AssetHandoverFormValues) => {
      const res = await api.post("/bangiaotaisan", {
        ...data,
        ngayTao: now,
        nguoiTao: user?.taiKhoan?.tenDangNhap,
      });
      return res.data;
    },
    onSuccess: async (response, data) => {
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.ASSET_HANDOVER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: [mainKey] });

      showSuccessAlert("Tạo bàn giao tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo bàn giao tài sản thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AssetHandoverFormValues) => {
      const res = await api.put(`/bangiaotaisan/${data.id}`, {
        ...data,
        ngayCapNhat: now,
        nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
      });
      return res.data;
    },
    onSuccess: async (response, data) => {
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.ASSET_HANDOVER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Sửa bàn giao tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa bàn giao tài sản thất bại",
      );
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (data: any) =>
      (await api.delete(`/bangiaotaisan/${data.id}`)).data,
    onSuccess: async (response, data) => {
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.ASSET_HANDOVER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Xóa thành công");
    },
  });
  const updateManyMutation = useMutation({
    mutationFn: async (data: AssetHandoverFormValues[]) => {
      const res = await api.put(`/bangiaotaisan/batch`, data);
      return res.data;
    },
    onSuccess: async (response, data) => {
      const list = await listNguoiKy(data);
      socketService.send({
        type: MessageTypeFunctions.ASSET_HANDOVER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      console.log("Sửa bàn giao tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Sửa bàn giao tài sản thất bại",
      );
    },
  });
  const cancelMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/bangiaotaisan/huytrangthai?id=${data.id}`);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.ASSET_HANDOVER,
        recieve: list,
      });
      showSuccessAlert("Hủy bàn giao tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Hủy bàn giao tài sản thất bại",
      );
    },
  });

  // chi tiết bàn giao

  const createAssetHandoverDetailManyMutation = useMutation({
    mutationFn: async (data: AssetHandoverDetail[]) => {
      const res = await api.post("/chitietbangiaotaisan/batch", data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });

      console.log("Tạo chi tiết bàn giao tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết bàn giao tài sản thất bại",
      );
    },
  });
  const deleteAssetHandoverDetailManyMutation = useMutation({
    mutationFn: async (data: string[]) => {
      const res = await api.delete("/chitietbangiaotaisan/batch", { data });
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });

      console.log("Tạo chi tiết bàn giao tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết bàn giao tài sản thất bại",
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
      assetHandover: AssetHandoverData;
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
        type: MessageTypeFunctions.ASSET_HANDOVER,
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
        `/dieudongtaisan/update-trang-thai-ban-giao?id=${id}&trangThaiBanGiao=${trangThaiBanGiao}`,
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
    mutationFn: async (data: { id: string; idDonVi: string }[]) => {
      const res = await api.put(`/taisan/updatedonvi`, data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      queryClient.invalidateQueries({ queryKey: ["assetsPage"] });

      console.log("Cập nhật tài sản theo đơn vị thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật tài sản theo đơn vị thất bại",
      );
    },
  });
  const { createManyHistoryAssetMutation } = useAssetManagerMutation();
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
      assetHandover: AssetHandoverData;
    }) => {
      const res = await api.post(
        `/bangiaotaisan/capnhattrangthai?id=${idTaiLieu}&userId=${userId}`,
      );
      return res.data.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      if (response === 3) {
        updateAssetOwnershipMutation.mutate(
          data.assetHandover.chiTietBanGiaoTaiSan.map((item) => ({
            id: item.idTaiSan,
            idDonVi: data.assetHandover.idDonViNhan,
          })),
        );
        updateStateAssetTransferMutation.mutate({
          id: data.assetHandover.lenhDieuDong,
          trangThaiBanGiao: true,
        });
        createManyHistoryAssetMutation.mutate(
          data.assetHandover.chiTietBanGiaoTaiSan.map((item, index) => ({
            id: generateCode("LSDCTS-") + `${item.idTaiSan} -`,
            idBanGiaoTaiSan: data.assetHandover.id,
            idTaiSan: item.idTaiSan,
            idDonViNhan: data.assetHandover.idDonViNhan,
            idDonViGiao: data.assetHandover.idDonViGiao,
            thoiGianBanGiao: dayjs(new Date()).format("YYYY-MM-DD"),
          })),
        );
      }
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
    updateAssetOwnershipMutation,
  };
};
export const useAssetHandoverAllQuery = () => {
  const idCongTy = CongTy.CT001;

  return useQuery({
    queryKey: ["assetHandoverAll"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/bangiaotaisan", {
        params: {
          idcongty: idCongTy,
        },
      });
      console.log("useAssetHandoverAllQuery");

      return res.data;
    },
    placeholderData: (placeholderData) => placeholderData,
  });
};

export const useAssetHandoverPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  userid?: string,
  status?: number,
  isSign?: boolean,
) => {
  const idCongTy = CongTy.CT001;

  return useQuery({
    queryKey: [
      "assetHandoverPage",
      page,
      pageSize,
      searchValue,
      status,
      userid,
      isSign,
    ],
    queryFn: async () => {
      const res = await api.get("/bangiaotaisan/paged", {
        params: {
          page,
          size: pageSize,
          search: searchValue,
          idcongty: idCongTy,
          userid: userid,
          trangThai: status,
          isSign: isSign,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
