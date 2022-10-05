import {
  BuilderFunction,
  QueryBuilder,
} from '@app/commons/builders/query.builder';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { Allow, IsOptional } from 'class-validator';
import { format, subWeeks } from 'date-fns';
import { SelectQueryBuilder } from 'typeorm';

export const ParseNumberTransform = (property: TransformFnParams) => {
  return Number(property.value);
};

const SUB_WEEK = 1;
export abstract class FilterBuilder {
  @ApiPropertyOptional({
    description: 'Pagina atual',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(ParseNumberTransform)
  page?: number;

  @ApiPropertyOptional({
    description: 'Limite de entidades por página',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Transform(ParseNumberTransform)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Ordenação',
  })
  @IsOptional()
  @Allow()
  order?: {
    [prop: string]: 'ASC' | 'DESC';
  };

  @ApiPropertyOptional({
    description: 'Entidades a partir de uma data',
    example: format(subWeeks(new Date(), SUB_WEEK), 'yyyy-MM-dd'),
  })
  @IsOptional()
  startAt?: string;

  @ApiPropertyOptional({
    description: 'Entidades até de uma data',
    example: format(new Date(), 'yyyy-MM-dd'),
  })
  @IsOptional()
  endAt?: string;

  protected getWithArray(value: any) {
    return QueryBuilder.getAsArray(value);
  }

  protected withFilter<E = any>(field: E, fnc: BuilderFunction<E>) {
    QueryBuilder.withFilter(field, fnc);
  }

  protected withOrderBy<E = any>(field: E, value: E, fnc: BuilderFunction<E>) {
    QueryBuilder.withOrderBy(field, value, fnc);
  }

  protected createLike(value: string) {
    return QueryBuilder.createLike(value);
  }

  abstract createWhere<T = any>(queryBuilder: SelectQueryBuilder<T>): void;

  createOrder<T = any>(queryBuilder: SelectQueryBuilder<T>): void {
    if (this.order) {
      Object.entries(this.order).forEach(([field, value]) => {
        queryBuilder.addOrderBy(`${queryBuilder.alias}.${field}`, value);
      });
    }
  }
}
