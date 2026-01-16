import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { TypeAssetType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import * as XLSX from "xlsx";

export const useTypeAssetMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  assetGroup?: string
) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: TypeAssetType) => {
      const res = await api.post("/loaitaisancon", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTypeAssets"] });
      showSuccessAlert("Tạo loại ccdc thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo loại ccdc thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TypeAssetType) => {
      const res = await api.put(`/loaitaisancon/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTypeAssets"] });
      showSuccessAlert("Sửa loại ccdc thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa loại ccdc thất bại"
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/loaitaisancon/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTypeAssets"] });
      showSuccessAlert("Xóa loại ccdc thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa loại ccdc thất bại"
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/loaitaisancon/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTypeAssets"] });
      showSuccessAlert(data || "Xóa loại ccdc thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa loại ccdc thất bại"
      );
    },
  });

  const { data = { items: [], totalItems: 0 }, isLoading } = useQuery({
    queryKey: ["typeAssetsPage", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/loaitaisancon/paged", {
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

  const { data: allTypeAssets = [] } = useQuery({
    queryKey: ["allTypeAssets"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/loaitaisancon");
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const { data: typeAssetsByAssetGroup = [] } = useQuery({
    queryKey: ["typeAssetsByAssetGroup", assetGroup], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get(`/loaitaisancon/byloaitaisan/${assetGroup}`);
      return res.data;
    },
    enabled: !!assetGroup,
  });

  const { data: assetGroups = [] } = useQuery({
    queryKey: ["assetGroups"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/nhomtaisan", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const exportMutation = useMutation({
    mutationFn: async (dataToExport: TypeAssetType[]) => {
      return new Promise((resolve) => {
        const worksheetData = dataToExport.map((item) => ({
          "Mã loại tài sản con": item.id || "",
          "Mã loại tài sản cha": item.idLoaiTs || "",
          "Tên loại tài sản": item.tenLoai || "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "LoaiTaiSanCon");
        XLSX.writeFile(workbook, "danh_sach_loai_tai_san_con.xlsx");
        resolve(true);
      });
    },
    onSuccess: () => showSuccessAlert("Xuất file loại tài sản thành công"),
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

            const listImport: TypeAssetType[] = [];
            const errors: string[] = [];

            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              if (!row[0] && !row[1] && !row[2]) continue;

              const id = row[0]?.toString().trim() || "";
              const idLoaiTs = row[1]?.toString().trim() || "";
              const tenLoai = row[2]?.toString().trim() || "";

              const rowErrors: string[] = [];

              if (!id) rowErrors.push("Mã loại con trống");
              if (!tenLoai) rowErrors.push("Tên loại trống");

              const parentExists = assetGroups.some(
                (group: any) => group.id === idLoaiTs
              );

              if (!idLoaiTs) {
                rowErrors.push("Mã loại cha trống");
              } else if (!parentExists) {
                rowErrors.push(`Mã cha ${idLoaiTs} không tồn tại`);
              }

              if (rowErrors.length > 0) {
                errors.push(`Dòng ${i + 1}: ${rowErrors.join(", ")}`);
              } else {
                listImport.push({ id, idLoaiTs, tenLoai });
              }
            }

            if (errors.length > 0) {
              reject(new Error(errors.join("\n")));
            } else if (listImport.length > 0) {
              const res = await api.post("/loaitaisancon/batch", listImport);
              resolve(res.data);
            } else {
              reject(new Error("File không có dữ liệu"));
            }
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTypeAssets"] });
      showSuccessAlert("Import dữ liệu thành công");
    },
    onError: (error: any) => {
      if (!error.message.includes("\n")) {
        showErrorAlert(error.message || "Lỗi khi import dữ liệu");
      }
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    importExcelMutation,
    exportMutation,
    allTypeAssets,
    typeAssets: data,
    isLoading,
    assetGroups,
    typeAssetsByAssetGroup,
  };
};
