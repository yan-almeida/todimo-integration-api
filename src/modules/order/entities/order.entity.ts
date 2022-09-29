import { UniqueIdentifierEntity } from '@app/commons';
import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum PaymentType {
  TICKET = 'ticket',
  CREDIT_CARD = 'cartao de credito',
  IN_CASH = 'em dinheiro',
}

@Entity()
export class Order extends UniqueIdentifierEntity {
  @Column({
    length: 50,
  })
  code: string;

  @Column({
    name: 'payment_type',
    enumName: 'payment_type',
    enum: PaymentType,
  })
  paymentType: PaymentType;

  @Column({
    name: 'customer_id',
  })
  customerId: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
