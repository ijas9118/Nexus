import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { verifyAccessToken } from "@/services/authService";

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [authLoading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          const response = await verifyAccessToken();
          dispatch(login(response));
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, dispatch]);

  return { isAuthenticated, authLoading };
};

export default useAuth;
