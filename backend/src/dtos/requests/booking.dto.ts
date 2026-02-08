import { IsNotEmpty, IsString } from 'class-validator';

interface RescheduleBookingPayload {
  timeSlotId: string;
  bookingDate: string;
}

export class RescheduleBookingRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'Timeslot is required' })
  timeSlotId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Booking is required' })
  bookingDate!: string;

  static fromPayload(payload: RescheduleBookingPayload): RescheduleBookingRequestDTO {
    const dto = new RescheduleBookingRequestDTO();
    dto.timeSlotId = payload.timeSlotId;
    dto.bookingDate = payload.bookingDate;
    return dto;
  }
}
