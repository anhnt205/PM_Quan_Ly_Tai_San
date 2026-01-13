import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { AssetDetailType, OwnerUnitType, ToolType } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import dayjs from "dayjs";
import axios from "axios";
let donViSoHuuList: any[] = [];
export const useToolManagerMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string
) => {
  const queryClient = useQueryClient();
  const idCongTy = "ct001";
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss");

  // --- quan ly ccdc - vat tu ---
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/ccdcvattu", {
        ...data,
        nguoiTao: user?.tailkhoan?.tenDangNhap || "",
        ngayCapNhat: now,
      });
      return res.data;
    },
    onSuccess: (responseData, variables) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      if (
        variables.chiTietTaiSanList &&
        variables.chiTietTaiSanList.length > 0
      ) {
        createManyAssetDetailMutation.mutate(
          variables.chiTietTaiSanList.map((item: any, index: number) => ({
            ...item,
            id: item.idTaiSan + "-STT-" + index,
          }))
        );
      }
      showSuccessAlert("Tạo CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo CCDC/Vật tư thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/ccdcvattu/${data.id}`, data);
      return res.data;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      if (
        variables.chiTietTaiSanList &&
        variables.chiTietTaiSanList.length > 0
      ) {
        donViSoHuuList = variables.chiTietDonViSoHuuList || [];
        console.log(variables.chiTietDonViSoHuuList);
        const deleteData = variables.chiTietTaiSanList
          .filter((item: any) => item.isDeleted)
          .map((item: any) => item.id);
        if (deleteData.length > 0) {
          // prepare owner-unit list first so it's available when deleteMany completes
          deleteManyAssetDetailMutation.mutate(deleteData);
        }
        const updateData = variables.chiTietTaiSanList
          .filter((item: any) => item.isInserted)
          .map((i: any, index: number) => ({
            ...i,
            id: i.idTaiSan + "-STT-" + index,
          }));
        if (updateData.length > 0) {
          createManyAssetDetailMutation.mutate(updateData);
        }
      }
      showSuccessAlert("Cập nhật CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật CCDC/Vật tư thất bại"
      );
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/ccdcvattu/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert("Xóa CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa CCDC/Vật tư thất bại"
      );
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/ccdcvattu/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert(data || "Xóa CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa CCDC/Vật tư thất bại"
      );
    },
  });

  // --- QUERIES ---
  const { data: toolsPage = { items: [], totalItems: 0 }, isLoading } =
    useQuery({
      queryKey: ["toolsPage", page, pageSize, searchValue],
      queryFn: async () => {
        const res = await api.get("/ccdcvattu/paged", {
          params: {
            idcongty: idCongTy,
            page: page,
            size: pageSize,
            search: searchValue,
          },
        });
        return res.data.data || res.data;
      },
      placeholderData: (previousData) => previousData,
    });

  // Lấy danh sách nhóm CCDC
  const { data: toolGroups = [] } = useQuery({
    queryKey: ["toolGroups", idCongTy],
    queryFn: async () => {
      const res = await api.get("/nhomccdc", {
        params: { idcongty: idCongTy },
      });
      return res.data;
    },
  });

  // chi tiet don vi so huu
  const createOwnerUnitMutation = useMutation({
    mutationFn: async (data: OwnerUnitType) => {
      const res = await axios.post(
        "http://42.119.110.246:8386/chitietdonvisohuu",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      console.log("Tạo chi tiết đơn vị sở hữu thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết đơn vị sở hữu thất bại"
      );
    },
  });
  const createManyOwnerUnitMutation = useMutation({
    mutationFn: async (data: OwnerUnitType[]) => {
      const res = await axios.post(
        "http://42.119.110.246:8386/chitietdonvisohuu/batch",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      console.log("Tạo chi tiết đơn vị sở hữu thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết đơn vị sở hữu thất bại"
      );
    },
  });
  const updateManyOwnerUnitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.put(
        "http://42.119.110.246:8386/chitietdonvisohuu/batch",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      console.log("Cập nhật chi tiết đơn vị sở hữu thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật chi tiết đơn vị sở hữu thất bại"
      );
    },
  });
  const deleteOneOwnerUnitMutation = useMutation({
    mutationFn: async (id: any) => {
      const res = await axios.delete(
        `http://42.119.110.246:8386/chitietdonvisohuu/${id}`
      );
      return res.data;
    },
    onSuccess: () => {
      console.log("Xóa chi tiết đơn vị sở hữu thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa chi tiết đơn vị sở hữu thất bại"
      );
    },
  });

  // chi tiet tai san
  const createAssetDetailMutation = useMutation({
    mutationFn: async (data: AssetDetailType) => {
      const res = await api.post("/chitiettaisan", data);
      return res.data;
    },
    onSuccess: () => {
      console.log("Tạo chi tiết tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết tài sản thất bại"
      );
    },
  });
  const createManyAssetDetailMutation = useMutation({
    mutationFn: async (data: AssetDetailType[]) => {
      const res = await api.post("/chitiettaisan/batch", data);
      return res.data;
    },
    onSuccess: (response, variables) => {
      createManyOwnerUnitMutation.mutate(
        variables.map((item) => ({
          id: "",
          idCCDCVT: item?.idTaiSan,
          idDonViSoHuu: item?.idDonVi,
          soLuong: item?.soLuong,
          thoiGianBanGiao: now,
          ngayTao: now,
          nguoiTao: user?.tailkhoan?.tenDangNhap || "",
          idTsCon: item?.id,
        }))
      );
      console.log("Tạo chi tiết tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết tài sản thất bại"
      );
    },
  });
  const updateManyAssetDetailMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put("/chitiettaisan/batch", data);
      return res.data;
    },
    onSuccess: (response, variables) => {
      createManyOwnerUnitMutation.mutate(
        variables.map((item: any) => ({
          id: "",
          idCCDCVT: item?.idTaiSan,
          idDonViSoHuu: item?.idDonVi,
          soLuong: item?.soLuong,
          thoiGianBanGiao: now,
          ngayTao: now,
          nguoiTao: user?.tailkhoan?.tenDangNhap || "",
          idTsCon: item?.id,
        }))
      );
      console.log("Cập nhật chi tiết tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết tài sản thất bại"
      );
    },
  });
  const deleteManyAssetDetailMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.delete("/chitiettaisan/batch", { data });
      return res.data;
    },
    onSuccess: (response, variables) => {
      console.log(donViSoHuuList);
      console.log(variables);
      donViSoHuuList = donViSoHuuList.filter((item: any) =>
        variables.includes(item.idTsCon)
      );
      donViSoHuuList.forEach((item: any) => {
        if (item && item.id) {
          deleteOneOwnerUnitMutation.mutate(item.id);
        }
      });
      console.log("Xóa chi tiết tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa chi tiết tài sản thất bại"
      );
    },
  });

  return {
    toolsPage,
    toolGroups,
    isLoading,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    createOwnerUnitMutation,
    updateManyOwnerUnitMutation,
    deleteOneOwnerUnitMutation,
    createAssetDetailMutation,
    updateManyAssetDetailMutation,
    deleteManyAssetDetailMutation,
  };
};
