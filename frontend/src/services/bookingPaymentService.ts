import api from "./api";
import { handleApi } from "@/utils/handleApi";

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
      api.post("/booking-payment/create-booking-checkout-session", bookingData),
    ),

  verifySession: (sessionId: string) =>
    handleApi<{ success: boolean }>(() =>
      api.get(`/booking-payment/verify-booking-session/${sessionId}`),
    ),
};

export default BookingPaymentService;
