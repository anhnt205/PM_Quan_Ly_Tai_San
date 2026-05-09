import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useChuKySuaChuaQuery = (page: number, pageSize: number, searchValue: string) => {
  return useQuery({
    queryKey: ["chuKySuaChuaPaged", page, pageSize, searchValue],
    queryFn: async () => {
      const res = await api.get("/chukysuachua", {
        params: { page, pageSize, searchValue },
      });
      return res.data;
    },
  });
};

export const useChuKySuaChuaSyncMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any[]) => {
      const res = await api.post("/chukysuachua/sync", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chuKySuaChuaPaged"] });
      showSuccessAlert("Đồng bộ chu kỳ sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Đồng bộ thất bại"
      );
    },
  });
};
