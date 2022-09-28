import { PrimaryGeneratedColumn } from 'typeorm';
import { DateEntity } from './date.entity';

export class IncrementalEntity extends DateEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}
