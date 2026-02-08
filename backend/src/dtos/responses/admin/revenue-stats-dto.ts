import { IsArray, IsString } from "class-validator";

export class RevenueDataPointDTO {
  @IsString()
  date!: string;

  platformFees!: number;
  subscriptions!: number;
  total!: number;
}

export class RevenueStatsDTO {
  @IsArray()
  data!: RevenueDataPointDTO[];

  static create(data: RevenueDataPointDTO[]): RevenueStatsDTO {
    const dto = new RevenueStatsDTO();
    dto.data = data;
    return dto;
  }
}
