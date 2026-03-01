import { useState, useEffect, useCallback } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import type { IBooking } from "@/types/booking";
import BookingService from "@/services/bookingService";
import { BookingFilters } from "./components/booking-filters";
import { BookingList } from "./components/booking-list";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    date?: string;
    mentorshipTypeId?: string;
  }>({});

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      if (Object.keys(filters).length > 0) {
        const data = await BookingService.getFilteredBookings(filters);
        setBookings(data || []);
      } else if (activeTab === "upcoming") {
        const data = await BookingService.getUpcomingBookings();
        setBookings(data || []);
      } else {
        const data = await BookingService.getCompletedBookings();
        setBookings(data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  console.log(bookings);

  const handleFilterChange = (newFilters: {
    date?: string;
    mentorshipTypeId?: string;
  }) => {
    setFilters(newFilters);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "upcoming" | "past");
    setFilters({}); // Reset filters when changing tabs
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Booking Management</h1>

      <Tabs defaultValue="upcoming" onValueChange={handleTabChange}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
          <TabsTrigger value="past">Past Bookings</TabsTrigger>
        </TabsList>

        <BookingFilters onFilterChange={handleFilterChange} />

        <TabsContent value="upcoming">
          <BookingList
            bookings={bookings}
            isLoading={isLoading}
            type="upcoming"
            onActionComplete={fetchBookings}
          />
        </TabsContent>

        <TabsContent value="past">
          <BookingList
            bookings={bookings}
            isLoading={isLoading}
            type="past"
            onActionComplete={fetchBookings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
