import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { ModelAssetType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import * as XLSX from "xlsx";
import { b, formatDateTime, s } from "../../../utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import dayjs from "dayjs";

export const useModelAssetMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
) => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss");

  const createMutation = useMutation({
    mutationFn: async (data: ModelAssetType) => {
      const currentUser = user?.taiKhoan?.tenDangNhap || "admin";
      const res = await api.post("/mohinhtaisan", {
        ...data,
        idCongTy: "ct001",
        ngayTao: now,
        nguoiTao: currentUser,
        ngayCapNhat: now,
        nguoiCapNhat: currentUser,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modelAssets"] });
      queryClient.invalidateQueries({ queryKey: ["modelAssetsPage"] });
      showSuccessAlert("Tạo mô hình tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo mô hình tài sản thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ModelAssetType) => {
      const currentUser = user?.taiKhoan?.tenDangNhap || "admin";
      const res = await api.put(`/mohinhtaisan/${data.id}`, {
        ...data,
        ngayCapNhat: now,
        nguoiCapNhat: currentUser,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modelAssets"] });
      queryClient.invalidateQueries({ queryKey: ["modelAssetsPage"] });
      showSuccessAlert("Sửa mô hình tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa mô hình tài sản thất bại",
      );
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/mohinhtaisan/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modelAssets"] });
      queryClient.invalidateQueries({ queryKey: ["modelAssetsPage"] });
      showSuccessAlert("Xóa mô hình tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa mô hình tài sản thất bại",
      );
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/mohinhtaisan/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modelAssets"] });
      queryClient.invalidateQueries({ queryKey: ["modelAssetsPage"] });
      showSuccessAlert(data || "Xóa mô hình tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa mô hình tài sản thất bại",
      );
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (dataToExport: ModelAssetType[]) => {
      const payload = dataToExport.map((item) => ({
        "Mã mô hình": item.id || "",
        "Tên mô hình": item.tenMoHinh || "",
        "Phương pháp khấu hao": item.phuongPhapKhauHao || "",
        "Kỳ khấu hao": item.kyKhauHao || "",
        "Loại kỳ khấu hao": item.loaiKyKhauHao || "",
        "Tài khoản tài sản": item.taiKhoanTaiSan || "",
        "Tài khoản khấu hao": item.taiKhoanKhauHao || "",
        "Tài khoản chi phí": item.taiKhoanChiPhi || "",
        "Ngày tạo": item.ngayTao
          ? item.ngayTao.replace("T", " ").split(".")[0]
          : "",
        "Ngày cập nhật": item.ngayCapNhat
          ? item.ngayCapNhat.replace("T", " ").split(".")[0]
          : "",
      }));

      const response = await api.post("/upload/export", payload, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "danh_sach_mo_hinh_tai_san.xlsx");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    },
    onSuccess: () => showSuccessAlert("Xuất file mô hình tài sản thành công"),
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

            const listImport: ModelAssetType[] = [];
            const errorMessages: string[] = [];
            const currentUser = "admin";

            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];

              if (!row[0] && !row[1]) continue;

              const id = s(row[0]);
              const tenMoHinh = s(row[1]);

              const rowErrors: string[] = [];
              if (!id) rowErrors.push("Mã mô hình không được để trống");
              if (!tenMoHinh) rowErrors.push("Tên mô hình không được để trống");

              if (rowErrors.length > 0) {
                errorMessages.push(`Dòng ${i + 1}: ${rowErrors.join(", ")}`);
              } else {
                listImport.push({
                  id,
                  tenMoHinh,
                  idCongTy: "ct001",
                  ngayTao: formatDateTime(row[9]),
                  ngayCapNhat: formatDateTime(row[10]),
                  nguoiTao: currentUser,
                  nguoiCapNhat: currentUser,
                });
              }
            }

            if (errorMessages.length > 0) {
              reject(new Error(errorMessages.join("\n")));
            } else if (listImport.length > 0) {
              const res = await api.post("/mohinhtaisan/batch", listImport);
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
      queryClient.invalidateQueries({ queryKey: ["modelAssets"] });
      queryClient.invalidateQueries({ queryKey: ["modelAssetsPage"] });
      showSuccessAlert("Import mô hình tài sản thành công");
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
  };
};

export const useModelAssetPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
) => {
  return useQuery({
    queryKey: ["modelAssetsPage", page, pageSize, searchValue],
    queryFn: async () => {
      const res = await api.get("/mohinhtaisan/paged", {
        params: {
          idCongTy: "ct001",
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

export const useAllModelAssetQuery = () => {
  return useQuery({
    queryKey: ["allModelAssets"],
    queryFn: async () => {
      const res = await api.get("/mohinhtaisan/paged", {
        params: {
          idCongTy: "ct001",
          page: 1,
          size: 1000,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
