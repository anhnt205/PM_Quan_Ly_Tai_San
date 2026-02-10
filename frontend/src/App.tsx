import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "./utils/routes";
import Login from "./pages/Auth/Login";
import Main from "./layout/Main";
import { useSelector } from "react-redux";
import Staff from "./pages/Staff/Staff";
import DashBoard from "./pages/Dashboard/DashBoard";
import Department from "./pages/Department/Department";
import Project from "./pages/Project/Project";
import CapitalSource from "./pages/CapitalSource/CapitalSource";
import Position from "./pages/Position/Position";
import TypeAsset from "./pages/TypeAsset/TypeAsset";
import ModelAsset from "./pages/ModelAsset/ModelAsset";
import AssetGroup from "./pages/AssetGroup/AssetGroup";
import ToolGroup from "./pages/ToolGroup/ToolGroup";
import AssetManager from "./pages/AssetManager/AssetManager";
import AssetTransfer from "./pages/AssetTransfer/AssetTransfer";
import AssetDepreciation from "./pages/AssetManager/AssetDepreciation";
import ToolType from "./pages/ToolType/ToolType";
import Unit from "./pages/Unit/Unit";
import ReasonIncrease from "./pages/ReasonIncrease/ResonIncrease";
import CurrentStatus from "./pages/CurrentStatus/CurrentStatus";
import ToolManager from "./pages/ToolManager/ToolManager";
import AssetHandover from "./pages/AssetHandover/AssetHandover";
import Report from "./pages/Report/Report";
import ToolTransfer from "./pages/ToolTransfer/ToolTransfer";
import ToolHandover from "./pages/ToolHandover/ToolHandover";
import Account from "./pages/Account/Account";
import NotFound from "./pages/Notfound/Notfound";
import { useEffect } from "react";
import socketService, { SocketMessage } from "./services/socketService";
import { RootState } from "./redux/store";
import { useQueryClient } from "@tanstack/react-query";
import { MessageTypeFunctions } from "./utils/const";

const ProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: any;
}) => {
  const { user } = useSelector((state: RootState) => state.user);

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} />;
  }
  const listRole = user?.role?.map((item: any) => item.permissionCode) || [];
  if (!allowedRoles.some((r: any) => listRole.includes(r))) {
    return <Navigate to={ROUTES.NOT_FOUND} />;
  }

  return typeof children === "function" ? children(user.role) : children;
};
function App() {
  const { user } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (user?.taiKhoan?.tenDangNhap) {
      socketService.connect(user.taiKhoan.tenDangNhap);
    }
    // Lắng nghe notification từ socket
    socketService.onNotification((data: SocketMessage) => {
      if (
        (data.recieve.includes(user?.taiKhoan?.tenDangNhap || "") ||
          user?.taiKhoan?.tenDangNhap === "admin") &&
        data.type === MessageTypeFunctions.ASSET_TRANSFER
      ) {
        console.log("Handling socket message in App.tsx:", data);
        queryClient.invalidateQueries({ queryKey: ["assetTranferPage"] });
        queryClient.invalidateQueries({ queryKey: ["assetTranferAll"] });
      } else if (
        (data.recieve.includes(user?.taiKhoan?.tenDangNhap || "") ||
          user?.taiKhoan?.tenDangNhap === "admin") &&
        data.type === MessageTypeFunctions.TOOL_TRANSFER
      ) {
        console.log("Handling socket message in App.tsx:", data);
        queryClient.invalidateQueries({ queryKey: ["toolTransferPage"] });
        queryClient.invalidateQueries({ queryKey: ["toolTranferAll"] });
      } else if (
        (data.recieve.includes(user?.taiKhoan?.tenDangNhap || "") ||
          user?.taiKhoan?.tenDangNhap === "admin") &&
        data.type === MessageTypeFunctions.ASSET_HANDOVER
      ) {
        console.log("Handling socket message in App.tsx:", data);
        queryClient.invalidateQueries({ queryKey: ["assetHandoverPage"] });
        queryClient.invalidateQueries({ queryKey: ["assetHandoverAll"] });
      } else if (
        (data.recieve.includes(user?.taiKhoan?.tenDangNhap || "") ||
          user?.taiKhoan?.tenDangNhap === "admin") &&
        data.type === MessageTypeFunctions.TOOL_HANDOVER
      ) {
        console.log("Handling socket message in App.tsx:", data);
        queryClient.invalidateQueries({ queryKey: ["toolHandoverPage"] });
        queryClient.invalidateQueries({ queryKey: ["toolHandoverAll"] });
      }
    });

    // Cleanup khi component unmount
    return () => {
      socketService.disconnect();
    };
  }, [user]);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route
          path={ROUTES.MAIN}
          element={user ? <Main /> : <Navigate to={ROUTES.LOGIN} />}
        >
          <Route index element={<DashBoard />} />
          <Route
            path={ROUTES.STAFF}
            element={
              <ProtectedRoute allowedRoles={["NHANVIEN"]}>
                <Staff />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DEPARTMENT}
            element={
              <ProtectedRoute allowedRoles={["PHONGBAN"]}>
                <Department />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.POSITION} element={<Position />} />
          <Route
            path={ROUTES.PROJECT}
            element={
              <ProtectedRoute allowedRoles={["DUAN"]}>
                <Project />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CAPITALSOURCE}
            element={
              <ProtectedRoute allowedRoles={["NGUONVON"]}>
                <CapitalSource />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.ASSETGROUP} element={<AssetGroup />} />
          <Route path={ROUTES.MODELASSET} element={<ModelAsset />} />
          <Route path={ROUTES.TYPEASSET} element={<TypeAsset />} />
          <Route path={ROUTES.TOOLGROUP} element={<ToolGroup />} />
          <Route path={ROUTES.TOOLTYPE} element={<ToolType />} />
          <Route path={ROUTES.UNIT} element={<Unit />} />
          <Route path={ROUTES.REASONINCREASE} element={<ReasonIncrease />} />
          <Route path={ROUTES.CURRENTSTATUS} element={<CurrentStatus />} />
          <Route
            path={ROUTES.ASSETMANAGER}
            element={
              <ProtectedRoute allowedRoles={["TAISAN"]}>
                <AssetManager />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ASSETHANDOVER}
            element={
              <ProtectedRoute allowedRoles={["BANGIAO_TAISAN"]}>
                <AssetHandover />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ASSETTRANSFER}
            element={
              <ProtectedRoute allowedRoles={["DIEUDONG_TAISAN"]}>
                <AssetTransfer />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ASSETDEPRECIATION}
            element={<AssetDepreciation />}
          />
          <Route
            path={ROUTES.TOOLMANAGER}
            element={
              <ProtectedRoute allowedRoles={["CCDCVT"]}>
                <ToolManager />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TOOLTRANSFER}
            element={
              <ProtectedRoute allowedRoles={["DIEUDONG_CCDC"]}>
                <ToolTransfer />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TOOLHANDOVER}
            element={
              <ProtectedRoute allowedRoles={["BANGIAO_CCDC"]}>
                <ToolHandover />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.REPORT}
            element={
              <ProtectedRoute allowedRoles={["BAOCAO"]}>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.ACCOUNT} element={<Account />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
