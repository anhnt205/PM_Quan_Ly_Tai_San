import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { ROUTES } from './utils/routes';
import Login from './pages/Auth/Login';
import Main from './layout/Main';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store'
import Staff from './pages/Staff/Staff';
import DashBoard from './pages/Dashboard/DashBoard';
import Department from './pages/Department/Department';
import Project from './pages/Project/Project';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useSelector((state: RootState) => state.user);

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} />
  }

  if (!allowedRoles.includes(user.role)) {
    return null
  }

  return typeof children === "function" ? children(user.role) : children
}
function App() {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path={ROUTES.MAIN} element={<Main />} >
          <Route index element={<DashBoard />} />
          <Route path={ROUTES.STAFF} element={<Staff />} />
          <Route path={ROUTES.DEPARTMENT} element={<Department />} />
          <Route path={ROUTES.PROJECT} element={<Project />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
