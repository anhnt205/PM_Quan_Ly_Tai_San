import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { RepairLevel } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import * as XLSX from "xlsx";
import { s } from "../../../utils/helpers";

export const useRepairLevelMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: RepairLevel) => {
      const res = await api.post("/cap-sua-chua", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairLevelPage"] });
      queryClient.invalidateQueries({ queryKey: ["allRepairLevels"] });
      showSuccessAlert("Tạo cấp sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo cấp sửa chữa thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: RepairLevel) => {
      const res = await api.put(`/cap-sua-chua/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairLevelPage"] });
      queryClient.invalidateQueries({ queryKey: ["allRepairLevels"] });
      showSuccessAlert("Sửa cấp sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa cấp sửa chữa thất bại",
      );
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/cap-sua-chua/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairLevelPage"] });
      queryClient.invalidateQueries({ queryKey: ["allRepairLevels"] });
      showSuccessAlert("Xóa cấp sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa cấp sửa chữa thất bại",
      );
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // Logic xóa nhiều chưa hỗ trợ endpoint batch cho cap-sua-chua,
      // tạm thời gọi xóa từng cái hoặc chờ backend cập nhật.
      // Dưới đây giả định backend có /batch hoặc gọi delete lần lượt.
      const promises = ids.map((id) => api.delete(`/cap-sua-chua/${id}`));
      await Promise.all(promises);
      return "Xóa các bản ghi thành công";
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["repairLevelPage"] });
      queryClient.invalidateQueries({ queryKey: ["allRepairLevels"] });
      showSuccessAlert(data || "Xóa cấp sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa cấp sửa chữa thất bại",
      );
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/cap-sua-chua/delete-all`);
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["repairLevelPage"] });
      queryClient.invalidateQueries({ queryKey: ["allRepairLevels"] });
      showSuccessAlert(data || "Xóa toàn bộ cấp sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa toàn bộ cấp sửa chữa thất bại",
      );
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (dataToExport: RepairLevel[]) => {
      const payload = dataToExport.map((item) => ({
        "Ký hiệu": item.kyHieu || "",
        "Cấp sửa chữa": item.ten || "",
        "Chu kỳ": item.chuKyThucHien || "",
        "Số lần/chu kỳ": item.soLanTrongChuKy || 0,
        "Thời gian sửa": item.thoiGianSuaChua || "",
        "Ghi chú": item.ghiChu || "",
      }));

      const response = await api.post("/upload/export", payload, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "danh_sach_cap_sua_chua.xlsx");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    },
    onSuccess: () => showSuccessAlert("Xuất file thành công"),
    onError: () => showErrorAlert("Lỗi khi kết nối server để xuất file"),
  });

  const importExcelMutation = useMutation({
    mutationFn: async (file: File) => {
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

            const listImport: any[] = [];
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (!row[0] && !row[1]) continue;
              listImport.push({
                kyHieu: s(row[0]),
                ten: s(row[1]),
                chuKyThucHien: s(row[2]),
                soLanTrongChuKy: Number(row[3]) || 0,
                thoiGianSuaChua: s(row[4]),
                ghiChu: s(row[5]),
              });
            }

            // Backend chưa có endpoint nhập batch, tạm thời loop post
            for (const item of listImport) {
              await api.post("/cap-sua-chua", item);
            }
            queryClient.invalidateQueries({ queryKey: ["repairLevelPage"] });
            queryClient.invalidateQueries({ queryKey: ["allRepairLevels"] });
            resolve("Import hoàn tất");
          } catch (err) {
            reject(new Error("Lỗi định dạng file hoặc lỗi hệ thống"));
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    onSuccess: () => {
      showSuccessAlert("Import thành công");
    },
    onError: (error: any) => {
      showErrorAlert(error.message || "Lỗi khi import dữ liệu");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    importExcelMutation,
    exportMutation,
    deleteAllMutation,
  };
};

export const useAllRepairLevelQuery = () => {
  return useQuery({
    queryKey: ["allRepairLevels"],
    queryFn: async () => {
      const res = await api.get("/cap-sua-chua");
      return res.data.data;
    },
  });
};

export const useRepairLevelPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
) => {
  return useQuery({
    queryKey: ["repairLevelPage", page, pageSize, searchValue],
    queryFn: async () => {
      const res = await api.get("/cap-sua-chua/paged", {
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
