import { IsNumber, IsString, IsArray } from 'class-validator';

export class SubscriptionPlanStatsDTO {
  @IsString()
  tier!: string;

  @IsNumber()
  count!: number;

  @IsNumber()
  percentage!: number;

  @IsNumber()
  revenue!: number;

  @IsString()
  color!: string;
}

export class SubscriptionStatsDTO {
  @IsNumber()
  totalRevenue!: number;

  @IsNumber()
  totalSubscriptions!: number;

  @IsArray()
  plans!: SubscriptionPlanStatsDTO[];

  static create(
    totalRevenue: number,
    totalSubscriptions: number,
    plans: SubscriptionPlanStatsDTO[]
  ): SubscriptionStatsDTO {
    const dto = new SubscriptionStatsDTO();
    dto.totalRevenue = totalRevenue;
    dto.totalSubscriptions = totalSubscriptions;
    dto.plans = plans;
    return dto;
  }
}
