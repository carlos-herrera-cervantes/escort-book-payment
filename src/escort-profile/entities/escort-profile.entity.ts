import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'profile' })
export class EscortProfile extends BaseEntity {
  @Column({ name: 'id', primary: true })
  id: string;

  @Column({ name: 'escort_id' })
  escortId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'gender' })
  gender: string;

  @Column({ name: 'nationality_id' })
  nationalityId: string;

  @Column({ type: 'date', name: 'birthdate' })
  birthdate: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
