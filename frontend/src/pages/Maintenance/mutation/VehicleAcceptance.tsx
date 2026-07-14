// --- nghiệm thu phương tiện ---

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { CongTy } from "../../../utils/const";
import { AcceptanceTestAdapter } from "../Adapter";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useMaintenanceAcceptanceTestVehiclePageQuery = (
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
      "nghiemThuPhuongTienPage",
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
      const res = await api.get("/nghiemthu-phuongtien/paged", {
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

export const useMaintenanceAcceptanceVehicleByBienPhapQuery = (
  idBienPhap?: string,
) => {
  return useQuery({
    queryKey: ["nghiemThuPhuongTienByBienPhap", idBienPhap],
    queryFn: async () => {
      const res = await api.get(
        `/nghiemthu-phuongtien/bienphap-phuongtien/${idBienPhap}`,
      );
      return (res.data.data || res.data).map((item: any) =>
        AcceptanceTestAdapter(item),
      );
    },
    enabled: !!idBienPhap,
  });
};

export const useMaintenanceAcceptanceVehicleByGiamDinhQuery = (
  idGiamDinhPhuongTien: string | undefined,
) => {
  return useQuery({
    queryKey: ["nghiemThuPhuongTienByGiamDinh", idGiamDinhPhuongTien],
    queryFn: async () => {
      const res = await api.get(
        `/nghiemthu-phuongtien/giamdinh-phuongtien/${idGiamDinhPhuongTien}`,
      );
      return (res.data.data || res.data).map((item: any) =>
        AcceptanceTestAdapter(item),
      );
    },
    enabled: !!idGiamDinhPhuongTien,
  });
};

export const useMaintenanceAcceptanceTestVehicleMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const { user } = useSelector((state: any) => state.user);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["nghiemThuPhuongTienPage"] });
    queryClient.invalidateQueries({
      queryKey: ["nghiemThuPhuongTienByBienPhap"],
    });
    queryClient.invalidateQueries({
      queryKey: ["nghiemThuPhuongTienByGiamDinh"],
    });
    queryClient.invalidateQueries({
      queryKey: ["vehicleInspectionByBienBan"],
    });
    queryClient.invalidateQueries({
      queryKey: ["bienPhapPhuongTienByGiamDinh"],
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
        await api.post("/nghiemthu-phuongtien", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async () => {
      invalidate();
      showSuccessAlert("Tạo biên bản nghiệm thu phương tiện thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Tạo biên bản nghiệm thu phương tiện thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return (
        await api.put(`/nghiemthu-phuongtien/${data.id}`, {
          ...data,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })
      ).data;
    },
    onSuccess: async () => {
      invalidate();
      showSuccessAlert("Cập nhật biên bản nghiệm thu phương tiện thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Cập nhật biên bản nghiệm thu phương tiện thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/nghiemthu-phuongtien/${id}`)).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Xóa biên bản nghiệm thu phương tiện thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Xóa biên bản nghiệm thu phương tiện thất bại",
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      return (
        await api.post(
          `/nghiemthu-phuongtien/capnhattrangthai?id=${id}&userId=${userId}`,
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
      return (await api.post(`/nghiemthu-phuongtien/huy?id=${id}`)).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Hủy biên bản nghiệm thu phương tiện thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Hủy biên bản nghiệm thu phương tiện thất bại",
      );
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.put(
          `/nghiemthu-phuongtien/batch`,
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