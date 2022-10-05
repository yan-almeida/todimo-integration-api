import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderItemsDto } from 'src/modules/order-item/dto/create-order-items.dto';
import { OrderItemService } from './order-item.service';

@Controller('order-items')
@ApiTags('Order Items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  create(@Body() createOrderItemsDto: CreateOrderItemsDto) {
    return this.orderItemService.createOrUpdateInBatch(createOrderItemsDto);
  }

  @Get(':orderCode')
  findAllByOrderCode(@Param('orderCode') orderCode: string) {
    return this.orderItemService.findAllByOrderCode(orderCode);
  }

  @Get(':orderCode/details')
  orderDetailsParam(@Param('orderCode') orderCode: string) {
    return this.orderItemService.orderDetails(orderCode);
  }
}
