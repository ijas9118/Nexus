import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import MentorService from "@/services/mentorService";
import TimeSlotService from "@/services/TimeSlotService";
import { MentorshipType } from "@/types/mentor";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Info } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const BookingPage = () => {
  const { mentorId } = useParams<{ mentorId: string }>();

  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingReason, setBookingReason] = useState<string>("");

  const {
    data: mentorshipTypes = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["mentorMentorshipTypes", mentorId],
    queryFn: () => MentorService.getMentorshipTypes(mentorId as string),
    enabled: !!mentorId,
  });

  const {
    data: timeslots = {},
    isLoading: isTimeslotLoading,
    isError: isTimeslotError,
  } = useQuery({
    queryKey: ["mentorTimeslots", mentorId],
    queryFn: () => TimeSlotService.getMentorTimeSlots(mentorId as string),
    enabled: !!mentorId,
    select: (data) => {
      return Object.fromEntries(
        Object.entries(data).filter(([_, slots]) => slots.length > 0),
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData = {
      mentorId,
      mentorshipType: selectedType,
      date: selectedDate,
      timeSlot: selectedTime,
      reason: bookingReason,
    };

    console.log("Booking data:", bookingData);

    toast.success("Booking request submitted", {
      description:
        "Your booking request has been sent to the mentor for confirmation.",
    });
  };

  const selectedTypeDetails = mentorshipTypes.find(
    (type) => type._id === selectedType,
  );

  // Find the selected time slot to get the startTime
  const selectedTimeSlot =
    selectedDate && selectedTime
      ? timeslots[selectedDate]?.find((slot) => slot._id === selectedTime)
      : null;

  // Format the selected date for display
  const formattedSelectedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book a Mentorship Session</h1>
        <p className="text-muted-foreground">
          Select your preferred mentorship type, date, and time
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Mentorship Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Select Mentorship Type
            </CardTitle>
            <CardDescription>
              Choose the type of mentorship you need
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">
                Loading mentorship types...
              </p>
            ) : isError ? (
              <p className="text-red-500">
                Failed to load mentorship types. Please try again.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentorshipTypes.map((type: MentorshipType) => {
                  const isSelected = selectedType === type._id;
                  return (
                    <div
                      key={type._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                      onClick={() => setSelectedType(type._id)}
                    >
                      <div className="flex h-full items-center justify-between mb-2">
                        <h3 className="text-md font-semibold">{type.name}</h3>
                        <span>₹{type.defaultPrice}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Select Date
            </CardTitle>
            <CardDescription>
              Choose an available date for your session
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isTimeslotLoading ? (
              <p className="text-muted-foreground">
                Loading available dates...
              </p>
            ) : isTimeslotError ? (
              <p className="text-red-500">
                Failed to load timeslots. Please refresh the page.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.keys(timeslots).map((date) => {
                  const formattedDate = new Date(date).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      weekday: "short",
                    },
                  );

                  return (
                    <div
                      key={date}
                      className={`p-3 border rounded-md text-center cursor-pointer transition-colors hover:bg-accent ${
                        selectedDate === date
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime("");
                      }}
                    >
                      <p className="font-medium">{formattedDate}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeslots[date].length} slots
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Selection - Only shown if date is selected */}
        {selectedDate && timeslots[selectedDate]?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Select Time
              </CardTitle>
              <CardDescription>Choose an available time slot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {timeslots[selectedDate].map((slot) => (
                  <div
                    key={slot._id}
                    className={`p-2 border rounded-md text-center cursor-pointer transition-colors hover:bg-accent ${
                      selectedTime === slot._id
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedTime(slot._id)}
                  >
                    {slot.startTime}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Details */}
        {selectedTypeDetails && (
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                Review your mentorship session details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mentorship Type</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTypeDetails.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{selectedTypeDetails.defaultPrice}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formattedSelectedDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTimeSlot
                      ? selectedTimeSlot.startTime
                      : "Not selected"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Booking</Label>
                <Textarea
                  id="reason"
                  placeholder="Please describe what you'd like to discuss or achieve in this mentorship session..."
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This information helps the mentor prepare for your session and
                  decide whether to accept your booking request.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={
                  !selectedType ||
                  !selectedDate ||
                  !selectedTime ||
                  !bookingReason
                }
              >
                Submit Booking Request
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  );
};

export default BookingPage;
