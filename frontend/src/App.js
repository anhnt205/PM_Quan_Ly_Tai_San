import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "./utils/routes";
import Login from "./pages/Auth/Login";
import Main from "./layout/Main";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Staff from "./pages/Staff/Staff";
import DashBoard from "./pages/Dashboard/DashBoard";
import Department from "./pages/Department/Department";
import Project from "./pages/Project/Project";
import CapitalSource from "./pages/CapitalSource/CapitalSource";
import Position from "./pages/Position/Position";
import TypeAsset from "./pages/TypeAsset/TypeAsset";
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

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return typeof children === "function" ? children(user.role) : children;
};
function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route path={ROUTES.MAIN} element={<Main />}>
          <Route index element={<DashBoard />} />
          <Route path={ROUTES.STAFF} element={<Staff />} />
          <Route path={ROUTES.DEPARTMENT} element={<Department />} />
          <Route path={ROUTES.POSITION} element={<Position />} />
          <Route path={ROUTES.PROJECT} element={<Project />} />
          <Route path={ROUTES.CAPITALSOURCE} element={<CapitalSource />} />
          <Route path={ROUTES.TYPEASSET} element={<TypeAsset />} />
          <Route path={ROUTES.TOOLGROUP} element={<ToolGroup />} />
          <Route path={ROUTES.TOOLTYPE} element={<ToolType />} />
          <Route path={ROUTES.UNIT} element={<Unit />} />
          <Route path={ROUTES.REASONINCREASE} element={<ReasonIncrease />} />
          <Route path={ROUTES.CURRENTSTATUS} element={<CurrentStatus />} />
          <Route path={ROUTES.ASSETMANAGER} element={<AssetManager />} />
          <Route path={ROUTES.ASSETTRANSFER} element={<AssetTransfer />} />
          <Route path={ROUTES.ASSETHANDOVER} element={<AssetHandover />} />
          <Route
            path={ROUTES.ASSETDEPRECIATION}
            element={<AssetDepreciation />}
          />
          <Route path={ROUTES.TOOLMANAGER} element={<ToolManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
