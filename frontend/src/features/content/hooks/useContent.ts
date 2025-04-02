import { useQuery } from "@tanstack/react-query";
import { getContent } from "@/services/user/contentService";

export const useContent = (id: string | undefined) => {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => getContent(id as string),
    enabled: !!id,
  });
};
