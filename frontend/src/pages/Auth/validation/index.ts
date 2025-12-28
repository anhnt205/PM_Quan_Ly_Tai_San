import * as yup from "yup";
export const validationSchema = yup.object({
  UserName: yup.string().required("Vui lòng nhập email"),
  Password: yup.string().required("Vui lòng nhập mật khẩu"),
});
