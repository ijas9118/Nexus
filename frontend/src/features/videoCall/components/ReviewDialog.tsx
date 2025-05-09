// components/ReviewDialog.tsx
import React, { useState } from "react";

interface ReviewDialogProps {
  onSubmit: (rating: number, feedback: string) => void;
  onExit: () => void;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  onSubmit,
  onExit,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit(rating, feedback);
    onExit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Rate Your Call</h2>
        <div className="mb-4">
          <label className="block mb-2">Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
