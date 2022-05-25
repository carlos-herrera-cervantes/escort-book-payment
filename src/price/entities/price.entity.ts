import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'price' })
export class Price extends BaseEntity {
  @Column({ name: 'id', primary: true })
  id: string;

  @Column({ name: 'cost' })
  cost: number;

  @Column({ name: 'escort_id' })
  escortId: string;

  @Column({ name: 'time_category_id' })
  timeCategoryId: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'quantity' })
  quantity: number;
}
