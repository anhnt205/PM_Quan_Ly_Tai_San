import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api.config";
import { AuthType } from "../types";
import { loginSuccess } from "../../../redux/userSlice";
import { showErrorAlert } from "../../../components/Alert";

export const useAuthMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data: AuthType) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data?.user));
      navigate("/");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Đăng nhập thất bại"
      );
    },
  });

  return { loginMutation };
};
