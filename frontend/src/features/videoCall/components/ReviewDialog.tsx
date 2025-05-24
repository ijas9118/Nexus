import type React from "react";
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";

interface ReviewDialogProps {
  open?: boolean;
  onSubmit: (rating: number, feedback: string) => void;
  onExit: () => void;
}

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starIndex: number, isHalf: boolean) => {
    const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;
    onRatingChange(newRating);
  };

  const handleStarHover = (starIndex: number, isHalf: boolean) => {
    const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;
    setHoverRating(newRating);
  };

  const getStarFill = (starIndex: number) => {
    const currentRating = hoverRating || rating;
    if (currentRating >= starIndex + 1) {
      return "full";
    } else if (currentRating >= starIndex + 0.5) {
      return "half";
    }
    return "empty";
  };

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((starIndex) => (
        <div
          key={starIndex}
          className="relative cursor-pointer"
          onMouseLeave={() => setHoverRating(0)}
        >
          {/* Left half of star */}
          <div
            className="absolute inset-0 w-1/2 z-10"
            onMouseEnter={() => handleStarHover(starIndex, true)}
            onClick={() => handleStarClick(starIndex, true)}
          />
          {/* Right half of star */}
          <div
            className="absolute inset-0 left-1/2 w-1/2 z-10"
            onMouseEnter={() => handleStarHover(starIndex, false)}
            onClick={() => handleStarClick(starIndex, false)}
          />

          <div className="relative">
            {/* Background star (empty) */}
            <Star className="w-8 h-8 text-gray-300" />

            {/* Filled star overlay */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                width:
                  getStarFill(starIndex) === "full"
                    ? "100%"
                    : getStarFill(starIndex) === "half"
                      ? "50%"
                      : "0%",
              }}
            >
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        </div>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {rating > 0 ? `${rating} out of 5` : "Select a rating"}
      </span>
    </div>
  );
};

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open = true,
  onSubmit,
  onExit,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, feedback);
      onExit();
    }
  };

  const handleSkip = () => {
    onExit();
  };

  return (
    <Dialog open={open} onOpenChange={onExit}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Rate Your Call
          </DialogTitle>
          <DialogDescription>
            Help us improve by sharing your experience with this call.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              How would you rate this call?
            </Label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>

          <div className="space-y-3">
            <Label htmlFor="feedback" className="text-sm font-medium">
              Additional feedback (optional)
            </Label>
            <Textarea
              id="feedback"
              placeholder="Tell us more about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="min-w-[80px]"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
