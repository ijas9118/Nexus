import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/authService";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const result = await logout();

      if (result.success) {
        dispatch(logoutAction());
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return logoutUser;
};

export default useLogout;
