import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useAccountMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  userIdPermission?: string | null // Thêm id để theo dõi quyền nếu cần
) => {
  const queryClient = useQueryClient();
  const mainKey = "accountPage";
  const permissionKey = "userPermissions";
  const idCongTy = "ct001";

  // --- 1. QUERIES DANH MỤC & DỮ LIỆU ---

  // Lấy nhân viên để lấy thông tin Phòng Ban
  const { data: staffs = [] } = useQuery({
    queryKey: ["staffs", idCongTy],
    queryFn: async () =>
      (await api.get("/nhanvien", { params: { idcongty: idCongTy } })).data,
  });

  // Lấy danh sách tài khoản và map dữ liệu phòng ban
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

      const mappedItems = res.data.items.map((acc: any) => {
        const staff = staffs.find((s: any) => s.id === acc.tenDangNhap);
        return {
          ...acc,
          tenPhongBan: staff ? staff.tenPhongBan : "",
        };
      });

      return { ...res.data, items: mappedItems };
    },
    enabled: !!staffs,
  });

  // Query lấy danh sách quyền của User cụ thể
  const { data: userPermissions = [], isLoading: loadingPermissions } =
    useQuery({
      queryKey: [permissionKey, userIdPermission],
      queryFn: async () => {
        if (!userIdPermission) return [];
        const res = await api.get(`/userpermission/user/${userIdPermission}`);
        return res.data;
      },
      enabled: !!userIdPermission,
    });

  // --- 2. MUTATIONS TÀI KHOẢN ---

  const createMutation = useMutation({
    mutationFn: async (data: any) => (await api.post("/taikhoan", data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Thêm tài khoản thành công");
    },
    onError: () => showErrorAlert("Lỗi khi thêm tài khoản"),
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

  // --- 3. MUTATIONS PHÂN QUYỀN ---

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
    // Data
    accountPage,
    staffs,
    userPermissions,
    isLoading: loadingAccount || loadingPermissions,

    // Mutations
    createMutation,
    updateMutation,
    deleteAccountMutation,
    updatePermissionBatchMutation,
  };
};
