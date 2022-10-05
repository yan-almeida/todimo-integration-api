import { FilterBuilder, ParseNumberTransform } from '@app/commons/builders';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentType } from 'src/modules/order/entities/order.entity';
import { SelectQueryBuilder } from 'typeorm';

export class FilterOrderDto extends FilterBuilder {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(ParseNumberTransform)
  customerId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ enum: PaymentType })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  createWhere<T>(queryBuilder: SelectQueryBuilder<T>): void {
    this.withFilter(this.customerId, () =>
      queryBuilder.andWhere('o.customer_id = :customerId', {
        customerId: this.customerId,
      }),
    );

    this.withFilter(this.code, () =>
      queryBuilder.andWhere('o.code = :code', {
        code: this.code,
      }),
    );

    this.withFilter(this.paymentType, () =>
      queryBuilder.andWhere('o.payment_type = :paymentType', {
        paymentType: this.paymentType,
      }),
    );
  }

  createOrder<T = any>(queryBuilder: SelectQueryBuilder<T>): void {
    queryBuilder.addOrderBy('o.code', 'ASC');
  }
}
