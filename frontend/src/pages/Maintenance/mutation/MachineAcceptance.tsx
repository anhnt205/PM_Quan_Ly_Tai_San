// --- nghiệm thu máy móc ---

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AcceptanceTestAdapter } from "../Adapter";
import api from "../../../config/api.config";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { CongTy } from "../../../utils/const";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useMaintenanceAcceptanceTestPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  idTaiSan?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "nghiemThuMayMocPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
      isSign,
      dateFrom,
      dateTo,
      idTaiSan,
    ],
    queryFn: async () => {
      const res = await api.get("/nghiemthu-maymoc/paged", {
        params: {
          page: page,
          size: pageSize,
          idCongTy: CongTy.CT001,
          search: searchValue,
          trangThai: trangThai,
          userid: userid,
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
          idTaiSan: idTaiSan,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

export const useMaintenanceAcceptanceByBienPhapQuery = (
  idBienPhap?: string,
) => {
  return useQuery({
    queryKey: ["nghiemThuMayMocByBienPhap", idBienPhap],
    queryFn: async () => {
      const res = await api.get(
        `/nghiemthu-maymoc/bienphap-maymoc/${idBienPhap}`,
      );
      return (res.data.data || res.data).map((item: any) =>
        AcceptanceTestAdapter(item),
      );
    },
    enabled: !!idBienPhap,
  });
};

export const useMaintenanceAcceptanceByGiamDinhQuery = (
  idGiamDinhMayMoc: string | undefined,
) => {
  return useQuery({
    queryKey: ["nghiemThuMayMocByGiamDinh", idGiamDinhMayMoc],
    queryFn: async () => {
      const res = await api.get(
        `/nghiemthu-maymoc/giamdinh-maymoc/${idGiamDinhMayMoc}`,
      );
      return (res.data.data || res.data).map((item: any) =>
        AcceptanceTestAdapter(item),
      );
    },
    enabled: !!idGiamDinhMayMoc,
  });
};

export const useMaintenanceAcceptanceTestMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const { user } = useSelector((state: any) => state.user);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["inspectionByBienBan"] });
    queryClient.invalidateQueries({ queryKey: ["repairRequestPage"] });
    queryClient.invalidateQueries({ queryKey: ["nghiemThuMayMocPage"] });
    queryClient.invalidateQueries({ queryKey: ["nghiemThuMayMocByBienPhap"] });
    queryClient.invalidateQueries({
      queryKey: ["nghiemThuMayMocByGiamDinh"],
    });
    queryClient.invalidateQueries({
      queryKey: ["bienPhapMayMocByGiamDinh"],
    });
    queryClient.invalidateQueries({
      queryKey: ["incidentDetailByIncident"],
    });
    queryClient.invalidateQueries({
      queryKey: ["maintenancePlanningDetailsByMonth"],
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return (
        await api.post("/nghiemthu-maymoc", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async () => {
      invalidate();

      showSuccessAlert("Tạo biên bản nghiệm thu thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Tạo biên bản nghiệm thu thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return (
        await api.put(`/nghiemthu-maymoc/${data.id}`, {
          ...data,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })
      ).data;
    },
    onSuccess: async () => {
      invalidate();
      showSuccessAlert("Cập nhật biên bản nghiệm thu thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Cập nhật biên bản nghiệm thu thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/nghiemthu-maymoc/${id}`)).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Xóa biên bản nghiệm thu thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Xóa biên bản nghiệm thu thất bại",
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      return (
        await api.post(
          `/nghiemthu-maymoc/capnhattrangthai?id=${id}&userId=${userId}`,
        )
      ).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Cập nhật trạng thái thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.post(`/nghiemthu-maymoc/huy?id=${id}`)).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Hủy biên bản nghiệm thu thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Hủy biên bản nghiệm thu thất bại",
      );
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.put(
          `/nghiemthu-maymoc/batch`,
          data.map((i) => ({
            ...i,
            ngayCapNhat: now,
            nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          })),
        )
      ).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Cập nhật danh sách thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật danh sách thất bại",
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusMutation,
    cancelMutation,
    updateManyMutation,
  };
};