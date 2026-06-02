import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import api from "../../../config/api.config";
import { BienPhapMayMocData } from "../types";
import { CongTy } from "../../../utils/const";
import { BienPhapMayMocAdapter } from "../Adapter";

const KEY = "bienPhapMayMocPage";
const URI = "bienphap-maymoc";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useBienPhapMayMocQuery = () =>
  useQuery({
    queryKey: [KEY],
    queryFn: async () => {
      const res = await api.get(`/${URI}?idcongty=${CongTy.CT001}`);
      return (res.data?.data as BienPhapMayMocData[]) ?? [];
    },
  });

export const useBienPhapMayMocByGiamDinhQuery = (idGiamDinhMayMoc: string) =>
  useQuery({
    queryKey: ["bienPhapMayMocByGiamDinh", idGiamDinhMayMoc],
    enabled: !!idGiamDinhMayMoc,
    queryFn: async () => {
      const res = await api.get(`/${URI}/giamdinh-maymoc/${idGiamDinhMayMoc}`);
      return ((res.data?.data as BienPhapMayMocData[]) ?? []).map((item) =>
        BienPhapMayMocAdapter(item),
      );
    },
  });

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useBienPhapMayMocMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [KEY],
    });
    queryClient.invalidateQueries({
      queryKey: ["bienPhapMayMocByGiamDinh"],
    });
    queryClient.invalidateQueries({ queryKey: ["inspectionByBienBan"] });
    queryClient.invalidateQueries({ queryKey: [KEY] });
  };

  const createMutation = useMutation({
    mutationFn: async (data: BienPhapMayMocData) => {
      const res = await api.post(`/${URI}`, data);
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Tạo biện pháp sửa chữa thành công");
    },
    onError: (err: any) => {
      showErrorAlert(
        err.response?.data?.message || err.message || "Tạo thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BienPhapMayMocData) => {
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
