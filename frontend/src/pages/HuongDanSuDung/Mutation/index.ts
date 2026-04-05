import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { HuongDanType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useHuongDanMutation = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async (data: HuongDanType) => {
            const res = await api.post("/huong-dan", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["huongDan"] });
            showSuccessAlert("Tạo hướng dẫn thành công");
        },
        onError: (error: any) => {
            showErrorAlert(error.response?.data?.message || error.message || "Tạo hướng dẫn thất bại");
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: HuongDanType) => {
            const res = await api.put(`/huong-dan/${data.id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["huongDan"] });
            showSuccessAlert("Cập nhật hướng dẫn thành công");
        },
        onError: (error: any) => {
            showErrorAlert(error.response?.data?.message || error.message || "Cập nhật hướng dẫn thất bại");
        },
    });

    return { createMutation, updateMutation };
};

export const useHuongDanQuery = () => {
    return useQuery({
        queryKey: ["huongDan"],
        queryFn: async () => {
            const res = await api.get("/huong-dan");
            return res.data as HuongDanType[];
        },
    });
};
