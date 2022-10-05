import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from 'src/modules/order-item/dto/create-order-item.dto';

export class CreateOrderItemsDto {
  @ApiProperty()
  orderCode: string;

  @ApiProperty({ isArray: true, type: CreateOrderItemDto })
  @ValidateNested()
  @IsArray()
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
