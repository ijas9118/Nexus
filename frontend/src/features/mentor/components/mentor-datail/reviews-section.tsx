import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Star } from "lucide-react";

// Dummy review data
const reviewsData = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
    },
    rating: 5,
    date: "March 15, 2025",
    content:
      "Ahammed was incredibly helpful in guiding me through my portfolio review. His feedback was constructive and actionable. I implemented his suggestions and landed three interviews the following week!",
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    rating: 4,
    date: "February 28, 2025",
    content:
      "Great 1-on-1 session focused on React and TypeScript. Ahammed explained complex concepts in a way that was easy to understand. Would definitely book another session.",
  },
  {
    id: 3,
    user: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ER",
    },
    rating: 5,
    date: "January 10, 2025",
    content:
      "The resume review session was exactly what I needed. Ahammed provided detailed feedback on how to highlight my skills and experience. Very professional and knowledgeable.",
  },
  {
    id: 4,
    user: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DK",
    },
    rating: 5,
    date: "December 5, 2024",
    content:
      "Ahammed helped me prepare for technical interviews with practical advice and mock interview sessions. His industry experience was evident, and his tips were invaluable.",
  },
];

export function ReviewsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reviews</span>
          <span className="text-sm font-normal text-muted-foreground">
            {reviewsData.length} reviews
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviewsData.map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={review.user.avatar || "/placeholder.svg"}
                    alt={review.user.name}
                  />
                  <AvatarFallback>{review.user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{review.user.name}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.content}</p>
            {review.id !== reviewsData.length && <hr className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
