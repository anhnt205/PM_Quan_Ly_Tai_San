import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { DepartmentType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import * as XLSX from "xlsx";

export const useDepartmentMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: DepartmentType) => {
      const res = await api.post("/phongban", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["departmentsPage"] });
      showSuccessAlert("Tạo phòng ban thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo phòng ban thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: DepartmentType) => {
      const res = await api.put(`/phongban/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["departmentsPage"] });
      showSuccessAlert("Sửa phòng ban thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa phòng ban thất bại",
      );
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/phongban/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["departmentsPage"] });
      showSuccessAlert("Xóa phòng ban thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa phòng ban thất bại",
      );
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/phongban/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["departmentsPage"] });
      showSuccessAlert(data || "Xóa phòng ban thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa phòng ban thất bại",
      );
    },
  });
  const getByIdMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/phongban/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Lấy phòng ban thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Lấy phòng ban thất bại",
      );
      return null;
    },
  });
  const { data = { items: [], totalItems: 0 }, isLoading } = useQuery({
    queryKey: ["departmentsPage", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/phongban/paged", {
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

  const { data: allDepartments = [] } = useQuery({
    queryKey: ["allDepartments"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/phongban", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data;
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (dataToExport: DepartmentType[]) => {
      return new Promise((resolve) => {
        const worksheetData = dataToExport.map((item) => ({
          "Mã phòng ban": item.id || "",
          "Tên phòng ban": item.tenPhongBan || "",
          "Mã phòng cấp trên": item.phongCapTren || "",
          "Là kho": item.isKho ? "TRUE" : "FALSE",
          "Là lãnh đạo": item.isLanhDao ? "TRUE" : "FALSE",
          "Trạng thái": item.isActive ? "Đang hoạt động" : "Ngừng hoạt động",
          "Loại kho":
            item.loaiKho === 1
              ? "Kho cấp phát"
              : item.loaiKho === 2
                ? "Kho thu hồi"
                : "Không phải kho", // Giá trị 0 hoặc undefined sẽ vào đây
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "PhongBan");
        XLSX.writeFile(workbook, "danh_sach_phong_ban.xlsx");
        resolve(true);
      });
    },
    onSuccess: () => showSuccessAlert("Xuất file thành công"),
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

            const listPhongBan: DepartmentType[] = [];

            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (!row[1]) continue;

              const loaiKhoText = row[6]?.toString().toLowerCase().trim();
              let loaiKhoValue = 0;
              if (loaiKhoText === "kho cấp phát") loaiKhoValue = 1;
              else if (loaiKhoText === "kho thu hồi") loaiKhoValue = 2;

              listPhongBan.push({
                id: row[0]?.toString() || "",
                tenPhongBan: row[1]?.toString() || "",
                phongCapTren: row[2]?.toString() || "",
                idCongTy: "ct001",
                isKho:
                  row[3] === true ||
                  row[3]?.toString().toUpperCase() === "TRUE",
                isLanhDao:
                  row[4] === true ||
                  row[4]?.toString().toUpperCase() === "TRUE",
                isActive:
                  row[5]?.toString() === "Đang hoạt động" ||
                  row[5] === true ||
                  row[5]?.toString().toUpperCase() === "TRUE",
                loaiKho: loaiKhoValue,
              });
            }

            if (listPhongBan.length > 0) {
              const res = await api.post("/phongban/batch", listPhongBan);
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
      queryClient.invalidateQueries({ queryKey: ["departmentsPage"] });
      showSuccessAlert("Import dữ liệu thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Lỗi khi lưu dữ liệu import",
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    importExcelMutation,
    exportMutation,
    departmentsPage: data,
    allDepartments,
    isLoading,
    getByIdMutation,
  };
};
