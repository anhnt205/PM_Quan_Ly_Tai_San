import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { StaffType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import dayjs from "dayjs";
import imageCompression from "browser-image-compression";

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

  const handleUploadFileS3 = useMutation({
    mutationFn: async ({
      name,
      file,
      type,
    }: {
      name: string;
      file: File;
      type: "tailieu" | "chuky";
    }) => {
      let fileToUpload: File | Blob = file;
      let ext = "pdf";
      let contentType = "application/pdf";

      if (type === "chuky") {
        // 1. Chuyển sang PNG để pdf-lib có thể đọc trực tiếp (embedPng)
        fileToUpload = await imageCompression(file, {
          maxWidthOrHeight: 300,
          maxSizeMB: 1,
          fileType: "image/png", // ÉP BUỘC ĐỊNH DẠNG PNG
        });
        ext = "png";
        contentType = "image/png";
      } else {
        // 2. Nếu là tài liệu: Giữ nguyên file PDF
        if (file.type !== "application/pdf") {
          alert("Vui lòng chọn định dạng file PDF cho tài liệu");
          throw new Error("Invalid file type"); // Nên throw lỗi để mutation nhận biết
        }
        fileToUpload = file;
        ext = "pdf";
        contentType = "application/pdf";
      }

      // Tạo fileName ngẫu nhiên
      const fileName = `${name.split(".")?.[0] || "file"}-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      // 3. Gọi API Spring Boot
      const res = await api.get(`/s3/put`, {
        params: { fileName, type },
      });

      const url = res.data?.data;

      // 4. Upload trực tiếp lên S3
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: fileToUpload,
      });

      // 5. Trả về key
      const key = url.split(".amazonaws.com/")[1].split("?")[0];
      return key || "";
    },
  });
  const handleDownloadS3 = async (currentKey: string) => {
    if (!currentKey) return;
    try {
      // Encode tên file để xử lý ký tự đặc biệt
      const fileName = decodeURIComponent(
        currentKey.split("/").pop() || "file",
      );
      const response = await api.get(`/s3/download?key=${currentKey}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showErrorAlert("Không thể tải tập tin");
    }
  };

  const handlePreviewS3 = async (key: string) => {
    if (!key) return;
    try {
      // Encode tên file để xử lý ký tự đặc biệt
      const response = await api.get(`/s3/preview?key=${key}`, {
        responseType: "blob",
      });
      // response.data lúc này là một đối tượng Blob (Binary Large Object)
      return response.data;
    } catch (error) {
      console.log("Không thể tải tập tin");
      return null;
    }
  };

  return {
    exportMutation,
    importExcelMutation,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    uploadMutation,
    getByIdMutation,
    handleUploadFileS3,
    handleDownloadS3,
    handlePreviewS3,
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
export const useAllStaffsQuery = () => {
  return useQuery({
    queryKey: ["allStaffs"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/nhanvien", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
export const useGetFileQuery = (currentKey?: string) => {
  return useQuery({
    queryKey: ["file", currentKey], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get(`/s3/get?key=${currentKey}`);
      return (res.data.data as string) || "";
    },
    placeholderData: (previousData) => previousData,
    enabled: !!currentKey,
  });
};
