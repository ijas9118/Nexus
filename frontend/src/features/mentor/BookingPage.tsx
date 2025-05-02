import { Alert, AlertDescription } from "@/components/atoms/alert";
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
import { AlertTriangle, Calendar, Clock, Info } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

// Mentorship types with their details (removed duration)
const mentorshipTypes = [
  { id: "1-on-1", name: "1-on-1 Session", price: 50 },
  { id: "career-guidance", name: "Career Guidance", price: 60 },
  { id: "mock-interview", name: "Mock Interview", price: 75 },
  { id: "portfolio-review", name: "Portfolio Review", price: 65 },
  { id: "resume-review", name: "Resume Review", price: 40 },
  { id: "code-review", name: "Code Review", price: 70 },
  { id: "technical-mentoring", name: "Technical Mentoring", price: 80 },
];

// Sample data for available timeslots
const availableTimeslots: Record<string, string[]> = {
  "2025-04-23": ["12:01", "12:15", "13:30", "20:47"],
  "2025-04-25": ["13:30", "18:50", "19:30", "20:53", "21:53"],
  "2025-04-26": ["10:00"],
  "2025-04-30": ["10:30"],
};

const BookingPage = () => {
  const { mentorId } = useParams<{ mentorId: string }>();

  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingReason, setBookingReason] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData = {
      mentorId,
      mentorshipType: selectedType,
      date: selectedDate,
      time: selectedTime,
      reason: bookingReason,
    };

    console.log("Booking data:", bookingData);

    toast.success("Booking request submitted", {
      description:
        "Your booking request has been sent to the mentor for confirmation.",
    });
  };

  const selectedTypeDetails = mentorshipTypes.find(
    (type) => type.id === selectedType,
  );

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentorshipTypes.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <div
                    key={type.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted"
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex h-full items-center justify-between mb-2">
                      <h3 className="text-md font-semibold">{type.name}</h3>
                      <span>₹{type.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.keys(availableTimeslots).map((date) => {
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
                      {availableTimeslots[date].length} slots
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Time Selection - Only shown if date is selected */}
        {selectedDate && (
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
                {availableTimeslots[selectedDate].map((time) => (
                  <div
                    key={time}
                    className={`p-2 border rounded-md text-center cursor-pointer transition-colors hover:bg-accent ${
                      selectedTime === time
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
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
                    ${selectedTypeDetails.price}
                  </p>
                </div>
              </div>

              <Alert className="bg-muted/50 border-blue-500 text-blue-600 dark:text-blue-300 dark:border-blue-400">
                <div className="flex items-center gap-5">
                  <AlertTriangle className="stroke-blue-500 dark:stroke-blue-300" />
                  <AlertDescription>
                    Full payment is required to confirm your booking. No refunds
                    will be provided if you disconnect before the session ends.
                  </AlertDescription>
                </div>
              </Alert>

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
