import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AvailabilityType } from "@/types/mentor";
import MentorService from "@/services/mentorService";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";

export function useMentorAvailability() {
  const [availabilityType, setAvailabilityType] =
    useState<AvailabilityType>("both");
  const [originalAvailabilityType, setOriginalAvailabilityType] =
    useState<AvailabilityType>("both");

  const { showConfirm } = useConfirmDialog();
  const queryClient = useQueryClient();

  const {
    data: existingAvailability,
    isLoading: isFetchingAvailability,
    isError,
  } = useQuery({
    queryKey: ["mentorAvailability"],
    queryFn: MentorService.getAvailability,
    staleTime: 1000 * 60 * 5, // cache for 5 min
    retry: false,
  });

  useEffect(() => {
    if (existingAvailability) {
      setAvailabilityType(existingAvailability);
      setOriginalAvailabilityType(existingAvailability);
    }
  }, [existingAvailability]);

  const { mutate: updateAvailability, isPending } = useMutation({
    mutationFn: (availabilityType: AvailabilityType) =>
      MentorService.updateAvailability(availabilityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorAvailability"] });
    },
  });

  const handleAvailabilityChange = (availabilityType: AvailabilityType) => {
    showConfirm({
      title: "Update your availability?",
      description:
        "Changing your availability may affect existing scheduled sessions.",
      confirmLabel: "Yes, update",
      cancelLabel: "Cancel",
      onConfirm: () => updateAvailability(availabilityType),
    });
  };

  return {
    availabilityType,
    setAvailabilityType,
    originalAvailabilityType,
    isFetchingAvailability,
    isError,
    isPending,
    handleAvailabilityChange,
  };
}
