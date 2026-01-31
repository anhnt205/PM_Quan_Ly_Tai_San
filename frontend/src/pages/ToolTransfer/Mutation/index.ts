import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";

import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import dayjs from "dayjs";
import {
  ToolSignature,
  ToolSigner,
  ToolTransferData,
  ToolTransferDetail,
} from "../types";
import { useState } from "react";
import axios from "axios";
import { findById } from "../../../utils/helpers";

export const useToolTransferMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  loai?: number,
  trangThai?: number,
  idDonViGiao?: string,
  chuaBanGiaoHet?: boolean,
  selectedId?: string,
) => {
  const queryClient = useQueryClient();
  const idCongTy = "ct001";
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss");

  const createMutation = useMutation({
    mutationFn: async (data: ToolTransferData) => {
      const res = await api.post("/dieudongccdcvattu", {
        ...data,
        ngayTao: now,
        nguoiTao: user?.taiKhoan?.tenDangNhap,
      });
      return res.data;
    },
    onSuccess: (response, data) => {
      const idDDTS = response.data.id;
      if (
        data.chiTietDieuDongCCDCVatTuDTOS &&
        data.chiTietDieuDongCCDCVatTuDTOS.length > 0
      ) {
        createToolTransferDetailManyMutation.mutate(
          data.chiTietDieuDongCCDCVatTuDTOS?.map((item) => ({
            ...item,
            idDieuDongCCDCVatTu: idDDTS,
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
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });

      showSuccessAlert("Tạo điều động ccdc vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo điều động ccdc vật tư thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ToolTransferData) => {
      const res = await api.put(`/dieudongccdcvattu/${data.id}`, {
        ...data,
        ngayCapNhat: now,
        nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
      });
      return res.data;
    },
    onSuccess: (response, data) => {
      if (data.initialChiTiet && data.initialChiTiet.length > 0) {
        deleteToolTransferDetailManyMutation.mutate(data.initialChiTiet);
      }
      if (
        data.chiTietDieuDongCCDCVatTuDTOS &&
        data.chiTietDieuDongCCDCVatTuDTOS.length > 0
      ) {
        createToolTransferDetailManyMutation.mutate(
          data.chiTietDieuDongCCDCVatTuDTOS.map((item) => ({
            ...item,
            idDieuDongCCDCVatTu: data.id,
          })),
        );
      }
      if (data.nguoiKyList && data.nguoiKyList.length > 0 && data.id) {
        updateSignerMutation.mutate({
          idTaiLieu: data.id,
          data: data.nguoiKyList,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });
      showSuccessAlert("Sửa điều động ccdc vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa điều động ccdc vật tư thất bại",
      );
    },
  });
  const updateManyMutation = useMutation({
    mutationFn: async (data: ToolTransferData[]) => {
      const res = await api.put(`/dieudongccdcvattu/batch`, data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });
      console.log("Sửa điều động ccdc vật tư thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Sửa điều động ccdc vật tư thất bại",
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/dieudongccdcvattu/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });
      showSuccessAlert("Xóa điều động ccdc vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa điều động ccdc vật tư thất bại",
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/dieudongccdcvattu/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });
      showSuccessAlert(data || "Xóa điều động ccdc vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa điều động ccdc vật tư thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/dieudongccdcvattu/huy?id=${id}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });
      showSuccessAlert("Hủy điều động ccdc vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Hủy điều động ccdc vật tư thất bại",
      );
    },
  });

  // chi tiết điều động

  const createToolTransferDetailManyMutation = useMutation({
    mutationFn: async (data: ToolTransferDetail[]) => {
      const res = await api.post("/chitietdieudongccdcvattu/batch", data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });

      console.log("Tạo chi tiết điều động ccdc vật tư thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết điều động ccdc vật tư thất bại",
      );
    },
  });
  const deleteToolTransferDetailManyMutation = useMutation({
    mutationFn: async (data: string[]) => {
      const res = await api.delete("/chitietdieudongccdcvattu/batch", { data });
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });

      console.log("Tạo chi tiết điều động ccdc vật tư thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết điều động ccdc vật tư thất bại",
      );
    },
  });
  // nguoi ky
  const createSignerMutation = useMutation({
    mutationFn: async (data: ToolSigner) => {
      const res = await api.post("/chuky/nguoi-ky", data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });

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
      data: ToolSigner[];
    }) => {
      const res = await api.put(`/chuky/nguoi-ky/update/${idTaiLieu}`, data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });

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
    mutationFn: async (idTaiLieu: string) => {
      const res = await api.delete(`/chuky/update/${idTaiLieu}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });

      console.log("XÓa người ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "XÓa người ký thất bại",
      );
    },
  });

  const getByIdMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/chitietdieudongccdcvattu/${id}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      console.log("Lấy chi tiết điều động ccdc vật tưhành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Lấy chi tiết điều động ccdc vật tưn thất bại",
      );
      return null;
    },
  });

  const getToolHandoverMutation = useMutation({
    mutationFn: async (search: string) => {
      if (!search) return;
      const res = await api.get(`/bangiaoccdcvattu/paged`, {
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
    mutationFn: async (data: ToolSignature[]) => {
      const res = await api.post("/chuky", data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });
      data.forEach((item) => {
        signStatusMutation.mutate({
          idTaiLieu: item.idTaiLieu,
          userId: item.idNguoiKy,
        });
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
        `/dieudongccdcvattu/capnhattrangthai?id=${idTaiLieu}&userId=${userId}`,
      );
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });

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

  const { data = { items: [], totalItems: 0 }, isLoading } = useQuery({
    queryKey: [
      "toolTransferPage",
      page,
      pageSize,
      searchValue,
      loai,
      trangThai,
    ], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/dieudongccdcvattu/paged", {
        params: {
          idcongty: idCongTy,
          page: page,
          size: pageSize,
          search: searchValue,
          loai: loai,
          userid: user?.taiKhoan?.tenDangNhap,
          trangThai: trangThai,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  // list phongban
  const { data: allDepartments = [] } = useQuery({
    queryKey: ["allDepartments"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/phongban", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data;
    },
  });
  // list nhanvien
  const { data: allStaff = [] } = useQuery({
    queryKey: ["allStaff"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/nhanvien", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data;
    },
  });
  // danh sach ccdc

  const handoverDetailsQuery = useQuery({
    queryKey: ["handoverDetails", selectedId],
    queryFn: async () => {
      if (!selectedId) return [];
      const res = await api.get(
        `/chitietbangiaoccdcvattu/by-dieu-dong/${selectedId}`,
      );
      return res.data;
    },
    enabled: !!selectedId, // Chỉ chạy khi có selectedId
  });

  // don vi tính
  const { data: allUnits = [] } = useQuery({
    queryKey: ["allUnits"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/donvitinh", {});
      return res.data;
    },
  });
  //hien trang ki thuat
  const { data: allCurrentStatus = [] } = useQuery({
    queryKey: ["allCurrentStatus"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/hientrangkythuat");
      return res.data;
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
      uploadMutation.mutate(file);
      // response.data lúc này là một đối tượng Blob (Binary Large Object)
      return response.data;
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
    toolTransferPage: data,
    handleDownloadFile,
    handlePreview,
    convertDocxToPdf,
    cancelMutation,
    updateManyMutation,
    allDepartments,
    allStaff,
    isLoading,
    allUnits,
    allCurrentStatus,
    handleSignatureList,
    signMutation,
    getByIdMutation,
    getToolHandoverMutation,
    handoverDetails: handoverDetailsQuery.data || [],
  };
};

export const useAllToolPageQuery = () => {
  const idCongTy = "ct001";

  return useQuery({
    queryKey: ["allTool", idCongTy],
    queryFn: async () => {
      const res = await api.get("/ccdcvattu/paged", {
        params: { idcongty: idCongTy, page: 0, size: 9999 },
      });
      return res.data.data?.items || res.data?.items || [];
    },
  });
};

export const useToolByDepartmentPageQuery = ({
  departmentId,
}: {
  departmentId: string;
}) => {
  const idCongTy = "ct001";

  const { data: allTools = [] } = useAllToolPageQuery();

  return useQuery({
    queryKey: ["allToolByDonVi", departmentId, idCongTy],
    queryFn: async () => {
      // Gọi cả 2 API cùng lúc để tối ưu thời gian (Parallel)
      const resAllTools = await axios.get(
        `http://42.119.110.246:8386/chitietdonvisohuu/by-donvisohuu/${departmentId}`,
      );
      let data = [];
      const allToolsByDonVi = resAllTools.data.data || resAllTools.data || [];
      const listDetailAsset = allTools.flatMap(
        (item: any) => item.chiTietTaiSanList || [],
      );
      for (const e of allToolsByDonVi) {
        if (!e.idCCDCVT || !e.idTsCon) {
          continue;
        }
        const asset = findById(allTools, e.idCCDCVT);
        const detailAsset = listDetailAsset.find(
          (i: any) => i.id === e?.idTsCon,
        );
        if (!asset.id || !detailAsset.id) {
          continue;
        }
        data.push({
          id: e.idCCDCVT,
          idCCDCVatTu: e.idCCDCVT,
          tenCCDCVatTu: asset.ten,
          idDetaiAsset: detailAsset.id,
          tenDetailAsset: `${asset.ten}(${detailAsset.soKyHieu}) - ${detailAsset.namSanXuat}`,
          idDonVi: e.idDonViSoHuu,
          donViTinh: asset.donViTinh,
          namSanXuat: detailAsset.namSanXuat ?? 2010,
          soLuong: e.soLuong,
          soLuongConLai: e.soLuong,
          ghiChu: asset.ghiChu,
          soKyHieu: asset.soKyHieu,
          kyHieu: asset.kyHieu,
          soLuongDaBanGiao: 0,
          asset: asset,
        });
      }
      return data;
    },
    enabled: !!departmentId && allTools.length > 0,
  });
};
