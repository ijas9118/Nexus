import { Separator } from "@/components/atoms/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { MapPin } from "lucide-react";

type Props = {
  data: any; // Replace with your actual type
};

const ApplicantProfileCard = ({ data }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle>Applicant Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        <div className="relative h-24 w-24 mb-4">
          <img
            src={data.userId.profilePic || "/placeholder.svg"}
            alt={data.userId.name}
            className="rounded-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold">{data.userId.name}</h3>
        <p className="text-sm text-muted-foreground">@{data.userId.username}</p>
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {data.userId.location}
        </div>
        <Separator className="my-4" />
        <div className="w-full text-left">
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm text-muted-foreground mb-3">
            {data.userId.email}
          </p>
          {data.userId?.phone && (
            <>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground mb-3">
                {data.userId.phone}
              </p>
            </>
          )}
          <p className="text-sm font-medium">Application Date</p>
          <p className="text-sm text-muted-foreground mb-3">
            {formatDate(data.createdAt)}
          </p>
          <p className="text-sm font-medium">Bio</p>
          <p className="text-sm text-muted-foreground mb-3">
            {data.experience.bio || "No bio provided"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicantProfileCard;
