import { IsArray, IsNumber, IsString } from "class-validator";

export class MentorApplicationStatusDTO {
  @IsString()
  status!: string;

  @IsNumber()
  count!: number;

  @IsNumber()
  percentage!: number;

  @IsString()
  color!: string;
}

export class MentorApplicationStatsDTO {
  @IsNumber()
  totalApplications!: number;

  @IsArray()
  statusBreakdown!: MentorApplicationStatusDTO[];

  static create(
    totalApplications: number,
    statusBreakdown: MentorApplicationStatusDTO[],
  ): MentorApplicationStatsDTO {
    const dto = new MentorApplicationStatsDTO();
    dto.totalApplications = totalApplications;
    dto.statusBreakdown = statusBreakdown;
    return dto;
  }
}
