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
      // BƯỚC 1: Tạo tài khoản
      const createRes = await api.post("/taikhoan", payload.values);
      const newAccount = createRes.data?.data || createRes.data;

      try {
        // BƯỚC 2: Login ngầm bằng tài khoản vừa tạo
        const loginRes = await api.post("/taikhoan/login", null, {
          params: {
            tenDangNhap: payload.values.username,
            matKhau: payload.values.matKhau,
          },
        });
        const loggedInUser =
          loginRes.data?.data?.taiKhoan || loginRes.data?.taiKhoan;

        // BƯỚC 3: Sử dụng chucVuId từ object staff để lấy quyền
        const targetChucVuId = payload.staff.chucVuId;

        if (loggedInUser && targetChucVuId) {
          const chucVuRes = await api.get(`/chucvu/${targetChucVuId}`);
          const chucVuData = chucVuRes.data?.data || chucVuRes.data;

          const permissionsBatch = Object.entries(PERMISSION_MAP)
            .filter(([key]) => chucVuData[key] === true)
            .map(([_, roleCode]) => ({
              userId: loggedInUser.id,
              permissionCode: roleCode,
              canCreate: true,
              canRead: true,
              canUpdate: true,
              canDelete: true,
              permissionName: roleCode,
            }));

          // BƯỚC 4: Set quyền Batch (POST)
          if (permissionsBatch.length > 0) {
            await api.post(
              "/userpermission/set-permission-batch",
              permissionsBatch,
            );
          }
        } else {
          console.warn(
            "Không tìm thấy loggedInUser hoặc staff.chucVuId để áp quyền.",
          );
        }
      } catch (workflowError) {
        console.error("Lỗi quy trình tự động áp quyền:", workflowError);
      }

      return newAccount;
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
