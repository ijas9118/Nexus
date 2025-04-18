import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/molecules/alert-dialog";
import { Button } from "@/components/atoms/button";
import ApplicationHeader from "./mentor-application/ApplicationHeader";
import ApplicantProfileCard from "./mentor-application/ApplicantProfileCard";
import { useQuery } from "@tanstack/react-query";
import MentorService from "@/services/mentorService";
import { MentorApplication } from "@/types/mentor";
import { useParams } from "react-router-dom";

export default function MentorApplicationDetails() {
  const { mentorId } = useParams<{ mentorId: string }>();

  const {
    data: applicationData,
    isLoading,
    error,
  } = useQuery<MentorApplication>({
    queryKey: ["mentor-details", mentorId],
    queryFn: () => MentorService.getMentorDetails(mentorId as string),
  });

  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );

  const handleApprove = async () => {
    try {
      await MentorService.approveMentor(
        mentorId!,
        applicationData?.userId._id as string,
      );
      setStatus("approved");
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async () => {
    try {
      await MentorService.rejectMentor(mentorId!);
      setStatus("rejected");
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  if (isLoading)
    return <div className="text-center py-10">Loading mentor data...</div>;
  if (error || !applicationData)
    return (
      <div className="text-center text-red-500">
        Error fetching mentor details.
      </div>
    );

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <ApplicationHeader status={status} />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Section */}
        <ApplicantProfileCard data={applicationData} />

        <div className="md:col-span-2 space-y-6">
          {/* Experience Section */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Current Role</p>
                  <p className="text-muted-foreground">
                    {applicationData.experience.currentRole}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-muted-foreground">
                    {applicationData.experience.company}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Experience Level</p>
                  <p className="text-muted-foreground">
                    {applicationData.experience.experienceLevel.value} years
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Expertise Areas</p>
                <div className="flex flex-wrap gap-2">
                  {applicationData.experience.expertiseAreas.map((area) => (
                    <Badge
                      key={area._id}
                      variant="secondary"
                      className="capitalize"
                    >
                      {area.value}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {applicationData.experience.technologies.map((tech) => (
                    <Badge
                      key={tech._id}
                      variant="outline"
                      className="capitalize"
                    >
                      {tech.value}
                    </Badge>
                  ))}
                </div>
              </div>

              {applicationData.experience.resume && (
                <div>
                  <p className="text-sm font-medium mb-2">Resume</p>
                  <Button variant="outline" size="sm">
                    View Resume
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mentorship Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Mentorship Types</p>
                <div className="flex flex-wrap gap-2">
                  {applicationData.mentorshipDetails.mentorshipTypes.map(
                    (type) => (
                      <Badge
                        key={type._id}
                        variant="secondary"
                        className="capitalize"
                      >
                        {type.value.replace(/-/g, " ")}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Target Audience</p>
                <div className="flex flex-wrap gap-2">
                  {applicationData.mentorshipDetails.targetAudiences.map(
                    (audience) => (
                      <Badge
                        key={audience._id}
                        variant="outline"
                        className="capitalize"
                      >
                        {audience.value.replace(/-/g, " ")}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Availability</p>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="capitalize">
                    {applicationData.mentorshipDetails.availabilityType}s
                  </span>
                </div>
                <div className="space-y-1">
                  {applicationData.mentorshipDetails.availableTimeSlots.map(
                    (slot, index) => (
                      <div key={index} className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{slot}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Motivation</p>
                <p className="text-muted-foreground">
                  {applicationData.mentorshipDetails.motivation ||
                    "No motivation provided"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4">
        {/* Action Buttons */}
        {status === "pending" && (
          <div className="flex gap-4 justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Reject Application
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Application</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this mentor application?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReject}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  Approve Application
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Application</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve this mentor application?
                    The applicant will be notified and added to your mentor
                    roster.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleApprove}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {status !== "pending" && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setStatus("pending")}>
              Reset Status
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
