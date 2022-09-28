import { BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { DateEntity } from './date.entity';

/**
 * Entidade base para Identificador único - UUID/GUID
 */
export class UniqueIdentifierEntity extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  private generateUuid() {
    if (this.id) {
      return;
    }

    this.id = uuidV4();
  }
}
