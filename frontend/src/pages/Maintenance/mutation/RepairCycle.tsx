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

export const useMaintenanceHistoryQuery = (
  page: number,
  pageSize: number,
  searchValue: string,
  status?: string,
) => {
  return useQuery({
    queryKey: ["maintenanceHistoryPaged", page, pageSize, searchValue, status],
    queryFn: async () => {
      const res = await api.get("/quy-trinh/history-paged", {
        params: {
          page: page + 1,
          pageSize,
          search: searchValue,
          status: status !== "" ? Number(status) : undefined,
        },
      });
      return res.data.data || res.data;
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
