import { DummyUserClient } from '@app/dummy';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { FilterOrderDto } from 'src/modules/order/dto/filter-order.dto';
import { Order } from 'src/modules/order/entities/order.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dummyUserClient: DummyUserClient,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    await this.validateOrderCodeAlreadyExists(createOrderDto.code);

    const customer = await this.dummyUserClient.getSingleUser(
      createOrderDto.customerId,
    );

    const order = this.orderRepository.create({
      ...createOrderDto,
      customerId: customer.id,
    });

    return this.orderRepository.save(order);
  }

  filterOrders(filterOrderDto: FilterOrderDto) {
    const queryBuilder = this.orderRepository.createQueryBuilder('o');

    filterOrderDto.createOrder(queryBuilder);
    filterOrderDto.createWhere(queryBuilder);

    return paginate(queryBuilder, {
      page: filterOrderDto.page,
      limit: filterOrderDto.limit,
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOneBy({
      id,
    });

    if (!order) {
      throw new NotFoundException();
    }

    return order;
  }

  async findOneBy(
    where: FindOptionsWhere<Order> | FindOptionsWhere<Order>[],
  ): Promise<Order> {
    const order = await this.orderRepository.findOneBy(where);

    if (!order) {
      throw new NotFoundException();
    }

    return order;
  }

  private async validateOrderCodeAlreadyExists(code: string): Promise<void> {
    const orderAlreadyExists = await this.orderRepository.countBy({
      code,
    });

    if (orderAlreadyExists > 0) {
      throw new ConflictException(
        `Já existe um pedido cadastrado com o código ${code}.`,
      );
    }
  }
}
