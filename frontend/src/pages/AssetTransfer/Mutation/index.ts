import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import {
  AssetTransferData,
  AssetTransferDetail,
  SignaturesData,
  Signer,
} from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import dayjs from "dayjs";
import { listNguoiKy } from "../config";
import socketService from "../../../services/socketService";
import {
  CongTy,
  MessageTypeActions,
  MessageTypeFunctions,
} from "../../../utils/const";

export const useAssetTranferMutation = () => {
  const queryClient = useQueryClient();
  const idCongTy = CongTy.CT001;
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss");
  const createMutation = useMutation({
    mutationFn: async (data: AssetTransferData) => {
      const res = await api.post("/dieudongtaisan", {
        ...data,
        ngayTao: now,
        nguoiTao: user?.taiKhoan?.tenDangNhap,
      });
      return res.data;
    },
    onSuccess: async (response, data) => {
      const idDDTS = response.data.id;
      if (
        data.chiTietDieuDongTaiSanDTOS &&
        data.chiTietDieuDongTaiSanDTOS.length > 0
      ) {
        createAssetTransferDetailManyMutation.mutate(
          data.chiTietDieuDongTaiSanDTOS?.map((item) => ({
            ...item,
            idDieuDongTaiSan: idDDTS,
          })),
        );
      }
      if (data.nguoiKyList && data.nguoiKyList.length > 0) {
        updateSignerMutation.mutate({
          idTaiLieu: idDDTS,
          data: data.nguoiKyList.map((item) => ({
            ...item,
            idTaiLieu: idDDTS,
          })),
        });
      }
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.ASSET_TRANSFER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });

      showSuccessAlert("Tạo điều động tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo điều động tài sản thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AssetTransferData) => {
      const res = await api.put(`/dieudongtaisan/${data.id}`, {
        ...data,
        ngayCapNhat: now,
        nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
      });
      return res.data;
    },
    onSuccess: async (response, data) => {
      if (data.initialChiTiet && data.initialChiTiet.length > 0) {
        deleteAssetTransferDetailManyMutation.mutate(data.initialChiTiet);
      }
      if (
        data.chiTietDieuDongTaiSanDTOS &&
        data.chiTietDieuDongTaiSanDTOS.length > 0
      ) {
        createAssetTransferDetailManyMutation.mutate(
          data.chiTietDieuDongTaiSanDTOS.map((item) => ({
            ...item,
            idDieuDongTaiSan: data.id,
          })),
        );
      }
      if (data.nguoiKyList && data.nguoiKyList.length > 0 && data.id) {
        updateSignerMutation.mutate({
          idTaiLieu: data.id,
          data: data.nguoiKyList,
        });
      }
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.ASSET_TRANSFER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });
      showSuccessAlert("Sửa điều động tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa điều động tài sản thất bại",
      );
    },
  });
  const updateManyMutation = useMutation({
    mutationFn: async (data: AssetTransferData[]) => {
      const res = await api.put(`/dieudongtaisan/batch`, data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });
      console.log("Sửa điều động tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Sửa điều động tài sản thất bại",
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.delete(`/dieudongtaisan/${data.id}`);
      return res.data;
    },
    onSuccess: async (_, data) => {
      deleteSignerMutation.mutate(data.id);
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.ASSET_TRANSFER,
        recieve: list,
      });
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });
      showSuccessAlert("Xóa điều động tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa điều động tài sản thất bại",
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/dieudongtaisan/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });
      showSuccessAlert(data || "Xóa điều động tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa điều động tài sản thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/dieudongtaisan/huy?id=${data.id}`);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });
      deleteSignerMutation.mutate(data.id);
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.ASSET_TRANSFER,
        recieve: list,
      });
      showSuccessAlert("Hủy điều động tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Hủy điều động tài sản thất bại",
      );
    },
  });

  const decisionMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const res = await api.post(
        `/dieudongtaisan/banhanhquyetdinh`,
        data.map((item) => ({
          id: item.id,
          soQuyetDinh: item.soQuyetDinh,
          ngayQuyetDinh: item.ngayQuyetDinh,
        })),
      );
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });
      const list = await listNguoiKy(data);
      socketService.send({
        type: MessageTypeFunctions.ASSET_TRANSFER,
        recieve: list,
      });
      showSuccessAlert("Ban hành quyết định thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Ban hành quyết định thất bại",
      );
    },
  });

  // chi tiết điều động

  const createAssetTransferDetailManyMutation = useMutation({
    mutationFn: async (data: AssetTransferDetail[]) => {
      const res = await api.post("/chitietdieudongtaisan/batch", data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });

      console.log("Tạo chi tiết điều động tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết điều động tài sản thất bại",
      );
    },
  });
  const deleteAssetTransferDetailManyMutation = useMutation({
    mutationFn: async (data: string[]) => {
      const res = await api.delete("/chitietdieudongtaisan/batch", { data });
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });

      console.log("Tạo chi tiết điều động tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết điều động tài sản thất bại",
      );
    },
  });

  const assetTransferDetailAllMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/chitietdieudongtaisan`, {
        params: {
          iddieudongtaisan: id,
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
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });

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
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });

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
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });

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
      const res = await api.get(`/chitietdieudongtaisan/${id}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      console.log("Lấy chi tiết điều động tài sảnhành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Lấy chi tiết điều động tài sảnn thất bại",
      );
      return null;
    },
  });

  const getAssetHandoverMutation = useMutation({
    mutationFn: async (search: string) => {
      if (!search) return;
      const res = await api.get(`/bangiaotaisan/paged`, {
        params: {
          page: 0,
          size: 999,
          search: search,
          idcongty: idCongTy,
        },
      });
      return res.data.items || [];
    },
    onSuccess: (response, data) => {
      console.log("Lấy biên bản bàn giao thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Lấy biên bản bàn giao tài sản thất bại",
      );
      return [];
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
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });
      data.SignaturesData.forEach((item) => {
        signStatusMutation.mutate({
          idTaiLieu: item.idTaiLieu,
          userId: item.idNguoiKy,
        });
      });
      const list = await listNguoiKy([data.asset]);
      socketService.send({
        type: MessageTypeFunctions.ASSET_TRANSFER,
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
  const signStatusMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      userId,
    }: {
      idTaiLieu: string;
      userId: string;
    }) => {
      const res = await api.post(
        `/dieudongtaisan/capnhattrangthai?id=${idTaiLieu}&userId=${userId}`,
      );
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });

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
    getAssetHandoverMutation,
    assetTransferDetailAllMutation,
    decisionMutation,
  };
};

export const useAssetTransferAllQuery = () => {
  const idCongTy = CongTy.CT001;

  return useQuery({
    queryKey: ["assetTranferAll"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/dieudongtaisan/paged", {
        params: {
          page: 0,
          size: 99999,
          idcongty: idCongTy,
        },
      });
      console.log("Fetched asset transfer all data:", res.data);
      return res.data.items;
    },
  });
};
export const useAssetTransferPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  loai?: number,
  userid?: string,
  trangThai?: number,
  idDonViGiao?: string,
  chuaBanGiaoHet?: boolean,
  isSign?: boolean,
) => {
  const idCongTy = CongTy.CT001;

  return useQuery({
    queryKey: [
      "assetTranferPage",
      page,
      pageSize,
      searchValue,
      loai,
      userid,
      trangThai,
      idDonViGiao,
      chuaBanGiaoHet,
      isSign,
    ], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/dieudongtaisan/paged", {
        params: {
          idcongty: idCongTy,
          page: page,
          size: pageSize,
          search: searchValue,
          loai: loai,
          userid: userid,
          trangThai: trangThai,
          idDonViGiao: idDonViGiao,
          chuaBanGiaoHet: chuaBanGiaoHet,
          isSign: isSign,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
// danh sach tai san

export const useAssetByDonViQuery = (
  loai?: number,
  idDonViGiao?: string,
  search?: string,
  page: number = 0,
  pageSize: number = 99999,
) => {
  return useQuery({
    queryKey: ["allAssetsByDonVi", loai, idDonViGiao, search, page, pageSize], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get(
        loai === 1
          ? "/taisan/by-donvi-bandau/paged"
          : "/taisan/by-donvi-hienthoi/paged",
        {
          params: {
            idcongty: CongTy.CT001,
            page: page,
            size: pageSize,
            search: search,
            ...(loai === 1
              ? {
                  iddonvibandau: idDonViGiao,
                }
              : { iddonvihienthoi: idDonViGiao }),
          },
        },
      );
      return res.data.data || res.data;
    },
    placeholderData: (placeholderData) => placeholderData,
    enabled: !!idDonViGiao && !!loai,
  });
};
