import { Navigate, useLocation } from "react-router-dom";

import CancelPage from "./CancelPage";
import SuccessPage from "./SuccessPage";

const PaymentPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get("success");
  const canceled = queryParams.get("canceled");
  const sessionId = queryParams.get("session_id");

  if (success === "true" && sessionId) {
    return <SuccessPage sessionId={sessionId} />;
  }

  if (canceled === "true") {
    return <CancelPage />;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default PaymentPage;
