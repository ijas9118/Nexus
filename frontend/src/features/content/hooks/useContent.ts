import ContentService from "@/services/user/contentService";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@/types/content";

export const useContent = (id: string | undefined) => {
  return useQuery<Content>({
    queryKey: ["content", id],
    queryFn: () => ContentService.getContent(id as string),
    enabled: !!id,
  });
};
