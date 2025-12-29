import * as yup from "yup";
export const validationSchema = yup.object({
  tenDangNhap: yup.string().required("Vui lòng nhập tên đăng nhập"),
  matKhau: yup.string().required("Vui lòng nhập mật khẩu"),
});
