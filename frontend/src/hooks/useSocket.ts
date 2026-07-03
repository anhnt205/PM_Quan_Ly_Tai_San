// hooks/useSocket.ts
import { useEffect } from "react";
import socketService from "../services/socketService";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useSocket = () => {
  // Lấy user từ Redux (giả sử cấu trúc state đúng như bạn cung cấp)
  // Lưu ý: useSelector trả về user object, không phải [user, setUser]
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const userId = user?.taiKhoan?.tenDangNhap;

    if (userId) {
      console.log("Connecting socket for user:", userId);
      socketService.connect(userId);
    }

    // Cleanup function: ngắt kết nối khi component unmount hoặc user thay đổi
    return () => {
      if (userId) {
        socketService.disconnect();
      }
    };
  }, [user]); // Chạy lại khi user thay đổi

  return socketService;
};
