import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

const PERMISSION_MAP: Record<string, string> = {
  quanLyNhanVien: "NHANVIEN",
  quanLyPhongBan: "PHONGBAN",
  quanLyDuAn: "DUAN",
  quanLyNguonVon: "NGUONVON",
  quanLyMoHinhTaiSan: "MOHINHTAISAN",
  quanLyNhomTaiSan: "NHOMTAISAN",
  quanLyTaiSan: "TAISAN",
  quanLyCCDCVatTu: "CCDCVT",
  dieuDongTaiSan: "DIEUDONG_TAISAN",
  dieuDongCCDCVatTu: "DIEUDONG_CCDC",
  banGiaoTaiSan: "BANGIAO_TAISAN",
  banGiaoCCDCVatTu: "BANGIAO_CCDC",
  baoCao: "BAOCAO",
};

export const useAccountMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  userIdPermission?: string | null,
  idCongTy?: string,
) => {
  const queryClient = useQueryClient();
  const mainKey = "accountPage";
  const permissionKey = "userPermissions";

  const { data: accountPage, isLoading: loadingAccount } = useQuery({
    queryKey: [mainKey, page, pageSize, searchValue],
    queryFn: async () => {
      const res = await api.get("/taikhoan/paged", {
        params: {
          page,
          size: pageSize,
          search: searchValue,
        },
      });
      return res.data;
    },
    placeholderData: (placeholderData) => placeholderData,
  });

  const { data: userPermissions, isLoading: loadingPermissions } = useQuery({
    queryKey: [permissionKey, userIdPermission],
    queryFn: async () => {
      if (!userIdPermission) return [];
      const res = await api.get(`/userpermission/user/${userIdPermission}`);
      return res.data;
    },
    enabled: !!userIdPermission,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { values: any; staff: any }) => {
      const createRes = await api.post("/taikhoan", payload.values);
      return createRes.data?.data || createRes.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      queryClient.invalidateQueries({ queryKey: ["staffsPage"] });
      showSuccessAlert("Thêm tài khoản và áp quyền thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error?.response?.data?.message || "Lỗi khi thêm tài khoản",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) =>
      (await api.put(`/taikhoan/${data.id}`, data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Cập nhật tài khoản thành công");
    },
    onError: () => showErrorAlert("Lỗi khi cập nhật tài khoản"),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (id: string) =>
      (await api.delete(`/taikhoan/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Xóa tài khoản thành công");
    },
  });

  const updatePermissionBatchMutation = useMutation({
    mutationFn: async (payload: any[]) => {
      return (await api.put("/userpermission/update-permission-batch", payload))
        .data;
    },
    onSuccess: () => {
      showSuccessAlert("Cập nhật quyền thành công");
      queryClient.invalidateQueries({ queryKey: [permissionKey] });
    },
    onError: () => showErrorAlert("Cập nhật quyền thất bại"),
  });

  return {
    accountPage,
    userPermissions,
    isLoading: loadingAccount || loadingPermissions,
    createMutation,
    updateMutation,
    deleteAccountMutation,
    updatePermissionBatchMutation,
  };
};
