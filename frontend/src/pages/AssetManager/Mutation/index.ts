import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { AssetChildType, AssetType, HistoryAssetType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import axios from "axios";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { generateCode } from "../../../utils/helpers";

const getColumnLetter = (colIndex: number): string => {
  let letter = "";
  while (colIndex >= 0) {
    letter = String.fromCharCode((colIndex % 26) + 65) + letter;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return letter;
};

export const useAssetManagerMutation = (
  onValidationError?: (messages: string[]) => void,
  onErrorImport?: (messages: string[]) => void,
) => {
  const queryClient = useQueryClient();
  const idCongTy = "ct001";
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs().format("YYYY-MM-DDTHH:mm:ss");

  //taisan
  const createMutation = useMutation({
    mutationFn: async (data: AssetType) => {
      const res = await api.post("/taisan", {
        ...data,
        nguoiTao: user?.taiKhoan?.tenDangNhap || "",
        ngayTao: now,
      });
      return res.data;
    },
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: ["assetsPage"], exact: false });
      createChildAssetBulkMutation.mutate(
        (payload?.taiSanConList || []).map((i) => ({
          ...i,
          id: generateCode(i.idTaiSanCon + "-"),
          nguoiTao: user?.taiKhoan?.tenDangNhap || "",
          ngayTao: now,
        })),
      );
      showSuccessAlert("Tạo tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo tài sản thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AssetType) => {
      const res = await api.put(`/taisan/${data.id}`, {
        ...data,
        nguoiCapNhat: user?.taiKhoan?.tenDangNhap || "",
        ngayCapNhat: now,
      });
      return res.data;
    },
    onSuccess: (data, payload) => {
      console.log(payload);
      const listDeleted = (payload?.taiSanConList || []).filter(
        (i) => i.isDeleted,
      );
      const listUpdated = (payload?.taiSanConList || []).filter(
        (i) => i.isInsert,
      );
      if (listUpdated.length > 0) {
        createChildAssetBulkMutation.mutate(
          (listUpdated || []).map((i) => ({
            ...i,
            id: i.id ? i.id : generateCode(i.idTaiSanCon + "-"),
            nguoiCapNhat: user?.taiKhoan?.tenDangNhap || "",
            ngayCapNhat: now,
          })),
        );
      }
      if (listDeleted.length > 0) {
        (listDeleted || [])
          .filter((i) => i.id)
          .forEach((i) => {
            deleteOneChildAsssetMutation.mutate(i.id);
          });
      }
      queryClient.invalidateQueries({ queryKey: ["assetsPage"], exact: false });
      showSuccessAlert("Sửa tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa tài sản thất bại",
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/taisan/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsPage"], exact: false });
      showSuccessAlert("Xóa tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa tài sản thất bại",
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/taisan/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsPage"], exact: false });
      showSuccessAlert(data || "Xóa tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa tài sản thất bại",
      );
    },
  });

  // taisancon
  const createChildAssetBulkMutation = useMutation({
    mutationFn: async (data: AssetChildType[]) => {
      const res = await api.post("/taisan/taisancon/bulk", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsChild"] });
      console.log("Tạo tài sản con thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo tài sản con thất bại",
      );
    },
  });

  const deleteOneChildAsssetMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/taisan/taisancon/`, {
        params: { idTaiSanCon: id },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsChild"] });
      console.log("Xóa tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa tài sản thất bại",
      );
    },
  });

  const createManyHistoryAssetMutation = useMutation({
    mutationFn: async (data: HistoryAssetType[]) => {
      const res = await api.post(`/lichsudieuchuyentaisan/batch`, data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Tạo lịch sử điều chuyển thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo lịch sử điều chuyển thất bại",
      );
    },
  });

  // --- 1. Mutation Xuất Excel ---
  const exportAssetMutation = useMutation({
    mutationFn: async () => {
      const res = await api.get("/taisan/export/excel", {
        params: { idcongty: idCongTy },
        responseType: "blob",
      });
      return res.data;
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Danh_Sach_Tai_San_${dayjs().format("YYYYMMDD")}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccessAlert("Xuất file Excel thành công");
    },
    onError: () => showErrorAlert("Xuất file thất bại"),
  });

  // --- 2. Mutation Nhập Excel (Mapping 37 trường) ---
  const importAssetMutation = useMutation({
    mutationFn: async (file: File) => {
      // Gọi API gác cổng lấy nhóm tài sản
      const responseGroups = await api.get("/nhomtaisan", {
        params: { idcongty: idCongTy },
      });
      const currentAssetGroups = responseGroups.data || [];

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const errorMessages: string[] = [];
            const maxErrorsBeforeExit = 500;

            // --- GIAI ĐOẠN 1: VALIDATE TOÀN BỘ FILE ---
            for (let index = 0; index < jsonData.length; index++) {
              const item: any = jsonData[index];
              const rowIndex = index + 2;

              // 1. Kiểm tra mã nhóm tài sản
              const maNhomExcel = String(item["Mã nhóm tài sản"] || "").trim();
              const groupExists = currentAssetGroups.some(
                (g: any) => g.id === maNhomExcel,
              );

              if (!maNhomExcel) {
                errorMessages.push(
                  `Cột H - Hàng ${rowIndex}: Mã nhóm tài sản đang bỏ trống`,
                );
              } else if (!groupExists) {
                errorMessages.push(
                  `Cột H - Hàng ${rowIndex}: Mã nhóm [${maNhomExcel}] không tồn tại`,
                );
              }

              // 2. Kiểm tra các trường bắt buộc khác
              if (!item["Mã tài sản"]) {
                errorMessages.push(
                  `Cột B - Hàng ${rowIndex}: ID tài sản đang bỏ trống`,
                );
              }
              if (!item["Số thẻ tài sản"]) {
                errorMessages.push(
                  `Cột C - Hàng ${rowIndex}: Số thẻ tài sản đang bỏ trống`,
                );
              }
              if (!item["Tên tài sản"]) {
                errorMessages.push(
                  `Cột D - Hàng ${rowIndex}: Tên tài sản đang bỏ trống`,
                );
              }
              if (!item["Mã đơn vị hiện thời"]) {
                errorMessages.push(
                  `Cột AF - Hàng ${rowIndex}: Mã đơn vị hiện thời đang bỏ trống`,
                );
              }

              // 3. Kiểm tra định dạng số cho các nguồn vốn
              const fieldsToCheck = [
                "Vốn NS",
                "Vốn vay",
                "Vốn khác",
                "Năm sản xuất",
              ];
              fieldsToCheck.forEach((field) => {
                const val = String(item[field] || "").trim();
                if (val && isNaN(Number(val.replace(/[^0-9.]/g, "")))) {
                  errorMessages.push(
                    `Hàng ${rowIndex}: Cột ${field} phải là số, không được là chữ: "${val}"`,
                  );
                }
              });

              // Kiểm tra giới hạn lỗi
              if (errorMessages.length >= maxErrorsBeforeExit) {
                errorMessages.push(
                  `... Đã dừng kiểm tra sớm do quá nhiều lỗi (>${maxErrorsBeforeExit} lỗi).`,
                );
                break;
              }
            }

            // --- GIAI ĐOẠN 2: KIỂM TRA LỖI TỔNG THỂ ---
            if (errorMessages.length > 0) {
              // Nếu có bất kỳ lỗi nào, reject ngay lập tức và không thực hiện mapping/batching
              return reject({
                isValidationError: true,
                messages: errorMessages,
              });
            }

            // --- GIAI ĐOẠN 3: MAPPING DỮ LIỆU (Chỉ chạy khi 0 lỗi) ---
            const allAssets: AssetType[] = [];
            jsonData.forEach((item: any) => {
              const vonNS =
                Number(String(item["Vốn NS"] || "0").replace(/[^0-9.]/g, "")) ||
                0;
              const vonVay =
                Number(
                  String(item["Vốn vay"] || "0").replace(/[^0-9.]/g, ""),
                ) || 0;
              const vonKhac =
                Number(
                  String(item["Vốn khác"] || "0").replace(/[^0-9.]/g, ""),
                ) || 0;

              allAssets.push({
                id: String(item["Mã tài sản"] || ""),
                soThe: String(item["Số thẻ tài sản"] || ""),
                tenTaiSan: String(item["Tên tài sản"] || ""),
                idLoaiTaiSan: String(item["Mã loại tài sản"] || ""),
                idLoaiTaiSanCon: String(item["Mã loại tài sản"] || ""),
                idNhomTaiSan: String(item["Mã nhóm tài sản"] || ""),
                idDuDan: String(item["Mã dự án"] || ""),
                idNguonVon: String(item["Mã nguồn vốn"] || ""),
                nvNS: vonNS,
                vonVay: vonVay,
                vonKhac: vonKhac,
                nguyenGia: vonNS + vonVay + vonKhac,
                giaTriKhauHaoBanDau:
                  Number(item["Giá trị khấu hao ban đầu"]) || 0,
                kyKhauHaoBanDau: Number(item["Kỳ khấu hao ban đầu"]) || 0,
                giaTriThanhLy: Number(item["Giá trị thanh lý"]) || 0,
                idMoHinhTaiSan: String(item["Mã mô hình tài sản"] || ""),
                phuongPhapKhauHao: Number(item["Phương pháp khấu hao"]) || 0,
                soKyKhauHao: Number(item["Số kỳ khấu hao"]) || 0,
                taiKhoanTaiSan: Number(item["TK tài sản"]) || 0,
                taiKhoanKhauHao: Number(item["TK khấu hao"]) || 0,
                taiKhoanChiPhi: Number(item["TK chi phí"]) || 0,
                ngayVaoSo: item["Ngày vào sổ"]
                  ? dayjs(item["Ngày vào sổ"]).format("YYYY-MM-DDTHH:mm:ss")
                  : now,
                ngaySuDung: item["Ngày sử dụng"]
                  ? dayjs(item["Ngày sử dụng"]).format("YYYY-MM-DDTHH:mm:ss")
                  : now,
                kyHieu: String(item["Ký hiệu"] || ""),
                soKyHieu: String(item["Số ký hiệu"] || ""),
                congSuat: String(item["Công suất"] || ""),
                nuocSanXuat: String(item["Nước sản xuất"] || ""),
                namSanXuat: Number(item["Năm sản xuất"]) || 0,
                lyDoTang: String(item["Lý do tăng"] || ""),
                hienTrang: Number(item["Hiện trạng"]) || 0,
                soLuong: 1,
                donViTinh: String(item["Đơn vị tính"] || ""),
                ghiChu: String(item["Ghi chú"] || ""),
                idDonViBanDau: String(item["Mã đơn vị ban đầu"] || "K30"),
                idDonViHienThoi: String(item["Mã đơn vị hiện thời"] || ""),
                moTa: String(item["Mô tả"] || ""),
                idCongTy: idCongTy,
                ngayTao: now,
                ngayCapNhat: now,
                nguoiTao: user?.taikhoan?.tenDangNhap || "",
                nguoiCapNhat: user?.taikhoan?.tenDangNhap || "",
                isActive: true,
                isTaiSanCon: false,
              });
            });

            // --- GIAI ĐOẠN 4: GỬI BATCH (100 item/lần) ---
            const batchSize = 100;
            for (let i = 0; i < allAssets.length; i += batchSize) {
              const batch = allAssets.slice(i, i + batchSize);
              await api.post("/taisan/batch", batch);
            }

            resolve(true);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsBinaryString(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assetsPage"] });
      showSuccessAlert("Import tài sản thành công!");
    },
    onError: (error: any) => {
      if (error.isValidationError) {
        // Gọi callback để mở Modal từ UI thay vì Alert
        if (onValidationError) {
          onValidationError(error.messages);
        }
      } else {
        showErrorAlert(
          error.response?.data?.message || "Lỗi khi gửi dữ liệu lên máy chủ",
        );
      }
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    exportAssetMutation,
    importAssetMutation,
    createChildAssetBulkMutation,
    deleteOneChildAsssetMutation,
    createManyHistoryAssetMutation
  };
};

export const useAssetPageQuery = (
  tab?: number,
  page?: number,
  pageSize?: number,
  searchValue?: string,
  idNhomTaiSan?: string,
) => {
  return useQuery({
    queryKey: ["assetsPage", page, pageSize, searchValue, idNhomTaiSan, tab], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get(
        tab === 0
          ? "/taisan/by-donvi-hienthoi/paged"
          : tab === 1
            ? "/taisan/paged-da-ban-giao"
            : tab === 2
              ? "/taisan/paged-chua-ban-giao"
              : "/taisan/by-donvi-hienthoi/paged",
        {
          params: {
            idcongty: "ct001",
            page: page,
            size: pageSize,
            search: searchValue,
            idNhomTaiSan: idNhomTaiSan,
            ...(tab === 0 && { iddonvihienthoi: "kth" }),
          },
        },
      );
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
export const useAllAssetsQuery = () => {
  return useQuery({
    queryKey: ["allAssets"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/taisan", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
export const useAssetByTypeQuery = (idloaitaisan?: string) => {
  return useQuery({
    queryKey: ["assetsByType", idloaitaisan], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/taisan/loaitaisan/", {
        params: {
          idloataisan: idloaitaisan,
        },
      });
      return res.data.data || res.data || [];
    },
    placeholderData: (placeholderData) => placeholderData,
    enabled: !!idloaitaisan,
  });
};
export const useAssetDepreciationsQuery = (
  date?: string,
  page?: number,
  pageSize?: number,
  searchValue?: string,
) => {
  return useQuery({
    queryKey: ["assetDepreciationsPage", date, page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/taisan/khauhaotaisan", {
        params: {
          idcongty: "ct001",
          ngay: date ? new Date(date).getDate() : undefined,
          thang: date ? new Date(date).getMonth() + 1 : undefined,
          nam: date ? new Date(date).getFullYear() : undefined,
          page,
          size: pageSize,
          search: searchValue,
        },
      });
      return res.data.data || res.data;
    },
    enabled: !!date,
    placeholderData: (previousData) => previousData,
  });
};
export const useCountriesQuery = () => {
  return useQuery({
    queryKey: ["countries"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await axios.get("https://open.oapi.vn/location/countries");
      return res.data.data;
    },
    placeholderData: (placeholderData) => placeholderData,
  });
};
export const useHistoryAssethandoverQuery = (
  page?: number,
  pageSize?: number,
  fromDate?: string,
  toDate?: string,
  idTaiSan?: string,
) => {
  return useQuery({
    queryKey: [
      "historyAssetHandover",
      page,
      pageSize,
      fromDate,
      toDate,
      idTaiSan,
    ], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/lichsudieuchuyentaisan", {
        params: {
          page,
          size: pageSize,
          fromDate,
          toDate,
          idTaiSan,
        },
      });
      return res.data;
    },
    placeholderData: (placeholderData) => placeholderData,
    enabled: !!idTaiSan,
  });
};
