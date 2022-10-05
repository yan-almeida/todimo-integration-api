import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, MaxLength } from 'class-validator';
import { PaymentType } from 'src/modules/order/entities/order.entity';

export class CreateOrderDto {
  @ApiProperty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty()
  @IsInt()
  customerId: number;
}
