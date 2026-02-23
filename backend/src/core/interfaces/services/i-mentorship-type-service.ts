import type { MentorshipTypeResponseDto } from "@/dtos/responses/mentorship-type.dto";

export interface IMentorshipTypeService {
  createMentorshipType: (data: {
    name: string;
    description: string;
    defaultPrice?: number;
  }) => Promise<MentorshipTypeResponseDto>;
  getMentorshipType: (
    id: string,
    options?: { includeInactive?: boolean },
  ) => Promise<MentorshipTypeResponseDto>;
  getAllMentorshipTypes: (options?: {
    includeInactive?: boolean;
  }) => Promise<MentorshipTypeResponseDto[]>;
  updateMentorshipType: (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      defaultPrice: number;
    }>,
  ) => Promise<MentorshipTypeResponseDto>;
  deleteMentorshipType: (id: string) => Promise<void>;
  restoreMentorshipType: (id: string) => Promise<void>;
}
