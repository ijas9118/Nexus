import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MENTORS } from "./components/constants";
import ServiceSelection from "./components/mentor-booking/ServiceSelection";
import DateTimeSelection from "./components/mentor-booking/DateTimeSelection";
import PaymentDetails from "./components/mentor-booking/PaymentDetails";

const BookSession = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState<string>();
  const [sessionType, setSessionType] = useState<string>(
    "1-on-1 Session (45 min)",
  );
  const [step, setStep] = useState(1);

  const id = Number.parseInt(mentorId || "");

  if (isNaN(id)) {
    return <p>Invalid Mentor ID</p>;
  }

  const mentor = MENTORS[id - 1];

  const timeSlots = [
    "9:00 AM - 9:45 AM",
    "10:00 AM - 10:45 AM",
    "11:00 AM - 11:45 AM",
    "1:00 PM - 1:45 PM",
    "2:00 PM - 2:45 PM",
    "3:00 PM - 3:45 PM",
    "4:00 PM - 4:45 PM",
  ];

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getCurrentPrice = () => {
    const sessionTypeObj = mentor.pricing.find((p) => p.type === sessionType);
    return sessionTypeObj ? sessionTypeObj.price : 0;
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <div className="mb-4">
        <Link to={`/mentors/${id}`}>
          <Button variant="ghost">← Back to profile</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Book a Session</h1>
          <p className="text-muted-foreground">
            Schedule a mentorship session with {mentor.name}
          </p>

          <div className="relative">
            <div className="absolute left-0 top-0 h-full w-[1px] bg-border">
              <div
                className="absolute left-0 top-0 h-1/3 w-[1px] bg-primary"
                style={{ height: `${(step / 3) * 100}%` }}
              />
            </div>

            <div className="space-y-6 ml-10">
              <div className="relative">
                <div
                  className={`absolute left-[-24px] top-1 h-4 w-4 rounded-full border 
                    ${step >= 1 ? "bg-primary border-primary" : "bg-background border-border"}`}
                >
                  {step > 1 && (
                    <Check className="h-3 w-3 text-primary-foreground absolute inset-0 m-auto" />
                  )}
                </div>
                <ServiceSelection
                  step={step}
                  sessionType={sessionType}
                  setSessionType={setSessionType}
                  pricing={mentor.pricing}
                  onContinue={handleContinue}
                />
              </div>

              <div className="relative">
                <div
                  className={`absolute left-[-24px] top-1 h-4 w-4 rounded-full border 
                    ${step >= 2 ? "bg-primary border-primary" : "bg-background border-border"}`}
                >
                  {step > 2 && (
                    <Check className="h-3 w-3 text-primary-foreground absolute inset-0 m-auto" />
                  )}
                </div>
                <DateTimeSelection
                  date={date}
                  step={step}
                  setDate={setDate}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                  onBack={handleBack}
                  onContinue={handleContinue}
                  timeSlots={timeSlots}
                />
              </div>

              <div className="relative">
                <div
                  className={`absolute left-[-24px] top-1 h-4 w-4 rounded-full border ${
                    step >= 3
                      ? "bg-primary border-primary"
                      : "bg-background border-border"
                  }`}
                >
                  {step > 3 && (
                    <Check className="h-3 w-3 text-primary-foreground absolute inset-0 m-auto" />
                  )}
                </div>
                <PaymentDetails
                  step={step}
                  onBack={handleBack}
                  price={getCurrentPrice()}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`/placeholder.svg?text=${mentor.name.charAt(0)}`}
                    alt={mentor.name}
                  />
                  <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{mentor.name}</p>
                  <p className="text-sm text-muted-foreground">{mentor.role}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span className="font-medium">Session Type:</span>
                  <span>{sessionType}</span>
                </div>
                {date && (
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{date.toLocaleDateString()}</span>
                  </div>
                )}
                {timeSlot && (
                  <div className="flex justify-between">
                    <span className="font-medium">Time:</span>
                    <span>{timeSlot}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-between pt-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">${getCurrentPrice()}</span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                If you have any questions about booking a session, please
                contact our support team.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookSession;
