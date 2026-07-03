import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { MaintenanceRepairType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import * as XLSX from "xlsx";
import { b, s } from "../../../utils/helpers";

export const useLoaiSCBDMutation = () => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairType) => {
      const res = await api.post("/loaiscbd", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["loaiscbdPage"] });
      showSuccessAlert("Tạo loại sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo loại sửa chữa thất bại",
      );
    },
  });

  const createBatchMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairType[]) => {
      const res = await api.post("/loaiscbd/batch", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loaiscbdPage"] });
      showSuccessAlert("Tạo hàng loạt loại sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Tạo hàng loạt thất bại");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairType) => {
      const res = await api.put(`/loaiscbd/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["loaiscbdPage"] });
      showSuccessAlert("Sửa loại sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa loại sửa chữa thất bại",
      );
    },
  });

  const updateBatchMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairType[]) => {
      const res = await api.put("/loaiscbd/batch", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loaiscbdPage"] });
      showSuccessAlert("Sửa hàng loạt loại sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Sửa hàng loạt thất bại");
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/loaiscbd/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["loaiscbdPage"] });
      showSuccessAlert("Xóa loại sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa loại sửa chữa thất bại",
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/loaiscbd/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["loaiscbdPage"] });
      showSuccessAlert(data || "Xóa loại sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa loại sửa chữa thất bại",
      );
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/loaiscbd/delete-all`);
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["loaiscbdPage"] });
      showSuccessAlert(data || "Xóa loại đơn vị sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa loại đơn vị sửa chữa thất bại",
      );
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (dataToExport: MaintenanceRepairType[]) => {
      const payload = dataToExport.map((item) => ({
        "Mã loại sửa chữa": item.id || "",
        "Tên loại sửa chữa": item.ten || "",
      }));

      const response = await api.post("/upload/export", payload, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "danh_sach_loai_scbd.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    },
    onSuccess: () => showSuccessAlert("Xuất file loại sửa chữa thành công"),
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

            const listImport: MaintenanceRepairType[] = [];
            const errorMessages: string[] = [];

            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (!row[0] && !row[1]) continue;

              const id = s(row[0]);
              const ten = s(row[1]);

              const rowErrors: string[] = [];
              if (!id) rowErrors.push("Mã loại sửa chữa không được để trống");
              if (!ten) rowErrors.push("Tên loại sửa chữa không được để trống");

              if (rowErrors.length > 0) {
                errorMessages.push(`Dòng ${i + 1}: ${rowErrors.join(", ")}`);
              } else {
                listImport.push({
                  id,
                  ten,
                });
              }
            }

            if (errorMessages.length > 0) {
              reject(new Error(errorMessages.join("\n")));
            } else if (listImport.length > 0) {
              const res = await api.post("/loaiscbd/batch", listImport);
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
      queryClient.invalidateQueries({ queryKey: ["loaiscbdPage"] });
      showSuccessAlert("Import loại sửa chữa thành công");
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
    createBatchMutation,
    updateBatchMutation,
  };
};

export const useloaiscbdPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
) => {
  return useQuery({
    queryKey: ["loaiscbdPage", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/loaiscbd/paged", {
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
};

export const useAllLoaiSCBDQuery = () => {
  return useQuery({
    queryKey: ["allLoaiSCBD"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/loaiscbd");
      return res.data.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
