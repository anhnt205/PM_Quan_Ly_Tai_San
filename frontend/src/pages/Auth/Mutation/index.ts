import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthType } from "../types";
import api from "../../../config/api.config";
import { loginSuccess } from "../../../redux/userSlice";
import { showErrorAlert } from "../../../components/Alert";

export const useAuthMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data: AuthType) => {
      // 1. Perform Login
      const loginRes = await api.post(
        `/taikhoan/login?tenDangNhap=${data.tenDangNhap}&matKhau=${data.matKhau}`,
      );
      const userData = loginRes.data.data;

      // 2. Fetch Permissions using the ID from the login response
      // This replaces the need to call usePermissionQuery inside onSuccess
      const permissionRes = await api.get(
        `/userpermission/user/${userData.taiKhoan.id}`,
      );
      const permissions = permissionRes.data || [];

      // Return both together
      return { ...userData, role: permissions };
    },
    onSuccess: (fullUserData) => {
      // Now the data contains everything you need
      dispatch(loginSuccess(fullUserData));
      navigate("/");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Đăng nhập thất bại",
      );
    },
  });

  return { loginMutation };
};
