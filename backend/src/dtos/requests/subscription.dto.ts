import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriptionDTO {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  planId!: string;

  @IsString()
  @IsNotEmpty()
  stripeSubscriptionId!: string;

  @IsString()
  @IsNotEmpty()
  stripeCustomerId!: string;

  @IsString()
  @IsNotEmpty()
  paymentId!: string;

  @IsDate()
  @IsNotEmpty()
  endDate!: Date;
}
