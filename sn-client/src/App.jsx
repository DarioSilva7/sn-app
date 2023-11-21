import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Dashboard } from "./pages/Dashboard";
import { SignUpScreen } from "./pages/SignUpScreen";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { LoginScreen } from "./pages/LoginScreen";
import { NavBar } from "./components/NavBar";
import { getUserDetailAction } from "./services/actions";
import { loadUser, setErrors } from "./redux/userSlice";
import { Dialog } from "./components/Dialog";

export default function App() {
  const { user, roles, errors } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const refreshUserData = useCallback(async () => {
    const { data } = await getUserDetailAction();
    dispatch(loadUser(data.user));
    return data;
  }, [dispatch]);

  const clouseDialog = () => {
    dispatch(setErrors(null));
  };
  const userObject = {
    ...user,
    Roles: roles.map((r) => {
      return { name: r };
    }),
  };
  useEffect(() => {
    user && refreshUserData();
  }, [refreshUserData]);

  return (
    <>
      {user && <NavBar />}
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<SignUpScreen />} />
        <Route
          element={<ProtectedRoute isAllowed={!!user} redirectTo={"/login"} />}
        >
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile user={userObject} />} />
        </Route>
        <Route
          element={
            <ProtectedRoute
              isAllowed={!!user && roles.includes("admin")}
              redirectTo={"/dashboard"}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      {errors && <Dialog errors={errors} clouseDialog={clouseDialog} />}
    </>
  );
}
