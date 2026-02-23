import api from "./api";
import { handleApi } from "@/utils/handleApi";
import { BOOKING_PAYMENT_ROUTES } from "@/utils/constants";

interface BookingData {
  mentorId: string;
  mentorshipType: string;
  date: string;
  timeSlot: string;
  reason: string;
  email: string;
}

const BookingPaymentService = {
  createSession: (bookingData: BookingData) =>
    handleApi<string>(() =>
      api.post(BOOKING_PAYMENT_ROUTES.CREATE_CHECKOUT_SESSION, bookingData),
    ),

  verifySession: (sessionId: string) =>
    handleApi<{ success: boolean }>(() =>
      api.get(`${BOOKING_PAYMENT_ROUTES.VERIFY_SESSION}/${sessionId}`),
    ),
};

export default BookingPaymentService;
