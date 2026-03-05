import { useQuery } from "@tanstack/react-query";

import ContentService from "@/services/user/contentService";
import type { Content } from "@/types/content";

export const useContent = (id: string | undefined) => {
  return useQuery<Content>({
    queryKey: ["content", id],
    queryFn: () => ContentService.getContent(id as string),
    enabled: !!id,
  });
};
