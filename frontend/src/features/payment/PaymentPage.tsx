import { useLocation } from "react-router-dom";
import SuccessPage from "./SuccessPage";
import CancelPage from "./CancelPage";

const PaymentPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get("success");
  const canceled = queryParams.get("canceled");

  if (success === "true") {
    return <SuccessPage />;
  }

  if (canceled === "true") {
    return <CancelPage />;
  }

  return <div>Invalid payment status</div>;
};

export default PaymentPage;
