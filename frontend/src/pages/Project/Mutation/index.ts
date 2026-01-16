import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { ProjectType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import * as XLSX from "xlsx";

export const useProjectMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string
) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: ProjectType) => {
      const res = await api.post("/duan", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projectsPage"] });
      showSuccessAlert("Tạo dự án thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Tạo dự án thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProjectType) => {
      const res = await api.put(`/duan/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projectsPage"] });
      showSuccessAlert("Sửa dự án thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Sửa dự án thất bại"
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/duan/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projectsPage"] });
      showSuccessAlert("Xóa dự án thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Xóa dự án thất bại"
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/duan/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projectsPage"] });
      showSuccessAlert(data || "Xóa dự án thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Xóa dự án thất bại"
      );
    },
  });

  const { data = { items: [], totalItems: 0 }, isLoading } = useQuery({
    queryKey: ["projectsPage", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/duan/paged", {
        params: {
          idcongty: "ct001",
          page: page,
          size: pageSize,
          search: searchValue,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ["allProjects"],
    queryFn: async () => {
      const res = await api.get("/duan", {
        params: { idcongty: "ct001" }, // Truyền idcongty qua query string
      });
      // Swagger cho thấy trả về trực tiếp mảng dự án
      return res.data || [];
    },
  });

  // 1. Mutation cho EXPORT
  const exportMutation = useMutation({
    mutationFn: async (dataToExport: ProjectType[]) => {
      return new Promise((resolve) => {
        // Tạo độ trễ giả lập 500ms để người dùng thấy Dialog đang xử lý
        setTimeout(() => {
          const worksheetData = dataToExport.map((item) => ({
            "Mã dự án": item.id || "",
            "Tên dự án": item.tenDuAn || "",
            "Ghi chú": item.ghiChu || "",
            "Hiệu lực": item.hieuLuc !== false ? "TRUE" : "FALSE",
          }));

          const worksheet = XLSX.utils.json_to_sheet(worksheetData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "DuAn");
          XLSX.writeFile(workbook, "danh_sach_du_an.xlsx");
          resolve(true);
        }, 500);
      });
    },
    onSuccess: () => {
      showSuccessAlert("Xuất file thành công!");
    },
    onError: () => {
      showErrorAlert("Có lỗi khi xuất file Excel");
    },
  });

  // 2. Mutation cho IMPORT
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
            });

            const listDuAn: ProjectType[] = [];
            const b = (val: any) =>
              val === true ||
              val?.toString().toUpperCase() === "TRUE" ||
              val === null ||
              val === undefined;

            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (!row[1]) continue;

              listDuAn.push({
                id: row[0]?.toString() || "",
                tenDuAn: row[1]?.toString() || "",
                ghiChu: row[2]?.toString() || "",
                hieuLuc: b(row[3]),
                idCongTy: "ct001",
                isActive: true,
                nguoiTao: "admin",
                nguoiCapNhat: "admin",
              });
            }

            if (listDuAn.length > 0) {
              const res = await api.post("/duan/batch", listDuAn);
              resolve(res.data);
            } else {
              reject(new Error("File Excel không có dữ liệu hợp lệ"));
            }
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectsPage"] });
      showSuccessAlert("Import dữ liệu dự án thành công!");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi lưu dữ liệu import"
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    allProjects,
    projectsPage: data,
    exportMutation,
    importExcelMutation,
    isLoading,
  };
};
