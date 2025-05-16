import ContentService from "@/services/user/contentService";
import { useQuery } from "@tanstack/react-query";

export const useContent = (id: string | undefined) => {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => ContentService.getContent(id as string),
    enabled: !!id,
  });
};
