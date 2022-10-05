import { UniqueIdentifierEntity } from '@app/commons';
import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum PaymentType {
  TICKET = 'boleto',
  CREDIT_CARD = 'cartao de credito',
  IN_CASH = 'em dinheiro',
}

@Entity()
export class Order extends UniqueIdentifierEntity {
  @Column({
    length: 50,
    unique: true,
  })
  code: string; // varchar(50), nvarchar(50)

  @Column({
    name: 'payment_type',
    enumName: 'payment_type',
    enum: PaymentType,
    default: PaymentType.TICKET,
  })
  paymentType: PaymentType;

  @Column({
    name: 'customer_id',
  })
  customerId: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
