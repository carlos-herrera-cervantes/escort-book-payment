import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'service' })
export class PriceDetail extends BaseEntity {
  @Column({ name: 'id', primary: true })
  id: string;
}
