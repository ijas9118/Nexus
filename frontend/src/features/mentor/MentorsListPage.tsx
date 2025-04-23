import { Button } from "@/components/atoms/button";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MentorFilters from "./components/MentorFilters";
import SearchAndSort from "./components/SearchAndSort";
import MentorCard from "./components/MentorCard";
import { useQuery } from "@tanstack/react-query";
import MentorService from "@/services/mentorService";
import { Mentor } from "@/types/mentor";
import { RootState } from "@/store/store";

const Mentors = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "Mentors", url: "" },
      ]),
    );
  }, [dispatch]);

  const {
    data: mentorStatus,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mentor-status"],
    queryFn: () => MentorService.getStatus(),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: mentors = [],
    isLoading: isMentorListLoading,
    isError: isMentorListError,
  } = useQuery({
    queryKey: ["mentor-list", currentUserId], // so cache is scoped per user
    queryFn: async () => {
      const allMentors = await MentorService.getApprovedMentors();
      return allMentors.filter(
        (mentor: Mentor) => mentor.userId._id !== currentUserId,
      );
    },
  });

  console.log(mentors);

  if (isLoading) return <p>Loading mentor status...</p>;
  if (isError) return <p>Failed to load mentor status</p>;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Find Your Mentor
          </h1>
          <p className="text-muted-foreground">
            Connect with experienced mentors to accelerate your growth
          </p>
        </div>
        <div className="flex gap-2">
          {!mentorStatus && (
            <Link to="/mentors/apply">
              <Button>Become a Mentor</Button>
            </Link>
          )}

          {mentorStatus === "pending" && (
            <p className="text-sm text-muted-foreground italic">
              Your mentor application is under review.
            </p>
          )}

          {mentorStatus === "approved" && (
            <p className="text-sm text-green-600 font-medium">
              You're already a mentor!
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr] mb-8">
        <div className="h-screen sticky top-0 overflow-y-auto">
          <MentorFilters />
        </div>

        <div className="space-y-6 pb-10">
          <SearchAndSort />

          <div className="space-y-4">
            {isMentorListLoading && (
              <p className="text-sm text-muted-foreground">
                Loading mentors...
              </p>
            )}

            {isMentorListError && (
              <p className="text-sm text-red-500">Failed to load mentors.</p>
            )}

            {!isMentorListLoading &&
              !isMentorListError &&
              mentors.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No mentors available at the moment. Try again later!
                </p>
              )}

            {!isMentorListLoading &&
              !isMentorListError &&
              mentors.length > 0 &&
              mentors.map((mentor: Mentor) => (
                <MentorCard key={mentor._id} mentor={mentor} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
