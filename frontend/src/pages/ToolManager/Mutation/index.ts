import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { AssetDetailType, OwnerUnitType, ToolType } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import dayjs from "dayjs";
import axios from "axios";
import * as XLSX from "xlsx";
let donViSoHuuList: any[] = [];
export const useToolManagerMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string
) => {
  const queryClient = useQueryClient();
  const idCongTy = "ct001";
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss");

  // --- quan ly ccdc - vat tu ---
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/ccdcvattu", {
        ...data,
        nguoiTao: user?.tailkhoan?.tenDangNhap || "",
        ngayCapNhat: now,
      });
      return res.data;
    },
    onSuccess: (responseData, variables) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      if (
        variables.chiTietTaiSanList &&
        variables.chiTietTaiSanList.length > 0
      ) {
        createManyAssetDetailMutation.mutate(
          variables.chiTietTaiSanList.map((item: any, index: number) => ({
            ...item,
            id: item.idTaiSan + "-STT-" + index,
          }))
        );
      }
      showSuccessAlert("Tạo CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo CCDC/Vật tư thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/ccdcvattu/${data.id}`, data);
      return res.data;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      if (
        variables.chiTietTaiSanList &&
        variables.chiTietTaiSanList.length > 0
      ) {
        donViSoHuuList = variables.chiTietDonViSoHuuList || [];
        console.log(variables.chiTietDonViSoHuuList);
        const deleteData = variables.chiTietTaiSanList
          .filter((item: any) => item.isDeleted)
          .map((item: any) => item.id);
        if (deleteData.length > 0) {
          // prepare owner-unit list first so it's available when deleteMany completes
          deleteManyAssetDetailMutation.mutate(deleteData);
        }
        const updateData = variables.chiTietTaiSanList
          .filter((item: any) => item.isInserted)
          .map((i: any, index: number) => ({
            ...i,
            id: i.idTaiSan + "-STT-" + index,
          }));
        if (updateData.length > 0) {
          createManyAssetDetailMutation.mutate(updateData);
        }
      }
      showSuccessAlert("Cập nhật CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật CCDC/Vật tư thất bại"
      );
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/ccdcvattu/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert("Xóa CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa CCDC/Vật tư thất bại"
      );
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/ccdcvattu/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert(data || "Xóa CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa CCDC/Vật tư thất bại"
      );
    },
  });

  // --- QUERIES ---
  const { data: toolsPage = { items: [], totalItems: 0 }, isLoading } =
    useQuery({
      queryKey: ["toolsPage", page, pageSize, searchValue],
      queryFn: async () => {
        const res = await api.get("/ccdcvattu/paged", {
          params: {
            idcongty: idCongTy,
            page: page,
            size: pageSize,
            search: searchValue,
          },
        });
        return res.data.data || res.data;
      },
      placeholderData: (previousData) => previousData,
    });

  // Lấy danh sách nhóm CCDC
  const { data: toolGroups = [] } = useQuery({
    queryKey: ["toolGroups", idCongTy],
    queryFn: async () => {
      const res = await api.get("/nhomccdc", {
        params: { idcongty: idCongTy },
      });
      return res.data;
    },
  });

  // chi tiet don vi so huu
  const createOwnerUnitMutation = useMutation({
    mutationFn: async (data: OwnerUnitType) => {
      const res = await axios.post(
        "http://42.119.110.246:8386/chitietdonvisohuu",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      console.log("Tạo chi tiết đơn vị sở hữu thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết đơn vị sở hữu thất bại"
      );
    },
  });
  const createManyOwnerUnitMutation = useMutation({
    mutationFn: async (data: OwnerUnitType[]) => {
      const res = await axios.post(
        "http://42.119.110.246:8386/chitietdonvisohuu/batch",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      console.log("Tạo chi tiết đơn vị sở hữu thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết đơn vị sở hữu thất bại"
      );
    },
  });
  const updateManyOwnerUnitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.put(
        "http://42.119.110.246:8386/chitietdonvisohuu/batch",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      console.log("Cập nhật chi tiết đơn vị sở hữu thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật chi tiết đơn vị sở hữu thất bại"
      );
    },
  });
  const deleteOneOwnerUnitMutation = useMutation({
    mutationFn: async (id: any) => {
      const res = await axios.delete(
        `http://42.119.110.246:8386/chitietdonvisohuu/${id}`
      );
      return res.data;
    },
    onSuccess: () => {
      console.log("Xóa chi tiết đơn vị sở hữu thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa chi tiết đơn vị sở hữu thất bại"
      );
    },
  });

  // chi tiet tai san
  const createAssetDetailMutation = useMutation({
    mutationFn: async (data: AssetDetailType) => {
      const res = await api.post("/chitiettaisan", data);
      return res.data;
    },
    onSuccess: () => {
      console.log("Tạo chi tiết tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết tài sản thất bại"
      );
    },
  });
  const createManyAssetDetailMutation = useMutation({
    mutationFn: async (data: AssetDetailType[]) => {
      const res = await api.post("/chitiettaisan/batch", data);
      return res.data;
    },
    onSuccess: (response, variables) => {
      createManyOwnerUnitMutation.mutate(
        variables.map((item) => ({
          id: "",
          idCCDCVT: item?.idTaiSan,
          idDonViSoHuu: item?.idDonVi,
          soLuong: item?.soLuong,
          thoiGianBanGiao: now,
          ngayTao: now,
          nguoiTao: user?.tailkhoan?.tenDangNhap || "",
          idTsCon: item?.id,
        }))
      );
      console.log("Tạo chi tiết tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết tài sản thất bại"
      );
    },
  });
  const updateManyAssetDetailMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put("/chitiettaisan/batch", data);
      return res.data;
    },
    onSuccess: (response, variables) => {
      createManyOwnerUnitMutation.mutate(
        variables.map((item: any) => ({
          id: "",
          idCCDCVT: item?.idTaiSan,
          idDonViSoHuu: item?.idDonVi,
          soLuong: item?.soLuong,
          thoiGianBanGiao: now,
          ngayTao: now,
          nguoiTao: user?.tailkhoan?.tenDangNhap || "",
          idTsCon: item?.id,
        }))
      );
      console.log("Cập nhật chi tiết tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết tài sản thất bại"
      );
    },
  });
  const deleteManyAssetDetailMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.delete("/chitiettaisan/batch", { data });
      return res.data;
    },
    onSuccess: (response, variables) => {
      console.log(donViSoHuuList);
      console.log(variables);
      donViSoHuuList = donViSoHuuList.filter((item: any) =>
        variables.includes(item.idTsCon)
      );
      donViSoHuuList.forEach((item: any) => {
        if (item && item.id) {
          deleteOneOwnerUnitMutation.mutate(item.id);
        }
      });
      console.log("Xóa chi tiết tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa chi tiết tài sản thất bại"
      );
    },
  });

  const exportExcelMutation = useMutation({
    mutationFn: async () => {
      // Sử dụng 'api' instance để tự động ăn theo baseURL và Port trong config
      const res = await api.get("/ccdcvattu/export/excel", {
        params: { idcongty: idCongTy },
        responseType: "blob", // Quan trọng: Để nhận dữ liệu file nhị phân
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Tạo một đường dẫn ảo để trình duyệt kích hoạt tải file
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `CCDC_VatTu_${dayjs().format("YYYYMMDD")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();

      // Dọn dẹp sau khi tải xong
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccessAlert("Xuất file Excel thành công");
    },
    onError: (error: any) => {
      showErrorAlert("Xuất file thất bại");
    },
  });

  const validateRow = (row: any, rowIndex: number, currentGroups: any[]) => {
    const rowErrors: string[] = [];
    if (
      !row["Mã công cụ dụng cụ"] ||
      String(row["Mã công cụ dụng cụ"]).trim() === ""
    ) {
      rowErrors.push("Mã loại CCDC không được để trống"); // Sửa .add -> .push
    }
    const maNhom = String(row["Mã nhóm CCDC"] || "").trim();
    if (!maNhom) {
      rowErrors.push("Mã nhóm CCDC không được để trống");
    } else {
      const groupExists = currentGroups.some((g) => g.id === maNhom);
      if (!groupExists) {
        rowErrors.push(`Mã nhóm CCDC không tồn tại: ${maNhom}`);
      }
    }
    if (
      !row["Tên công cụ dụng cụ"] ||
      String(row["Tên công cụ dụng cụ"]).trim() === ""
    ) {
      rowErrors.push("Tên loại CCDC không được để trống");
    }
    return {
      rowIndex: rowIndex + 2,
      hasError: rowErrors.length > 0,
      errors: rowErrors,
    };
  };
  const importExcelMutation = useMutation({
    mutationFn: async (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            const idToHeader: Record<string, any> = {};
            const idToDetails: Record<string, any[]> = {};
            const errorMessages: string[] = [];
            jsonData.forEach((item: any, index: number) => {
              const validation = validateRow(item, index, toolGroups); // Sử dụng hàm validateRow
              if (validation.hasError) {
                errorMessages.push(
                  `Dòng ${validation.rowIndex}: ${validation.errors.join(", ")}`
                );
                return;
              }

              const id = String(item["Mã công cụ dụng cụ"] || "").trim();

              // 1. Nếu chưa có Header cho ID này, khởi tạo nó (Giống idToHeader.putIfAbsent)
              if (!idToHeader[id]) {
                idToHeader[id] = {
                  id: id,
                  idDonVi: String(item["Mã đơn vị"] || ""),
                  ten: String(item["Tên công cụ dụng cụ"] || ""),
                  ngayNhap: item["Ngày nhập"]
                    ? dayjs(item["Ngày nhập"]).format("YYYY-MM-DDTHH:mm:ss")
                    : now,
                  donViTinh: String(item["Mã đơn vị tính"] || ""),
                  idNhomCCDC: String(item["Mã nhóm CCDC"] || ""),
                  idLoaiCCDCCon: String(item["Mã loại CCDC con"] || ""),
                  giaTri: Number(item["Giá trị"]) || 0,
                  kyHieu: String(item["Ký hiệu"] || ""),
                  ghiChu: String(item["Ghi chú"] || ""),
                  idCongTy: idCongTy,
                  ngayTao: now,
                  ngayCapNhat: now,
                  nguoiTao: user?.tailkhoan?.tenDangNhap || "",
                  nguoiCapNhat: user?.tailkhoan?.tenDangNhap || "",
                  isActive: true,
                  hienTrang: 0,
                  chiTietTaiSanList: [], // Khởi tạo mảng chi tiết
                };
              }

              // 2. Kiểm tra xem dòng này có chứa thông tin chi tiết không (Cột 10-14 trong Excel)
              const soKyHieu = String(item["Số ký hiệu"] || "").trim();
              const soLuong = Number(item["Số lượng"]) || 0;

              if (soKyHieu || soLuong > 0) {
                if (!idToDetails[id]) idToDetails[id] = [];

                idToDetails[id].push({
                  id: "", // Sẽ sinh sau giống Flutter
                  idTaiSan: id,
                  soKyHieu: soKyHieu || null,
                  soLuong: soLuong,
                  congSuat: String(item["Công suất"] || "") || null,
                  nuocSanXuat: String(item["Nước sản xuất"] || "") || null,
                  namSanXuat: Number(item["Năm sản xuất"]) || 0,
                  idDonVi: idToHeader[id].idDonVi,
                });
              }
            });
            // 3. Kết thúc: Gắn chi tiết vào header và tính tổng số lượng
            const finalData = Object.values(idToHeader).map((header: any) => {
              const details = idToDetails[header.id] || [];

              // Gán ID cho chi tiết và tính tổng (Giống hệt Flutter)
              header.chiTietTaiSanList = details.map((d, i) => ({
                ...d,
                id: `${header.id}-STT-${i}`,
              }));

              header.soLuong = header.chiTietTaiSanList.reduce(
                (sum: number, d: any) => sum + d.soLuong,
                0
              );

              return header;
            });

            // 4. Gửi lên API
            if (errorMessages.length > 0) {
              reject({ isValidationError: true, messages: errorMessages });
            } else {
              const res = await api.post("/ccdcvattu/batch", finalData);
              resolve(res.data);
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert("Import dữ liệu thành công");
    },
    onError: (error: any) => {
      if (error.isValidationError) {
        showErrorAlert("Dữ liệu Excel có lỗi:\n" + error.messages.join("\n"));
      } else {
        showErrorAlert(
          error.response?.data?.message || "Lỗi khi đọc hoặc gửi file"
        );
      }
    },
  });

  return {
    toolsPage,
    toolGroups,
    isLoading,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    createOwnerUnitMutation,
    updateManyOwnerUnitMutation,
    deleteOneOwnerUnitMutation,
    createAssetDetailMutation,
    updateManyAssetDetailMutation,
    deleteManyAssetDetailMutation,
    exportExcelMutation,
    importExcelMutation,
  };
};
