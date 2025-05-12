import { useState, useEffect, useCallback } from "react";
import { IBooking } from "@/types/booking";
import BookingService from "@/services/bookingService";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  Tabs,
} from "@/components/organisms/tabs";
import { MeetingCard } from "./components/MeetingCard";
import { EmptyState } from "./components/EmptyState";

export default function MentorshipMeetingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
    "upcoming",
  );
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data =
        activeTab === "upcoming"
          ? await BookingService.getUpcomingBookings()
          : await BookingService.getCompletedBookings();
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [activeTab, fetchBookings]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "upcoming" | "completed");
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Mentorship Meetings</h1>

      <Tabs
        defaultValue="upcoming"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading upcoming meetings...
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <MeetingCard key={booking._id} booking={booking} />
            ))
          ) : (
            <EmptyState message="You don't have any upcoming mentorship meetings scheduled. Book a session with a mentor to get started." />
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <MeetingCard key={booking._id} booking={booking} />
            ))
          ) : (
            <EmptyState message="You haven't completed any mentorship meetings yet." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
