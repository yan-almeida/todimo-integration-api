import { UniqueIdentifierEntity } from '@app/commons';
import { Order } from 'src/modules/order/entities/order.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('order_item')
export class OrderItem extends UniqueIdentifierEntity {
  @Column()
  quantity: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({
    type: 'decimal',
    scale: 2,
    name: 'unit_Price',
  })
  unitPrice: number;

  @Column({
    type: 'decimal',
    scale: 2,
    name: 'total_price',
  })
  totalPrice: number;

  @ManyToOne(() => Order)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id',
  })
  order: Order;
}
