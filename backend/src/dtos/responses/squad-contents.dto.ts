import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

import type { EnrichedContent } from "@/core/types/content";

export class SquadContentResponseDto {
  @IsString()
  _id!: string;

  @IsString()
  author!: string;

  @IsString()
  contentType!: string;

  @IsString()
  title!: string;

  @IsNumber()
  upvoteCount!: number;

  @IsNumber()
  downvoteCount!: number;

  @IsString()
  squad!: string;

  @IsBoolean()
  isPremium!: boolean;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string | null;

  @IsString()
  content!: string;

  @IsNumber()
  commentCount!: number;

  @IsNumber()
  bookmarkCount!: number;

  @IsNumber()
  viewCount!: number;

  @IsBoolean()
  isVerified!: boolean;

  @IsDateString()
  createdAt!: string;

  @IsBoolean()
  isUpvoted!: boolean;

  @IsBoolean()
  isDownvoted!: boolean;

  @IsBoolean()
  isBookmarked!: boolean;

  @IsBoolean()
  isFollowing!: boolean;

  @IsBoolean()
  isConnected!: boolean;

  @IsString()
  authorName!: string;

  @IsString()
  authorUsername!: string;

  @IsString()
  authorProfilePic!: string;

  @IsString()
  authorRole!: string;

  static fromEntity(entity: EnrichedContent): SquadContentResponseDto {
    const dto = new SquadContentResponseDto();
    dto._id = entity._id;
    dto.author = entity.author;
    dto.contentType = entity.contentType;
    dto.title = entity.title;
    dto.upvoteCount = entity.upvoteCount;
    dto.downvoteCount = entity.downvoteCount;
    dto.squad = entity.squad;
    dto.isPremium = entity.isPremium;
    dto.thumbnailUrl = entity.thumbnailUrl;
    dto.videoUrl = entity.videoUrl;
    dto.content = entity.content;
    dto.commentCount = entity.commentCount;
    dto.bookmarkCount = entity.bookmarkCount;
    dto.viewCount = entity.viewCount;
    dto.isVerified = entity.isVerified;
    dto.createdAt = entity.createdAt;
    dto.isUpvoted = entity.isUpvoted;
    dto.isDownvoted = entity.isDownvoted;
    dto.isBookmarked = entity.isBookmarked;
    dto.isFollowing = entity.isFollowing;
    dto.isConnected = entity.isConnected;
    dto.authorName = entity.authorName;
    dto.authorUsername = entity.authorUsername;
    dto.authorProfilePic = entity.authorProfilePic;
    dto.authorRole = entity.authorRole;
    return dto;
  }

  static fromEntities(entities: EnrichedContent[]): SquadContentResponseDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}
