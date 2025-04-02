import { useState, useEffect } from "react";

export const useInteraction = (initialLikes: number = 0) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    setIsLiked(initialLikes > 0);
  }, [initialLikes]);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    // Add API call here if needed
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    // Add API call here if needed
  };

  return { isLiked, isBookmarked, handleLike, handleBookmark };
};
