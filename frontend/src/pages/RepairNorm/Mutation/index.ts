import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { DinhMucSuaChua } from "../types";
import { showSuccessAlert, showErrorAlert } from "../../../components/Alert";

export const useDinhMucSuaChuaPageQuery = (page: number, size: number, search: string) => {
    return useQuery({
        queryKey: ["dinhMucSuaChuaPage", page, size, search],
        queryFn: async () => {
            const res = await api.get("/dinhmucsuachua/paged", {
                params: { page, size, search },
            });
            return res.data;
        },
    });
};

export const useDinhMucSuaChuaMutation = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async (data: { dto: DinhMucSuaChua; username: string }) => {
            const res = await api.post("/dinhmucsuachua", data.dto, {
                params: { username: data.username },
            });
            return res.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccessAlert("Tạo định mức thành công");
                queryClient.invalidateQueries({ queryKey: ["dinhMucSuaChuaPage"] });
            } else {
                showErrorAlert(res.message);
            }
        },
        onError: (err: any) => {
            showErrorAlert(err.response?.data?.message || "Lỗi khi tạo định mức");
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: { id: string; dto: DinhMucSuaChua; username: string }) => {
            const res = await api.put(`/dinhmucsuachua/${data.id}`, data.dto, {
                params: { username: data.username },
            });
            return res.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccessAlert("Cập nhật định mức thành công");
                queryClient.invalidateQueries({ queryKey: ["dinhMucSuaChuaPage"] });
            } else {
                showErrorAlert(res.message);
            }
        },
        onError: (err: any) => {
            showErrorAlert(err.response?.data?.message || "Lỗi khi cập nhật định mức");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/dinhmucsuachua/${id}`);
            return res.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccessAlert("Xóa định mức thành công");
                queryClient.invalidateQueries({ queryKey: ["dinhMucSuaChuaPage"] });
            } else {
                showErrorAlert(res.message);
            }
        },
        onError: (err: any) => {
            showErrorAlert(err.response?.data?.message || "Lỗi khi xóa định mức");
        },
    });

    return { createMutation, updateMutation, deleteMutation };
};
