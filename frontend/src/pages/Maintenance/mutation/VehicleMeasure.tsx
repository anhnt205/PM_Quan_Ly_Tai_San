import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import api from "../../../config/api.config";
import { BienPhapPhuongTienData } from "../types";
import { CongTy } from "../../../utils/const";
import { BienPhapPhuongTienAdapter } from "../Adapter";

const KEY = "bienPhapPhuongTienPage";
const URI = "bienphap-phuongtien";

// ─── Queries ─────────────────────────────────────────────────────────────────

// lấy dữ liệu phân trang
export const useMaintenanceBienPhapPhuongTienPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      KEY,
      page,
      pageSize,
      searchValue,
      trangThai,
      userid,
      isSign,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const res = await api.get("/bienphap-phuongtien/paged", {
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
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

// lấy dữ liệu theo idGiamDinhPhuongTien
export const useBienPhapPhuongTienByGiamDinhQuery = (
  idGiamDinhPhuongTien: string,
) =>
  useQuery({
    queryKey: ["bienPhapPhuongTienByGiamDinh", idGiamDinhPhuongTien],
    enabled: !!idGiamDinhPhuongTien,
    queryFn: async () => {
      const res = await api.get(
        `/${URI}/giamdinh-phuongtien/${idGiamDinhPhuongTien}`,
      );
      return ((res.data?.data as BienPhapPhuongTienData[]) ?? []).map((item) =>
        BienPhapPhuongTienAdapter(item),
      );
    },
  });

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useBienPhapPhuongTienMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [KEY],
    });
    queryClient.invalidateQueries({
      queryKey: ["bienPhapPhuongTienByGiamDinh"],
    });
    queryClient.invalidateQueries({ queryKey: ["vehicleInspectionPage"] });
    queryClient.invalidateQueries({ queryKey: ["vehicleInspectionByBienBan"] });
  };

  const createMutation = useMutation({
    mutationFn: async (data: BienPhapPhuongTienData) => {
      const res = await api.post(`/${URI}`, data);
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Tạo biện pháp sửa chữa phương tiện thành công");
    },
    onError: (err: any) => {
      showErrorAlert(
        err.response?.data?.message || err.message || "Tạo thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BienPhapPhuongTienData) => {
      const res = await api.put(`/${URI}/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Cập nhật thành công");
    },
    onError: (err: any) => {
      showErrorAlert(
        err.response?.data?.message || err.message || "Cập nhật thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/${URI}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Xóa thành công");
    },
    onError: (err: any) => {
      showErrorAlert(
        err.response?.data?.message || err.message || "Xóa thất bại",
      );
    },
  });

  const huyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/${URI}/huy?id=${id}`);
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Hủy biên bản thành công");
    },
    onError: (err: any) => {
      showErrorAlert(
        err.response?.data?.message || err.message || "Hủy thất bại",
      );
    },
  });

  return { createMutation, updateMutation, deleteMutation, huyMutation };
};
