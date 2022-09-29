import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  productId: number;
}
