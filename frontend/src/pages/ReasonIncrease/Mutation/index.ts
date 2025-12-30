import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api.config";
import { ReasonIncreaseType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useReasonIncreaseMutation = (
  page: number,
  pageSize: number,
  searchValue: string
) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: ReasonIncreaseType) => {
      const res = await api.post("/lydotang", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reasonIncreases"] });
      showSuccessAlert("Tạo lý do tăng thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo lý do tăng thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ReasonIncreaseType) => {
      const res = await api.put(`/lydotang/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reasonIncreases"] });
      showSuccessAlert("Sửa lý do tăng thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa lý do tăng thất bại"
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/lydotang/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reasonIncreases"] });
      showSuccessAlert("Xóa lý do tăng thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa lý do tăng thất bại"
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/lydotang/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reasonIncreases"] });
      showSuccessAlert(data || "Xóa lý do tăng thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa lý do tăng thất bại"
      );
    },
  });

  const { data = { items: [], totalItems: 0 }, isLoading } = useQuery({
    queryKey: ["reasonIncreases", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/lydotang/paged-mini", {
        params: {
          page: page,
          size: pageSize,
          search: searchValue,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const { data: allData = [] } = useQuery({
    queryKey: ["reasonIncreases"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/lydotang");
      return res.data.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    reasonIncreases: data,
    allData,
    isLoading,
  };
};
