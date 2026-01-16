import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { CapitalSourceType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import * as XLSX from "xlsx";

export const useCapitalSourceMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string
) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: CapitalSourceType) => {
      const res = await api.post("/nguonvon", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["capitalSourcesPage"] });
      showSuccessAlert("Tạo nguồn vốn thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo nguồn vốn thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CapitalSourceType) => {
      const res = await api.put(`/nguonvon/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["capitalSourcesPage"] });
      showSuccessAlert("Sửa nguồn vốn thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa nguồn vốn thất bại"
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/nguonvon/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["capitalSourcesPage"] });
      showSuccessAlert("Xóa nguồn vốn thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa nguồn vốn thất bại"
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/nguonvon/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["capitalSourcesPage"] });
      showSuccessAlert(data || "Xóa nguồn vốn thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa nguồn vốn thất bại"
      );
    },
  });

  const { data = { items: [], totalItems: 0 }, isLoading } = useQuery({
    queryKey: ["capitalSourcesPage", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/nguonvon/paged", {
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

  const { data: allData = [] } = useQuery({
    queryKey: ["capitalSources"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/nguonvon", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const exportMutation = useMutation({
    mutationFn: async (dataToExport: CapitalSourceType[]) => {
      return new Promise((resolve) => {
        const worksheetData = dataToExport.map((item) => ({
          Id: item.id || "",
          "Tên nguồn kinh phí": item.tenNguonKinhPhi || "",
          "Ghi chú": item.ghiChu || "",
          "Hiệu lực": item.hieuLuc ? "TRUE" : "FALSE", // Hiển thị TRUE/FALSE như ảnh mẫu
          "Ngày tạo": item.ngayTao || "",
          "Ngày cập nhật": item.ngayCapNhat || "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "NguonVon");
        XLSX.writeFile(workbook, "danh_sach_nguon_von.xlsx");
        resolve(true);
      });
    },
    onSuccess: () => showSuccessAlert("Xuất file nguồn vốn thành công"),
    onError: () => showErrorAlert("Lỗi khi xuất file"),
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
            });

            const listNguonVon: CapitalSourceType[] = [];

            // Bắt đầu từ i = 1 để bỏ qua tiêu đề
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (!row[1]) continue; // Bỏ qua nếu không có Tên nguồn kinh phí

              // Xử lý logic Hiệu lực (TRUE/FALSE từ excel sang boolean)
              const hieuLucValue = row[3]?.toString().toUpperCase() === "TRUE";

              listNguonVon.push({
                id: row[0]?.toString() || "",
                tenNguonKinhPhi: row[1]?.toString() || "",
                ghiChu: row[2]?.toString() || "",
                hieuLuc: hieuLucValue,
                idCongTy: "ct001", // Gán mặc định theo pattern của bạn
                isActive: true, // Mặc định hoạt động khi import
              });
            }

            if (listNguonVon.length > 0) {
              // Gọi đến đúng endpoint /api/nguonvon/batch
              const res = await api.post("/nguonvon/batch", listNguonVon);
              resolve(res.data);
            } else {
              reject(new Error("File không có dữ liệu hợp lệ"));
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
      queryClient.invalidateQueries({ queryKey: ["allCapitalSources"] });
      showSuccessAlert("Import dữ liệu nguồn vốn thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Lỗi khi lưu dữ liệu import nguồn vốn"
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    exportMutation,
    importExcelMutation,
    allData,
    capitalSourcesPage: data,
    isLoading,
  };
};
