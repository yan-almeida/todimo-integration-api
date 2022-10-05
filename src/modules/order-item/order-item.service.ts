import { DummyProductClient } from '@app/dummy';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderItemDto } from 'src/modules/order-item/dto/create-order-item.dto';
import { CreateOrderItemsDto } from 'src/modules/order-item/dto/create-order-items.dto';
import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { OrderService } from 'src/modules/order/order.service';
import { Repository } from 'typeorm';

class OrderDetail {
  @ApiProperty()
  total: string;

  @ApiProperty()
  quantity: string;
}

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly orderService: OrderService,
    private readonly dummyProductClient: DummyProductClient,
  ) {}

  /**
   * Criação de recurso em lote
   */
  async createOrUpdateInBatch(
    createOrderItemDto: CreateOrderItemsDto,
  ): Promise<void> {
    const buildOrderItems = this.buildOrderItems(createOrderItemDto);

    const orderItems: OrderItem[] = [];

    for await (const orderItem of buildOrderItems) {
      orderItems.push(orderItem);
    }

    await this.orderItemRepository.save(orderItems);
  }

  // utilizar GENERATORS para criação de items de um pedido
  // validar se o productId já existe no pedido e, caso exista, alterar a QUANTIDADE, PREÇO UNITÁRIO e VALOR TOTAL
  async *buildOrderItems(
    createOrderItemDto: CreateOrderItemsDto,
  ): AsyncGenerator<OrderItem, void, unknown> {
    const { orderCode, orderItems } = createOrderItemDto;

    const order = await this.orderService.findOneBy({
      code: orderCode,
    });

    for (const orderItem of orderItems) {
      const { productId, quantity } = orderItem;

      const productAlreadyExists = await this.orderItemRepository.findOneBy({
        productId,
        order: {
          id: order.id,
        },
      });

      if (productAlreadyExists) {
        await this.updateWhenAlreadyExists(order.id, orderItem);
        continue;
      }

      const product = await this.dummyProductClient.getSingleProduct(productId);

      const totalPrice = this.calculateTotalPrice(quantity, product.price);

      yield this.orderItemRepository.create({
        order,
        productId,
        quantity,
        totalPrice,
        unitPrice: product.price,
      });
    }
  }

  async orderDetails(orderCode: string): Promise<OrderDetail> {
    const order = await this.orderService.findOneBy({
      code: orderCode,
    });

    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select('SUM(oi.quantity)', 'quantity')
      .addSelect('SUM(oi.totalPrice)', 'total')
      .where('oi.order_id = :orderId', {
        orderId: order.id,
      })
      .getRawOne<OrderDetail>();
  }

  private async updateWhenAlreadyExists(
    orderId: string,
    orderItem: CreateOrderItemDto,
  ) {
    const { productId, quantity } = orderItem;

    const product = await this.dummyProductClient.getSingleProduct(productId);

    const totalPrice = this.calculateTotalPrice(quantity, product.price);

    await this.orderItemRepository.update(
      {
        productId,
        order: {
          id: orderId,
        },
      }, // update ... where orderId and productId
      {
        quantity,
        totalPrice,
        unitPrice: product.price,
      },
    );
  }

  private calculateTotalPrice(quantity: number, productPrice: number): number {
    return quantity * productPrice;
  }

  findAllByOrderCode(orderCode: string) {
    return this.orderItemRepository.findBy({ order: { code: orderCode } });
  }
}
