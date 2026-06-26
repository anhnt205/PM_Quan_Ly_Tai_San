import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { AssetDetailType, HistoryToolType, OwnerUnitType } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { generateCode } from "../../../utils/helpers";
import { useAllToolGroupQuery } from "../../ToolGroup/Mutation";
import { CongTy } from "../../../utils/const";
let donViSoHuuList: any[] = [];

const getColumnLetter = (colIndex: number): string => {
  let letter = "";
  while (colIndex >= 0) {
    letter = String.fromCharCode((colIndex % 26) + 65) + letter;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return letter;
};

export const useToolManagerMutation = (
  onValidationError?: (messages: string[]) => void,
) => {
  const queryClient = useQueryClient();
  const idCongTy = CongTy.CT001;
  const { user } = useSelector((state: RootState) => state.user);
  const now = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss");

  const syncBakMutation = useMutation({
    mutationFn: async (dbConfigId: string) => {
      const res = await api.post(`/migration/sync-vat-tu/${dbConfigId}`);
      return res.data;
    },
    onSuccess: (data) => {
      // Sau khi đồng bộ xong 5,804 bản ghi, ta cần làm mới danh sách hiển thị
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert(data || "Đồng bộ dữ liệu SQL Server thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data || error.message || "Quá trình đồng bộ thất bại",
      );
    },
  });

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
    onSuccess: (_responseData, variables) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      // if (
      //   variables.chiTietTaiSanList &&
      //   variables.chiTietTaiSanList.length > 0
      // ) {
      //   createManyAssetDetailMutation.mutate(
      //     variables.chiTietTaiSanList.map((item: any) => ({
      //       ...item,
      //       id: generateCode(item.idTaiSan + "-"),
      //     })),
      //   );
      // }
      showSuccessAlert("Tạo CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo CCDC/Vật tư thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/ccdcvattu/${data.id}`, data);
      return res.data;
    },
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });

      // if (
      //   variables.chiTietTaiSanList &&
      //   variables.chiTietTaiSanList.length > 0
      // ) {
      //   // 1. Xử lý XÓA
      //   const deleteData = variables.chiTietTaiSanList
      //     .filter((item: any) => item.isDeleted && !item.isInserted) // Chỉ xóa nếu đã có trên server
      //     .map((item: any) => item.id);
      //   if (deleteData.length > 0) {
      //     deleteManyAssetDetailMutation.mutate({
      //       ids: deleteData,
      //       ownerList: variables.chiTietDonViSoHuuList,
      //     });
      //   }

      //   // 2. Xử lý THÊM MỚI (Dòng mới bấm nút "Thêm một dòng")
      //   const insertData = variables.chiTietTaiSanList
      //     .filter((item: any) => item.isInserted && !item.isDeleted)
      //     .map((i: any) => ({
      //       ...i,
      //       id: generateCode(i.idTaiSan + "-"), // Sinh ID mới
      //     }));
      //   if (insertData.length > 0) {
      //     createManyAssetDetailMutation.mutate(insertData);
      //   }

      //   // 3. Xử lý CẬP NHẬT (Dòng cũ bị sửa thông tin)
      //   const updateData = variables.chiTietTaiSanList.filter(
      //     (item: any) => item.isUpdated && !item.isInserted && !item.isDeleted,
      //   );
      //   if (updateData.length > 0) {
      //     updateManyAssetDetailMutation.mutate(updateData);
      //   }
      // }
      showSuccessAlert("Cập nhật CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật CCDC/Vật tư thất bại",
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
          "Xóa CCDC/Vật tư thất bại",
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
          "Xóa CCDC/Vật tư thất bại",
      );
    },
  });
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/ccdcvattu/delete-all`);
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert(data || "Xóa ccdc vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa ccdc vật tư thất bại",
      );
    },
  });

  // --- QUERIES ---

  // Lấy danh sách nhóm CCDC
  const { data: toolGroups = [] } = useAllToolGroupQuery();

  // chi tiet don vi so huu
  const createOwnerUnitMutation = useMutation({
    mutationFn: async (data: OwnerUnitType) => {
      const res = await api.post("/chitietdonvisohuu", data);
      return res.data;
    },
    onSuccess: () => {
      console.log("Tạo chi tiết đơn vị sở hữu thành công");
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết đơn vị sở hữu thất bại",
      );
    },
  });

  const createManyOwnerUnitMutation = useMutation({
    mutationFn: async (data: OwnerUnitType[]) => {
      const res = await api.post("/chitietdonvisohuu/batch", data);
      return res.data;
    },
    onSuccess: () => {
      console.log("Tạo chi tiết đơn vị sở hữu thành công");
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết đơn vị sở hữu thất bại",
      );
    },
  });

  const updateManyOwnerUnitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put("/chitietdonvisohuu/batch", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      console.log("Cập nhật chi tiết đơn vị sở hữu thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật chi tiết đơn vị sở hữu thất bại",
      );
    },
  });

  const deleteOneOwnerUnitMutation = useMutation({
    mutationFn: async (id: any) => {
      const res = await api.delete(`/chitietdonvisohuu/${id}`);
      return res.data;
    },
    onSuccess: () => {
      console.log("Xóa chi tiết đơn vị sở hữu thành công");
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa chi tiết đơn vị sở hữu thất bại",
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
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết tài sản thất bại",
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
        })),
      );
      console.log("Tạo chi tiết tài sản thành công");
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo chi tiết tài sản thất bại",
      );
    },
  });

  const updateManyAssetDetailMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put("/chitiettaisan/batch", data);
      return res.data;
    },
    onSuccess: (response, variables) => {
      updateManyOwnerUnitMutation.mutate(
        variables.map((item: any) => ({
          id: item.idOwnerRecord,
          idCCDCVT: item?.idTaiSan,
          idDonViSoHuu: item?.idDonVi,
          soLuong: Number(item?.soLuong), // Bắt buộc là kiểu Number
          thoiGianBanGiao: now, // Đảm bảo định dạng YYYY-MM-DDTHH:mm:ss
          ngayTao: item?.ngayTao || now, // Backend yêu cầu ngayTao, không phải ngayCapNhat
          nguoiTao: user?.tailkhoan?.tenDangNhap || "", // Khớp với Schema
          idTsCon: item?.id, // ID của tài sản con
        })),
      );

      // 2. Refresh lại dữ liệu bảng chính ngay lập tức
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });

      console.log(
        "Cập nhật chi tiết tài sản và đồng bộ đơn vị sở hữu thành công",
      );
    },
    onError: (error: any) => {
      showErrorAlert("Cập nhật chi tiết tài sản thất bại");
    },
  });

  const deleteManyAssetDetailMutation = useMutation({
    mutationFn: async ({
      ids,
      ownerList,
    }: {
      ids: string[];
      ownerList: any[];
    }) => {
      const res = await api.delete("/chitiettaisan/batch", { data: ids });
      // Trả về dữ liệu để dùng trong onSuccess
      return { deletedIds: ids, ownerList };
    },
    onSuccess: (data) => {
      const { deletedIds, ownerList } = data;

      // Tìm ID bản ghi ở bảng vàng dựa vào idTsCon (mã vật tư chi tiết)
      const ownerUnitsToDelete = ownerList
        ?.filter((owner: any) => deletedIds.includes(owner.idTsCon))
        .map((owner: any) => owner.id); // Lấy UUID thực tế (ví dụ: cf59a412...)

      // Thực hiện lệnh xóa dây chuyền lên server
      if (ownerUnitsToDelete && ownerUnitsToDelete.length > 0) {
        ownerUnitsToDelete.forEach((id: string) => {
          if (id) deleteOneOwnerUnitMutation.mutate(id);
        });
      }

      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
    },
    onError: (error: any) => {
      console.error("Xóa chi tiết tài sản thất bại:", error);
    },
  });

  const updateAssetOwnershipMutation = useMutation({
    mutationFn: async (
      data: {
        idCCDCVT: string;
        idDonViGui: string;
        idDonViNhan: string;
        idTsCon: string;
        soLuongBanGiao: number;
        thoiGianBanGiao: string;
      }[],
    ) => {
      const res = await api.post(
        `/chitietdonvisohuu/update-so-luong/batch`,
        data,
      );
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });

      console.log("Cập nhật ccdc vật tư theo đơn vị thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật ccdc vật tư theo đơn vị thất bại",
      );
    },
  });

  const exportExcelMutation = useMutation({
    mutationFn: async () => {
      const res = await api.get("/ccdcvattu/export/excel", {
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
        `CCDC_VatTu_${dayjs().format("YYYYMMDD")}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();

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
      rowErrors.push("Mã loại CCDC không được để trống");
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
            const errorMessages: string[] = [];
            const idToHeader: Record<string, any> = {};
            const idToDetails: Record<string, any[]> = {};
            const maxErrorsBeforeExit = 500;

            // Sửa từ jsonData.forEach sang vòng lặp for
            for (let index = 0; index < jsonData.length; index++) {
              const item: any = jsonData[index];
              const rowIndex = index + 2;

              // 1. Kiểm tra mã nhóm (Cột F - index 5)
              const idNhom = String(item["Mã nhóm CCDC"] || "").trim();
              const groupExists = toolGroups.some((g: any) => g.id === idNhom);

              if (!idNhom) {
                errorMessages.push(
                  `Cột F - Hàng ${rowIndex}: Mã nhóm CCDC đang bỏ trống`,
                );
              } else if (!groupExists) {
                errorMessages.push(
                  `Cột F - Hàng ${rowIndex}: Mã nhóm [${idNhom}] không tồn tại`,
                );
              }

              // 2. Kiểm tra các trường bắt buộc khác
              if (!item["Mã công cụ dụng cụ"])
                errorMessages.push(
                  `Cột A - Hàng ${rowIndex}: Mã CCDC đang bỏ trống`,
                );
              if (!item["Tên công cụ dụng cụ"])
                errorMessages.push(
                  `Cột C - Hàng ${rowIndex}: Tên CCDC đang bỏ trống`,
                );

              // 3. Kiểm tra giới hạn lỗi (Giống hệt Flutter)
              if (errorMessages.length >= maxErrorsBeforeExit) {
                errorMessages.push(
                  `... Đã dừng kiểm tra sớm do quá nhiều lỗi (>${maxErrorsBeforeExit} lỗi).`,
                );
                break;
              }

              // 4. Nếu chưa có lỗi nào thì mới gom nhóm dữ liệu
              if (errorMessages.length === 0) {
                const id = String(item["Mã công cụ dụng cụ"] || "").trim();
                if (!idToHeader[id]) {
                  idToHeader[id] = {
                    id: id,
                    idDonVi: String(item["Mã đơn vị"] || ""),
                    ten: String(item["Tên công cụ dụng cụ"] || ""),
                    ngayNhap: item["Ngày nhập"]
                      ? dayjs(item["Ngày nhập"]).format("YYYY-MM-DDTHH:mm:ss")
                      : now,
                    donViTinh: String(item["Mã đơn vị tính"] || ""),
                    idNhomCCDC: idNhom,
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
                    chiTietTaiSanList: [],
                  };
                }

                // Xử lý chi tiết (Số ký hiệu, Số lượng...)
                const soKyHieu = String(item["Số ký hiệu"] || "").trim();
                const soLuong = Number(item["Số lượng"]) || 0;
                if (soKyHieu || soLuong > 0) {
                  if (!idToDetails[id]) idToDetails[id] = [];
                  idToDetails[id].push({
                    id: "",
                    idTaiSan: id,
                    soKyHieu: soKyHieu || null,
                    soLuong: soLuong,
                    congSuat: String(item["Công suất"] || "") || null,
                    nuocSanXuat: String(item["Nước sản xuất"] || "") || null,
                    namSanXuat: Number(item["Năm sản xuất"]) || 0,
                    idDonVi: idToHeader[id].idDonVi,
                  });
                }
              }
            }
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
                0,
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
        // Gọi callback để UI hiển thị Modal MUI
        if (onValidationError) {
          onValidationError(error.messages);
        }
      } else {
        showErrorAlert(
          error.response?.data?.message || "Lỗi khi đọc hoặc gửi file",
        );
      }
    },
  });

  const createManyHistoryToolMutation = useMutation({
    mutationFn: async (data: HistoryToolType[]) => {
      const res = await api.post(`/lichsudieuchuyenccdcvattu/batch`, data);
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

  return {
    toolGroups,
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
    createManyHistoryToolMutation,
    updateAssetOwnershipMutation,
    syncBakMutation,
    deleteAllMutation,
  };
};

export const fetchToolDetails = async (id: string) => {
  const res = await api.get(`/ccdcvattu/${id}`);
  return res.data.data || res.data;
};

export const useToolPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  idDonViSoHuu?: string,
  idNhomCCDC?: string,
  loai?: string,
) => {
  const idcongty = CongTy.CT001;
  return useQuery({
    queryKey: [
      "toolsPage",
      page,
      pageSize,
      searchValue,
      idDonViSoHuu,
      idNhomCCDC,
      loai,
    ],
    queryFn: async () => {
      const res = await api.get("/ccdcvattu/paged", {
        params: {
          idcongty: idcongty,
          page: page,
          size: pageSize,
          search: searchValue,
          iddonvisohuu: idDonViSoHuu,
          idnhomccdc: idNhomCCDC,
          loai: loai,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
export const useAllToolQuery = () => {
  const idcongty = CongTy.CT001;
  return useQuery({
    queryKey: ["allTools"],
    queryFn: async () => {
      const res = await api.get("/ccdcvattu", {
        params: {
          idcongty: idcongty,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useHistoryAssethandoverQuery = (
  page?: number,
  pageSize?: number,
  fromDate?: string,
  toDate?: string,
  idCCDCVatTu?: string,
) => {
  return useQuery({
    queryKey: [
      "historyToolHandover",
      page,
      pageSize,
      fromDate,
      toDate,
      idCCDCVatTu,
    ], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/lichsudieuchuyenccdcvattu", {
        params: {
          page,
          size: pageSize,
          fromDate,
          toDate,
          idCCDCVatTu,
        },
      });
      return res.data;
    },
    placeholderData: (placeholderData) => placeholderData,
    enabled: !!idCCDCVatTu,
  });
};

export const useToolOwnershipPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  idDonViSoHuu?: string,
  date?: string,
) => {
  return useQuery({
    queryKey: [
      "toolOwnershipPage",
      page,
      pageSize,
      searchValue,
      idDonViSoHuu,
      date,
    ],
    queryFn: async () => {
      const res = await api.get("/chitietdonvisohuu/paged", {
        params: {
          page: page,
          size: pageSize,
          search: searchValue,
          idDonViSoHuu: idDonViSoHuu,
          date: date,
        },
      });
      return res.data.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useAllToolDetailQuery = () => {
  return useQuery({
    queryKey: ["allToolDetails"],
    queryFn: async () => {
      const res = await api.get("/chitiettaisan");
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
