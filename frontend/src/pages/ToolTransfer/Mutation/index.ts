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
import { useMemo, useState } from "react";
import axios from "axios";
import { findById } from "../../../utils/helpers";
import { useAllToolQuery } from "../../ToolManager/Mutation";
import {
  CongTy,
  MessageTypeActions,
  MessageTypeFunctions,
} from "../../../utils/const";
import { listNguoiKy } from "../config";
import socketService from "../../../services/socketService";

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
  const idCongTy = CongTy.CT001;
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
    onSuccess: async (response, data) => {
      const idDDTS = response.data.id;
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_TRANSFER,
        recieve: list,
      });
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
    onSuccess: async (response, data) => {
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_TRANSFER,
        recieve: list,
      });
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
    mutationFn: async (data: any) => {
      const res = await api.delete(`/dieudongccdcvattu/${data.id}`);
      return res.data;
    },
    onSuccess: async (_, data) => {
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_TRANSFER,
        recieve: list,
      });
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

  const decisionMutation = useMutation({
    mutationFn: async (data: any[]) => {
      console.log(data);
      const res = await api.post(
        `/dieudongccdcvattu/banhanhquyetdinh`,
        data.map((item) => ({
          id: item.id,
          soQuyetDinh: item.soQuyetDinh,
          ngayQuyetDinh: item.ngayQuyetDinh,
        })),
      );
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });
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

  const cancelMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/dieudongccdcvattu/huy?id=${data.id}`);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });
      const list = await listNguoiKy([data]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_TRANSFER,
        recieve: list,
      });
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
    mutationFn: async (id: string) => {
      const res = await api.delete(`/chuky/${id}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });

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
  const toolTransferDetailMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/chitietdieudongccdcvattu/${id}`);
      return res.data;
    },
  });
  const toolTransferDetailAllMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/chitietdieudongccdcvattu`, {
        params: {
          iddieudongccdcvattu: id,
        },
      });
      return res.data;
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
      toolTransfer,
    }: {
      SignaturesData: ToolSignature[];
      toolTransfer: any;
    }) => {
      const res = await api.post("/chuky", SignaturesData);
      return res.data;
    },
    onSuccess: async (response, data) => {
      data.SignaturesData.forEach((item) => {
        signStatusMutation.mutate({
          idTaiLieu: item.idTaiLieu,
          userId: item.idNguoiKy,
        });
      });
      const list = await listNguoiKy([data.toolTransfer]);
      socketService.send({
        type: MessageTypeFunctions.TOOL_TRANSFER,
        recieve: list,
      });
      showSuccessAlert("Ký thành công");
      queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });
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
    getByIdMutation,
    getToolHandoverMutation,
    handoverDetails: handoverDetailsQuery.data || [],
    toolTransferDetailMutation,
    toolTransferDetailAllMutation,
    decisionMutation,
  };
};

export const useToolTransferPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  userid?: string,
  loai?: number,
  trangThai?: number,
  chuaBanGiaoHet?: boolean,
  idDonViGiao?: string,
  isSign?: boolean,
) => {
  const idCongTy = CongTy.CT001;
  return useQuery({
    queryKey: [
      "toolTransferPage",
      page,
      pageSize,
      searchValue,
      loai,
      trangThai,
      chuaBanGiaoHet,
      userid,
      idDonViGiao,
      isSign,
    ], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/dieudongccdcvattu/paged", {
        params: {
          idcongty: idCongTy,
          page: page,
          size: pageSize,
          search: searchValue,
          loai: loai,
          userid: userid,
          trangThai: trangThai,
          chuaBanGiaoHet,
          idDonViGiao,
          isSign: isSign,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

// export const useToolByDepartmentPageQuery = ({
//   departmentId,
// }: {
//   departmentId: string;
// }) => {
//   const allToolsQuery = useAllToolQuery(); // đã được cache ở nhiều nơi

//   const detailQuery = useQuery({
//     queryKey: ["chitietdonvisohuu", departmentId],
//     queryFn: async () => {
//       if (!departmentId) return [];
//       const res = await api.get(
//         `/chitietdonvisohuu/by-donvisohuu/${departmentId}`,
//       );
//       return res.data?.data || res.data || [];
//     },
//     enabled: !!departmentId,
//     // staleTime: 5 * 60 * 1000,
//   });

//   const processedData = useMemo(() => {
//     // Ép kiểu tạm thời thành any[] để tránh lỗi TypeScript
//     const allTools = (allToolsQuery.data || []) as any[];
//     const details = (detailQuery.data || []) as any[];
//     if (!details.length || !allTools.length) return [];

//     // Tạo Map để lookup nhanh
//     const toolMap = new Map(allTools.map((tool: any) => [tool.id, tool]));
//     const detailMap = new Map();
//     allTools.forEach((tool: any) => {
//       tool?.chiTietTaiSanList?.forEach((detail: any) => {
//         detailMap.set(detail.id, {
//           ...detail,
//           assetTen: tool.ten,
//           assetDonVi: tool.donViTinh,
//         });
//       });
//     });

//     return details.reduce((acc: any[], e: any) => {
//       if (!e?.idCCDCVT || !e?.idTsCon) return acc;
//       const asset = toolMap.get(e.idCCDCVT) as any;
//       const detailAsset = detailMap.get(e.idTsCon) as any;
//       if (asset?.id && detailAsset?.id) {
//         acc.push({
//           id: detailAsset.id,
//           idCCDCVatTu: e.idCCDCVT,
//           tenCCDCVatTu: asset.ten || "N/A",
//           idDetaiAsset: detailAsset.id,
//           tenDetailAsset: `${asset.ten || "N/A"} (${e.soChungTu || ""})`,
//           idDonVi: e.idDonViSoHuu,
//           donViTinh: asset.donViTinh,
//           namSanXuat: detailAsset.namSanXuat ?? 0,
//           soLuong: e.soLuong || 0,
//           soLuongConLai: e.soLuong || 0,
//           giaTri: asset.giaTri || 0,
//           ghiChu: detailAsset.ghiChu,
//           soKyHieu: detailAsset.soKyHieu,
//           kyHieu: asset.kyHieu,
//           soLuongDaBanGiao: 0,
//           idNhomCCDC: asset.idNhomCCDC,
//           tenNhomCCDC: asset.tenNhomCCDC,
//           asset: asset,
//         });
//       }
//       return acc;
//     }, []);
//   }, [allToolsQuery.data, detailQuery.data]);

//   return {
//     data: processedData,
//     isLoading: allToolsQuery.isLoading || detailQuery.isLoading,
//     isError: detailQuery.isError,
//     error: detailQuery.error,
//     refetch: detailQuery.refetch,
//   };
// };

export const useToolByDepartmentPageQuery = ({
  departmentId,
}: {
  departmentId: string;
}) => {
  return useQuery({
    queryKey: ["chitietdonvisohuu", departmentId],
    queryFn: async () => {
      if (!departmentId) return [];
      const res = await api.get(
        `/chitietdonvisohuu/by-donvisohuu-enriched/${departmentId}`,
      );
      const data = res.data?.data || res.data || [];
      return data.map((item: any) => ({
        ...item,
        idCustom: item.soChungTu + "_" + item.idCCDCVT,
        idCCDCVatTu: item.idCCDCVT,
        idChiTietCCDCVatTu: item.idTsCon,
        tenDetailAsset: `${item.tenCCDCVatTu || ""} (${item.soChungTu || ""})`,
        tenCCDCVatTu: item.assetTen,
        donViTinh: item.donViTinh,
        namSanXuat: item.namSanXuat,
        soLuong: item.soLuong,
        soLuongConLai: item.soLuong,
        giaTri: item.giaTri,
        ghiChu: item.ghiChu,
        asset: item,
      }));
    },
    enabled: !!departmentId,
    // staleTime: 5 * 60 * 1000,
  });
};
export const useToolDetailAllQuery = () => {
  const allToolsQuery = useAllToolQuery(); // đã được cache ở nhiều nơi

  const detailQuery = useQuery({
    queryKey: ["chitietdonvisohuuALl"],
    queryFn: async () => {
      const res = await api.get(`/chitietdonvisohuu`);
      return res.data?.data || res.data || [];
    },
  });

  const processedData = useMemo(() => {
    // Ép kiểu tạm thời thành any[] để tránh lỗi TypeScript
    const allTools = (allToolsQuery.data || []) as any[];
    const details = (detailQuery.data || []) as any[];
    if (!details.length || !allTools.length) return [];

    // Tạo Map để lookup nhanh
    const toolMap = new Map(allTools.map((tool: any) => [tool.id, tool]));
    const detailMap = new Map();
    allTools.forEach((tool: any) => {
      tool?.chiTietTaiSanList?.forEach((detail: any) => {
        detailMap.set(detail.id, {
          ...detail,
          assetTen: tool.ten,
          assetDonVi: tool.donViTinh,
        });
      });
    });

    return details.reduce((acc: any[], e: any) => {
      if (!e?.idCCDCVT || !e?.idTsCon) return acc;
      const asset = toolMap.get(e.idCCDCVT) as any;
      const detailAsset = detailMap.get(e.idTsCon) as any;
      if (asset?.id && detailAsset?.id) {
        acc.push({
          id: detailAsset.id,
          idCCDCVatTu: e.idCCDCVT,
          ten: `${asset.ten || "N/A"} (${detailAsset.soKyHieu || ""}) - ${detailAsset.namSanXuat || ""}`,
        });
      }
      return acc;
    }, []);
  }, [allToolsQuery.data, detailQuery.data]);

  return {
    data: processedData,
    isLoading: allToolsQuery.isLoading || detailQuery.isLoading,
    isError: detailQuery.isError,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
  };
};

export const useToolTransferAllQuery = () => {
  const idCongTy = CongTy.CT001;

  return useQuery({
    queryKey: ["toolTranferAll"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/dieudongccdcvattu", {
        params: {
          idcongty: idCongTy,
        },
      });
      return res.data;
    },
    placeholderData: (placeholderData) => placeholderData,
  });
};
