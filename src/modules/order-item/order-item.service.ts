import { DummyProductClient } from '@app/dummy';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderItemsDto } from 'src/modules/order-item/dto/create-order-items.dto';
import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { OrderService } from 'src/modules/order/order.service';
import { Repository } from 'typeorm';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly orderService: OrderService,
    private readonly dummyProductClient: DummyProductClient,
  ) {}

  async create(createOrderItemDto: CreateOrderItemsDto): Promise<OrderItem[]> {
    const buildOrderItems = this.buildOrderItems(createOrderItemDto);

    const orderItems: OrderItem[] = [];

    for await (const orderItem of buildOrderItems) {
      orderItems.push(orderItem);
    }

    return this.orderItemRepository.save(orderItems);
  }

  // utilizar GENERATORS para criação de items de um pedido
  async *buildOrderItems(
    createOrderItemDto: CreateOrderItemsDto,
  ): AsyncGenerator<OrderItem, void, unknown> {
    const { orderCode, orderItems } = createOrderItemDto;

    const order = await this.orderService.findOneBy({
      code: orderCode,
    });

    for (const { productId, quantity } of orderItems) {
      const product = await this.dummyProductClient.getSingleProduct(productId);

      const totalPrice = quantity * product.price;

      yield this.orderItemRepository.create({
        order,
        productId,
        quantity,
        totalPrice,
        unitPrice: product.price,
      });
    }
  }

  findAll() {
    return `This action returns all orderItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderItem`;
  }

  update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }
}
