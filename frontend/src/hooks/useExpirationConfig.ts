import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../components/Alert";

export const useExpirationConfig = (userId: string) => {
  const queryClient = useQueryClient();

  // 1. Lấy cấu hình hiện tại (Tương đương getConfigTimeExpire)
  const { data: config, isLoading } = useQuery({
    queryKey: ["expirationConfig", userId],
    queryFn: async () => {
      const res = await api.get(`/config/expiration/${userId}`);
      return res.data; // Giả sử trả về { thoiHanTaiLieu: number, ngayBaoHetHan: number }
    },
    enabled: !!userId,
  });

  // 2. Cập nhật cấu hình (Tương đương setConfigTimeExpire)
  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: {
      thoiHanTaiLieu: number;
      ngayBaoHetHan: number;
    }) => {
      return await api.post("/config/expiration", {
        idAccount: userId,
        ...newConfig,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expirationConfig", userId] });
      showSuccessAlert("Thiết lập thời gian hết hạn thành công");
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Cập nhật thất bại");
    },
  });

  return {
    config,
    isLoading,
    updateConfig: updateConfigMutation.mutate,
    isUpdating: updateConfigMutation.isPending,
  };
};
