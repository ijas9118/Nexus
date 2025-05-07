import { useLocation, Navigate } from "react-router-dom";
import SuccessPage from "./SuccessPage";
import CancelPage from "./CancelPage";

const BookingStatus = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get("success");
  const canceled = queryParams.get("canceled");
  const sessionId = queryParams.get("session_id");

  if (success === "true" && sessionId) {
    return <SuccessPage />;
  }

  if (canceled === "true") {
    return <CancelPage />;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default BookingStatus;
