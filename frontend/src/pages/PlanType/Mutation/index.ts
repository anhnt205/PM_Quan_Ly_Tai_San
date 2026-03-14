import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { PlanTypeType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import * as XLSX from "xlsx";
import { s } from "../../../utils/helpers";
import { CongTy } from "../../../utils/const";

export const usePlanTypeMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: PlanTypeType) => {
      const res = await api.post("/loaikehoachscbd", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["planTypesPage"] });
      showSuccessAlert("Tạo loại kế hoạch thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo loại kế hoạch thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PlanTypeType) => {
      const res = await api.put(`/loaikehoachscbd/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["planTypesPage"] });
      showSuccessAlert("Sửa loại kế hoạch thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa loại kế hoạch thất bại",
      );
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/loaikehoachscbd/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["planTypesPage"] });
      showSuccessAlert("Xóa loại kế hoạch thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa loại kế hoạch thất bại",
      );
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/loaikehoachscbd/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["planTypesPage"] });
      showSuccessAlert(data || "Xóa loại kế hoạch thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa loại kế hoạch thất bại",
      );
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/loaikehoachscbd/delete-all`);
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["planTypesPage"] });
      showSuccessAlert(data || "Xóa loại kế hoạch thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa loại kế hoạch thất bại",
      );
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (dataToExport: PlanTypeType[]) => {
      const payload = dataToExport.map((item) => ({
        "Mã loại kế hoạch": item.id || "",
        "Tên loại kế hoạch": item.tenLoai || "",
      }));

      const response = await api.post("/upload/export", payload, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "danh_sach_loai_kehoach.xlsx");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    },
    onSuccess: () => showSuccessAlert("Xuất file loại kế hoạch thành công"),
    onError: () => showErrorAlert("Lỗi khi kết nối server để xuất file"),
  });

  const importExcelMutation = useMutation({
    mutationFn: (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              defval: "",
            });

            const listImport: PlanTypeType[] = [];
            const errorMessages: string[] = [];

            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];

              if (!row[0] && !row[1] && !row[2]) continue;

              const id = s(row[0]);
              const tenLoai = s(row[1]);

              const rowErrors: string[] = [];

              if (!id) {
                rowErrors.push("Mã loại kế hoạch không được để trống");
              }

              if (!tenLoai) {
                rowErrors.push("Tên loại kế hoạch không được để trống");
              }

              if (rowErrors.length > 0) {
                errorMessages.push(`Dòng ${i + 1}: ${rowErrors.join(", ")}`);
              } else {
                listImport.push({ id, tenLoai });
              }
            }

            if (errorMessages.length > 0) {
              reject(new Error(errorMessages.join("\n")));
            } else if (listImport.length > 0) {
              const res = await api.post("/loaikehoachscbd/batch", listImport);
              resolve(res.data);
            } else {
              reject(new Error("File không có dữ liệu hợp lệ"));
            }
          } catch (err) {
            reject(new Error("Lỗi đọc file hoặc lỗi hệ thống"));
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planTypesPage"] });
      showSuccessAlert("Import loại kế hoạch thành công");
    },
    onError: (error: any) => {
      showErrorAlert(`Import dữ liệu thất bại: \n${error.message}`);
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    exportMutation,
    importExcelMutation,
    deleteAllMutation,
  };
};

export const useAllPlanTypeQuery = () => {
  return useQuery({
    queryKey: ["allPlanTypes"],
    queryFn: async () => {
      const res = await api.get("/loaikehoachscbd", {
        params: {
          page: 0,
          size: 9999,
        },
      });
      console.log(res.data.data);
      return res.data.data;
    },
    placeholderData: (placeholderData) => placeholderData,
  });
};
export const usePlanTypePageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
) => {
  return useQuery({
    queryKey: ["planTypesPage", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/loaikehoachscbd", {
        params: {
          page: page,
          size: pageSize,
          search: searchValue,
        },
      });
      return res.data.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
