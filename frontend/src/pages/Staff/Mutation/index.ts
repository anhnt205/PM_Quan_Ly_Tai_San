import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { StaffType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import dayjs from "dayjs";

export const useStaffMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: StaffType) => {
      const res = await api.post("/nhanvien", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staffsPage"] });
      showSuccessAlert("Tạo nhân viên thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo nhân viên thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: StaffType) => {
      const res = await api.put(`/nhanvien/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staffsPage"] });
      showSuccessAlert("Sửa nhân viên thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa nhân viên thất bại",
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/nhanvien/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staffsPage"] });
      showSuccessAlert("Xóa nhân viên thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa nhân viên thất bại",
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/nhanvien/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staffsPage"] });
      showSuccessAlert(data || "Xóa nhân viên thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa nhân viên thất bại",
      );
    },
  });

  const getByIdMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/nhanvien/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Lấy nhân viên thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Lấy nhân viên thất bại",
      );
      return null;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.message;
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ["staffsPage"] });
      // showSuccessAlert(data || "Xóa nhân viên thành công");
    },
    onError: (error: any) => {
      console.log(error);
      // showErrorAlert(
      //   error.response?.data?.message ||
      //     error.message ||
      //     "Xóa nhân viên thất bại"
      // );
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const listRes = await api.get("/nhanvien", {
        params: { idcongty: "ct001" },
      });
      const allStaffs = listRes.data;

      const payload = allStaffs.map((s: any) => ({
        "Mã nhân viên": s.id || "",
        "Tên nhân viên": s.hoTen || "",
        "Số điện thoại": s.diDong || "",
        Email: s.emailCongViec || "",
        "Chữ ký nháy": s.chuKyNhay ? s.chuKyNhay.split("/").pop() : "",
        "Chữ ký thường": s.chuKyThuong ? s.chuKyThuong.split("/").pop() : "",
        "Agreement UUId": s.agreementUUId || "",
        "Mã Pin": s.pin || "",
        "Phòng ban (Mã phòng ban)": s.phongBanId || "",
        "Chức vụ (Mã chức vụ)": s.chucVuId || "",
        "Ngày tạo": s.ngayTao || "",
        "Ngày cập nhật": s.ngayCapNhat || "",
      }));

      const res = await api.post("/upload/export", payload, {
        params: { sheetName: "Sheet1" },
        responseType: "blob",
      });

      return res.data;
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = `nhan_vien_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccessAlert("Xuất dữ liệu thành công");
    },
    onError: () => showErrorAlert("Xuất dữ liệu thất bại"),
  });

  const importExcelMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("file", file);

      const res = await api.post("/nhanvien/upload-from-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffsPage"] });
      showSuccessAlert("Import dữ liệu thành công");
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Lỗi khi nhập dữ liệu";
      showErrorAlert(errorMsg);
    },
  });

  const { data: allStaff = [] } = useQuery({
    queryKey: ["staffsPage"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/nhanvien", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data;
    },
  });
  return {
    exportMutation,
    importExcelMutation,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    uploadMutation,
    allStaff,
    getByIdMutation,
  };
};

export const useStaffPagesQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
) => {
  return useQuery({
    queryKey: ["staffsPage", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/nhanvien/paged", {
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
};
export const useAllStaffsQuery = (
) => {
  return useQuery({
    queryKey: ["allStaffs"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/nhanvien");
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};