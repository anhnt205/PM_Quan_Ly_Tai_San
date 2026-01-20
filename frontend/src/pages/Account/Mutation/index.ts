import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

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

  const { data: staffs = [] } = useQuery({
    queryKey: ["staffs", idCongTy],
    queryFn: async () => {
      if (!idCongTy) return [];
      return (await api.get("/nhanvien", { params: { idcongty: idCongTy } }))
        .data;
    },
    enabled: !!idCongTy,
  });

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
    mutationFn: async (data: any) => (await api.post("/taikhoan", data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
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
    staffs,
    userPermissions,
    isLoading: loadingAccount || loadingPermissions,
    createMutation,
    updateMutation,
    deleteAccountMutation,
    updatePermissionBatchMutation,
  };
};
